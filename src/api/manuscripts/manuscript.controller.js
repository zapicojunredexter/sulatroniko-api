const { statusCodes, buildResponse } = require('../models/Response');
const Model = require('./Manuscript');
const Thread = require('../threads/Thread');

exports.fetchAll = async (req, res) => {
  try {
    const users = await Model.retrieveAll();
    return res.status(statusCodes.OK).send(users);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};

exports.fetch = async (req, res) => {
  try {
    const { params } = req;
    const resource = await Model.retrieve(params.id);
    if (!resource) {
      return res.send(statusCodes.NOT_FOUND);
    }
    return res.status(statusCodes.OK).send(resource);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};

exports.set = async (req, res) => {
  try {
    const { body } = req;
    const resource = await Model.create(body);

    // const newThread = {
    //   memberIds: [
    //     body.publisher,
    //     body.author,
    //   ],
    //   messages: [],
    // };
    // await Thread.create(newThread);
    return res.status(statusCodes.CREATED).send(resource);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};


exports.edit = async (req, res) => {
  try {
    const { body, params } = req;
    const resource = await Model.retrieve(params.id);
    if (!resource) {
      return res.send(statusCodes.NOT_FOUND);
    }
    await Model.update(params.id, body);
    return res.status(statusCodes.OK).send({
      ...resource,
      ...body,
    });
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};
