// const admin = require('firebase-admin');

const { statusCodes, buildResponse } = require('../models/Response');
const Model = require('./Thread');

exports.create = async (req, res) => {
  try {
    const { body } = req;
    const resource = await Model.create({
      messages: [],
      ...body,
    });
    return res.status(statusCodes.OK).send({
      ...body,
      ...resource,
    });
  } catch (err) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse(err.message, err));
  }
};
exports.edit = async (req, res) => {
  try {
    const { params, body } = req;
    const thread = await Model.retrieve(params.id);
    if (!thread) {
      return res.send(statusCodes.NOT_FOUND);
    }
    await Model.update(params.id, body);
    return res.status(statusCodes.OK).send({
      ...thread,
      ...body,
    });
  } catch (err) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse(err.message, err));
  }
};

exports.addMessage = async (req, res) => {
  try {
    const { params, body } = req;
    const thread = await Model.retrieve(params.id);
    if (!thread) {
      return res.send(statusCodes.NOT_FOUND);
    }
    const { messages = [] } = thread;

    const newMessage = {
    //   createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: new Date(),
      ...body,
    };
    const newMessageCount = (thread.newMessageCount || 0) + 1;

    messages.push(newMessage);
    await Model.update(thread.id, { messages, newMessageCount });
    return res.status(statusCodes.OK).send({});
  } catch (err) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse(err.message, err));
  }
};
