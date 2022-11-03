const router = require("express").Router();
const controller = require("../dishes/dishes.controller.js");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
  .route("/:dishId")
  .get(controller.get)
  .put(controller.update)
  .all(methodNotAllowed);

router.route("/").post(controller.create).all(methodNotAllowed);

// TODO: Implement the /dishes routes needed to make the tests pass

module.exports = router;
