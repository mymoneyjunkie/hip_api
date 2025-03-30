const dbConnectionPromise = require('../db_web');

const { body, validationResult } = require("express-validator");

const admin = require("firebase-admin");

const serviceAccount = require("../fb.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

require('dotenv').config();

module.exports.get_web_category = async (req, res, next) => {
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
		console.log("get web categories error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.get_web_brand = async (req, res, next) => {
	try {
		async function main() {
			const dbConnection = await dbConnectionPromise;

			const [response] = await dbConnection.query("SELECT * FROM raffle_brand");

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
					"data": response.filter(i => i.brand !== "")
				})
			}
		}

		main().catch(error => {
			console.log(error.code);

			return res.json({ "isSuccess": false, "message": error.code });
		})
	}

	catch(error) {
		console.log("get web brand error: ", error);
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
		console.log("get web admin trending error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.get_web_category_by_id = async (req, res, next) => {
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

				const [response] = await dbConnection.query(`SELECT * FROM category WHERE id = ${id}`);

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
				console.log(error.code);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("get web categories by id error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.get_web_brand_by_id = async (req, res, next) => {
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

				const [response] = await dbConnection.query(`SELECT * FROM raffle_brand WHERE id = ${id}`);

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
				console.log(error.code);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("get web brand by id error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.delete_web_category = async (req, res, next) => {
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

				const [response1, response] = await Promise.all([
					dbConnection.query(`DELETE FROM tags WHERE category_id = ${id}`),
					dbConnection.query(`DELETE FROM category WHERE id = ${id}`)
				])

				// console.log(response);

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
						"data": []
					})
				}
			}

			main().catch(error => {
				console.log(error.code);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("delete web categories error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.delete_brand = async (req, res, next) => {
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

				const [response] = await dbConnection.query(`DELETE FROM raffle_brand WHERE id = ${id}`);

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
						"data": []
					})
				}
			}

			main().catch(error => {
				console.log(error.code);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("delete web brand error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
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

				const query = `SELECT id, title, title_translate, des, des_translate FROM posts WHERE title LIKE '%${term}%' UNION ALL
					SELECT id, title, title_translate, des, des_translate FROM posts WHERE title_translate LIKE '%${term}%' UNION ALL
					SELECT id, title, title_translate, des, des_translate FROM posts WHERE des LIKE '%${term}%' UNION ALL
					SELECT id, title, title_translate, des, des_translate FROM posts WHERE des_translate LIKE '%${term}%' UNION ALL
					SELECT id, title, title_translate, des, des_translate FROM posts WHERE YEAR(date) = ${year} UNION ALL
					SELECT id, title, title_translate, des, des_translate FROM posts WHERE MONTH(date) = ${month} 
					ORDER BY id LIMIT 10 OFFSET ${offset}`;

				// console.log(query);

				const [response] = await dbConnection.query(query);

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

module.exports.post_category = async (req, res, next) => {
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

				const { name } = req.body;

				const [response] = await dbConnection.query("SELECT * FROM category WHERE name = ?", [name]);
			    // console.log(response);

			    if (response != '') {
					return res.json({
					    "isSuccess": false,
					    "message": "Category already found. Please insert a new one..."
					})
				}

				else {
					const insertQuery = "INSERT INTO category (name) VALUES (?)";

				    const response1 = await dbConnection.query(insertQuery, [name]);

				    if (!response1) {
				    	return res.json({ "isSuccess": false, "message": "Insert operation failed." });
				    }

				    else {
				    	const data = {
					        id: response1[0].insertId, // The ID of the newly inserted category
					        name: name // The actual category name
					    };
					    // console.log("Emitting category:", { action: 'update', data: data });
						// io.getIO().emit('category', { action: 'create', data: data });
				    	return res.json({
				            "isSuccess": true,
				            "message": "Inserted successfully!",
				            "catId": response1[0].insertId // Optionally return the new user's ID
				        });
				    }
				}
			}

			main().catch(err => {
				return res.json({
					"isSuccess": false,
					"message": err.code
				})
			})
		}
	}

	catch(error) {
		console.log("post web category: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.categories_update = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { name } = req.body;

		const error = validationResult(req);
      
      	if (!error.isEmpty()) {
		    // console.log(error.array());
		    let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"id": id,
		       	"oldInput": {
		       		"name": name
		       	}
		    })
		}

		else {
			async function main() {
				const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

				// console.log(id, name);
			    // Now you can use dbConnection to execute queries
			    const [response] = await dbConnection.query("SELECT * FROM category WHERE id = ?", [id]);
			    // console.log(response);

			    if (response == '') {
					return res.json({
					    "isSuccess": false,
					    "message": "Category not found..."
					})
				}

				else {
			    	const [response2] = await dbConnection.query("UPDATE category SET name = ? WHERE id = ?", [name, id]);
			    	// console.log(response2);

			    	if (!response2) {
				    	return res.json({
				    		"isSuccess": false,
				    		"message": "Update operation failed..."
				    	})
			    	}

			    	else {
			    		const data = {
					        id: id, // The ID of the newly inserted category
					        name: name // The actual category name
					    };
					    // console.log("Emitting category:", { action: 'update', data: data });
						// io.getIO().emit('category', { action: 'update', data: data });

			    		return res.json({
					        "isSuccess": true,
					        "message": "Updated successfully!"
					    });
			    	}
				}
			}

			main().catch(error => {
				// console.log(error);
				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch(error) {
		console.log("update web category error: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.post_brand = async (req, res, next) => {
	try {
		const { name } = req.body;

		const error = validationResult(req);
      
      	if (!error.isEmpty()) {
		    // console.log(error.array());
		    let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"oldInput": {
		       		"name": name
		       	}
		    })
		}

		else {
			async function main() {
				const dbConnection = await dbConnectionPromise;

				const [response] = await dbConnection.query("SELECT * FROM raffle_brand WHERE brand = ?", [name]);
			    // console.log(response);

			    if (response != '') {
					return res.json({
					    "isSuccess": false,
					    "message": "Brand already found. Please insert a new one..."
					})
				}

				else {
					const insertQuery = "INSERT INTO raffle_brand (brand) VALUES (?)";

				    const response1 = await dbConnection.query(insertQuery, [name]);

				    if (!response1) {
				    	return res.json({ "isSuccess": false, "message": "Insert operation failed." });
				    }

				    else {
				    	const data = {
					        id: response1[0].insertId, // The ID of the newly inserted category
					        name: name // The actual category name
					    };
					    // console.log("Emitting category:", { action: 'update', data: data });
						// io.getIO().emit('category', { action: 'create', data: data });
				    	return res.json({
				            "isSuccess": true,
				            "message": "Inserted successfully!",
				            "catId": response1[0].insertId // Optionally return the new user's ID
				        });
				    }
				}
			}

			main().catch(err => {
				return res.json({
					"isSuccess": false,
					"message": err.code
				})
			})
		}
	}

	catch(error) {
		console.log("post web raffle brand: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.brand_update = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { name } = req.body;

		const error = validationResult(req);
      
      	if (!error.isEmpty()) {
		    // console.log(error.array());
		    let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"id": id,
		       	"oldInput": {
		       		"name": name
		       	}
		    })
		}

		else {
			async function main() {
				const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

				// console.log(id, name);
			    // Now you can use dbConnection to execute queries
			    const [response] = await dbConnection.query("SELECT * FROM raffle_brand WHERE id = ?", [id]);
			    // console.log(response);

			    if (response == '') {
					return res.json({
					    "isSuccess": false,
					    "message": "Raffle Brand not found..."
					})
				}

				else {
			    	const [response2] = await dbConnection.query("UPDATE raffle_brand SET brand = ? WHERE id = ?", [name, id]);
			    	// console.log(response2);

			    	if (!response2) {
				    	return res.json({
				    		"isSuccess": false,
				    		"message": "Update operation failed..."
				    	})
			    	}

			    	else {
			    		const data = {
					        id: id, // The ID of the newly inserted category
					        name: name // The actual category name
					    };
					    // console.log("Emitting category:", { action: 'update', data: data });
						// io.getIO().emit('category', { action: 'update', data: data });

			    		return res.json({
					        "isSuccess": true,
					        "message": "Updated successfully!"
					    });
			    	}
				}
			}

			main().catch(error => {
				// console.log(error);
				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch(error) {
		console.log("update web raffle brand error: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.get_posts_by_category = async (req, res, next) => {
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
				const page = parseInt(req.query.page) || 1;
				let itemsPerPage = parseInt(req.query.items) || 10;
				const offset = (page > 1 ? (page - 1) * itemsPerPage : 0);

				const [response, response1] = await Promise.all([
					dbConnection.query(`select count(*) as c from posts p join tags t on p.id = t.post_id join views v on p.id=v.post_id where t.category_id = ${id}`),
					dbConnection.query(`select p.id, p.title, p.des, p.date, t.category_id, v.views from posts p join tags t on p.id = t.post_id join views v on p.id=v.post_id where t.category_id = ${id} ORDER BY p.id DESC limit 10 offset ${offset}`)
				])

				// const countResult = response[0];
				// const data = response1[0];

				if (response[0] && response[0][0]?.c == 0 && response1[0] == "") {
					return res.json({
						"isSuccess": false,
						"data": [],
						"message": ""
					})
				}

				else {
					return res.json({
						"isSuccess": true,
						"data": response1[0],
						"totalCount": response[0][0]?.c
					})
				}
			}

			main().catch(error => {
				console.log(error.code);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("get posts by category error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.get_all_posts = async (req, res, next) => {
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
				let itemsPerPage = parseInt(req.query.items) || 10;
				const offset = (page > 1 ? (page - 1) * itemsPerPage : 0);

				const [response, response1] = await Promise.all([
					dbConnection.query(`select COUNT(*) AS c from posts p join views v on p.id = v.post_id ORDER BY p.id DESC`),
					dbConnection.query(`select p.id, p.title, p.des, p.date, v.views from posts p join views v on p.id = v.post_id ORDER BY p.id DESC LIMIT 10 OFFSET ${offset}`)
				])

				// const countResult = response[0];
				// const data = response1[0];

				if (response[0] && response[0][0]?.c == 0 && response1[0] == "") {
					return res.json({
						"isSuccess": false,
						"data": [],
						"message": ""
					})
				}

				else {
					return res.json({
						"isSuccess": true,
						"data": response1[0],
						"totalCount": response[0][0]?.c
					})
				}
			}

			main().catch(error => {
				console.log(error.code);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("get posts by id error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.add_posts = async (req, res, next) => {
	try {
		const { title, tt, dt, des, sm, logo, portrait_image, fileCode, link, tags } =
        req.body;
      	      
	    // console.log(sm2);

	    const cleanedTags =
	        typeof tags == "object" ? tags.filter((tag) => tag !== "") : [tags];

		const error = validationResult(req);
      
      	if (!error.isEmpty()) {
		    // console.log(error.array());
		    let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"oldInput": {
			        "title": title ? title.trim() : '',
			        "tt": tt? tt.trim() : '',
			        "dt": dt ? dt.trim() : '',
			        "des": des ? des.trim() : '',
			        "sm": sm ? sm.trim() : '',
			        "logo": logo ? logo.trim() : '',
			        "portrait_image": portrait_image ? portrait_image.trim() : '',
			        "fileCode": fileCode ? fileCode.trim() : '',
			        "link": link ? link.trim() : '',
			        "tags": cleanedTags,
			    },
		    })
		}

		else {
			if (fileCode == "" && link == "") {
				return res.json({
			       	"isSuccess": false,
			       	"message": "Upload either video or link...",
			       	"oldInput": {
				        "title": title ? title.trim() : '',
				        "tt": tt? tt.trim() : '',
				        "dt": dt ? dt.trim() : '',
				        "des": des ? des.trim() : '',
				        "sm": sm ? sm.trim() : '',
				        "logo": logo ? logo.trim() : '',
				        "portrait_image": portrait_image ? portrait_image.trim() : '',
				        "fileCode": fileCode ? fileCode.trim() : '',
				        "link": link ? link.trim() : '',
				        "tags": cleanedTags,
				    },
			    })
			}

			else {
				async function main() {
					const dbConnection = await dbConnectionPromise;
					const createdAt = new Date().toISOString().split('T')[0];

					const insertQuery = "INSERT INTO posts (title,title_translate,des,des_translate,social_media,image,portrait_image,video,date,link) VALUES (?,?,?,?,?,?,?,?,?,?)";

					const response1 = await dbConnection.query(insertQuery, [title, tt, des, dt, sm, logo, portrait_image, fileCode, createdAt, link]);

					if (!response1) {
					   	return res.json({ "isSuccess": false, "message": "Insert operation failed." });
					}

					else {
						const response2 = await dbConnection.query("INSERT INTO views (post_id,views,date) values(?,?,?)", [response1[0].insertId, 0, createdAt]);

						if (!response2) {
					   		return res.json({ "isSuccess": false, "message": "Insert operation failed." });
						}

						else {
							for (const i of cleanedTags) {
							    await dbConnection.query("INSERT INTO tags (post_id,category_id) values(?,?)", [response1[0].insertId, i]);
							}

						   	const data = {
							    id: response1[0].insertId // The ID of the newly inserted category
							};
							// console.log("Emitting category:", { action: 'update', data: data });
							// io.getIO().emit('category', { action: 'create', data: data });
						    	
						    return res.json({
						        "isSuccess": true,
						        "message": "Inserted successfully!",
						        "catId": response1[0].insertId // Optionally return the new user's ID
						    });
						}
					}
				}

				main().catch(err => {
					// console.log(err);

					return res.json({
						"isSuccess": false,
						"message": err.code
					})
				})
			}
		}
	}

	catch(error) {
		console.log("add posts error: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.get_posts_by_id = async (req, res, next) => {
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

				const [response, response1] = await Promise.all([
					dbConnection.query(`select p.*,v.views from posts p join views v on p.id = v.post_id where p.id = ${id}`),

					dbConnection.query(`select c.* from tags t join category c on t.category_id=c.id where t.post_id = ${id}`)
				]);

				// console.log(response[0], response1[0], !response[0]&&!response1[0]);

				if (response[0] !== "" && response1[0] !== "") {
					return res.json({
						"isSuccess": true,
						"data": response[0],
						"tags": response1[0]
					})
				}

				else {
					return res.json({ 
						"isSuccess": false,
						"data": [],
						"tags": [], 
						"message": "" 
					});
				}
			}

			main().catch(error => {
				console.log(error.code);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("get posts by id error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.post_update = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { title, tt, dt, des, sm, logo, portrait_image, fileCode, link, tags } =
        req.body;
      	      
	    // console.log(sm2);

	    const cleanedTags =
	        typeof tags == "object" ? tags.filter((tag) => tag !== "") : [tags];

		const error = validationResult(req);
      
      	if (!error.isEmpty()) {
		    // console.log(error.array());
		    let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"id": id,
		       	"oldInput": {
			        "title": title ? title.trim() : '',
			        "tt": tt? tt.trim() : '',
			        "dt": dt ? dt.trim() : '',
			        "des": des ? des.trim() : '',
			        "sm": sm ? sm.trim() : '',
			        "logo": logo ? logo.trim() : '',
			        "portrait_image": portrait_image ? portrait_image.trim() : '',
			        "fileCode": fileCode ? fileCode.trim() : '',
			        "link": link ? link.trim() : '',
			        "tags": cleanedTags,
			    },
		    })
		}

		else {
			if (fileCode == "" && link == "") {
			    return res.json({
			       	"isSuccess": false,
			       	"message": "Upload either video or link...",
			       	"id": id,
			       	"oldInput": {
				        "title": title ? title.trim() : '',
				        "tt": tt? tt.trim() : '',
				        "dt": dt ? dt.trim() : '',
				        "des": des ? des.trim() : '',
				        "sm": sm ? sm.trim() : '',
				        "logo": logo ? logo.trim() : '',
				        "portrait_image": portrait_image ? portrait_image.trim() : '',
				        "fileCode": fileCode ? fileCode.trim() : '',
				        "link": link ? link.trim() : '',
				        "tags": cleanedTags,
				    },
			    })
			}

			else {
				async function main() {
					const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

					// console.log(id, name);
				    // Now you can use dbConnection to execute queries
				    const [response] = await dbConnection.query("SELECT * FROM posts WHERE id = ?", [id]);
				    // console.log(response);

				    if (response == '') {
						return res.json({
						    "isSuccess": false,
						    "message": "Posts not found..."
						})
					}

					else {
						const createdAt = new Date().toISOString().split('T')[0];

				    	const [response2] = await dbConnection.query("UPDATE posts SET title=?, title_translate=?, des=?, des_translate=?, social_media=?, image=?, portrait_image=?, video=?, link=?, date=? WHERE id=?", 
				    		[title, tt, des, dt, sm, logo, portrait_image, fileCode, link, createdAt, id]);
				    	// console.log(response2);

				    	if (!response2) {
					    	return res.json({
					    		"isSuccess": false,
					    		"message": "Update operation failed..."
					    	})
				    	}

				    	else {
				    		const [response3] = await dbConnection.query(`DELETE FROM tags WHERE post_id = ?`, [id]);

				    		for (const i of cleanedTags) {
							    await dbConnection.query("INSERT INTO tags (post_id,category_id) values(?,?)", [id, i]);
							}

				    		const data = {
						        id: id, // The ID of the newly inserted category
						    };
						    // console.log("Emitting category:", { action: 'update', data: data });
							// io.getIO().emit('category', { action: 'update', data: data });

				    		return res.json({
						        "isSuccess": true,
						        "message": "Updated successfully!"
						    });
				    	}
					}
				}

				main().catch(error => {
					// console.log(error);
					return res.json({ "isSuccess": false, "message": error.code });
				})
			}
		}
	}

	catch(error) {
		console.log("update web category error: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.delete_posts = async (req, res, next) => {
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

				const [response1, response2, response3] = await Promise.all([
					dbConnection.query(`DELETE FROM posts WHERE id = ${id}`),
					dbConnection.query(`DELETE FROM tags WHERE post_id = ${id}`),
					dbConnection.query(`DELETE FROM views WHERE post_id = ${id}`)
				]);

				if (response1 == "") {
					return res.json({
						"isSuccess": false,
						"data": [],
						"message": ""
					})
				}

				else {
					return res.json({
						"isSuccess": true,
						"data": []
					})
				}
			}

			main().catch(error => {
				console.log(error.code);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("delete posts error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.get_all_users = async (req, res, next) => {
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
				let itemsPerPage = parseInt(req.query.items) || 10;
				const offset = (page > 1 ? (page - 1) * itemsPerPage : 0);

				const [response, response1] = await Promise.all([
					dbConnection.query(`select COUNT(*) AS c from users ORDER BY id DESC`),

					dbConnection.query(`select p.id, p.email, p.name, p.image, p.ip_address, p.gender, p.primary_size from users p ORDER BY p.id DESC LIMIT 10 OFFSET ${offset}`)
				]);

				// console.log(!response[0] || !response1[0]);

				if (response[0] && response[0][0]?.c == 0 && response1[0] == "") {
					return res.json({
						"isSuccess": false,
						"data": [],
						"message": ""
					})
				}

				else {
					return res.json({
						"isSuccess": true,
						"data": response1[0],
						"totalCount": response[0][0]?.c
					})
				}
			}

			main().catch(error => {
				console.log(error.code);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("get all users error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.get_search_user = async (req, res, next) => {
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

				const query = `SELECT id, email AS user_email, NULL AS user_name, NULL AS user_gender FROM users WHERE email LIKE '%${term}%' UNION ALL 
					SELECT id, email AS user_email, name AS user_name, NULL AS user_gender FROM users WHERE name LIKE '%${term}%' UNION ALL 
					SELECT id, email AS user_email, name AS user_name, gender AS user_gender FROM users WHERE gender LIKE '%${term}%' UNION ALL 
					SELECT id, email AS user_email, NULL AS user_name, NULL AS user_gender FROM users WHERE YEAR(created_at) = ${year} UNION ALL 
					SELECT id, email AS user_email, NULL AS user_name, NULL AS user_gender FROM users WHERE MONTH(created_at) = ${month} 
					ORDER BY id LIMIT 10 OFFSET ${offset}`;

				// console.log(query);

				const [response] = await dbConnection.query(query);

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
		console.log("get user search data: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.get_poll = async (req, res, next) => {
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
				let itemsPerPage = parseInt(req.query.items) || 10;
				const offset = (page > 1 ? (page - 1) * itemsPerPage : 0);

				const [response, response1] = await Promise.all([
					dbConnection.query(`select COUNT(*) AS c from poll ORDER BY id DESC`),

					dbConnection.query(`select p.id, p.question from poll p ORDER BY p.id DESC LIMIT 10 OFFSET ${offset}`)
				]);

				// console.log(response[0], response1[0], response[0] !== "" && response1[0] !== "")

				if (response[0] && response[0][0]?.c == 0 && response1[0] == "") {
					return res.json({
						"isSuccess": false,
						"data": [],
						"message": ""
					})
				}

				else {
					return res.json({
						"isSuccess": true,
						"data": response1[0],
						"totalCount": response[0][0]?.c
					})
				}
			}

			main().catch(error => {
				console.log(error.code);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("get all poll error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.add_poll = async (req, res, next) => {
	try {
		const { question, ques_tr, logo, landscape_img, options, answer } =
        req.body;

		const error = validationResult(req);
      
      	if (!error.isEmpty()) {
		    // console.log(error.array());
		    let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"oldInput": {
			        "question": question,
		            "ques_tr": ques_tr,
		            "logo": logo,
		            "landscape_img": landscape_img,
		            "answer": answer,
		            "options": options,
			    },
		    })
		}

		else {
	        if (logo == "" && landscape_img == "") {
	          	return res.json({
			       	"isSuccess": false,
			       	"message": "Upload either Portrait or Landscape image...",
		            "oldInput": {
				        "question": question,
			            "ques_tr": ques_tr,
			            "logo": logo,
			            "landscape_img": landscape_img,
			            "answer": answer,
			            "options": options,
				    }
	          	});
	        }

			else {
				async function main() {
					const dbConnection = await dbConnectionPromise;
					const createdAt = new Date().toISOString().split('T')[0];

					const insertQuery = "INSERT INTO poll (portrait_image,landscape_img,question,ques_translate,answer) VALUES (?,?,?,?,?)";

					const response1 = await dbConnection.query(insertQuery, [logo, landscape_img, question, ques_tr, answer]);

					if (!response1) {
					   	return res.json({ "isSuccess": false, "message": "Insert operation failed." });
					}

					else {
						for (const i of options) {
						    await dbConnection.query("INSERT INTO options (poll_id,option_text,votes,date) values(?,?,?,?)", [response1[0].insertId, i, 0, createdAt]);
						}

						const data = {
						    id: response1[0].insertId // The ID of the newly inserted category
						};
						// console.log("Emitting category:", { action: 'update', data: data });
						// io.getIO().emit('category', { action: 'create', data: data });
						    	
						return res.json({
					        "isSuccess": true,
					        "message": "Inserted successfully!",
					        "catId": response1[0].insertId // Optionally return the new user's ID
					    });
					}
				}

				main().catch(err => {
					// console.log(err);

					return res.json({
						"isSuccess": false,
						"message": err.code
					})
				})
			}
		}
	}

	catch(error) {
		console.log("add poll error: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.get_poll_by_id = async (req, res, next) => {
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

				const [response] = await dbConnection.query(`SELECT p.*, o.option_text, o.votes FROM poll AS p JOIN options AS o ON o.poll_id = p.id WHERE p.id = ${id}`);

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
				// console.log(error.code);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("get poll by id error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
} 

module.exports.poll_update = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { question, ques_tr, logo, landscape_img, options, answer } = req.body;

		const error = validationResult(req);
      
      	if (!error.isEmpty()) {
		    // console.log(error.array());
		    let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"id": id,
		       	"oldInput": {
			        "question": question,
		            "ques_tr": ques_tr,
		            "logo": logo,
		            "landscape_img": landscape_img,
		            "answer": answer,
		            "options": options,
			    },
		    })
		}

		else {
	        if (logo == "" && landscape_img == "") {
	          	return res.json({
			       	"isSuccess": false,
			       	"message": "Upload either Portrait or Landscape image...",
			       	"id": id,
		            "oldInput": {
				        "question": question,
			            "ques_tr": ques_tr,
			            "logo": logo,
			            "landscape_img": landscape_img,
			            "answer": answer,
			            "options": options,
				    }
	          	});
	        }

			else {
				async function main() {
					const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

					const createdAt = new Date().toISOString().split('T')[0];

					// console.log(id, name);
				    // Now you can use dbConnection to execute queries
				    const [response] = await dbConnection.query("SELECT * FROM poll WHERE id = ?", [id]);
				    // console.log(response);

				    if (response == '') {
						return res.json({
						    "isSuccess": false,
						    "message": "Poll not found..."
						})
					}

					else {
				    	const [response1] = await dbConnection.query("UPDATE poll set portrait_image=?, landscape_img=?, question=?, ques_translate=?, answer=? where id = ?", 
				    		[logo, landscape_img, question, ques_tr, answer, id]);
				    	// console.log(response2);

				    	if (!response1) {
					    	return res.json({
					    		"isSuccess": false,
					    		"message": "Update operation failed..."
					    	})
				    	}

				    	else {
				    		const [response2] = await dbConnection.query("DELETE from options where poll_id = ?", [id]);

				    		for (const i of options) {
							    await dbConnection.query("INSERT INTO options (poll_id,option_text,votes,date) values(?,?,?,?)", [id, i, 0, createdAt]);
							}

				    		const data = {
						        id: id // The ID of the newly inserted category
						    };
						    // console.log("Emitting category:", { action: 'update', data: data });
							// io.getIO().emit('category', { action: 'update', data: data });

				    		return res.json({
						        "isSuccess": true,
						        "message": "Updated successfully!"
						    });
				    	}
					}
				}

				main().catch(error => {
					// console.log(error);
					return res.json({ "isSuccess": false, "message": error.code });
				})
			}
		}
	}

	catch(error) {
		console.log("update poll error: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.delete_poll = async (req, res, next) => {
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

				const [response1, response2] = await Promise.all([
					dbConnection.query(`DELETE FROM options WHERE poll_id = ${id}`),
					dbConnection.query(`DELETE FROM poll WHERE id = ${id}`)
				]);

				if (response1 == "") {
					return res.json({
						"isSuccess": false,
						"data": [],
						"message": ""
					})
				}

				else {
					return res.json({
						"isSuccess": true,
						"data": []
					})
				}
			}

			main().catch(error => {
				// console.log(error);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("delete poll error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.get_header_popup = async (req, res, next) => {
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
					"data": response.filter(i => i.id !== "")
				})
			}
		}

		main().catch(error => {
			console.log(error.code);

			return res.json({ "isSuccess": false, "message": error.code });
		})
	}

	catch (error) {
		console.log("get footer popup error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.update_header_popup = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { title, link1, link2 } = req.body;

		const error = validationResult(req);
      
      	if (!error.isEmpty()) {
		    // console.log(error.array());
		    let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"id": id,
		       	"oldInput": {
			        "title": title,
		            "link1": link1,
		            "link2": link2,
			    },
		    })
		}

		else {
			async function main() {
				const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

				const createdAt = new Date().toISOString().split('T')[0];

				// console.log(id, name);
			    // Now you can use dbConnection to execute queries
			    const [response] = await dbConnection.query("SELECT * FROM popdown WHERE id = ?", [id]);
			    // console.log(response);

			    if (response == '') {
					return res.json({
					    "isSuccess": false,
					    "message": "Popdown not found..."
					})
				}

				else {
			    	const [response1] = await dbConnection.query("UPDATE popdown set title=?, link1=?, link2=? where id = ?", 
			    		[title, link1, link2, id]);
			    	// console.log(response2);

			    	if (!response1) {
				    	return res.json({
				    		"isSuccess": false,
				    		"message": "Update operation failed..."
				    	})
			    	}

			    	else {
			    		const data = {
					        id: id // The ID of the newly inserted category
					    };
					    // console.log("Emitting category:", { action: 'update', data: data });
						// io.getIO().emit('category', { action: 'update', data: data });

			    		return res.json({
					        "isSuccess": true,
					        "message": "Updated successfully!"
					    });
			    	}
				}
			}

			main().catch(error => {
				// console.log(error);
				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch(error) {
		console.log("update popdown error: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.get_all_notifications = async (req, res, next) => {
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
				let itemsPerPage = parseInt(req.query.items) || 10;
				const offset = (page > 1 ? (page - 1) * itemsPerPage : 0);

				const [response, response1] = await Promise.all([
					dbConnection.query(`select COUNT(*) AS c from notifications ORDER BY id DESC`),

					dbConnection.query(`select * from notifications ORDER BY id DESC LIMIT 10 OFFSET ${offset}`)
				]);

				if (response[0] && response[0][0]?.c == 0 && response1[0] == "") {
					return res.json({
						"isSuccess": false,
						"data": [],
						"message": ""
					})
				}

				else {
					return res.json({
						"isSuccess": true,
						"data": response1[0],
						"totalCount": response[0][0]?.c
					})
				}
			}

			main().catch(error => {
				console.log(error.code);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("get all notifications error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.add_notification = async (req, res, next) => {
	try {
		const { title, bdes, link } = req.body;

		const error = validationResult(req);
      
      	if (!error.isEmpty()) {
		    // console.log(error.array());
		    let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"oldInput": {
		       		"title": title,
		       		"bdes": bdes,
		       		"link": link
		       	}
		    })
		}

		else {
			async function main() {
				const dbConnection = await dbConnectionPromise;

				const [response] = await dbConnection.query("INSERT INTO notifications (title, body, link) VALUES (?,?,?)", 
					[title, bdes, link]);

				if (response == "") {
					return res.json({ 
						"isSuccess": false, 
						"message": "Insert operation failed." 
					});
				}

				else {
					const data = {
					    id: response.insertId // The ID of the newly inserted category
					};
					// console.log("Emitting category:", { action: 'update', data: data });
					// io.getIO().emit('category', { action: 'create', data: data });
					    	
					return res.json({
				        "isSuccess": true,
				        "message": "Inserted successfully!",
				        "catId": response.insertId // Optionally return the new user's ID
				    });
				}
			}

			main().catch(error => {
				console.log(error);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("post notification error: ", error);

		return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.get_notification_by_id = async (req, res, next) => {
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

				const [response] = await dbConnection.query(`SELECT * FROM notifications WHERE id = ${id}`);

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
				// console.log(error.code);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("get notification by id error: ", error);

	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.update_notification = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { title, bdes, link } = req.body;

		const error = validationResult(req);
      
      	if (!error.isEmpty()) {
		    // console.log(error.array());
		    let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"id": id,
		       	"oldInput": {
			        "title": title,
		            "bdes": bdes,
		            "link": link
			    },
		    })
		}

		else {
			async function main() {
				const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

				const createdAt = new Date().toISOString().split('T')[0];

				// console.log(id, name);
			    // Now you can use dbConnection to execute queries
			    const [response] = await dbConnection.query("SELECT * FROM notifications WHERE id = ?", [id]);
			    // console.log(response);

			    if (response == '') {
					return res.json({
					    "isSuccess": false,
					    "message": "Notification not found..."
					})
				}

				else {
			    	const [response1] = await dbConnection.query("UPDATE notifications set title=?, body=?, link=? where id = ?", 
			    		[title, bdes, link, id]);
			    	// console.log(response2);

			    	if (!response1) {
				    	return res.json({
				    		"isSuccess": false,
				    		"message": "Update operation failed..."
				    	})
			    	}

			    	else {
			    		const data = {
					        id: id // The ID of the newly inserted category
					    };
					    // console.log("Emitting category:", { action: 'update', data: data });
						// io.getIO().emit('category', { action: 'update', data: data });

			    		return res.json({
					        "isSuccess": true,
					        "message": "Updated successfully!"
					    });
			    	}
				}
			}

			main().catch(error => {
				// console.log(error);
				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch(error) {
		console.log("update notification error: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.delete_notification = async (req, res, next) => {
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

				const [response1] = await dbConnection.query(`DELETE FROM notifications WHERE id = ${id}`);

				if (response1 == "") {
					return res.json({
						"isSuccess": false,
						"data": [],
						"message": ""
					})
				}

				else {
					return res.json({
						"isSuccess": true,
						"data": []
					})
				}
			}

			main().catch(error => {
				// console.log(error);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("delete notification error: ", error);

	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.send_notification = async (req, res, next) => {
	try {
		const { id } = req.body;

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

				const [response] = await dbConnection.query(`SELECT * FROM notifications WHERE id = ${id}`);

				if (!response) {
					return res.json({
						"isSuccess": false,
						"data": [],
						"message": ""
					})
				}

				else {
					function isValidHttpUrl(string) {
					  try {
					    const newUrl = new URL(string);
					    return ["http:", "https:"].includes(newUrl.protocol);
					  } catch (err) {
					    return false;
					  }
					}

					const isMatch = isValidHttpUrl(response[0].link);

					// console.log(isMatch);

					if (isMatch) {
						const match = response[0]?.link != null ? response[0]?.link.match(/\/(\d+)\//) : false;

						// console.log(match[1]);

						const [response1] = await dbConnection.query("SELECT * FROM posts WHERE id = ?", [match[1]]);

						if (!response1) {
							return res.json({
								"isSuccess": false,
								"message": "Failed try Again..."
							})
						}

						else {
							const message = {
						        notification: {
						          title: response[0]?.title,
						          body: response[0]?.body
						        },
						        data: {
						            "postID": String(response1[0]?.id), // Include the extracted ID
						            "click_action": "FLUTTER_NOTIFICATION_CLICK",
						            "screen": "video",
						            "postData": JSON.stringify(response1),
						        },
						        topic: "all", // Send to all users subscribed to this topic
						    };

					      	admin
						        .messaging()
						        .send(message)
						        .then((response) => {
						          	// console.log("Successfully sent message:", response);

						          	return res.json({
						          		"isSuccess": true,
						          		"message": ""
						          	})
						        })
						        .catch((error) => {
						          	// console.log("Error sending message:", error);

						          	return res.json({
						          		"isSuccess": false,
						          		"message": "Failed try Again..."
						          	})
						        });
						}
					}

					else if (!isMatch && response[0].body) {
						const message = {
					        notification: {
					          title: response[0]?.title,
					          body: response[0]?.body
					        },
					        data: {
					          "click_action": "FLUTTER_NOTIFICATION_CLICK",
					          "screen": "home",
					        },
					        topic: "all", // Send to all users subscribed to this topic
					    };

					    admin
					        .messaging()
					        .send(message)
					        .then((response) => {
						        // console.log("Successfully sent message:", response);
						        return res.json({
						          	"isSuccess": true,
						          	"message": ""
						        })
					        })
					        .catch((error) => {
					          	// console.log("Error sending message:", error);
					          	return res.json({
					          		"isSuccess": false,
					          		"message": "Failed to send. Try Again..."
					          	})
					    	});
					}

					else {
						return res.json({
							"isSuccess": false,
							"message": "Failed try Again..."
						})
					}
				}
			}

			main().catch(error => {
				// console.log(error);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("send notification error: ", error);

	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.get_raffle = async (req, res, next) => {
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
				let itemsPerPage = parseInt(req.query.items) || 10;
				const offset = (page > 1 ? (page - 1) * itemsPerPage : 0);

				const [response, response1, response2] = await Promise.all([
		      dbConnection.query("SELECT COUNT(*) AS c FROM release_raffle rr JOIN raffles r ON r.id = rr.raffle_id JOIN raffle_details d ON r.id = d.raffle_id JOIN raffle_category rc ON rc.id = rr.cat_id JOIN raffle_brand as rb ON rb.id = r.brand WHERE rr.cat_id = 4"),
		      dbConnection.query(`SELECT r.*, rb.brand as brand, d.image1, d.image2, d.image3, d.image4, d.image5, rc.category FROM release_raffle rr JOIN raffles r ON r.id = rr.raffle_id JOIN raffle_details d ON r.id = d.raffle_id JOIN raffle_category rc ON rc.id = rr.cat_id JOIN raffle_brand as rb ON rb.id = r.brand WHERE rr.cat_id = 4 LIMIT 10 OFFSET ${offset}`),
		      dbConnection.query("SELECT DISTINCT rb.brand FROM raffles JOIN release_raffle as rc ON raffles.id = rc.raffle_id JOIN raffle_brand as rb ON raffles.brand = rb.id WHERE rc.cat_id = 4")
		   	]);

		        // const countResult = response[0]; // Access the first element of the result array
		        // const raffleData = response1[0]; // Access the first element of the result array
		        // const brands = response2[0]; // Access the first element of the result array

		        // Process the results as needed
		        // console.log("Count:", countResult);
		        // console.log("Raffle Data:", raffleData);
		        // console.log("Brands:", brands);

		        if (response[0] && response[0][0]?.c == 0 && response1[0] == "" && response2[0] == "") {
							return res.json({
								"isSuccess": false,
								"data": [],
								"message": ""
							})
						}

						else {
							return res.json({
			          "isSuccess": true,
			          "count": response[0][0]?.c,
			          "data": response1[0],
			         	"brands": response2[0],
			          "message": ""
			        });
						}
			}

			main().catch(error => {
				console.log(error.code);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("get raffle error: ", error);

	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.get_sneaker_release = async (req, res, next) => {
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
				let itemsPerPage = parseInt(req.query.items) || 10;
				const offset = (page > 1 ? (page - 1) * itemsPerPage : 0);

				const [response, response1, response2] = await Promise.all([
		            dbConnection.query("SELECT COUNT(*) AS c FROM release_raffle rr JOIN raffles r ON r.id = rr.raffle_id JOIN raffle_details d ON r.id = d.raffle_id JOIN raffle_category rc ON rc.id = rr.cat_id JOIN raffle_brand as rb ON rb.id = r.brand WHERE rr.cat_id != 4"),
		            dbConnection.query(`SELECT r.*, rb.brand as brand, d.image1, d.image2, d.image3, d.image4, d.image5, rc.category FROM release_raffle rr JOIN raffles r ON r.id = rr.raffle_id JOIN raffle_details d ON r.id = d.raffle_id JOIN raffle_category rc ON rc.id = rr.cat_id JOIN raffle_brand as rb ON rb.id = r.brand WHERE rr.cat_id != 4 LIMIT 10 OFFSET ${offset}`),
		            dbConnection.query("SELECT DISTINCT rb.brand FROM raffles JOIN release_raffle as rc ON raffles.id = rc.raffle_id JOIN raffle_brand as rb ON raffles.brand = rb.id WHERE rc.cat_id != 4")
		        ]);

		        const countResult = response[0]; // Access the first element of the result array
		        const raffleData = response1[0]; // Access the first element of the result array
		        const brands = response2[0]; // Access the first element of the result array

		        // Process the results as needed
		        // console.log("Count:", countResult);
		        // console.log("Raffle Data:", raffleData);
		        // console.log("Brands:", brands);

		        if (response[0] && response[0][0]?.c == 0 && response1[0] == "" && response2[0] == "") {
							return res.json({
								"isSuccess": false,
								"data": [],
								"message": ""
							})
						}

						else {
							return res.json({
			          "isSuccess": true,
			          "count": response[0][0]?.c,
			          "data": response1[0],
			         	"brands": response2[0],
			          "message": ""
			        });
						}
			}

			main().catch(error => {
				console.log(error.code);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("get sneaker_release error: ", error);

	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.post_raffle = async (req, res, next) => {
	try {
		const { title, des, image1, image2, image3, image4, image5, brand_img, retail_price, resell_price, cat_id, brand, date, sizes } = req.body;

	    const cleanedSizes =
	        typeof sizes == "object"
	        ? sizes.filter((size) => size !== "").map((size) => size === "" ? "" : parseFloat(size))
	        : sizes == undefined ? "" : [parseFloat(sizes)];

		const error = validationResult(req);
      
    if (!error.isEmpty()) {
		    // console.log(error.array());
		    let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"sizes": cleanedSizes,
		       	"oldInput": {
			        "title": title,
		            "des": des.replace(/"/g, '\\"'),
		            "image1": image1,
		            "image2": image2,
		            "image3": image3,
		            "image4": image4,
		            "image5": image5,
		            "brand_img": brand_img,
		            "brand": brand,
		            "retail_price": retail_price,
		            "resell_price": resell_price,
		            "cat_id": cat_id,
		            "date": date
			    },
		    })
		}

		else {
			async function main() {
				const dbConnection = await dbConnectionPromise;
				const createdAt = new Date(date).toISOString().split('T')[0];

				const insertQuery = "INSERT INTO raffles (title,description,retail_price,resell_price,brand,logo,date) VALUES (?,?,?,?,?,?,?)";

				const response1 = await dbConnection.query(insertQuery, [title, des, retail_price, resell_price, brand, brand_img, createdAt]);

				if (!response1) {
				   	return res.json({ "isSuccess": false, "message": "Insert operation failed." });
				}

				else {
					const [response2] = await dbConnection.query("INSERT INTO raffle_details (raffle_id, image1, image2, image3, image4, image5) VALUES (?, ?, ?, ?, ?, ?)", 
						[response1[0].insertId, image1, image2, image3, image4, image5]);

					if (!response2) {
				   		return res.json({ "isSuccess": false, "message": "Insert operation failed." });
					}

					else {
						const [response3] = await dbConnection.query("INSERT INTO release_raffle (cat_id,raffle_id) values(?,?)", 
							[cat_id, response1[0].insertId]);

						if (!response3) {
				   			return res.json({ "isSuccess": false, "message": "Insert operation failed." });
						}

						else {
							if (sizes) {
								for (const i of sizes) {
								    await dbConnection.query("INSERT INTO raffle_shoe_size (raffle_id, size) VALUES (?,?)", [response1[0].insertId, i]);
								}
							}

							const data = {
							    id: response1[0].insertId // The ID of the newly inserted category
							};
							// console.log("Emitting category:", { action: 'update', data: data });
							// io.getIO().emit('category', { action: 'create', data: data });
							    	
							return res.json({
						        "isSuccess": true,
						        "message": "Inserted successfully!",
						        "catId": response1[0].insertId // Optionally return the new user's ID
						    });
						}
					}
				}
			}

			main().catch(err => {
				// console.log(err);

				return res.json({
					"isSuccess": false,
					"message": err.code
				})
			})
		}
	}

	catch (error) {
		console.log("post raffle error: ", error);

	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.get_raffle_by_id = async (req, res, next) => {
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

				const [response] = await dbConnection.query(`select r.*, d.image1, d.image2, d.image3, d.image4, d.image5, rr.cat_id, GROUP_CONCAT(DISTINCT rs.size ORDER BY rs.size) AS sizes from raffles r join raffle_details d on r.id = d.raffle_id join release_raffle rr ON rr.raffle_id = r.id join raffle_shoe_size rs on rs.raffle_id = r.id where r.id= ${id} GROUP BY r.id`);

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
				// console.log(error.code);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("get raffle by id error: ", error);

	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.update_raffle = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { title, des, image1, image2, image3, image4, image5, brand_img, retail_price, resell_price, cat_id, brand, date, sizes } = req.body;

	    const cleanedSizes =
	        typeof sizes == "object"
	        ? sizes.filter((size) => size !== "").map((size) => size === "" ? "" : parseFloat(size))
	        : sizes == undefined ? "" : [parseFloat(sizes)];

		const error = validationResult(req);
      
    if (!error.isEmpty()) {
		    // console.log(error.array());
		    let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"id": id,
		       	"sizes": cleanedSizes,
		       	"oldInput": {
			        "title": title,
		            "des": des.replace(/"/g, '\\"'),
		            "image1": image1,
		            "image2": image2,
		            "image3": image3,
		            "image4": image4,
		            "image5": image5,
		            "brand_img": brand_img,
		            "brand": brand,
		            "retail_price": retail_price,
		            "resell_price": resell_price,
		            "cat_id": cat_id,
		            "date": date
			    },
		    })
		}

		else {
			async function main() {
				const dbConnection = await dbConnectionPromise;
				const createdAt = new Date(date).toISOString().split('T')[0];

				const [response] = await dbConnection.query("SELECT * FROM raffles WHERE id = ?", [id]);
			    // console.log(response);

			  if (response == '') {
					return res.json({
					    "isSuccess": false,
					    "message": "Item not found..."
					})
				}

				else {
					const insertQuery = "UPDATE raffles SET title=?, description=?, retail_price=?, resell_price=?, brand=?, logo=?, date=? WHERE id=?";

					const response1 = await dbConnection.query(insertQuery, [title, des, retail_price, resell_price, brand, brand_img, createdAt, id]);

					if (!response1) {
					   	return res.json({ "isSuccess": false, "message": "Update operation failed." });
					}

					else {
						const [response4] = await dbConnection.query("DELETE FROM raffle_details WHERE raffle_id=?", [id]);

						const [response2] = await dbConnection.query("INSERT INTO raffle_details (raffle_id, image1, image2, image3, image4, image5) VALUES (?, ?, ?, ?, ?, ?)", 
							[id, image1, image2, image3, image4, image5]);

						if (!response2) {
					   		return res.json({ "isSuccess": false, "message": "Update operation failed." });
						}

						else {
							const [response5] = await dbConnection.query("DELETE FROM release_raffle WHERE raffle_id=?", [id]);

							const [response3] = await dbConnection.query("INSERT INTO release_raffle (cat_id,raffle_id) values(?,?)", 
								[cat_id, id]);

							if (!response3) {
					   			return res.json({ "isSuccess": false, "message": "Update operation failed." });
							}

							else {
								const [response6] = await dbConnection.query("DELETE FROM raffle_shoe_size WHERE raffle_id=?", [id]);

								for (const i of sizes) {
								    await dbConnection.query("INSERT INTO raffle_shoe_size (raffle_id, size) VALUES (?,?)", [id, i]);
								}

								const [response4] = await dbConnection.query("DELETE FROM raffle_details WHERE raffle_id=?", [id]);

								const [response2] = await dbConnection.query("INSERT INTO raffle_details (raffle_id, image1, image2, image3, image4, image5) VALUES (?, ?, ?, ?, ?, ?)", 
									[id, image1, image2, image3, image4, image5]);

								if (!response2) {
							   		return res.json({ "isSuccess": false, "message": "Update operation failed." });
								}

								const data = {
								    id: id // The ID of the newly inserted category
								};
								// console.log("Emitting category:", { action: 'update', data: data });
								// io.getIO().emit('category', { action: 'create', data: data });
								    	
								return res.json({
							    "isSuccess": true,
							    "message": "Updated successfully!",
							  });
							}
						}
					}
				}
			}

			main().catch(err => {
				console.log(err);

				return res.json({
					"isSuccess": false,
					"message": err.code
				})
			})
		}
	}

	catch(error) {
		console.log("update raffle error: ", error);

	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.raffle_filter = async (req, res, next) => {
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
			// const month = req.query.month ? req.query.month : 'null';
			const brand = req.query.brand ? req.query.brand : 'null';
			// const category = req.query.category ? req.query.category : 'null';

			const page = parseInt(req.query.page) || 1;
			let itemsPerPage = parseInt(req.query.items) || 10;
			const offset = (page > 1 ? (page - 1) * itemsPerPage : 0);

			const buildRaffleQuery = async (req) => {

		    // Initialize arrays for WHERE conditions and parameters
		    const conditions = [];
		    const params = [];

		    // Build dynamic conditions
		    if (year !== 'null') {
		        conditions.push('YEAR(r.date) = ?');
		        params.push(year);
		    }

		    if (term !== 'null') {
		        conditions.push('LOWER(r.title) LIKE LOWER(?)');
		        params.push(`%${term}%`);
		    }

		    if (brand !== 'null') {
		        conditions.push('LOWER(raffle_brand.id) LIKE LOWER(?)');
		        params.push(brand);
		    }

		    // Add the fixed condition for cat_id
		    conditions.push('release_raffle.cat_id = 4');

		    // Construct the WHERE clause
		    const whereClause = conditions.length > 0 
		        ? 'WHERE ' + conditions.join(' AND ')
		        : 'WHERE release_raffle.cat_id = 4';

		    // Construct the full query
		    const sql = `
		        SELECT r.*, raffle_brand.brand, raffle_category.category
		        FROM raffles AS r
		        JOIN release_raffle ON r.id = release_raffle.raffle_id
		        JOIN raffle_category ON release_raffle.cat_id = raffle_category.id
		        JOIN raffle_brand ON r.brand = raffle_brand.id
		        ${whereClause}
		        LIMIT ? OFFSET ?
		    `;

		    // Add pagination parameters
		    params.push(itemsPerPage, offset);

		    // For debugging
		    // console.log('SQL Query:', sql);
		    // console.log('Parameters:', params);

		    const dbConnection = await dbConnectionPromise;
		    return dbConnection.query(sql, params);
			};

			async function main() {
		    try {
		        const [response] = await buildRaffleQuery(req);

		        // console.log(response);

		        if (response == '') {
							return res.json({
						   	"isSuccess": false,
						    "data": [],
						    "message": "No data found...",
						    "current_page": page,
						    "term": term,
						    "year": year,
						    "brand": brand
							})
						}

						else {
							return res.json({
						   	"isSuccess": true,
						    "data": response,
						    "message": "",
						    "current_page": page,
						    "term": term,
						    "year": year,
						    "brand": brand
							})
						}
		    } catch (error) {
		        console.log('Query error:', error);
		        throw error;
		    }
			}

			main().catch(err => {
				console.log(err);

				return res.json({
					"isSuccess": false,
					"message": err.code,
					"term": term
				})
			})
		}
	}

	catch(error) {
		console.log("get raffle filter data: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.sneaker_filter = async (req, res, next) => {
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
			// const month = req.query.month ? req.query.month : 'null';
			const brand = req.query.brand ? req.query.brand : 'null';
			const category = req.query.category ? req.query.category : 'null';

			const page = parseInt(req.query.page) || 1;
			let itemsPerPage = parseInt(req.query.items) || 10;
			const offset = (page > 1 ? (page - 1) * itemsPerPage : 0);

			// console.log("term: ", term, " year: ", year, " brand: ", brand, " category: ", category);

			const buildRaffleQuery = async (req) => {

		    // Initialize arrays for WHERE conditions and parameters
		    const conditions = [];
		    const params = [];

		    // Build dynamic conditions
		    if (year !== 'null') {
		        conditions.push('YEAR(r.date) = ?');
		        params.push(year);
		    }

		    if (term !== 'null') {
		        conditions.push('LOWER(r.title) LIKE LOWER(?)');
		        params.push(`%${term}%`);
		    }

		    if (brand !== 'null') {
		        conditions.push('LOWER(raffle_brand.id) LIKE LOWER(?)');
		        params.push(brand);
		    }

		    if (category !== 'null') {
        		conditions.push(`release_raffle.cat_id = ${category}`);
		    } else {
		        conditions.push('release_raffle.cat_id != 4');
		    }

		    // Construct the WHERE clause - no need for default since we always have at least one condition
		    const whereClause = 'WHERE ' + conditions.join(' AND ');

		    // Construct the full query
		    const sql = `
		        SELECT r.*, raffle_brand.brand, raffle_category.category
		        FROM raffles AS r
		        JOIN release_raffle ON r.id = release_raffle.raffle_id
		        JOIN raffle_category ON release_raffle.cat_id = raffle_category.id
		        JOIN raffle_brand ON r.brand = raffle_brand.id
		        ${whereClause}
		        LIMIT ? OFFSET ?
		    `;

		    // Add pagination parameters
		    params.push(itemsPerPage, offset);

		    // For debugging
		    // console.log('SQL Query:', sql);
		    // console.log('Parameters:', params);

		    const dbConnection = await dbConnectionPromise;
		    return dbConnection.query(sql, params);
			};

			async function main() {
		    try {
		        const [response] = await buildRaffleQuery(req);

		        // console.log(response, response == '');

		        if (response == '') {
							return res.json({
						   	"isSuccess": false,
						    "data": [],
						    "message": "No data found...",
						    "current_page": page,
						    "term": term,
						    "year": year,
						    "brand": brand,
						    "category": category
							})
						}

						else {
							return res.json({
						   	"isSuccess": true,
						    "data": response,
						    "message": '',
						    "current_page": page,
						    "term": term,
						    "year": year,
						    "brand": brand,
						    "category": category
							})
						}
		    } catch (error) {
		        console.log('Query error:', error);
		        throw error;
		    }
			}

			main().catch(err => {
				return res.json({
					"isSuccess": false,
					"message": err.code
				})
			})
		}
	}

	catch(error) {
		console.log("get sneaker filter data: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.delete_raffle = async (req, res, next) => {
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

				const [response1] = await Promise.all([
					dbConnection.query(`DELETE FROM raffle_shoe_size WHERE raffle_id = ${id}`),
					dbConnection.query(`DELETE FROM release_raffle WHERE raffle_id = ${id}`),
					dbConnection.query(`DELETE FROM raffle_details WHERE raffle_id = ${id}`),
					dbConnection.query(`DELETE FROM raffles WHERE id = ${id}`)
				]);

				if (response1 == "") {
					return res.json({
						"isSuccess": false,
						"data": [],
						"message": ""
					})
				}

				else {
					return res.json({
						"isSuccess": true,
						"data": []
					})
				}
			}

			main().catch(error => {
				// console.log(error);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch(error) {
		console.log("delete raffle data: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.delete_sneakers = async (req, res, next) => {
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

				const [response1] = await Promise.all([
					dbConnection.query(`DELETE FROM raffle_shoe_size WHERE raffle_id = ${id}`),
					dbConnection.query(`DELETE FROM release_raffle WHERE raffle_id = ${id}`),
					dbConnection.query(`DELETE FROM raffle_details WHERE raffle_id = ${id}`),
					dbConnection.query(`DELETE FROM raffles WHERE id = ${id}`)
				]);

				if (response1 == "") {
					return res.json({
						"isSuccess": false,
						"data": [],
						"message": ""
					})
				}

				else {
					return res.json({
						"isSuccess": true,
						"data": []
					})
				}
			}

			main().catch(error => {
				// console.log(error);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch(error) {
		console.log("delete raffle data: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.get_all_ads = async (req, res, next) => {
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
			const offset = (page > 1 ? (page - 1) * itemsPerPage : 0);

			async function main() {
				const dbConnection = await dbConnectionPromise;

				const [response] = await dbConnection.query(`SELECT * FROM advertisement ORDER BY id DESC limit 10 offset ${offset}`);

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
				// console.log(error.code);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("get all ads error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.get_ads_filter = async (req, res, next) => {
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

			const page = parseInt(req.query.page) || 1;
			let itemsPerPage = parseInt(req.query.items) || 10;
			const offset = (page > 1 ? (page - 1) * itemsPerPage : 0);

			// console.log(year, term, brand, year != null && term == 'null' && brand == 'null');

			// console.log("term: ", term, " year: ", year, " month: ", month);

			async function main() {
				const conditions = [];
		    const params = [];

		    // Build dynamic conditions
		    if (year !== 'null') {
		        conditions.push('YEAR(date) = ?');
		        params.push(year);
		    }

		    if (term !== 'null') {
		        conditions.push('LOWER(title) LIKE LOWER(?)');
		        params.push(`%${term}%`);
		    }

		    const whereClause = 'WHERE ' + conditions.join(' AND ');

		    // Construct the full query
		    const sql = `
		        select * from advertisement
		        ${whereClause}
		        LIMIT ? OFFSET ?
		    `;

		    // Add pagination parameters
		    params.push(itemsPerPage, offset);

		    // For debugging
		    console.log('SQL Query:', sql);
		    console.log('Parameters:', params);

		    const dbConnection = await dbConnectionPromise;
		    // return dbConnection.query();

				// if (year != null && term == 'null') {
				// 	query = `select * from advertisement where date = ${year} LIMIT 10 OFFSET ${offset}`;
				// }

				// else if (term != null && year == 'null') {
				// 	query = `select * from advertisement where lower(title) like lower('%${term}%') LIMIT 10 OFFSET ${offset}`;
				// }

				// else {
				// 	return res.json({
				// 		"isSuccess": false,
				// 		"message": "No data found..."
				// 	})
				// }

				const [response] = await dbConnection.query(sql, params);

				// console.log(response);

				if (response == '') {
					return res.json({
					   	"isSuccess": false,
					    "data": [],
					    "current_page": page,
					    "term": term,
					    "year": year
					})
				}

				else {
					return res.json({
					   	"isSuccess": true,
					    "data": response,
					    "current_page": page,
					    "term": term,
					    "year": year
					})
				}
			}

			main().catch(err => {
				// console.log(err);

				return res.json({
					"isSuccess": false,
					"message": err.code
				})
			})
		}
	}

	catch(error) {
		console.log("get ads filter data: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.post_ads = async (req, res, next) => {
	try {
		const { title, image, link_android, link_ios, date } = req.body;
    const des = req.body.des ? req.body.des.trim() : '';

    // console.log(!des && !link_android && !link_ios, !des, !link_android, !link_ios);

		const error = validationResult(req);
      
    	if (!error.isEmpty()) {
		    // console.log(error.array());
		    let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"oldInput": {
			        "title": title,
		          "image": image,
		          "link_android": link_android,
		          "link_ios": link_ios,
		          "date": date,
		          "des": des.replace(/"/g, '\\"')
			    	},
		    })
			}

			else {
	      if (!des && !link_android && !link_ios) {
	        return res.json({
			      "isSuccess": false,
			      "message": "Insert either code or android or ios link...",
		        "oldInput": {
				      "title": title,
			        "image": image,
			        "link_android": link_android,
			        "link_ios": link_ios,
			        "date": date,
			        "des": des.replace(/"/g, '\\"')
				    }
	        });
	      }

				else {
					async function main() {
						const dbConnection = await dbConnectionPromise;
						const createdAt = new Date(date).toISOString().split('T')[0];

						const insertQuery = "INSERT INTO advertisement (title, image, link_android, link_ios, code, date) VALUES (?,?,?,?,?,?)";

						const response1 = await dbConnection.query(insertQuery, [title, image, link_android, link_ios, des, createdAt]);

						if (!response1) {
						  return res.json({ "isSuccess": false, "message": "Insert operation failed." });
						}

						else {
							const data = {
							  id: response1[0].insertId // The ID of the newly inserted category
							};
							// console.log("Emitting category:", { action: 'update', data: data });
							// io.getIO().emit('category', { action: 'create', data: data });
							    	
							return res.json({
						        "isSuccess": true,
						        "message": "Inserted successfully!",
						        "catId": response1[0].insertId // Optionally return the new user's ID
						    });
						}
					}

					main().catch(err => {
						console.log(err);

						return res.json({
							"isSuccess": false,
							"message": err.code
						})
					})
				}
			}
	}

	catch(error) {
		console.log("post ads error: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.get_ads_by_id = async (req, res, next) => {
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

				const [response] = await dbConnection.query(`select * from advertisement where id = ${id}`);

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
				// console.log(error.code);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("get ads by id error: ", error);

	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.ads_update = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { title, image, link_android, link_ios, date } = req.body;
    const des = req.body.des.trim();

		const error = validationResult(req);
      
    if (!error.isEmpty()) {
		    // console.log(error.array());
		    let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"id": id,
		       	"oldInput": {
			        "title": title,
		          "image": image,
		          "link_android": link_android,
		          "link_ios": link_ios,
		          "date": date,
		          "des": des.replace(/"/g, '\\"')
			    	}
		    })
		}

		else {
			async function main() {
				const dbConnection = await dbConnectionPromise;
				const createdAt = new Date(date).toISOString().split('T')[0];

				const [response] = await dbConnection.query("SELECT * FROM advertisement WHERE id = ?", [id]);
			    // console.log(response);

			  if (response == '') {
					return res.json({
					    "isSuccess": false,
					    "message": "Item not found..."
					})
				}

				else {
					if (!des && !link_android && !link_ios) {
		        return res.json({
				      "isSuccess": false,
				      "message": "Insert either code or android or ios link...",
				      "id": id,
			        "oldInput": {
					      "title": title,
				        "image": image,
				        "link_android": link_android,
				        "link_ios": link_ios,
				        "date": date,
				        "des": des.replace(/"/g, '\\"')
					    }
		        });
		      }

		      else {
						const insertQuery = "UPDATE advertisement SET title=?, image=?, link_android=?, link_ios=?, code=?, date=? WHERE id=?";

						const response1 = await dbConnection.query(insertQuery, [title, image, link_android, link_ios, des, createdAt, id]);

						if (!response1) {
						   	return res.json({ "isSuccess": false, "message": "Update operation failed." });
						}

						else {
							return res.json({
							  "isSuccess": true,
							  "message": "Updated successfully!",
							});
						}
					}
				}
			}

			main().catch(err => {
				console.log(err);

				return res.json({
					"isSuccess": false,
					"message": err.code
				})
			})
		}
	}

	catch(error) {
		console.log("update ads error: ", error);

	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.delete_ads = async (req, res, next) => {
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

				const [response1] = await dbConnection.query(`DELETE FROM advertisement WHERE id = ${id}`)

				if (response1 == "") {
					return res.json({
						"isSuccess": false,
						"data": [],
						"message": ""
					})
				}

				else {
					return res.json({
						"isSuccess": true,
						"data": []
					})
				}
			}

			main().catch(error => {
				// console.log(error);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch(error) {
		console.log("delete advertisement data: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.get_desktop_ads = async (req, res, next) => {
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
			const offset = (page > 1 ? (page - 1) * itemsPerPage : 0);

			async function main() {
				const dbConnection = await dbConnectionPromise;

				const [response, response1] = await Promise.all([
					dbConnection.query("select count(*) as c FROM page_ads INNER JOIN pages as p on page_ads.page_id = p.id INNER JOIN advertisement as ads on page_ads.ads_id = ads.id"),
					dbConnection.query(`SELECT p.id, ads.id as ads_id, p.name, ads.title, ads.image, ads.link_android, ads.link_ios FROM page_ads INNER JOIN pages as p on page_ads.page_id = p.id INNER JOIN advertisement as ads on page_ads.ads_id = ads.id ORDER BY p.name LIMIT 10 OFFSET ${offset}`)
				]);

				// console.log(response[0], response1[0], response[0] == "", response[0][0]?.c == 0, response1[0] == "");

				if (response[0] && response[0][0]?.c == 0 && response1[0] == "") {
					return res.json({
						"isSuccess": false,
						"data": [],
						"message": ""
					})
				}

				else {
					return res.json({
						"isSuccess": true,
						"data": response1[0],
						"totalCount": response[0][0]?.c
					})
				}
			}

			main().catch(error => {
				// console.log(error.code);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("get desktop ads error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.get_mobile_ads = async (req, res, next) => {
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
			const offset = (page > 1 ? (page - 1) * itemsPerPage : 0);

			async function main() {
				const dbConnection = await dbConnectionPromise;

				const [response, response1] = await Promise.all([
					dbConnection.query("select count(*) as c FROM mobile_ads INNER JOIN pages as p on mobile_ads.page_id = p.id INNER JOIN advertisement as ads on mobile_ads.ads_id = ads.id"),
					dbConnection.query(`SELECT p.id, ads.id as ads_id, p.name, ads.title, ads.image, ads.link_android, ads.link_ios FROM mobile_ads INNER JOIN pages as p on mobile_ads.page_id = p.id INNER JOIN advertisement as ads on mobile_ads.ads_id = ads.id ORDER BY p.name LIMIT 10 OFFSET ${offset}`)
				])

				// console.log(response[0], response1[0]);

				if (response[0] && response[0][0]?.c == 0 && response1[0] == "") {
					return res.json({
						"isSuccess": false,
						"data": [],
						"message": ""
					})
				}

				else {
					return res.json({
						"isSuccess": true,
						"data": response1[0],
						"totalCount": response[0][0]?.c
					})
				}
			}

			main().catch(error => {
				// console.log(error.code);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("get mobile ads error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.get_ads_page = async (req, res, next) => {
	try {
		async function main() {
			const dbConnection = await dbConnectionPromise;

			const [response] = await dbConnection.query("SELECT * FROM pages");

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
		console.log("get ads pages error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.post_desktop_ads = async (req, res, next) => {
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

				const { page_id, ads_id } = req.body;

				const cleanedAds =
        typeof ads_id == "object" ? ads_id.filter((ads) => ads !== "") : [ads_id];

				const [response] = await dbConnection.query("SELECT * FROM pages WHERE id = ?", [page_id]);
			    // console.log(response);

			  if (response == '') {
					return res.json({
					    "isSuccess": false,
					    "message": "Page not found..."
					})
				}

				else {
						if (cleanedAds) {
								for (const i of cleanedAds) {
								    await dbConnection.query("INSERT INTO page_ads (page_id, ads_id) VALUES (?,?)", [page_id, i]);
								}
						}

				   	// const data = {
					  //     id: response1[0].insertId, // The ID of the newly inserted category
					  //     name: name // The actual category name
					  // };
					  // console.log("Emitting category:", { action: 'update', data: data });
						// io.getIO().emit('category', { action: 'create', data: data });
				   	return res.json({
				      "isSuccess": true,
				      "message": "Inserted successfully!"
				    });
				}
			}

			main().catch(err => {
				return res.json({
					"isSuccess": false,
					"message": err.code
				})
			})
		}
	}

	catch(error) {
		console.log("post desktop ads: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.post_mobile_ads = async (req, res, next) => {
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

				const { page_id, ads_id } = req.body;

				const cleanedAds =
        typeof ads_id == "object" ? ads_id.filter((ads) => ads !== "") : [ads_id];

				const [response] = await dbConnection.query("SELECT * FROM pages WHERE id = ?", [page_id]);
			    // console.log(response);

			  if (response == '') {
					return res.json({
					    "isSuccess": false,
					    "message": "Page not found..."
					})
				}

				else {
						if (cleanedAds) {
								for (const i of cleanedAds) {
								    await dbConnection.query("INSERT INTO mobile_ads (page_id, ads_id) VALUES (?,?)", [page_id, i]);
								}
						}

				   	// const data = {
					  //     id: response1[0].insertId, // The ID of the newly inserted category
					  //     name: name // The actual category name
					  // };
					  // console.log("Emitting category:", { action: 'update', data: data });
						// io.getIO().emit('category', { action: 'create', data: data });
				   	return res.json({
				      "isSuccess": true,
				      "message": "Inserted successfully!"
				    });
				}
			}

			main().catch(err => {
				return res.json({
					"isSuccess": false,
					"message": err.code
				})
			})
		}
	}

	catch(error) {
		console.log("post mobile ads: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.get_desktop_ads_by_id = async (req, res, next) => {
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

				const [response] = await dbConnection.query(`SELECT p.id as page_id, GROUP_CONCAT(ads.id) as ads_id FROM page_ads INNER JOIN pages AS p ON page_ads.page_id = p.id INNER JOIN advertisement AS ads ON page_ads.ads_id = ads.id WHERE page_ads.page_id = ${id}`);

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
				// console.log(error.code);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("get desktop ads by id error: ", error);

	  return res.status(500).json({
	    "isSuccess": false,
	    "message": "Failed try Again..."
	  });
	}
}

module.exports.get_mobile_ads_by_id = async (req, res, next) => {
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

				const [response] = await dbConnection.query(`SELECT p.id as page_id, GROUP_CONCAT(ads.id) as ads_id FROM mobile_ads INNER JOIN pages AS p ON mobile_ads.page_id = p.id INNER JOIN advertisement AS ads ON mobile_ads.ads_id = ads.id WHERE mobile_ads.page_id = ${id}`);

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
				// console.log(error.code);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("get mobile ads by id error: ", error);

	  return res.status(500).json({
	    "isSuccess": false,
	    "message": "Failed try Again..."
	  });
	}
}

module.exports.update_desktop_ads = async (req, res, next) => {
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

				const { page_id, ads_id } = req.body;

				const cleanedAds =
        typeof ads_id == "object" ? ads_id.filter((ads) => ads !== "") : [ads_id];

				const [response] = await dbConnection.query("SELECT * FROM pages WHERE id = ?", [page_id]);
			    // console.log(response);

			  if (response == '') {
					return res.json({
					    "isSuccess": false,
					    "message": "Page not found..."
					})
				}

				else {
						if (cleanedAds) {
								const [response1] = await dbConnection.query("DELETE FROM page_ads WHERE page_id = ?", [page_id]);

								for (const i of cleanedAds) {
								    await dbConnection.query("INSERT INTO page_ads (page_id, ads_id) VALUES (?,?)", [page_id, i]);
								}
						}

				   	// const data = {
					  //     id: response1[0].insertId, // The ID of the newly inserted category
					  //     name: name // The actual category name
					  // };
					  // console.log("Emitting category:", { action: 'update', data: data });
						// io.getIO().emit('category', { action: 'create', data: data });
				   	return res.json({
				      "isSuccess": true,
				      "message": "Updated successfully!"
				    });
				}
			}

			main().catch(err => {
				// console.log(err);
				return res.json({
					"isSuccess": false,
					"message": err.code
				})
			})
		}
	}

	catch(error) {
		console.log("update desktop ads: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.update_mobile_ads = async (req, res, next) => {
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

				const { page_id, ads_id } = req.body;

				const cleanedAds =
        typeof ads_id == "object" ? ads_id.filter((ads) => ads !== "") : [ads_id];

				const [response] = await dbConnection.query("SELECT * FROM pages WHERE id = ?", [page_id]);
			    // console.log(response);

			  if (response == '') {
					return res.json({
					    "isSuccess": false,
					    "message": "Page not found..."
					})
				}

				else {
						if (cleanedAds) {
								const [response1] = await dbConnection.query("DELETE FROM mobile_ads WHERE page_id = ?", [page_id]);

								for (const i of cleanedAds) {
								    await dbConnection.query("INSERT INTO mobile_ads (page_id, ads_id) VALUES (?,?)", [page_id, i]);
								}
						}

				   	// const data = {
					  //     id: response1[0].insertId, // The ID of the newly inserted category
					  //     name: name // The actual category name
					  // };
					  // console.log("Emitting category:", { action: 'update', data: data });
						// io.getIO().emit('category', { action: 'create', data: data });
				   	return res.json({
				      "isSuccess": true,
				      "message": "Updated successfully!"
				    });
				}
			}

			main().catch(err => {
				return res.json({
					"isSuccess": false,
					"message": err.code
				})
			})
		}
	}

	catch(error) {
		console.log("update mobile ads: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.delete_desktop_ads = async (req, res, next) => {
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

				const { page_id, ads_id } = req.body;

				const [response1] = await dbConnection.query(`DELETE FROM page_ads WHERE page_id = ${page_id} AND ads_id = ${ads_id}`);

				// console.log(response1);

				if (response1 == "") {
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

			main().catch(error => {
				// console.log(error);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch(error) {
		console.log("delete desktop ads error: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.delete_mobile_ads = async (req, res, next) => {
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

				const { page_id, ads_id } = req.body;

				const [response1] = await dbConnection.query(`DELETE FROM mobile_ads WHERE page_id = ${page_id} AND ads_id = ${ads_id}`);

				if (response1 == "") {
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

			main().catch(error => {
				// console.log(error);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch(error) {
		console.log("delete mobile ads error: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}