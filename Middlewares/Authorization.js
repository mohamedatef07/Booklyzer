const jwt = require("jsonwebtoken");
require("dotenv").config();
const tokenKey = process.env.tokenKey;

//Authorization
function authorizeRoles(allowedRoles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ Message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, tokenKey);
    if (allowedRoles.includes(decoded.Role)) {
      next();
    } else {
      return res.status(403).json({
        Message: "Unauthorized",
      });
    }
  };
}
module.exports = authorizeRoles;
