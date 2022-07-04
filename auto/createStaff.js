/**Creating A Staff 
 * username = admin
 * password = welcome
 * email = from ENV Config
 */
 const staff = require("../schema/staff");
 console.log(" Creating Site Super Admin AKA HR...");
const defaultMail = process.env.EMAIL || "troveen@gmail.com"
 staff.findOne({
     email : defaultMail
 }).then(data => {
     if (!data) {
         const newStaff = new staff({
             email: defaultMail,
             password: "welcome",
             username: "admin",
         });
             newStaff.save()
             .then((user) => {
                 console.log("New Staff Created");
             }).catch(error=>{
                 console.log(error);
             });
     }else{
         console.log("A Staff Already Exist");
     }
 }).catch(error => {
     console.log(error);
 })