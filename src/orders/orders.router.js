const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("../orders/orders.controller.js");

// TODO: Implement the /orders routes needed to make the tests pass

router
  .route("/:orderId")
  .get(controller.getOrders)
  .put(controller.put)
  .all(methodNotAllowed);

router.route("/").post(controller.post).all(methodNotAllowed);

module.exports = router;
