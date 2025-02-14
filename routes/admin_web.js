const { Router } = require("express");

const { body, param, query, validationResult } = require("express-validator");

const {
	get_web_category,
	get_web_brand,
	trending_get,
	get_web_category_by_id,
	get_web_brand_by_id,
	delete_web_category,
	get_search_data,
	post_category,
	categories_update,
	post_brand,
	brand_update,
	delete_brand,
	get_all_posts,
	add_posts,
	get_posts_by_id,
	get_posts_by_category,
	post_update,
	delete_posts,
	get_all_users,
	get_search_user,
	get_poll,
	add_poll,
	get_poll_by_id,
	poll_update,
	delete_poll,
	get_header_popup,
	update_header_popup,
	get_all_notifications,
	add_notification,
	get_notification_by_id,
	update_notification,
	delete_notification,
	send_notification,
	get_raffle,
	get_sneaker_release,
	raffle_filter,
	sneaker_filter,
	post_raffle,
	update_raffle,
	get_raffle_by_id,
	delete_raffle,
	delete_sneakers,
	get_all_ads,
	get_ads_filter,
	post_ads,
	get_ads_by_id,
	ads_update,
	delete_ads,
	get_desktop_ads,
	get_mobile_ads,
	get_ads_page,
	post_desktop_ads,
	post_mobile_ads,
	get_desktop_ads_by_id,
	get_mobile_ads_by_id,
	update_desktop_ads,
	update_mobile_ads,
	delete_desktop_ads,
	delete_mobile_ads
} = require("../controllers/adminWebController");

const router = Router();

router.get("/category", get_web_category);

router.get("/brand", get_web_brand);

router.get("/trending",
	[
		query("term")
	      .optional()
          .isIn(['now', 'week', 'month', 'year'])
          .withMessage("Type must be a string")
	],
	trending_get
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
	get_web_category_by_id
);

router.get("/brand/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	], 
	get_web_brand_by_id
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
	delete_web_category
);

router.get("/searchWeb", 
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
)

router.post("/brand",
	[
	    body("name")
	      .trim()
	      .notEmpty()
	      .withMessage("Brand name is required.")
	      .isString()
	      .withMessage("Brand name must be a string.")
	      .matches(/^[A-Za-z\s]+$/)
	      .withMessage("Brand name can only contain letters and spaces."),
  	],
  	post_brand
);

router.post("/brand_update/:id",
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
	      .withMessage("Brand name is required.")
	      .isString()
	      .withMessage("Brand name must be a string.")
	      .matches(/^[A-Za-z\s]+$/)
	      .withMessage("Brand name can only contain letters and spaces."),
  	],
  	brand_update 
);

router.get("/deleteBrand/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	], 
	delete_brand
);

router.get("/category_post/:id",
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
	    query("page")
	      .optional()
          .isInt()
          .withMessage("Page must be a number")
	],
	get_posts_by_category
);

router.get("/posts",
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
	get_all_posts
);

router.post("/posts",
	[
	    body("title")
	      .trim()
	      .notEmpty()
	      .withMessage("Title is required.")
	      .matches(/^(?:(?!<script).)*$/is)
	      .withMessage("Invalid Title..."),
	    body("tt")
	      .trim()
	      .notEmpty()
	      .withMessage("Title Translate is required.")
	      .matches(/^(?:(?!<script).)*$/is)
	      .withMessage("Invalid Title Translate..."),
	    body("des")
	      .trim()
	      .notEmpty()
	      .withMessage("Description is required")
	      .matches(/^(?:(?!<script).)*$/is)
	      .withMessage("Invalid Description..."),
	    body("dt")
	      .trim()
	      .notEmpty()
	      .withMessage("Description Translate is required")
	      .matches(/^(?:(?!<script).)*$/is)
	      .withMessage("Invalid Description Translate..."),
	    body("logo").trim().notEmpty().withMessage("Image is required").escape(),
	    body("portrait_image")
	      .trim()
	      .notEmpty()
	      .withMessage("Portrait Image is required")
	      .escape(),
	    body("tags").trim().notEmpty().withMessage("Category is required"),
	    body("fileCode").optional().matches(/^(?:(?!<script).)*$/is).withMessage("Link is Invalid"),
	    body("link").optional().isURL().withMessage("Link is Invalid"),
	    body("sm").optional().matches(/^(?:(?!<script).)*$/is).withMessage("social media is Invalid"),
	], 
	add_posts
);

router.get("/posts/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	], 
	get_posts_by_id
);

