const staff = require("../schema/staff");
const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
  const token =
    req.cookies.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.redirect("/login")
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await staff.findById(decoded.user_id);
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
