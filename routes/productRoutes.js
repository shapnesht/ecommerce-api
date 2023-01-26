const router = require("express").Router();
const {
  authenticationHandler,
  authorizeUser,
} = require("../middleware/authentication");
const { getAllReviewsOfProduct } = require("../controllers/reviewController");
const {
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/productController");

router
  .route("/")
  .post([authenticationHandler, authorizeUser("admin")], addProduct)
  .get(authenticationHandler, getAllProducts);

router
  .route("/uploadImage")
  .post([authenticationHandler, authorizeUser("admin")], uploadImage);

router.route("/:id/reviews").get(getAllReviewsOfProduct);

router
  .route("/:id")
  .patch([authenticationHandler, authorizeUser("admin")], updateProduct)
  .get(authenticationHandler, getSingleProduct)
  .delete([authenticationHandler, authorizeUser("admin")], deleteProduct);

module.exports = router;
