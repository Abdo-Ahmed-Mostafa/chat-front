const router = require("express").Router();
const {
  addMessage,
  getAllMessage,
} = require("../controller/messageController");
router.post("/add-msg", addMessage);
router.post("/get-msg", getAllMessage);

module.exports = router;
