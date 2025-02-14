const { Router } = require("express");

const { body, param, query, validationResult } = require("express-validator");

const {
	get_news_category,
	get_news_category_by_id,
	delete_news_category,
	get_search_data,
	post_category,
	categories_update,
	get_blog_data,
	get_blog_data_by_id,
	add_blog,
	blog_update,
	delete_blog
} = require("../controllers/adminNewsController");

const router = Router();

router.get("/category", get_news_category);

router.get("/category/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	], 
	get_news_category_by_id
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
	delete_news_category
);

router.get("/searchNews", 
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

router.get("/blog",
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
	get_blog_data
);

router.get("/blog/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	], 
	get_blog_data_by_id
);

router.post("/blog",
	[
	    body("title")
	      .trim()
	      .notEmpty()
	      .withMessage("Title is required.")
	      .matches(/^[^<>]*$/)
	      .withMessage("Invalid Title..."),
	    body("des")
	      .trim()
	      .notEmpty()
	      .withMessage("Description is required")
	      .matches(/^[^<>]*$/)
	      .withMessage("Invalid Description..."),
	    body("image")
	      .trim()
	      .notEmpty()
	      .withMessage("Image is required")
	      .escape(),
	    body("tags").trim().notEmpty().withMessage("Category is required"),
	], 
	add_blog
);

router.post("/blog_update/:id",
	[
		param("id")
			.trim()
			.notEmpty()
			.withMessage("Id is required.")
			.isInt()
			.withMessage("Invalid ID found..."),
	    body("title")
	      .trim()
	      .notEmpty()
	      .withMessage("Title is required.")
	      .matches(/^[^<>]*$/)
	      .withMessage("Invalid Title..."),
	    body("des")
	      .trim()
	      .notEmpty()
	      .withMessage("Description is required")
	      .matches(/^[^<>]*$/)
	      .withMessage("Invalid Description..."),
	    body("image")
	      .trim()
	      .notEmpty()
	      .withMessage("Image is required")
	      .escape(),
	    body("tags").trim().notEmpty().withMessage("Category is required"),
	], 
	blog_update
);

router.get("/deleteBlog/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	], 
	delete_blog
);

module.exports = router;