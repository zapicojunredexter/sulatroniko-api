/* eslint-disable no-await-in-loop */
const { statusCodes, buildResponse } = require('../models/Response');
const Model = require('./User');
const Author = require('../authors/Author');
const Publisher = require('../publishers/Publisher');
const CopyWriter = require('../copywriters/CopyWriter');

exports.fetchMultiple = async (req, res) => {
  try {
    const { body: { userIds } } = req;
    const allUsers = await Model.retrieveAll();
    const includedUsers = allUsers.filter(user => userIds.includes(user.id));
    const returnValue = [];

    for (let i = 0; i < includedUsers.length; i += 1) {
      const user = includedUsers[i];
      let resource = null;
      if (user.type === 'author') {
        resource = await Author.retrieve(user.id);
      } else if (user.type === 'copywriter') {
        resource = await CopyWriter.retrieve(user.id);
      } else if (user.type === 'publisher') {
        resource = await Publisher.retrieve(user.id);
      }
      returnValue.push({ ...user, ...resource });
    }
    return res.status(statusCodes.OK).send(returnValue);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};

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
    const result = await Model.getCollection().where('username', '==', body.username).get();

    if (!result.empty) {
      return res.status(statusCodes.BAD_REQUEST).send(buildResponse('Username already in use', null));
    }
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
    console.log('eeeek', value, value.password, body.password);
    if (value.password !== body.password) {
      return res.status(statusCodes.UNAUTHORIZED).send(buildResponse('Wrong password', null));
    }
    return res.status(statusCodes.OK).send(value);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};
