const { statusCodes, buildResponse } = require('../models/Response');
const Model = require('./User');

exports.fetch = async (req, res) => {
  try {
    const { params } = req;
    const user = await Model.retrieve(params.id);
    return res.status(statusCodes.OK).send(user);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};

exports.set = async (req, res) => {
  try {
    const { params, body } = req;
    const user = await Model.create(body, params.id);
    return res.status(statusCodes.CREATED).send(user);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};
