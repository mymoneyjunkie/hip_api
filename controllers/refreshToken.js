const dbConnectionPromise = require('../db_web');

const jwt = require("jsonwebtoken");

require('dotenv').config();

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  
  // console.log("refresh api", cookies);
  
  if (!cookies?.EISJOJ) return res.status(401).send("Access Denied / Unauthorized user");
  
  // console.log(cookies?.EISJOJ);
  
  const refreshToken = cookies?.EISJOJ;
  
  const dbConnection = await dbConnectionPromise; 
  
  const [foundUser] = await dbConnection.query("SELECT * FROM users WHERE rem_token = ?", [refreshToken]);
	// console.log(response);
  
  if (!foundUser) return res.status(403).send("Access Denied / Unauthorized user"); // forbidden
  
  // evaluate jwt
  const verifiedUser = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  
  if (Number(verifiedUser.id) != Number(foundUser[0]?.id)) return res.status(403).send("Access Denied / Unauthorized user");
  
  else {
    const accessToken = jwt.sign(
		  { id: foundUser[0]?.id }, 
			process.env.ACCESS_TOKEN_SECRET, 
			{ expiresIn: '60s' }
		);
        
    return res.json({ 
		  "isSuccess": true,
			"message": "successful!",
      "token": accessToken
		});
  }
}

module.exports = {handleRefreshToken};