/* eslint-disable no-await-in-loop */
const { statusCodes, buildResponse } = require('../models/Response');
const { arrayToObject } = require('../../utils/array.object.util');
const Model = require('./User');
const Author = require('../authors/Author');
const Publisher = require('../publishers/Publisher');
const CopyWriter = require('../copywriters/CopyWriter');
const Review = require('../reviews/Review');

exports.fetchAllUserTypes = async (req, res) => {
  try {
    // const allUsers = await Model.retrieveAll();
    // return res.status(statusCodes.OK).send([{das: true}]);
    const [allUsers, authorsArr, publishersArr, copywritersArr, reviewsArr] = await Promise.all([
      await Model.retrieveAll(),
      await Author.retrieveAll(),
      await Publisher.retrieveAll(),
      await CopyWriter.retrieveAll(),
      await Review.retrieveAll(),
    ]);
    const users = arrayToObject(allUsers, 'id');
    const authors = arrayToObject(authorsArr, 'id');
    const publishers = arrayToObject(publishersArr, 'id');
    const copywriters = arrayToObject(copywritersArr, 'id');
    const returnValue = [];

    for (let i = 0; i < allUsers.length; i += 1) {
      const user = allUsers[i];
      if (user.type === 'author') {
        returnValue.push({ ...user, type: 'Author', ...authors[user.id] });
      } else if (user.type === 'copywriter') {
        returnValue.push({ ...user, type: 'Copywriter', ...copywriters[user.id] });
      } else if (user.type === 'publisher') {
        returnValue.push({ ...user, type: 'Publisher', ...publishers[user.id] });
      }
    }

    const reviewsWithPeople = reviewsArr.map((review) => {
      const reviewee = publishers[review.revieweeId]
        || authors[review.revieweeId]
        || copywriters[review.revieweeId];
      const reviewer = publishers[review.reviewerId]
        || authors[review.reviewerId]
        || copywriters[review.reviewerId];
      return {
        ...review,
        reviewee: {
          ...reviewee,
          ...users[reviewee.id],
        },
        reviewer: {
          ...reviewer,
          ...users[reviewer.id],
        },
      };
    });

    const withReviews = returnValue.map((data) => {
      const reviews = reviewsWithPeople.filter(review => review.revieweeId === data.id);
      return {
        ...data,
        reviews,
      };
    });
    return res.status(statusCodes.OK).send(withReviews);
  } catch (err) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', err));
  }
};

exports.fetchMultiple = async (req, res) => {
  try {
    const { body: { userIds } } = req;
    const [allUsers, authorsArr, publishersArr, copywritersArr] = await Promise.all([
      await Model.retrieveAll(),
      await Author.retrieveAll(),
      await Publisher.retrieveAll(),
      await CopyWriter.retrieveAll(),
    ]);
    const authors = arrayToObject(authorsArr, 'id');
    const publishers = arrayToObject(publishersArr, 'id');
    const copywriters = arrayToObject(copywritersArr, 'id');
    const includedUsers = allUsers.filter(user => userIds.includes(user.id));
    const returnValue = [];

    for (let i = 0; i < includedUsers.length; i += 1) {
      const user = includedUsers[i];
      let resource = null;
      if (user.type === 'author') {
        resource = authors[user.id];
      } else if (user.type === 'copywriter') {
        resource = copywriters[user.id];
      } else if (user.type === 'publisher') {
        resource = publishers[user.id];
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
    if (value.password !== body.password) {
      return res.status(statusCodes.UNAUTHORIZED).send(buildResponse('Wrong password', null));
    }
    return res.status(statusCodes.OK).send(value);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};

exports.setNotifRead = async (req, res) => {
  try {
    const { params } = req;
    const userDoc = Model.getCollection().doc(params.userId);
    const notifDoc = userDoc.collection('notifications').doc(params.notifId);

    await notifDoc.update({ isRead: true });

    return res.status(statusCodes.OK).send({});
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};


exports.sendEmail = async (req, res) => {
  try {
    const { params } = req;
    return res.status(statusCodes.OK).send(params);
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};

exports.addNotif = async (req, res) => {
  try {
    const { params, body } = req;
    const userDoc = Model.getCollection().doc(params.userId);
    const notifDoc = userDoc.collection('notifications').doc();

    await notifDoc.set({
      id: notifDoc.id,
      ...body,
    });

    return res.status(statusCodes.OK).send({
      ...body,
      id: notifDoc.id,
    });
  } catch (error) {
    return res.status(statusCodes.INTERNAL_SERVER_ERROR).send(buildResponse('server_error', error));
  }
};
