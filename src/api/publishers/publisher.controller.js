const { statusCodes, buildResponse } = require('../models/Response');
const Model = require('./Publisher');

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
    const { params, body } = req;
    const resource = await Model.create(body, params.id);
    return res.status(statusCodes.CREATED).send(resource);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};
