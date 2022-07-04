var express = require('express');
var router = express.Router();
// Middleware
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/auth")
const _ = require('lodash');

//DayJs Plugins
var dayjs = require('dayjs')
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

//ORM DB IMPORT
const staff = require('../schema/staff');
const department = require('../schema/department');
const applicant = require('../schema/applicant');
const admission = require('../schema/admission');
const { result } = require('lodash');
const { sort_by } = require('../Utils/sortAd');

// 16 Routes 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Staff Login. */
router.get('/login/',  function(req, res, next) {
  res.render('login', { title: 'Express' });
});

/* GET Staff Logout. */
router.get('/logout/',  function(req, res, next) {
  res.clearCookie("token")
  res.redirect('/login')
});

/* GET Staff Home Page. */
router.get('/home/', protect,async function(req, res, next) {
  const dep = await department.find({})
  const applicants = await applicant.find({})
  res.render('home', { title: 'Express', department:dep,applicant:applicants });
});

/* GET Create A New Department. */
router.get('/new/Department/', protect,async function(req, res, next) {
  const dep = await department.find({})
  res.render('newDep', { title: 'Express',department:dep });
});

/* GET Create A New applicant. */ 
router.get('/new/applicant/', protect,async function(req, res, next) {
  const dep = await department.find({})
  res.render('newApp', { title: 'Express',department:dep });
});

/* GET View All Department. */ //DONE
router.get('/departments/', protect,async function(req, res, next) {
  const dep = await department.find({})
  res.render('departments', { title: 'Express', department:dep });
});

/* GET Edit Department */ //DONE
router.get('/edit/department/:id/', protect,async function(req, res, next) {
  const dep = await department.findOne({_id:req.params.id})
  res.render('editDep', { title: 'Express',data:dep });
});

/// Might not build 
/* GET Delete Department. */ //DONE
router.get('/delete/department/:id/', protect,async function(req, res, next) {
    department.findByIdAndDelete({_id:req.params.id}).then(daa =>{
      res.redirect('/departments')
    })
});

/* GET View All Applicant. */ //DONE
router.get('/applicants/', protect,async function(req, res, next) {
  const applicants = await applicant.find({})
  res.render('applicants', { title: 'Express', applicant:applicants });
});

/* GET Edit Applicant. */ //DONE
router.get('/edit/applicant/:id', protect, async function(req, res, next) {
  const applicants = await applicant.findOne({_id : req.params.id})
  const dep = await department.find({})

  res.render('editApp', { title: 'Express', data:applicants,department:dep });
});

/* GET Delete Applicant. */ //DONE
router.get('/delete/applicant/:id/', protect, async function(req, res, next) {
  await applicant.findByIdAndDelete({_id:req.params.id})
  res.redirect('/applicants')
});

/* GET Generate Admission List. */
//perloader
router.get('/Generate', protect, async function(req, res, next) {
  res.render('compile');
  try{
    //O(n^2)
    const dep = await department.find({})
    dep.forEach(val =>{
      applicant.find({department : val.name}).then(data =>{
        const admit = data.sort(sort_by('score',true,parseInt))
        // Split to Maxium Number 
        console.log(admit.length);
        console.log(val.max_number);
        const maxx = admit.slice(0,val.max_number)
        const Rejected = admit.slice(val.max_number) 
        // wrong Logic Here But Who Care ? 
        // Yep It came And bit me in the ass 
        //new logic Yes 
        //Better NOPE :-D
        maxx.forEach(fin =>{
          if(fin.jambScore > val.jambScore -1){
            // Add And Change State status
             applicant.findOneAndUpdate({email : fin.email},{status:"Accepted"}).then(data=>{
               // Its Just Need This
               // Anyway Creating a new Applicant 
               admission.findOne({applicant_id:fin._id}).then(data=>{
                 if(!data){
                  admission.create({
                    name:fin.name,
                    applicant_id:fin._id,
                    applicant_email: fin.email,
                    department:fin.department,
                    gradeCummlativeScore:fin.score
                  }).then((data) =>{
                    
                  }).catch((error) =>{
                    console.log(error);
                  })
                 }
               })
             }).catch(err =>{
               console.log(err);
             })
             
            // And Add To Admission Table
            
          }else{
            // Add And Change State 
             applicant.findOneAndUpdate({email : fin.email},{status:"Rejected"}).then(data=>{
            }).catch(err =>{
              console.log(err);
            })
            // End
          }
        })

      Rejected.forEach(fin =>{
          // Add And Change State 
            applicant.findOneAndUpdate({email : fin.email},{status:"Rejected"}).then(data=>{
          }).catch(err =>{
            console.log(err);
          })
          // End
      })
      }).catch(error=>{
        console.log(error);
      })
      console.log('--------------------------------');
    })
  }catch{
    console.log('error')
  }
});

