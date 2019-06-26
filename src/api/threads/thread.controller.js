// const admin = require('firebase-admin');

const { statusCodes, buildResponse } = require('../models/Response');
const Model = require('./Thread');

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

    messages.push(newMessage);
    await Model.update(thread.id, { messages });
    return res.status(statusCodes.OK).send({});
  } catch (err) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse(err.message, err));
  }
};
