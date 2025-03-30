const { Router } = require("express");

const { body, param, query, validationResult } = require("express-validator");

const {
	get_music_category,
	get_music_category_by_id,
	delete_music_category,
	get_search_data,
	post_category,
	categories_update,
	get_artists,
	post_artist,
	get_artist_by_id,
	artists_update,
	delete_artist
} = require("../controllers/adminMusicController");

const router = Router();

router.get("/category", get_music_category);

router.get("/artist",
	[
	    query("items")
		    .optional()
          	.isInt()
          	.withMessage("Items must be a number"),
	    query("page")
	      .optional()
          .isInt()
          .withMessage("Page must be a number")
	], 
	get_artists
);

router.get("/category/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	], 
	get_music_category_by_id
);

router.get("/deleteCategory/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	], 
	delete_music_category
);

router.get("/searchMusic", 
	[
		query('term')
	        .optional()
	        .isString()
	        .withMessage("Search Term is required")
	        .matches(/^[^<>]*$/) // Regex to ensure no < or > characters
	        .withMessage("Invalid search term"),    
    	query('year')
	        .optional()
	        .isNumeric()
	        .withMessage("Year must be numeric"),
	    query('month')
	        .optional()
	        .isNumeric()
	        .withMessage("Month must be numeric"),
	    query("items")
		    .optional()
          	.isInt()
          	.withMessage("Items must be a number"),
	    query("page")
	      .optional()
          .isInt()
          .withMessage("Page must be a number")
	],
	get_search_data
);

router.post("/category",
	[
	    body("name")
	      .trim()
	      .notEmpty()
	      .withMessage("Category is required.")
	      .isString()
	      .withMessage("Category must be a string.")
	      .matches(/^[A-Za-z\s]+$/)
	      .withMessage("Category can only contain letters and spaces."),
  	],
  	post_category
);

router.post("/category_update/:id",
	[
		param("id")
			.trim()
			.notEmpty()
			.withMessage("Id is required.")
			.isInt()
			.withMessage("Invalid ID found..."),
	    body("name")
	      .trim()
	      .notEmpty()
	      .withMessage("Category is required.")
	      .isString()
	      .withMessage("Category must be a string.")
	      .matches(/^[A-Za-z\s]+$/)
	      .withMessage("Category can only contain letters and spaces."),
  	],
  	categories_update 
);

router.post("/artist", 
	[
		body("name")
	      .trim()
	      .notEmpty()
	      .withMessage("Artist Name is required.")
	      .isString()
	      .withMessage("Artist Name must be a string.")
	      .matches(/^[A-Za-z0-9\s]+$/)
	      .withMessage("Artist Name can only contain letters and spaces."),
	    body("image").trim().notEmpty().withMessage("Image is required").escape(),
	    body("portrait_image")
	      .trim()
	      .notEmpty()
	      .withMessage("Portrait Image is required")
	      .escape(),
	    body("social_media")
	    	.optional().isURL().withMessage('Must be a valid URL')
	],
	post_artist
);

router.get("/artist/:id",
	[
		param("id")
			.trim()
			.notEmpty()
			.withMessage("Id is required.")
			.isInt()
			.withMessage("Invalid ID found...")
	], 
	get_artist_by_id
);

router.post("/artist_update/:id", 
	[
		param("id")
			.trim()
			.notEmpty()
			.withMessage("Id is required.")
			.isInt()
			.withMessage("Invalid ID found..."),
		body("name")
	      .trim()
	      .notEmpty()
	      .withMessage("Artist Name is required.")
	      .isString()
	      .withMessage("Artist Name must be a string.")
	      .matches(/^[A-Za-z0-9\s]+$/)
	      .withMessage("Artist Name can only contain letters and spaces."),
	    body("image").trim().notEmpty().withMessage("Image is required").escape(),
	    body("portrait_image")
	      .trim()
	      .notEmpty()
	      .withMessage("Portrait Image is required")
	      .escape(),
	    body("social_media")
	    	.optional().isURL().withMessage('Must be a valid URL')
	],
	artists_update
);

router.get("/deleteArtist/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	], 
	delete_artist
);

module.exports = router;