const { statusCodes, buildResponse } = require('../models/Response');
const Model = require('./Transaction');
const Thread = require('../threads/Thread');
const Copywriter = require('../copywriters/CopyWriter');
const Manuscript = require('../manuscripts/Manuscript');
const Publisher = require('../publishers/Publisher');
const Author = require('../authors/Author');
const { arrayToObject } = require('../../utils/array.object.util');

exports.fetchAll = async (req, res) => {
  try {
    // const transactions = await Model.retrieveAll();
    // const manuscripts = await Manuscript.retrieveAll();
    const [transactions, manuscripts, copywriters, publishers, authors] = await Promise.all([
      await Model.retrieveAll(),
      await Manuscript.retrieveAll(),
      await Copywriter.retrieveAll(),
      await Publisher.retrieveAll(),
      await Author.retrieveAll(),
    ]);
    const manuscriptsObj = arrayToObject(manuscripts, 'id');
    const copywritersObj = arrayToObject(copywriters, 'id');
    const publishersObj = arrayToObject(publishers, 'id');
    const authorssObj = arrayToObject(authors, 'id');
    const retVal = transactions.map((transaction) => {
      const manuscript = manuscriptsObj[transaction.manuscriptId];
      const copywriter = copywritersObj[transaction.copywriterId];
      const publisher = publishersObj[transaction.publisherId];
      const author = authorssObj[transaction.authorId];
      return {
        ...transaction,
        manuscript,
        copywriter,
        publisher,
        author,
      };
    });
    return res.status(statusCodes.OK).send(retVal);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};

exports.assignToCopywriter = async (req, res) => {
  try {
    const { body, params: { id } } = req;

    const resource = await Model.retrieve(id);
    if (!resource) {
      return res.status(statusCodes.NOT_FOUND).send({});
    }

    const updated = await Model.update(id, body);

    return res.status(statusCodes.OK).send({
      ...body,
      updated,
    });
  } catch (err) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', err));
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const { body, params: { id } } = req;
    const resource = await Model.retrieve(id);
    if (!resource) {
      return res.status(statusCodes.NOT_FOUND).send({});
    }
    const progressDoc = Model.getCollection()
      .doc(id)
      .collection('progress')
      .doc();
    const toBeAdded = {
      id: progressDoc.id,
      cardId: progressDoc.id,
      status: 'proposal',
      ...body,
    };
    await progressDoc.set(toBeAdded);

    return res.status(statusCodes.OK).send(toBeAdded);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};

exports.addProgress = async (req, res) => {
  try {
    const { body, params: { id } } = req;
    const resource = await Model.retrieve(id);
    if (!resource) {
      return res.status(statusCodes.NOT_FOUND).send({});
    }
    const progressDoc = Model.getCollection()
      .doc(id)
      .collection('progress')
      .doc();
    const toBeAdded = {
      id: progressDoc.id,
      cardId: progressDoc.id,
      status: 'pending',
      ...body,
    };
    await progressDoc.set(toBeAdded);

    return res.status(statusCodes.OK).send(toBeAdded);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};

exports.editProgress = async (req, res) => {
  try {
    const { body, params: { id } } = req;
    const resource = await Model.retrieve(id);
    if (!resource) {
      return res.status(statusCodes.NOT_FOUND).send({});
    }
    if (!body.cardId) {
      return res.status(statusCodes.BAD_REQUEST).send(buildResponse('cardId missing', 'cardId missing'));
    }
    const progressDoc = Model.getCollection()
      .doc(id)
      .collection('progress')
      .doc(body.cardId);
    await progressDoc.update(body);

    return res.status(statusCodes.OK).send({
      ...resource,
      ...body,
    });
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};

exports.approveProposal = async (req, res) => {
  try {
    const { body, params: { id } } = req;
    const resource = await Model.retrieve(id);
    if (!resource) {
      return res.status(statusCodes.NOT_FOUND).send(buildResponse('Transaction does not exist'));
    }
    const newFields = {
      status: 'proposal approved',
    };
    await Model.update(id, newFields);
    return res.status(statusCodes.OK).send({
      ...resource,
      ...body,
    });
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};

exports.reorderProgress = async (req, res) => {
  try {
    const { body, params: { id } } = req;
    const resource = await Model.retrieve(id);
    if (!resource) {
      return res.status(statusCodes.NOT_FOUND).send(buildResponse('Transaction does not exist'));
    }
    const progressDoc = Model.getCollection()
      .doc(id)
      .collection('progress');
    const response = await progressDoc.get(body);
    const results = response.docs.map(data => ({ id: data.id, ...data.data() }));

    console.log('durdur', results);

    return res.status(statusCodes.OK).send({
      ...resource,
      ...body,
    });
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};

exports.fetch = async (req, res) => {
  try {
    const { params } = req;
    const resource = await Model.retrieve(params.id);
    if (!resource) {
      return res.status(statusCodes.NOT_FOUND).send();
    }
    const manuscript = await Manuscript.retrieve(resource.manuscriptId);
    const retVal = {
      ...resource,
      manuscript,
    };
    return res.status(statusCodes.OK).send(retVal);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};

exports.edit = async (req, res) => {
  try {
    const { params, body } = req;
    const resource = await Model.retrieve(params.id);
    if (!resource) {
      return res.status(statusCodes.NOT_FOUND).send();
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

exports.set = async (req, res) => {
  try {
    const { body } = req;
    const transaction = await Model.create(body);

    const newThread = {
      transactionId: transaction.id,
      memberIds: [
        body.publisherId,
        body.authorId,
      ],
      messages: [],
    };
    const thread = await Thread.create(newThread);
    return res.status(statusCodes.CREATED).send({
      transaction,
      thread,
    });
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};
