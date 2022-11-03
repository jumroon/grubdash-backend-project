const router = require("express").Router();
const controller = require("../dishes/dishes.controller.js");

router.route("/").post(controller.create);

// TODO: Implement the /dishes routes needed to make the tests pass

module.exports = router;
