const router = require("express").Router();

const {
  authenticationHandler,
  authorizeUser,
} = require("../middleware/authentication");

const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} = require("../controllers/orderController");

router.route("/showAllMyOrders").get(authenticationHandler, getCurrentUserOrders);

router
  .route("/")
  .get([authenticationHandler, authorizeUser("admin")], getAllOrders)
  .post(authenticationHandler, createOrder);

router
  .route("/:id")
  .get(authenticationHandler, getSingleOrder)
  .patch(authenticationHandler, updateOrder);

module.exports = router;