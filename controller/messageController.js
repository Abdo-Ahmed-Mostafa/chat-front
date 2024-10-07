const messageModel = require("../model/messageModel");

const addMessage = async (req, res) => {
  const { from, to, message } = req.body;
  const data = await messageModel.create({
    message: { text: message },
    users: [from, to],
    sender: from,
  });
  if (data) return res.json({ msg: "Message added successfully!" });
  return res.json({
    msg: "Failed to add message to the database",
  });
};
const getAllMessage = async (req, res) => {
  const { from, to } = req.body;
  const message = await messageModel
    .find({
      users: {
        $all: [from, to],
      },
    })
    .sort({ updateAt: 1 });
  const projectMessage = message.map((msg) => {
    return {
      fromSelf: msg.sender.toString() === from,
      message: msg.message.text,
    };
  });
  res.json(projectMessage);
};

module.exports = {
  addMessage,
  getAllMessage,
};
