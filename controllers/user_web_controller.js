const dbConnectionPromise = require('../db_web');

const { body, validationResult } = require("express-validator");

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
					const [response] = await dbConnection.query("SELECT p.id, p.title, p.title_translate, p.portrait_image, p.image FROM posts p JOIN views v ON p.id = v.post_id WHERE DATE(v.date) = CURDATE() ORDER BY views DESC LIMIT 10");

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
					const [response] = await dbConnection.query("SELECT p.id, p.title, p.title_translate, p.portrait_image, p.image FROM posts p JOIN views v ON p.id = v.post_id WHERE YEARWEEK(v.date, 1) = YEARWEEK(CURDATE(), 1) ORDER BY views DESC LIMIT 10");

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
					const [response] = await dbConnection.query("SELECT p.id, p.title, p.title_translate, p.portrait_image, p.image FROM posts p JOIN views v ON p.id = v.post_id WHERE MONTH(v.date) = MONTH(CURDATE()) AND YEAR(v.date) = YEAR(CURDATE()) ORDER BY views DESC LIMIT 10");

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
					const [response] = await dbConnection.query("SELECT p.id, p.title, p.title_translate, p.portrait_image, p.image FROM posts p JOIN views v ON p.id = v.post_id WHERE YEAR(v.date) = YEAR(CURDATE()) ORDER BY views DESC LIMIT 10");

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

			const [response] = await dbConnection.query("select p.id, p.title, p.portrait_image, p.image from posts p join tags t on p.id = t.post_id join views v on p.id=v.post_id where t.category_id=2 order by p.id desc limit 4");

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

