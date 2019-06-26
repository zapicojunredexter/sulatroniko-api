const { statusCodes, buildResponse } = require('../models/Response');
// const Route = require('./Route');

exports.fetch = (req, res) => {
  try {
    return res.status(statusCodes.OK).send(null);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};

exports.fetchAll = async (req, res) => {
  try {
    return res.status(statusCodes.OK).send(null);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};

exports.add = async (req, res) => {
  try {
    return res.status(statusCodes.OK).send(null);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};

exports.update = (req, res) => {
  try {
    return res.status(statusCodes.OK).send(null);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};

exports.delete = (req, res) => {
  try {
    return res.status(statusCodes.OK).send(null);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};