/* GET Export Admission List. */
router.get('/export',  protect,async function(req, res, next) {
  const dep = await department.find({})
  res.render('export', { title: 'Express', department:dep });
});

/* GET Export Admission List. */
router.get('/export/:id/exports.csv',  protect,async function(req, res, next) {
  const dep = await admission.find({department:req.params.id})
  res.type('text/csv')
  res.render('csv', { title: 'Express', data:dep });
});

/* GET Send Admission State. */
router.get('/send/Admission', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Check Admission status. */
router.get('/check/', function(req, res, next) {
  res.render('check', { title: 'Express' });
});




///////////////////////////// Post Router 
/* POST Check Admission status For an Applicant. */
router.post('/check/', function(req, res, next) {
  var email = req.body.email
  applicant.findOne({email:email}).then(data =>{
  if(data){
      res.render('state',{
      data:data
    })}else{
      res.send('Email Not Found, No User')
    }
  })
});

/**This Return the garde something...
 * @param {Number} wace
 * @param {Number} jamb
 * @returns Number of compiled math
 */
const compileGrade = (wace, jamb)=>{
  const addd = wace + Number(jamb)
  const bbe = addd/5
  return bbe
}

/* POST Create A New Applicant. */
router.post('/new/applicant/', protect,async function(req, res, next) {
  const data = req.body
  const course = await department.findOne({name:data.department})
  const courses = course.wace
  var sum = 0
  //
  const resulthh =[
    {"English":data.English},
    {"Civic_Education":data.Civic_Education},
    {"Computer_Science":data.Computer_Science},
    {"Geology":data.Geology},
    {"History":data.History},
    {"Government":data.Government},
    {"Food_and_Nutrition":data.Food_and_Nutrition},
    {"Christian_Religious_Studies":data.Christian_Religious_Studies},
    {"Mathematics":data.Mathematics},
    {"Biology":data.Biology},
    {"Economics":data.Economics},
    {"Chemistry":data.Chemistry},
    {"Physics":data.Physics},
    {"Literature_in_English":data.Literature_in_English},
    {"Commerce":data.Commerce},
    {"Islamic_Religious_Studies":data.Islamic_Religious_Studies},
  ]
  resulthh.forEach(val =>{
    if(courses.includes(Object.keys(val)[0])){
        var grade = Object.values(val)[0]
        var summm = Number(grade)
        console.log(summm);
        sum += summm
    }
  })
  // Add One To That Departments
  await department.updateOne({name:data.department},{$inc:{applicant:1}})

  //Add user 
  applicant.create({
    name:data.name,
    email:data.email,
    gender:data.gender,
    department :data.department,
    jambScore:data.jamb,
    dateOfBirth:data.date,
    stateOfOrigin:data.state,
    result: resulthh,
    score: compileGrade(sum,data.jamb),
    status:'Pending'
  }).then((data) =>{
    res.redirect('/applicants')
  }).catch((error) =>{
    console.log(error);
    return res.send("intenal Error Occured, Or Department Exist")
  })
  
});

/* POST Create A New Department. */
router.post('/new/Department/', protect, async function(req, res, next) {
  const d = req.body
  var cx = []
  // Check If Exist Push to Array 
  if(d.subject1){
    cx.push(d.subject1)
  }
    // Check If Exist Push to Array 
    if(d.subject2){
      cx.push(d.subject2)
    }
      // Check If Exist Push to Array 
  if(d.subject3){
    cx.push(d.subject3)
  }
    // Check If Exist Push to Array 
    if(d.subject4){
      cx.push(d.subject4)
    }
      // Check If Exist Push to Array 
  if(d.subject5){
    cx.push(d.subject5)
  }

  department.create({
      name:d.name,
      jambScore:d.jamb,
      max_number:d.max_number,
      wace: cx,
      hod:d.HOD,
      detail:d.detail,
      applicant:0
    }).then((data) =>{
      res.redirect('/departments')
    }).catch((error) =>{
      console.log(error);
      return res.send("intenal Error Occured, Or Department Exist")
    })
    
});

/* POST Edit an Applicant. */
router.post('/edit/applicant/:id', protect, async function(req, res, next) {
  const data = req.body
  const course = await department.findOne({name:data.department})
  const courses = course.wace
  var sum = 0

  const resulthh =[
    {"English":data.English},
    {"Civic_Education":data.Civic_Education},
    {"Computer_Science":data.Computer_Science},
    {"Geology":data.Geology},
    {"History":data.History},
    {"Government":data.Government},
    {"Food_and_Nutrition":data.Food_and_Nutrition},
    {"Christian_Religious_Studies":data.Christian_Religious_Studies},
    {"Mathematics":data.Mathematics},
    {"Biology":data.Biology},
    {"Economics":data.Economics},
    {"Chemistry":data.Chemistry},
    {"Physics":data.Physics},
    {"Literature_in_English":data.Literature_in_English},
    {"Commerce":data.Commerce},
    {"Islamic_Religious_Studies":data.Islamic_Religious_Studies},
  ]
  resulthh.forEach(val =>{
    if(courses.includes(Object.keys(val)[0])){
        var grade = Object.values(val)[0]
        var summm = Number(grade)
        console.log(summm);
        sum += summm
    }
  })
  // Remove From Department
  await department.updateOne({name:data.oldDepart},{$inc:{applicant:-1}})

  // Add One To New Department
  await department.updateOne({name:data.department},{$inc:{applicant:1}})

  applicant.updateOne({_id:req.params.id}, {
    name:data.name,
    email:data.email,
    gender:data.gender,
    department :data.department,
    jambScore:data.jamb,
    dateOfBirth:data.date,
    result: resulthh,
    score: compileGrade(sum,data.jamb)
  },(newData)=>{
    res.redirect('/applicants')
  })
});

/* POST Edit a Department. */
router.post('/edit/department/:id/', protect, function(req, res, next) {
      const body = req.body;
      var cx = []
      // Check If Exist Push to Array 
      if(body.subject1){
        cx.push(body.subject1)
      }
        // Check If Exist Push to Array 
        if(body.subject2){
          cx.push(body.subject2)
        }
          // Check If Exist Push to Array 
      if(body.subject3){
        cx.push(body.subject3)
      }
        // Check If Exist Push to Array 
        if(body.subject4){
          cx.push(body.subject4)
        }
          // Check If Exist Push to Array 
      if(body.subject5){
        cx.push(body.subject5)
      }
      const obj = {
        name:body.name,
        jambScore:body.jamb,
        max_number:body.max_number,
        wace: cx,
        hod:body.HOD,
        detail:body.detail,
      }
      department.findById({
          _id: req.params.id
      }).then(data => {
          depp = _.extend(data, obj);
          depp.save((error, result) => {
              if(error) {
                  console.log(error)
                  res.status(500);
              } else {
                  res.redirect('/departments')
              }
          })
      }).catch(error => {
          res.status(500);
      })
});


////////////////////////Login and logout
router.post('/login',async (req,res)=>{
  
    const data = req.body
    // Incomplete input
    if(!(data.username && data.password)){
    return  res.status(400).send("All input is required");
    }
    // Query To Find User
    const Staff = await staff.findOne({ username : data.username.toLowerCase() });
    // Verifying user
    if(!Staff){
      return  res.status(403).send("No User Found");
    }

    if(Staff && Staff.password == data.password){
       jwt.sign(
        Staff.toJSON(),
        process.env.JWT_SECRET,
        {
          expiresIn: "2h",
        },(err,user)=>{
          if(err){
            console.log(err);
          }
          // save user token
          res.cookie('token',user, { maxAge: 3600000, httpOnly: true });
          res.redirect("/home")
        }
      );
    }else{
      return  res.status(403).send("Invalid Password");
    }

})

///////////// JavaScript

router.get('/assets/js/volt.js', protect,async function(req, res, next) {
  const dep = await department.find({})
  res.render('volt', { department:dep });
});

module.exports = router;
