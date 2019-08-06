const admin = require('firebase-admin');

const getModelCollection = () => admin.firestore().collection('transactions');

exports.getUsersCollection = getModelCollection;

class Model {
  static getCollection() {
    return getModelCollection();
  }

  static async create(params, id) {
    const toBeAdded = {
      ...params,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      deleted: false,
    };

    const docRef = id ? getModelCollection().doc(id) : getModelCollection().doc();

    await docRef.set({
      id: docRef.id,
      ...toBeAdded,
    });

    const newlyAdded = {
      id: docRef.id,
      ...toBeAdded,
    };

    return newlyAdded;
  }

  static async retrieve(id) {
    const result = await getModelCollection()
      .doc(id)
      .get();
    if (result.exists) {
      return {
        id,
        ...result.data(),
      };
    }

    return null;
  }

  static async update(id, params) {
    const toBeUpdated = {
      ...params,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await getModelCollection()
      .doc(id)
      .update(toBeUpdated);

    return toBeUpdated;
  }

  static async delete(id) {
    const toBeUpdated = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      deleted: true,
    };

    await getModelCollection()
      .doc(id)
      .update(toBeUpdated);

    return toBeUpdated;
  }

  static async retrieveAll() {
    const result = await getModelCollection().get();

    return result.docs.map(data => ({
      id: data.id,
      ...data.data(),
    }));
  }
}

module.exports = Model;
