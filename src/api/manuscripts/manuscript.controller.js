const { statusCodes, buildResponse } = require('../models/Response');
const Model = require('./Manuscript');
const { arrayToObject } = require('../../utils/array.object.util');
const Author = require('../authors/Author');

exports.fetchAll = async (req, res) => {
  try {
    const [manuscriptsArr, authorsArr] = await Promise.all([
      await Model.retrieveAll(),
      await Author.retrieveAll(),
    ]);
    const authors = arrayToObject(authorsArr, 'id');
    const retVal = manuscriptsArr.map((manuscript) => {
      const author = authors[manuscript.authorId];
      return {
        ...manuscript,
        author,
      };
    });
    return res.status(statusCodes.OK).send(retVal);
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
