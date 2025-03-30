const { Router } = require("express");

const { body, validationResult } = require("express-validator");

const refreshTokenController = require("../controllers/refreshToken");

const router = Router();

router.get("/", refreshTokenController.handleRefreshToken);

module.exports = router;