router.post("/posts_update/:id",
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
	      .matches(/^(?:(?!<script).)*$/is)
	      .withMessage("Invalid Title..."),
	    body("tt")
	      .trim()
	      .notEmpty()
	      .withMessage("Title Translate is required.")
	      .matches(/^(?:(?!<script).)*$/is)
	      .withMessage("Invalid Title Translate..."),
	    body("des")
	      .trim()
	      .notEmpty()
	      .withMessage("Description is required")
	      .matches(/^(?:(?!<script).)*$/is)
	      .withMessage("Invalid Description..."),
	    body("dt")
	      .trim()
	      .notEmpty()
	      .withMessage("Description Translate is required")
	      .matches(/^(?:(?!<script).)*$/is)
	      .withMessage("Invalid Description Translate..."),
	    body("logo").trim().notEmpty().withMessage("Image is required").escape(),
	    body("portrait_image")
	      .trim()
	      .notEmpty()
	      .withMessage("Portrait Image is required")
	      .escape(),
	    body("tags").trim().notEmpty().withMessage("Category is required"),
	    body("fileCode").optional().matches(/^(?:(?!<script).)*$/is).withMessage("Link is Invalid"),
	    body("link").optional().isURL().withMessage("Link is Invalid"),
	    body("sm").optional().matches(/^(?:(?!<script).)*$/is).withMessage("social media is Invalid"),
	], 
	post_update
);

router.get("/deletePosts/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	], 
	delete_posts
);

router.get("/users",
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
	get_all_users
);

router.get("/searchUser", 
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
	get_search_user
);

router.get("/poll", 
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
	get_poll
);

router.post("/poll", 
	[
	    body("question")
	      .trim()
	      .notEmpty()
	      .withMessage("Question is required.")
	      .matches(/^[^<>]*$/)
	      .withMessage("Invalid Question..."),
	    body("ques_tr")
	      .trim()
	      .notEmpty()
	      .withMessage("Question Translate is required.")
	      .matches(/^[^<>]*$/)
	      .withMessage("Invalid Question Translate..."),
	    body("options").trim().notEmpty().withMessage("Options are required"),
	    body("answer")
	      .trim()
	      .notEmpty()
	      .withMessage("Answer is required")
	      .isNumeric()
	      .withMessage("Answer must be a number"),
	    body("logo").optional({ checkFalsy: true }).escape(),
	    body("landscape_img").optional({ checkFalsy: true }).escape(),
  	],
  	add_poll
);

router.get("/poll/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	], 
	get_poll_by_id
);

router.post("/poll_update/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number"),
	    body("question")
	      .trim()
	      .notEmpty()
	      .withMessage("Question is required.")
	      .matches(/^[^<>]*$/)
	      .withMessage("Invalid Question..."),
	    body("ques_tr")
	      .trim()
	      .notEmpty()
	      .withMessage("Question Translate is required.")
	      .matches(/^[^<>]*$/)
	      .withMessage("Invalid Question Translate..."),
	    body("options").trim().notEmpty().withMessage("Options are required"),
	    body("answer")
	      .trim()
	      .notEmpty()
	      .withMessage("Answer is required")
	      .isNumeric()
	      .withMessage("Answer must be a number"),
	    body("logo").optional({ checkFalsy: true }).escape(),
	    body("landscape_img").optional({ checkFalsy: true }).escape(),
  	], 
	poll_update
);

router.get("/deletePoll/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	], 
	delete_poll
);

router.get("/popdown", get_header_popup);

router.post("/popdown/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number"),
        body("title")
	      .optional()
	      .matches(/^[^<>]*$/)
	      .withMessage("Invalid Title..."),
		body("link1").trim().notEmpty().withMessage("Link1 is required."),
		body("link2").trim().notEmpty().withMessage("Link2 is required."),
	], 
	update_header_popup
);

router.get("/notifications", 
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
	get_all_notifications
);

router.post("/notify", 
	[
	    body("title")
	      .trim()
	      .notEmpty()
	      .withMessage("Title is required.")
	      .matches(/^[^<>]*$/)
	      .withMessage("Invalid Title..."),
	    body("bdes")
	      .trim()
	      .notEmpty()
	      .withMessage("Body is required.")
	      .matches(/^(<br\s*\/?>|\s|[^\<\>])*$|^[^\<\>]*$/)
	      .withMessage("Invalid Body..."),
	    body("link").optional().isURL().withMessage("Invalid Link...")
  	],
  	add_notification
);

