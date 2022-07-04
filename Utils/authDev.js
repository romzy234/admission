const jwt = require("jsonwebtoken");

if(process.env.AUTH){
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
          res.cookie('token',user, { maxAge: 900000, httpOnly: true });
          res.redirect("/home")
        }
      );
}