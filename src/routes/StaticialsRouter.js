const router = require("express").Router();
const Staticial = require("../controllers/StaticialsController");

router.get("/", Staticial.getAllStaticial);
router.get("/:id", Staticial.getStaticialbyId);
router.post("/", Staticial.createStaticial);
router.patch("/:id", Staticial.editStaticial);
router.delete("/:id", Staticial.deleteStaticial);

module.exports = router;
