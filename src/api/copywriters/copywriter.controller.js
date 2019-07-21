// const admin = require('firebase-admin');
const { statusCodes, buildResponse } = require('../models/Response');
const Model = require('./CopyWriter');
// const UserModel = require('../users/User');

exports.fetchAll = async (req, res) => {
  try {
    const users = await Model.retrieveAll();
    return res.status(statusCodes.OK).send(users);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};

exports.edit = async (req, res) => {
  try {
    const { params: { id }, body } = req;
    const resource = await Model.retrieve(id);
    if (!resource) {
      return res.send(statusCodes.NOT_FOUND);
    }
    await Model.update(id, body);
    return res.status(statusCodes.OK).send({ ...resource, ...body });
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

exports.fetchByPublisher = async (req, res) => {
  try {
    const { params } = req;
    const ref = Model.getCollection().where('publisherId', '==', params.id);
    const data = await ref.get();
    const resource = data.docs.map(dataElement => ({ id: dataElement.id, ...dataElement.data() }));
    if (!resource) {
      return res.send(statusCodes.NOT_FOUND);
    }
    return res.status(statusCodes.OK).send(resource);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};


exports.add = async (req, res) => {
  try {
    const { body } = req;
    const resource = await Model.create(body);
    return res.status(statusCodes.CREATED).send(resource);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};


exports.set = async (req, res) => {
  try {
    const { body, params: { id } } = req;
    const resource = await Model.create(body, id);
    return res.status(statusCodes.CREATED).send(resource);
    /*
    const { body: { copywriter, user } } = req;
    const batch = admin.firestore().batch();

    const userCollection = UserModel.getCollection();
    const userDoc = userCollection.doc();
    batch.set(userDoc, {
      type: 'copywriter',
      ...user,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      deleted: false,
    });

    const copywriterCollection = Model.getCollection();
    const copywriterDoc = copywriterCollection.doc(userDoc.id);
    batch.set(copywriterDoc, {
      id: userDoc.id,
      ...copywriter,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      deleted: false,
    });

    await batch.commit();
    return res.status(statusCodes.CREATED).send({});
    */
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};
