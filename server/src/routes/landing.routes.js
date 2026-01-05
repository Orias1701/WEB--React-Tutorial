const express = require("express");

const {
  createWaitlistLead,
  getLandingContent
} = require("../controllers/landing.controller");

const router = express.Router();

router.get("/landing-content", getLandingContent);
router.post("/waitlist", createWaitlistLead);

module.exports = router;