router.get("/notify/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	], 
	get_notification_by_id
);

router.post("/notify_update/:id", 
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number"),
	    body("title")
	      .trim()
	      .notEmpty()
	      .withMessage("Title is required.")
	      .matches(/^[^<>]*$/)
	      .withMessage("Invalid Title..."),
	    body("bdes")
	      .trim()
	      .notEmpty()
	      .withMessage("Body is required.")
	      .matches(/^(<br\s*\/?>|\s|[^\<\>])*$|^[^\<\>]*$/)
	      .withMessage("Invalid Body..."),
	    body("link").optional().isURL().withMessage("Invalid Link...")
  	],
  	update_notification
);

router.get("/deleteNotification/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	], 
	delete_notification
);

router.post("/sendNotification",
	[
		body("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	],  
	send_notification
);

router.get("/raffle",
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
	get_raffle
);

router.get("/sneaker_release",
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
	get_sneaker_release
);

router.get("/raffle_filter",
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
	    query('brand')
	        .optional()
	        .isNumeric()
	        .withMessage("Brand must be valid"),
		query("items")
		    .optional()
          	.isInt()
          	.withMessage("Items must be a number"),
	    query("page")
	      .optional()
          .isInt()
          .withMessage("Page must be a number")
	], 
	raffle_filter
);

router.get("/sneaker_filter",
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
	    query('brand')
	        .optional()
	        .isNumeric()
	        .withMessage("Brand must be valid"),
	    query('category')
	        .optional()
	        .isNumeric()
	        .withMessage("Category must be valid"),
		query("items")
		    .optional()
          	.isInt()
          	.withMessage("Items must be a number"),
	    query("page")
	      .optional()
          .isInt()
          .withMessage("Page must be a number")
	], 
	sneaker_filter
);

router.post("/raffle",
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
	    body("image1").trim().notEmpty().withMessage("Image1 is required").escape(),
	    body("image2").trim().notEmpty().withMessage("Image2 is required").escape(),
	    body("image3").trim().notEmpty().withMessage("Image3 is required").escape(),
	    body("image4").optional({ checkFalsy: true }).escape(),
	    body("image5").optional({ checkFalsy: true }).escape(),
	    body("brand_img").trim().notEmpty().withMessage("Brand Logo is required").escape(),
	    body("retail_price").optional({ checkFalsy: true })
	      .isNumeric().withMessage("Retail Price must be a valid number"),
	    body("resell_price").trim().notEmpty().withMessage("Resell Price is required")
	      .isNumeric().withMessage("Resell Price must be a valid number"),
	    body("cat_id")
	      .trim()
	      .notEmpty().withMessage("Category is required")
	      .isNumeric().withMessage("Category must be a valid number")
	      .isIn([1, 2, 3, 4]).withMessage("Invalid category value"),
	    body("brand").trim().notEmpty().withMessage("Brand Name is required")
	    	.isNumeric().withMessage("Brand Name must be valid"),
	    body("date").trim().notEmpty().withMessage("Date is required"),
	    body("sizes").optional({ checkFalsy: true })
  	], 
	post_raffle
);

router.get("/raffle/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	],
	get_raffle_by_id
);

router.post("/raffle_update/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number"),
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
	    body("image1").trim().notEmpty().withMessage("Image1 is required").escape(),
	    body("image2").trim().notEmpty().withMessage("Image2 is required").escape(),
	    body("image3").trim().notEmpty().withMessage("Image3 is required").escape(),
	    body("image4").optional({ checkFalsy: true }).escape(),
	    body("image5").optional({ checkFalsy: true }).escape(),
	    body("brand_img").trim().notEmpty().withMessage("Brand Logo is required").escape(),
	    body("retail_price").optional({ checkFalsy: true })
	      .isNumeric().withMessage("Retail Price must be a valid number"),
	    body("resell_price").trim().notEmpty().withMessage("Resell Price is required")
	      .isNumeric().withMessage("Resell Price must be a valid number"),
	    body("cat_id")
	      .trim()
	      .notEmpty().withMessage("Category is required")
	      .isNumeric().withMessage("Category must be a valid number")
	      .isIn([1, 2, 3, 4]).withMessage("Invalid category value"),
	    body("brand").trim().notEmpty().withMessage("Brand Name is required"),
	    body("date").trim().notEmpty().withMessage("Date is required"),
	    body("sizes").optional({ checkFalsy: true })
  	], 
	update_raffle
);

