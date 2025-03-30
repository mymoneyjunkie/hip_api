const dbConnectionPromise = require('../db_news');

const { body, validationResult } = require("express-validator");

// require('dotenv').config();

module.exports.get_news_category = async (req, res, next) => {
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
		console.log("get news categories error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.get_news_category_by_id = async (req, res, next) => {
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
		console.log("get news categories by id error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.delete_news_category = async (req, res, next) => {
	try {
		async function main() {
			const dbConnection = await dbConnectionPromise;

			const { id } = req.params;

			const [response1, response] = await Promise.all([
				dbConnection.query(`DELETE FROM tags WHERE category_id = ${id}`),
				dbConnection.query(`DELETE FROM category WHERE id = ${id}`)
			])

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

	catch (error) {
		console.log("delete news categories error: ", error);
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

				const query = `SELECT id, title AS news_title, NULL AS news_description, NULL AS category_name FROM posts WHERE title LIKE '%${term}%' UNION ALL 
					SELECT id, title AS news_title, des AS news_description, NULL AS category_name FROM posts WHERE des LIKE '%${term}%' UNION ALL 
					SELECT id, NULL AS news_title, NULL AS news_description, name AS category_name FROM category WHERE name LIKE '%${term}%' UNION ALL 
					SELECT id, title AS news_title, des AS news_description, NULL AS category_name FROM posts WHERE YEAR(date) = ${year} UNION ALL 
					SELECT id, title AS news_title, des AS news_description, NULL AS category_name FROM posts WHERE MONTH(date) = ${month} 
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
		console.log("get news search data: ", error);

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
		console.log("update news category error: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.get_blog_data = async (req, res, next) => {
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

				const [response] = await dbConnection.query("SELECT COUNT(*) AS c FROM posts p JOIN views v ON p.id = v.post_id");

				if (response == "") {
					return res.json({
						"isSuccess": false,
						"data": [],
						"message": ""
					})
				}

				else {
					const [response1] = await dbConnection.query(`SELECT p.id, p.title, p.image, p.date, v.views FROM posts p JOIN views v ON p.id = v.post_id LIMIT 10 OFFSET ${offset}`);

					if (response1 == "") {
						return res.json({
							"isSuccess": false,
							"data": [],
							"totalCount": response[0]?.c
						})
					}

					else {
						return res.json({
							"isSuccess": true,
							"data": response1,
							"totalCount": response[0]?.c
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
		console.log("get news blog error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.get_blog_data_by_id = async (req, res, next) => {
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

				const [response] = await dbConnection.query(`SELECT p.*, v.views FROM posts p JOIN views v ON p.id = v.post_id WHERE p.id = ${id}`);

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
		console.log("get news blog by id error: ", error);

	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.add_blog = async (req, res, next) => {
	try {
		const { title, des, image, tags } = req.body;
      	      
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
			        "des": des ? des.trim() : '',
			        "image": image ? image.trim() : '',
			        "tags": cleanedTags,
			    },
		    })
		}

		else {
			async function main() {
				const dbConnection = await dbConnectionPromise;
				const createdAt = new Date().toISOString().split('T')[0];

				const insertQuery = "INSERT INTO posts (title,des,image,date) VALUES (?,?,?,?)";

				const response1 = await dbConnection.query(insertQuery, [title, des, image, createdAt]);

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

	catch(error) {
		console.log("add blog posts error: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.blog_update = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { title, des, image, tags } = req.body;
      	      
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
			        "des": des ? des.trim() : '',
			        "image": image ? image.trim() : '',
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

			    	const [response2] = await dbConnection.query("UPDATE posts SET title=?, des=?, image=?, date=? WHERE id=?", 
			    		[title, des, image, createdAt, id]);
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

	catch(error) {
		console.log("update blog post error: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.delete_blog = async (req, res, next) => {
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

				const [response1] = await dbConnection.query(`DELETE FROM posts WHERE id = ${id}`);
				const [response2] = await dbConnection.query(`DELETE FROM tags WHERE post_id = ${id}`);
				const [response3] = await dbConnection.query(`DELETE FROM views WHERE post_id = ${id}`);

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
		console.log("delete blog posts error: ", error);
		
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}