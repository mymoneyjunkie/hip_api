const { Router } = require("express");

const { body, param, query, validationResult } = require("express-validator");

const {
	categories_get,
	trending_get,
	post_by_date_get,
	featured_get,
	poll_get,
	popdown_get,
	desktop_ads_get,
	mobile_ads_get,
	all_post_by_category_get,
	post_by_id_get,
	all_post_by_date_get,
	get_search_data,
	comments_get,
	update_views,
	update_votes
} = require("../controllers/user_web_controller");

const router = Router();

function isValidDate(dateString) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Basic YYYY-MM-DD format
  if (!dateRegex.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return !isNaN(date); // Check if the date is valid
}

router.get("/category", categories_get);

router.get("/trending",
	[
		query("term")
	      .optional()
          .isIn(['now', 'week', 'month', 'year'])
          .withMessage("Type must be a string")
	],
	trending_get
);

router.get("/posts",
	[
		query("page")
	    .optional()
      .isInt()
      .withMessage("Page must be a number"),
  ],
	post_by_date_get
);

router.get("/featured", featured_get);

router.get("/poll", poll_get);

router.get("/popdown", popdown_get);

router.get("/desktopAds/:page_id", 
	[
		param("page_id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
    ],
	desktop_ads_get
);

router.get("/mobileAds/:page_id",
	[
		param("page_id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
    ], 
	mobile_ads_get
);

router.get("/category_post/:id",
	[
		param("id")
	      	.trim()
          	.notEmpty()
          	.withMessage("ID is required")
          	.isInt()
          	.withMessage("ID must be a number"),
        query("filter")
        	.optional()
        	.isIn(['n', 'o'])
        	.withMessage("Name is required"),
        query("items")
		    	.optional()
          	.isInt()
          	.withMessage("Items must be a number"),
        query("page")
	      	.optional()
          	.isInt()
          	.withMessage("Page must be a number")
    ], 
	all_post_by_category_get
);

router.get("/post/:id",
	[
		param("id")
	      	.trim()
          	.notEmpty()
          	.withMessage("ID is required")
          	.isInt()
          	.withMessage("ID must be a number"),
    ],
    post_by_id_get
)

router.get("/post_date/:date",
	[
	    param("date")
	      .trim()
	      .notEmpty()
	      .withMessage("Date is required")
	      .custom((value) => {
	        if (!isValidDate(value)) {
	          throw new Error("Invalid date found...");
	        }
	        return true;
	      }),
  	],
	all_post_by_date_get
);

router.get("/search", 
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

router.get("/comments/:id",
	[
		param("id")
	    .trim()
      .notEmpty()
      .withMessage("ID is required")
      .isInt()
      .withMessage("ID must be a number"),
    query("items")
		  .optional()
      .isInt()
      .withMessage("Items must be a number"),
    query("reply_limit")
		  .optional()
      .isInt()
      .withMessage("Reply limit must be a number"),
	  query("page")
	    .optional()
      .isInt()
      .withMessage("Page must be a number")
  ],
  comments_get
)

router.get("/views/:post_id", 
	[
		param("post_id")
	      .trim()
          .notEmpty()
          .withMessage("Post Id is required")
          .isInt()
          .withMessage("Post Id must be a number")
	],
	update_views
);

router.post("/votes",
	[
		body("poll_id").trim().notEmpty().withMessage("Poll Id is required")
      .isNumeric().withMessage("Please select a valid Poll"),
    	body("option_id").trim().notEmpty().withMessage("Option Id is required")
      .isNumeric().withMessage("Please select a valid Option")
	], 
	update_votes
);

module.exports = router;