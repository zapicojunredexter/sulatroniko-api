const { statusCodes, buildResponse } = require('../models/Response');
const Model = require('./Transaction');
const Thread = require('../threads/Thread');

exports.fetchAll = async (req, res) => {
  try {
    const users = await Model.retrieveAll();
    return res.status(statusCodes.OK).send(users);
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
      status: 'pending',
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
    return res.status(statusCodes.OK).send(resource);
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
