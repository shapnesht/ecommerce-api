const Review = require("../models/Review");
const Product = require("../models/Product");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { checkPermission } = require("../utils");

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`No Product with id: ${productId}`);
  }

  const isReviewAlreadySubmitted = await Review.findOne({
    user: req.user.userId,
    product: productId,
  });

  if (isReviewAlreadySubmitted) {
    throw new CustomError.BadRequestError(
      "You Have already submitted the review for this product"
    );
  }
  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.ACCEPTED).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({});
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId }).populate({
    path: "user",
    select: "name",
  });
  console.log(review);
  if (!review) {
    throw new CustomError.NotFoundError(`No Review with the id ${reviewId}`);
  }
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { title, rating, comment } = req.body;
  if (!title || !rating || !comment) {
    throw new CustomError.BadRequestError(
      "Please provide title, rating and comment"
    );
  }
  const review = await Review.find({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No Review with the id ${reviewId}`);
  }
  checkPermission(req.user, review.user);
  review.title = title;
  review.rating = rating;
  review.comment = comment;

  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.find({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`No Review with the id ${reviewId}`);
  }
  checkPermission(req.user, review.user);
  await Review.deleteOne({ review });
  res.status(StatusCodes.OK).json({ msg: "Successfully deleted the review" });
};

const getAllReviewsOfProduct = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getAllReviewsOfProduct,
};
