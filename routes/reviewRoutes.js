const router = require("express").Router();
const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

// authentication Handler
const { authenticationHandler } = require("../middleware/authentication");

router
  .route("/")
  .get(authenticationHandler, getAllReviews)
  .post(authenticationHandler, createReview);

router
  .route("/:id")
  .get(authenticationHandler, getSingleReview)
  .patch(authenticationHandler, updateReview)
  .delete(authenticationHandler, deleteReview);

module.exports = router;
