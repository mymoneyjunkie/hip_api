const dbConnectionPromise = require('../db_web');

const jwt = require("jsonwebtoken");

require('dotenv').config();

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  
  if (!cookies?.EISJOJ) return res.status(204).send("Access Denied / Unauthorized user");
  
  // console.log(cookies?.EISJOJ);
  
  const refreshToken = cookies?.EISJOJ;
  
  const dbConnection = await dbConnectionPromise; 
  
  const [response1] = await dbConnection.query("UPDATE `users` set rem_token = null WHERE rem_token = ?", [refreshToken]);
	// console.log(response1);
  
  if (!response1) {
    res.clearCookie("EISJOJ", {
      sameSite: "None",
      httpOnly: true, // Prevents JavaScript access to the cookie
      secure: true // Use secure cookies in production
    });
    
    return res.status(204).send("Failed"); // forbidden
  }
  
  // delete refreshToken from db   
  
    res.clearCookie("EISJOJ", {
      sameSite: "None",
      httpOnly: true, // Prevents JavaScript access to the cookie
      secure: true // Use secure cookies in production
    });
    
    return res.status(204).send("Success");
}

module.exports = {handleLogout};