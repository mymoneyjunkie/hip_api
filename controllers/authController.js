const dbConnectionPromise = require('../db_web');
// const dbConnectionPromise = require('./db_news');
// const dbConnectionPromise = require('./db_music');

const requestIp = require("request-ip");

const { body, validationResult } = require("express-validator");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

require("dotenv").config();

module.exports.login_post = async (req, res, next) => {
	try {
        const { email, password } = req.body;
        const error = validationResult(req);
        
        if (!error.isEmpty()) {
            return res.status(400).json({
                isSuccess: false,
                message: error.array()[0].msg,
                oldInput: { email }
            });
        }
        
        const dbConnection = await dbConnectionPromise;
        
        const [users] = await dbConnection.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );
        
        if (!users.length) {
            return res.status(404).json({
                isSuccess: false,
                message: "User not found. Please Register..."
            });
        }
        
        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        // console.log(isMatch);
        
        if (!isMatch) {
            return res.status(401).json({
                isSuccess: false,
                message: "Invalid credentials"
            });
        }
        
        // Generate tokens
        const accessToken = jwt.sign(
            { id: user.id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "60s" }
        );
        
        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        );
      
        // console.log("rt api", refreshToken);
        
        // Store refresh token in database
        await dbConnection.query(
            "UPDATE users SET rem_token = ? WHERE id = ?",
            [refreshToken, user.id]
        );

        // console.log(accessToken, refreshToken);

        res.cookie('EISJOJ', 
            refreshToken, 
            { 
                httpOnly: true, 
                sameSite: 'None', 
                secure: true, 
                maxAge: 24 * 60 * 60 * 1000 
            }
        );
        
        // Send response with appropriate status code
        return res
            .status(200)
            .json({
                isSuccess: true,
                message: "Login successful!",
                token: accessToken
            });
        
    } 

    catch (error) {
        console.error("Login controller error:", error);
        return res.status(500).json({
            isSuccess: false,
            message: "Internal server error"
        });
    }
}

module.exports.register_post = async (req, res, next) => {
	try {
	    // console.log(req.body);

	    const { email, password, cpassword, name, image } = req.body;

        const clientIp = requestIp.getClientIp(req);

	    const error = validationResult(req);

	    if (!error.isEmpty()) {
	      // console.log(error.array());

	      return res.status(400).json({
	        isSuccess: false,
	        message: error.array()[0].msg,
	        oldInput: {
	          email: email,
	          name: name,
	          image: image,
	        },
	      });
	    } 

	    else {
	      async function main() {
	        const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

	        // Now you can use dbConnection to execute queries
	        const [response] = await dbConnection.query(
	          "SELECT * FROM users WHERE email = ?",
	          [email]
	        );
	        // console.log(response);

	        if (response != "") {
	          return res.status(404).json({
	            isSuccess: false,
	            message: "Email already found. Please Login to continue...",
	          });
	        } else {
	          const hashedPassword = await bcrypt.hash(password, 10);

	          // console.log(hashedPassword);

	          const createdAt = new Date(); // January is month 0 in JavaScript
	          const formattedDate = createdAt.toISOString().split("T")[0];

	          // Prepare the insert query
	          const insertQuery =
	            "INSERT INTO users(email, password, name, image, created_at, ip_address) VALUES (?, ?, ?, ?, ?, ?)";
	          const newUserData = [
	            email,
	            hashedPassword,
	            name,
	            image,
	            formattedDate,
	            clientIp
	          ]; // Make sure to hash the password

	          const response1 = await dbConnection.query(insertQuery, newUserData);

	          // console.log(response1, response1[0].insertId);

	          if (response1 == "") {
	            return res.status(404).json({
	              isSuccess: false,
	              message: "Failed to register. Try Again...",
	            });
	          } else {
	            const accessToken = jwt.sign(
	              { id: response1[0].insertId },
	              process.env.ACCESS_TOKEN_SECRET,
	              { expiresIn: "30s" }
	            );

	            const refreshToken = jwt.sign(
	              { id: response1[0].insertId },
	              process.env.REFRESH_TOKEN_SECRET,
	              { expiresIn: "1d" }
	            );

	            const [response2] = await dbConnection.query(
	              "UPDATE `users` SET `rem_token` = ? WHERE id = ?",
	              [refreshToken, response1[0].insertId]
	            );

	            res.cookie("EISJOJ", refreshToken, {
	              sameSite: "None",
	              httpOnly: true, // Prevents JavaScript access to the cookie
	              secure: process.env.NODE_ENV === "production", // Use secure cookies in production
	              maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time in milliseconds
	            });
	            
	            return res.status(200).json({
	              isSuccess: true,
	              message: "Registration successful!",
	              token: accessToken,
	            });
	          }
	        }
	      }

	      main().catch((err) => {
	        console.log("register error: ", err);
	        return res.status(500).json({ isSuccess: false, message: err.code });
	      });
	    }
  	} 

  	catch (error) {
	    console.log("Register controller error: ", error);
	    return res.status(500).json({
	        isSuccess: false,
	        message: "Internal server error"
	    });
  	}
}