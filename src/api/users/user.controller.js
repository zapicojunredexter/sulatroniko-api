const { statusCodes, buildResponse } = require('../models/Response');
const Model = require('./User');

exports.fetchAll = async (req, res) => {
  try {
    const resource = await Model.retrieveAll();
    return res.status(statusCodes.OK).send(resource);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};

exports.fetch = async (req, res) => {
  try {
    const { params } = req;
    const resource = await Model.retrieve(params.id);

    if (!resource) {
      return res.status(statusCodes.NOT_FOUND).send(buildResponse('User does not exists', null));
    }
    return res.status(statusCodes.OK).send(resource);
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


exports.add = async (req, res) => {
  try {
    const { body } = req;
    const user = await Model.create(body);
    return res.status(statusCodes.CREATED).send(user);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};

exports.login = async (req, res) => {
  try {
    const { body } = req;
    const result = await Model.getCollection().where('username', '==', body.username).get();

    if (result.empty) {
      return res.status(statusCodes.NOT_FOUND).send(buildResponse('Username does not exists', null));
    }
    const value = result.docs.map(data => ({ id: data.id, ...data.data() }))[0];
    if (value.password !== body.password) {
      return res.status(statusCodes.UNAUTHORIZED).send(buildResponse('Wrong password', null));
    }
    return res.status(statusCodes.OK).send(value);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};
