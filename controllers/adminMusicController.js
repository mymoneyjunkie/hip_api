const dbConnectionPromise = require('../db_music');

const { body, validationResult } = require("express-validator");

// require('dotenv').config();

module.exports.get_music_category = async (req, res, next) => {
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
		console.log("get music categories error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.get_artists = async (req, res, next) => {
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
					dbConnection.query(`SELECT * FROM artists LIMIT 10 offset ${offset}`),
					dbConnection.query("SELECT COUNT(*) AS c FROM artists")
				]);

				// console.log(response[0], response1[0]);

				if (response[0] == "") {
					return res.json({
						"isSuccess": false,
						"data": [],
						"message": ""
					})
				}

				else {
					return res.json({
						"isSuccess": true,
						"data": response[0].filter(i => i.name !== ""),
						"totalCount": response1[0][0]?.c
					})
				}
			}

			main().catch(error => {
				console.log(error);

				return res.json({ "isSuccess": false, "message": error.code });
			})
		}
	}

	catch (error) {
		console.log("get music artists error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.get_music_category_by_id = async (req, res, next) => {
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
		console.log("get music categories by id error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.delete_music_category = async (req, res, next) => {
	try {
		async function main() {
			const dbConnection = await dbConnectionPromise;

			const { id } = req.params;

			const [response] = await dbConnection.query(`DELETE FROM category WHERE id = ${id}`);

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
		console.log("delete music categories error: ", error);
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

				const query = `SELECT id, title AS audio_title, NULL AS audio_description, NULL AS artist_name, NULL AS category_name FROM music WHERE title LIKE '%${term}%' UNION ALL 
					SELECT id, NULL AS audio_title, description AS audio_description, NULL AS artist_name, NULL AS category_name FROM music_audio WHERE description LIKE '%${term}%' UNION ALL 
					SELECT id, NULL AS audio_title, NULL AS audio_description, name AS artist_name, NULL AS category_name FROM artists WHERE name LIKE '%${term}%' UNION ALL 
					SELECT id, NULL AS audio_title, NULL AS audio_description, NULL AS artist_name, name AS category_name FROM category WHERE name LIKE '%${term}%' UNION ALL 
					SELECT id, title AS audio_title, NULL AS audio_description, NULL AS artist_name, NULL AS category_name FROM music WHERE YEAR(date) = ${year} UNION ALL 
					SELECT id, title AS audio_title, NULL AS audio_description, NULL AS artist_name, NULL AS category_name FROM music WHERE MONTH(date) = ${month} 
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
		console.log("get music search data: ", error);

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
		console.log("update music category error: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.post_artist = async (req, res, next) => {
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

				const { name, image, portrait_image, social_media } = req.body;

				const [response] = await dbConnection.query("SELECT * FROM artists WHERE name = ?", [name]);
			    // console.log(response);

			    if (response != '') {
					return res.json({
					    "isSuccess": false,
					    "message": "Artist already found. Please insert a new one..."
					})
				}

				else {
					const insertQuery = "INSERT INTO artists (name, image, portrait_image, social_media) VALUES (?, ?, ?, ?)";

				    const response1 = await dbConnection.query(insertQuery, [name, image, portrait_image, social_media]);

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
		console.log("post music artist error: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.get_artist_by_id = async (req, res, next) => {
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

				const [response] = await dbConnection.query(`SELECT * FROM artists WHERE id = ${id}`);

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
		console.log("get music artists by id error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

module.exports.artists_update = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { name, image, portrait_image, social_media } = req.body;
		
		const error = validationResult(req);
      
      	if (!error.isEmpty()) {
		    // console.log(error.array());
		    let msg1 = error.array()[0].msg;

		    return res.json({
		       	"isSuccess": false,
		       	"message": msg1,
		       	"id": id,
		       	"oldInput": {
		       		"name": name,
		       		"image": image,
		       		"portrait_image": portrait_image,
		       		"social_media": social_media
		       	}
		    })
		}

		else {
			async function main() {
				const dbConnection = await dbConnectionPromise; // Wait for the promise to resolve

				// console.log(id, name);
			    // Now you can use dbConnection to execute queries
			    const [response] = await dbConnection.query("SELECT * FROM artists WHERE id = ?", [id]);
			    // console.log(response);

			    if (response == '') {
					return res.json({
					    "isSuccess": false,
					    "message": "Artist not found..."
					})
				}

				else {
			    	const [response2] = await dbConnection.query("UPDATE artists SET name = ?, image = ?, portrait_image = ?, social_media = ? WHERE id = ?", [name, image, portrait_image, social_media, id]);
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
		console.log("update music artist error: ", error);

		return res.json({
			"isSuccess": false,
			"message": "Failed try Again..."
		})
	}
}

module.exports.delete_artist = async (req, res, next) => {
	try {
		async function main() {
			const dbConnection = await dbConnectionPromise;

			const { id } = req.params;

			const [response] = await dbConnection.query(`DELETE FROM artists WHERE id = ${id}`);

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
		console.log("delete music artist error: ", error);
	    return res.status(500).json({
	        "isSuccess": false,
	        "message": "Failed try Again..."
	    });
	}
}

// module.exports.get_music_by_category = async (req, res, next) => {
// 	try {}

// 	catch (error) {
// 		console.log("get music by category error: ", error);
// 	    return res.status(500).json({
// 	        "isSuccess": false,
// 	        "message": "Failed try Again..."
// 	    });
// 	}
// }