const dbConnectionPromise = require('../db_news');

const { body, param, query, validationResult } = require("express-validator");

require('dotenv').config();

module.exports.categories_get = async (req, res, next) => {
	try {
		async function main() {
			const dbConnection = await dbConnectionPromise;

			const [response] = await dbConnection.query("SELECT * FROM category");

			if (response == "") {
				return res.json({
					"isSuccess": false,
					"data": [],
					"message": ""
				})
			}

			else {
				return res.json({
					"isSuccess": true,
					"data": response.filter(i => i.name !== "")
				})
			}
		}

		main().catch(error => {
			console.log(error.code);

			return res.json({ "isSuccess": false, "message": error.code });
		})
	}

	catch (error) {
		console.log("get categories error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.trending_get = async (req, res, next) => {
	try {
		const error = validationResult(req);
      
      	if (!error.isEmpty()) {
		    // console.log(error.array());
		    let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"data": []
		    })
		}

		else {
			async function main() {
				const dbConnection = await dbConnectionPromise;

				const term = req.query.term || 'now';

				// console.log(term, term.toLowerCase().toString() == 'week');

				if (term && term.toLowerCase() == 'now') {
					const [response] = await dbConnection.query("SELECT p.id, p.title, p.des, p.image FROM posts p JOIN views v ON p.id = v.post_id WHERE DATE(v.date) = CURDATE() ORDER BY views DESC LIMIT 10");

					// console.log(response, typeof response);

					if (response == "") {
						return res.json({
						   	"isSuccess": false,
						    "data": [],
						    "message": ""
						})
					}

					else {
						return res.json({
							"isSuccess": true,
							"data": response
						});
					}
				}

				else if (term && term.toLowerCase() == 'week') {
					const [response] = await dbConnection.query("SELECT p.id, p.title, p.des, p.image FROM posts p JOIN views v ON p.id = v.post_id WHERE YEARWEEK(v.date, 1) = YEARWEEK(CURDATE(), 1) ORDER BY views DESC LIMIT 10");

					// console.log(response, typeof response);

					if (response == "") {
						return res.json({
						   	"isSuccess": false,
						    "data": [],
						    "message": ""
						})
					}

					else {
						return res.json({
							"isSuccess": true,
							"data": response
						});
					}
				}

				else if (term && term.toLowerCase() == 'month') {
					const [response] = await dbConnection.query("SELECT p.id, p.title, p.des, p.image FROM posts p JOIN views v ON p.id = v.post_id WHERE MONTH(v.date) = MONTH(CURDATE()) AND YEAR(v.date) = YEAR(CURDATE()) ORDER BY views DESC LIMIT 10");

					// console.log(response, typeof response);

					if (response == "") {
						return res.json({
						   	"isSuccess": false,
						    "data": [],
						    "message": ""
						})
					}

					else {
						return res.json({
							"isSuccess": true,
							"data": response
						});
					}
				}

				else if (term && term.toLowerCase() == 'year') {
					const [response] = await dbConnection.query("SELECT p.id, p.title, p.des, p.image FROM posts p JOIN views v ON p.id = v.post_id WHERE YEAR(v.date) = YEAR(CURDATE()) ORDER BY views DESC LIMIT 10");

					// console.log(response, typeof response);

					if (response == "") {
						return res.json({
						   	"isSuccess": false,
						    "data": [],
						    "message": ""
						})
					}

					else {
						return res.json({
							"isSuccess": true,
							"data": response
						});
					}
				}

				else {
					return res.json({
						"isSuccess": false,
						"data": [],
						"message": ""
					});
				}
			}

			main().catch(error => {
				// console.log(error, error.code);

				return res.json({
					"isSuccess": false,
					"message": error.code
				})
			})
		}
	}

	catch (error) {
		console.log("get trending error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.post_by_date_get = async (req, res, next) => {
	try {
		const error = validationResult(req);
      
      	if (!error.isEmpty()) {
		    // console.log(error.array());
		    let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"data": []
		    })
		}

		else {
			async function main() {
				const dbConnection = await dbConnectionPromise;

				const page = parseInt(req.query.page) || 1;
		        const daysToShift = (page - 1) * 3; // Each page shifts back 3 days

		        let today = '';
		        let yesterday = '';
		        let dayBeforeYesterday = '';

		        if (page == 1) {
		        	today = new Date();
			        yesterday = new Date(today);
			        dayBeforeYesterday = new Date(today);
			        
			        yesterday.setDate(yesterday.getDate() - 1);
			        dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
		        }

		        else if (page >= 1) {
			        today = new Date();
			        today.setDate(today.getDate() - daysToShift); // Shift back based on page
			        
			        yesterday = new Date(today);
			        yesterday.setDate(yesterday.getDate() - 1);
			        
			        dayBeforeYesterday = new Date(today);
			        dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
			    }

			    else {
			    	return res.json({
						"isSuccess": false,
						"data": [],
						"message": ""
					}) 
			    }

		        // Format dates for SQL
		        const formatDate = (date) => {
		            return date.toISOString().split('T')[0];
		        };

		        // console.log(formatDate(today), formatDate(yesterday), formatDate(dayBeforeYesterday));

				const query1 = `
		            SELECT p.id, p.title, p.title_translate, p.des, p.des_translate, p.portrait_image, p.image, p.social_media, v.views, 
		                CASE 
		                    WHEN DATE(p.date) = ? THEN 'today'
		                    WHEN DATE(p.date) = ? THEN 'yesterday'
		                    WHEN DATE(p.date) = ? THEN 'day_before_yesterday'
		                END as day_category
		            FROM posts p 
		            JOIN views v ON p.id = v.post_id
		            WHERE DATE(p.date) IN (?, ?, ?)
		            ORDER BY p.date DESC LIMIT 10 offset 0
		        `;

		        const [rows] = await dbConnection.query(query1, [
		            today.toISOString().split('T')[0],
		            yesterday.toISOString().split('T')[0],
		            dayBeforeYesterday.toISOString().split('T')[0],
		            today.toISOString().split('T')[0],
		            yesterday.toISOString().split('T')[0],
		            dayBeforeYesterday.toISOString().split('T')[0]
		        ]);

		        // Group results by day category
		        const result = {
		            today: rows.filter(row => row.day_category === 'today'),
		            yesterday: rows.filter(row => row.day_category === 'yesterday'),
		            day_before_yesterday: rows.filter(row => row.day_category === 'day_before_yesterday')
		        };

		        // console.log(result);

		        if (result && result != '') {
					return res.json({
						"isSuccess": true,
						"data": result,
						"current_page": page,
						"today": formatDate(today),
						"yesterday": formatDate(yesterday),
						"day_before_yesterday": formatDate(dayBeforeYesterday)
					})
				}

				else {
					return res.json({
						"isSuccess": false,
						"data": [],
						"message": ""
					})
				}
			}

			main().catch(error => {
				// console.log(error);
				return res.json({
					"isSuccess": false,
					"message": error.code
				})
			})
		}
	}

	catch (error) {
		console.log("post by date error: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.featured_get = async (req, res, next) => {
	try {
		async function main() {
			const dbConnection = await dbConnectionPromise;

			const [response] = await dbConnection.query("select p.id, p.title, p.des, p.image from posts p join tags t on p.id = t.post_id join views v on p.id=v.post_id where t.category_id=5 order by p.id desc limit 4");

			if (response == "") {
				return res.json({
					"isSuccess": false,
					"data": [],
					"message": ""
				})
			}

			else {
				return res.json({
					"isSuccess": true,
					"data": response
				})
			}
		}

		main().catch(error => {
			return res.json({
				"isSuccess": false,
				"message": error.code
			})
		})
	}

	catch(error) {
		console.log("get featured error: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.update_views = async (req, res, next) => {
	try {
		async function main() {
			const dbConnection = await dbConnectionPromise;

			const { post_id } = req.params;

			const [response] = await dbConnection.query("SELECT * FROM posts WHERE id = ?", [post_id]);

			if (response == "") {
				return res.json({
					"isSuccess": false,
					"data": [],
					"message": ""
				})
			}

			else {
				const [response1] = await dbConnection.query("UPDATE views set views=views+1 where post_id = ?", [post_id]);

				if (!response1) {
					return res.json({
						"isSuccess": false,
						"data": [],
					})
				}

				else {
					return res.json({
						"isSuccess": true,
						"data": []
					})
				}
			}
		}

		main().catch(error => {
			console.log(error.code);

			return res.json({ "isSuccess": false, "message": error.code });
		})
	}

	catch (error) {
		console.log("update post views error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}