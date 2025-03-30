const { Router } = require("express");

const { body, param, query, validationResult } = require("express-validator");

const {
	categories_get,
	trending_get,
	update_views,
	featured_get
} = require("../controllers/user_news_controller");

const router = Router();

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

router.get("/featured", featured_get);

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

module.exports = router;