router.get("/deleteRaffle/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	], 
	delete_raffle
);

router.get("/deleteSneaker/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	], 
	delete_sneakers
);

router.get("/ads",
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
	get_all_ads
);

router.get("/ads_filter",
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
		query("items")
		    .optional()
          	.isInt()
          	.withMessage("Items must be a number"),
	    query("page")
	      .optional()
          .isInt()
          .withMessage("Page must be a number")
	],
	get_ads_filter
);

router.post("/ads",
	[
	    body("title")
	      .trim()
	      .notEmpty()
	      .withMessage("Title is required.")
	      .matches(/^[^<>]*$/)
	      .withMessage("Title Question..."),
	    body("image").trim().notEmpty().withMessage("Image is required").escape(),
	    body("link_android")
	      .optional({ checkFalsy: true })
	      .isURL()
	      .withMessage("Android Link is required"),
	    body("link_ios")
	      .optional({ checkFalsy: true })
	      .isURL()
	      .withMessage("IOS Link is required"),
	    body("des")
		    .optional()
		    .matches(/^(?:(?!<script).)*$/is)
		    .withMessage("Invalid code..."),
	    body("date").trim().notEmpty().withMessage("Date is required")
	],
 	post_ads
);

router.get("/ads/:id", 
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	], 
	get_ads_by_id
);

router.post("/ads_update/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number"),
	    body("title")
	      .trim()
	      .notEmpty()
	      .withMessage("Title is required.")
	      .matches(/^[^<>]*$/)
	      .withMessage("Title Question..."),
	    body("image").trim().notEmpty().withMessage("Image is required").escape(),
	    body("link_android")
	      .optional({ checkFalsy: true })
	      .isURL()
	      .withMessage("Android Link is required"),
	    body("link_ios")
	      .optional({ checkFalsy: true })
	      .isURL()
	      .withMessage("IOS Link is required"),
	    body("date").trim().notEmpty().withMessage("Date is required")
  	],
	ads_update
);

router.get("/deleteAds/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	],
	delete_ads
);

router.get("/desktopAds", 
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
	get_desktop_ads
);

router.get("/mobileAds", 
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
	get_mobile_ads
);

router.get("/page", get_ads_page);

router.post("/desktopAds", 
	[
		body("page_id").trim().notEmpty().withMessage("Page is required")
      .isNumeric().withMessage("Please select a valid Page"),
    	body("ads_id").trim().notEmpty().withMessage("Ads is required")
	],
	post_desktop_ads
);

router.post("/mobileAds", 
	[
		body("page_id").trim().notEmpty().withMessage("Page is required")
      .isNumeric().withMessage("Please select a valid Page"),
    	body("ads_id").trim().notEmpty().withMessage("Ads is required")
      .isNumeric().withMessage("Please select a valid Ads")
	],
	post_mobile_ads
);

router.get("/desktopAds/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	], 
	get_desktop_ads_by_id
);

router.get("/mobileAds/:id",
	[
		param("id")
	      .trim()
          .notEmpty()
          .withMessage("ID is required")
          .isInt()
          .withMessage("ID must be a number")
	], 
	get_mobile_ads_by_id
);

router.post("/desktopAds_update",
	[
		body("page_id").trim().notEmpty().withMessage("Page is required")
      .isNumeric().withMessage("Please select a valid Page"),
    	body("ads_id").trim().notEmpty().withMessage("Ads is required")
	],
	update_desktop_ads
);

router.post("/mobileAds_update",
	[
		body("page_id").trim().notEmpty().withMessage("Page is required")
      .isNumeric().withMessage("Please select a valid Page"),
    	body("ads_id").trim().notEmpty().withMessage("Ads is required")
      .isNumeric().withMessage("Please select a valid Ads")
	],
	update_mobile_ads
);

router.post("/desktopAds_delete",
	[
		body("page_id").trim().notEmpty().withMessage("Page is required")
      .isNumeric().withMessage("Please select a valid Page"),
    	body("ads_id").trim().notEmpty().withMessage("Ads is required")
      .isNumeric().withMessage("Please select a valid Ads")
	],
	delete_desktop_ads
);

router.post("/mobileAds_delete",
	[
		body("page_id").trim().notEmpty().withMessage("Page is required")
      .isNumeric().withMessage("Please select a valid Page"),
    	body("ads_id").trim().notEmpty().withMessage("Ads is required")
      .isNumeric().withMessage("Please select a valid Ads")
	],
	delete_mobile_ads
);

module.exports = router;