module.exports.poll_get = async (req, res, next) => {
	try {
		async function main() {
			const dbConnection = await dbConnectionPromise;

			const [response] = await dbConnection.query("select * from poll order by id desc limit 1 offset 0");
			// const [response] = await dbConnection.query("select * from posts order by id desc limit 1 offset 0");

			// console.log(response);

			if (response == "") {
				return res.json({
					"isSuccess": false,
					"data": [],
					"message": ""
				})
			}

			else {
				const [response1] = await dbConnection.query("select * from options where poll_id = ?", [response[0]?.id]);

				return res.json({
					"isSuccess": true,
					"data": response,
					"options": response1
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
		console.log("get latest poll error: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.popdown_get = async (req, res, next) => {
	try {
		async function main() {
			const dbConnection = await dbConnectionPromise;

			const [response] = await dbConnection.query("select * from popdown limit 1 offset 0");

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
		console.log("get popdown error: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.desktop_ads_get = async (req, res, next) => {
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

				const { page_id } = req.params;

				const [response] = await dbConnection.query("SELECT p.id as page_id, ads.id as ads_id, ads.title, ads.image, ads.link_android, ads.link_ios, ads.code FROM page_ads INNER JOIN pages AS p ON page_ads.page_id = p.id INNER JOIN advertisement AS ads ON page_ads.ads_id = ads.id WHERE page_ads.page_id = ? limit 2 offset 0", [page_id]);

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
				// console.log(error);
				return res.json({
					"isSuccess": false,
					"message": error.code
				})
			})
		}
	}

	catch(error) {
		console.log("get desktop ads error: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.mobile_ads_get = async (req, res, next) => {
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

				const { page_id } = req.params;

				const [response] = await dbConnection.query("SELECT p.id as page_id,ads.id as ads_id, ads.title, ads.image, ads.link_android, ads.link_ios, ads.code FROM mobile_ads INNER JOIN pages AS p ON mobile_ads.page_id = p.id INNER JOIN advertisement AS ads ON mobile_ads.ads_id = ads.id WHERE mobile_ads.page_id = ? limit 2 offset 0", [page_id]);

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
				// console.log(error);
				return res.json({
					"isSuccess": false,
					"message": error.code
				})
			})
		}
	}

	catch(error) {
		console.log("get desktop ads error: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.all_post_by_category_get = async (req, res, next) => {
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

				const { id } = req.params;

				let filterParam = req.query.filter || 'n'; // Use a different variable name to avoid confusion
				let itemsPerPage = parseInt(req.query.items) || 10;

				const page = parseInt(req.query.page) || 1;
				const offset = (page > 1 ? (page - 1) * itemsPerPage : 0);
				const filter = (filterParam == 'o' ? "order by p.id ASC" : "order by p.id DESC");

				const [response, response1] = await Promise.all([
					dbConnection.query(`select count(*) as c from posts p join tags t on p.id = t.post_id join views v on p.id=v.post_id where t.category_id = ? ${filter}` , [id]),
					dbConnection.query(`select p.id, p.title, p.title_translate, p.des, p.des_translate, p.portrait_image, p.image, p.social_media, t.category_id, v.views from posts p join tags t on p.id = t.post_id join views v on p.id=v.post_id where t.category_id = ? ${filter} limit 10 offset ?`, [id, offset])
				]);

				if (response[0] == "" && response[0][0]?.c == 0 && response1[0] == "") {
					return res.json({
						"isSuccess": false,
						"data": [],
						"message": ""
					})
				}

				else {
					// const [response1] = await dbConnection.query(`select p.id, p.title, p.title_translate, p.des, p.des_translate, p.portrait_image, p.image, t.category_id, v.views from posts p join tags t on p.id = t.post_id join views v on p.id=v.post_id where t.category_id = ${id} ${filter} limit 10 offset ${offset}`);

					// if (response1 == "") {
					// 	return res.json({
					// 		"isSuccess": true,
					// 		"data": [],
					// 		"totalCount": response[0]?.c
					// 	})
					// }

					// else {
						return res.json({
							"isSuccess": true,
							"data": response1[0],
							"totalCount": response[0][0]?.c
						})
					// }
				}
			}

			main().catch(error => {
				return res.json({
					"isSuccess": false,
					"message": error.code
				})
			})
		}
	}

	catch(error) {
		console.log("get post by category error: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.all_post_by_date_get = async (req, res, next) => {
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

				const { date } = req.params;

				const formatDate = new Date(date) !== 'Invalid Date' ? new Date(date).toISOString().split('T')[0] : 'Invalid Date';

				if (formatDate == "Invalid Date") {
					return res.json({
				       	"isSuccess": false,
				       	"message": "Invalid Date",
				       	"data": []
				    })
				}

				else {
					let filterParam = req.query.filter || 'n'; // Use a different variable name to avoid confusion
					let itemsPerPage = parseInt(req.query.items) || 10;

					const page = parseInt(req.query.page) || 1;
					const offset = (page > 1 ? (page - 1) * itemsPerPage : 0);
					const filter = (filterParam == 'o' ? "order by p.id ASC" : "order by p.id DESC");

					const [response, response1] = await Promise.all([
						dbConnection.query("SELECT COUNT(DISTINCT p.id) as c FROM posts p JOIN views v ON p.id = v.post_id join tags t on p.id = t.post_id WHERE DATE(p.date) = ?", [formatDate]),
						dbConnection.query(`SELECT p.id, p.title, p.title_translate, p.portrait_image, p.image, p.social_media, v.views, GROUP_CONCAT(t.category_id ORDER BY t.category_id SEPARATOR ', ') AS category_id FROM posts p JOIN views v ON p.id = v.post_id join tags t on p.id = t.post_id WHERE DATE(p.date) = ? GROUP BY p.id, v.views ${filter} limit 10 offset ?`, [formatDate, offset])
					]);

					if (response[0] == "" && response[0][0]?.c == 0 && response1[0] == "") {
						return res.json({
							"isSuccess": false,
							"data": [],
							"message": ""
						})
					}

					else {
						// const [response1] = await dbConnection.query(`SELECT p.id, p.title, p.title_translate, p.des, p.des_translate, p.portrait_image, p.image, v.views, GROUP_CONCAT(t.category_id ORDER BY t.category_id SEPARATOR ', ') AS category_id FROM posts p JOIN views v ON p.id = v.post_id join tags t on p.id = t.post_id WHERE DATE(p.date) = '${formatDate}' GROUP BY p.id, v.views ${filter} limit 10 offset ${offset}`);

						// if (response1 == "") {
						// 	return res.json({
						// 		"isSuccess": true,
						// 		"data": [],
						// 		"totalCount": response[0]?.c
						// 	})
						// }

						// else {
							return res.json({
								"isSuccess": true,
								"data": response1[0],
								"totalCount": response[0][0]?.c
							})
						// }
					}
				}
			}

			main().catch(error => {
				console.log(error);
				return res.json({
					"isSuccess": false,
					"message": error.code
				})
			})
		}
	}

	catch(error) {
		console.log("get post by category error: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.post_by_id_get = async (req, res, next) => {
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

				const { id } = req.params;

				const [response] = await dbConnection.query("SELECT p.*, GROUP_CONCAT(DISTINCT c.id ORDER BY c.id SEPARATOR ', ') AS categories_id, GROUP_CONCAT(DISTINCT c.name ORDER BY c.name SEPARATOR ', ') AS categories, v.views AS views, COUNT(comments.id) AS comment_count FROM posts AS p JOIN tags AS t ON t.post_id = p.id JOIN category AS c ON t.category_id = c.id JOIN views AS v ON v.post_id = p.id LEFT JOIN comments ON comments.post_id = p.id WHERE p.id = ? GROUP BY p.id, v.views LIMIT 10 OFFSET 0", [id]);

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
				// console.log(error);
				return res.json({
					"isSuccess": false,
					"message": error.code
				})
			})
		}
	}

	catch(error) {
		console.log("get post by id error: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.get_search_data = async (req, res, next) => {
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
			const term = req.query.term ? req.query.term : 'null';
			const year = req.query.year ? req.query.year : 'null';
			const month = req.query.month ? req.query.month : 'null';

			const page = parseInt(req.query.page) || 1;
			let itemsPerPage = parseInt(req.query.items) || 10;
			const offset = (page > 1 ? (page - 1) * itemsPerPage : 0);

			// console.log("term: ", term, " year: ", year, " month: ", month);

			async function main() {
				const dbConnection = await dbConnectionPromise;

				const query = `SELECT id, title, title_translate, des, des_translate, portrait_image, image, social_media FROM posts WHERE title LIKE ? UNION ALL
					SELECT id, title, title_translate, des, des_translate, portrait_image, image, social_media FROM posts WHERE title_translate LIKE ? UNION ALL
					SELECT id, title, title_translate, des, des_translate, portrait_image, image, social_media FROM posts WHERE des LIKE ? UNION ALL
					SELECT id, title, title_translate, des, des_translate, portrait_image, image, social_media FROM posts WHERE des_translate LIKE ? UNION ALL
					SELECT id, title, title_translate, des, des_translate, portrait_image, image, social_media FROM posts WHERE YEAR(date) = ? UNION ALL
					SELECT id, title, title_translate, des, des_translate, portrait_image, image, social_media FROM posts WHERE MONTH(date) = ?
					ORDER BY id LIMIT 10 OFFSET ?`;

				// console.log(query);

				const [response] = await dbConnection.query(query, [`%${term}%`, `%${term}%`, `%${term}%`, `%${term}%`, year, month, offset]);

				// console.log(response);

				if (response == '') {
					return res.json({
					   	"isSuccess": false,
					    "data": [],
					    "current_page": page,
					    "term": term,
					    "year": year,
					    "month": month
					})
				}

				else {
					return res.json({
					   	"isSuccess": true,
					    "data": response,
					    "current_page": page,
					    "term": term,
					    "year": year,
					    "month": month
					})
				}
			}

			main().catch(err => {
				return res.json({
					"isSuccess": false,
					"message": err.code,
					"term": term
				})
			})
		}
	}

	catch(error) {
		console.log("get search data: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.comments_get = async (req, res, next) => {
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
			const page = parseInt(req.query.page) || 1;
			let itemsPerPage = parseInt(req.query.items) || 10;
			let reply_limit = parseInt(req.query.reply_limit) || 10;
			const offset = (page > 1 ? (page - 1) * itemsPerPage : 0);
			const {id} = req.params;

			async function main() { // added req, res
			    try {
			        const dbConnection = await dbConnectionPromise;

			        const query = `
			        	WITH PaginatedComments AS (
						    SELECT
						        c.id,
						        c.text,
						        c.user_id,
			        			c.date,
						        u.name,
						        u.image
						    FROM comments c
						    JOIN users u ON c.user_id = u.id
						    WHERE c.post_id = ?
						    ORDER BY c.date DESC
						    LIMIT ? OFFSET ?
						),
						PaginatedReplies AS (
						    SELECT
						        r.id,
						        r.text,
						        r.comm_id,
						        r.likes,
						        r.dislikes,
			        			r.date,
						        ru.name AS reply_user_name,
						        ru.image AS reply_user_image,
						        ROW_NUMBER() OVER (PARTITION BY r.comm_id ORDER BY r.date ASC) AS rn
						    FROM replies r
						    JOIN users ru ON r.user_id = ru.id
						    WHERE r.comm_id IN (SELECT id FROM PaginatedComments)
						),
						LimitedReplies AS (
						    SELECT
						        id,
						        text,
						        comm_id,
						        likes,
						        dislikes,
			        			date,
						        reply_user_name,
						        reply_user_image
						    FROM PaginatedReplies
						    WHERE rn <= ?  -- Reply Limit
						)
						SELECT
						    pc.id,
						    pc.text,
						    pc.user_id,
						    pc.name,
						    pc.image,
			        		pc.date AS comment_time,
						    lr.id AS reply_id,
						    lr.text AS reply_text,
						    lr.likes AS reply_likes,
						    lr.dislikes AS reply_dislikes,
			        		lr.date AS reply_time,
						    lr.reply_user_name,
						    lr.reply_user_image
						FROM PaginatedComments pc
						LEFT JOIN LimitedReplies lr ON pc.id = lr.comm_id
						ORDER BY pc.date DESC, lr.date ASC;
			        `;

			        const [rows] = await dbConnection.query(query, [id, itemsPerPage, offset, reply_limit]);

			        // Transform the flat results into nested structure
			        const comments = rows.reduce((acc, row) => {
			            let comment = acc.find(c => c.id === row.id);

			            if (!comment) {
			                comment = {
			                    id: row.id,
			                    text: row.text,
			                    user_id: row.user_id,
			                    name: row.name,
			                    image: row.image,
			                    replies: []
			                };
			                acc.push(comment);
			            }

			            if (row.reply_id) {
			                comment.replies.push({
			                    id: row.reply_id,
			                    text: row.reply_text,
			                    likes: row.reply_likes,
			                    dislikes: row.reply_dislikes,
			                    user_name: row.reply_user_name,
			                    user_image: row.reply_user_image
			                });
			            }

			            return acc;
			        }, []);

			        // Remove duplicate replies within each comment
			        comments.forEach(comment => {
			            const replyIds = new Set();
			            comment.replies = comment.replies.filter(reply => {
			                if (replyIds.has(reply.id)) {
			                    return false; // Remove duplicate
			                } else {
			                    replyIds.add(reply.id);
			                    return true;
			                }
			            });
			        });

			        // console.log(comments);

			        if (comments == "") {
			            return res.json({
			                "isSuccess": false,
			                "data": [],
			                "current_page": page
			            });
			        } 
			        else {
			            return res.json({
			                "isSuccess": true,
			                "data": comments,
			                "current_page": page
			            });
			        }
			    } 

			    catch (error) {
			        console.log("Error fetching comments:", error); // Log the full error
			        return res.status(500).json({ // Send a 500 status code
			            "isSuccess": false,
			            "message": "Failed to fetch comments. Please try again later."
			        });
			    }
			}

			main().catch(error => {
				return res.json({
					"isSuccess": false,
					"message": error.code
				})
			})
		}
	}

	catch(error) {
		console.log("get comments error: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.update_views = async (req, res, next) => {
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
	}

	catch (error) {
		console.log("update post views error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.update_votes = async (req, res, next) => {
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

				const { poll_id, option_id } = req.body;

				const [response] = await dbConnection.query("SELECT * FROM poll WHERE id = ?", [poll_id]);

				if (response == "") {
					return res.json({
						"isSuccess": false,
						"data": [],
						"message": ""
					})
				}

				else {
					const [response1] = await dbConnection.query("UPDATE options set votes=votes+1 where poll_id = ? AND id = ?", [poll_id, option_id]);

					if (!response1) {
						return res.json({
							"isSuccess": false,
							"data": []
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
	}

	catch (error) {
		console.log("update poll votes error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.post_comments = async (req, res, next) => {
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

				const { user_id, title, post_id } = req.body;

				const createdAt = moment.tz('America/New_York').format();
            	// console.log(madridTime);

	    		const formattedDate = createdAt.toISOString().split('T')[0];

				const [response] = await dbConnection.query("INSERT INTO comments (user_id,post_id,text,likes,dislikes,date) VALUES (?,?,?,?,?,?)", 
					[user_id, title, post_id, 0, 0]);
			}

			main().catch(error => {
				console.log(error);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("post comment error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}