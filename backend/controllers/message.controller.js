import { asyncHandler } from "../utils/asyncHandler.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getReceiverSocketId } from "../socket/socket.js";

const sendMessage = asyncHandler(async (req, res) => {
  const { id: receiverId } = req.params;
  const { message } = req.body;
  const senderId = req.user._id; // we have to find the current online user so need a middleware to verify token
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }

  const newMessage = new Message({
    senderId,
    receiverId,
    message,
  });

  if (!newMessage) {
    throw new ApiError(500, "No new messages created");
  }

  conversation.messages.push(newMessage._id);
  // await conversation.save();
  // await newMessage.save();
  await Promise.all([conversation.save(), newMessage.save()]);

  //will add socket IO functionality will go here
  const receiverSocketId = getReceiverSocketId(receiverId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, newMessage, "New message has been created"));
});

const getMessage = asyncHandler(async (req, res) => {
  const { id: userToChatId } = req.params;
  const senderId = req.user._id;

  const conversation = await Conversation.findOne({
    participants: { $all: [senderId, userToChatId] },
  }).populate("messages"); //this is not reference or array of ids, it is the actual object

  return res.status(200).json(new ApiResponse(200, conversation.messages));
});
export { sendMessage, getMessage };
