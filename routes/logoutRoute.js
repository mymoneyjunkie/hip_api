const { Router } = require("express");

const { body, validationResult } = require("express-validator");

const logoutController = require("../controllers/logoutController");

const router = Router();

router.get("/", logoutController.handleLogout);

module.exports = router;