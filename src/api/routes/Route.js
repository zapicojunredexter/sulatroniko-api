const admin = require('firebase-admin');

exports.getRoutesCollection = () => admin.firestore().collection('Routes');

class Route {
    static async create (params) {
        const toBeAdded = {
            ...params,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            deleted: false
        };

        const docRef = getRoutesCollection().doc();
    
        await docRef.set({
            Id: docRef.id,
            ...toBeAdded
        });
    
        const newlyAdded = {
            id: docRef.id,
            ...toBeAdded
        };
    
        return newlyAdded;
    }
    
    static async retrieve (id) {
        const result = await getRoutesCollection()
            .doc(id)
            .get();
        if (result.exists) {
            return {Id: id,
                ...result.data()};
        }

        return null;
    }
    
    static async update (id, params) {
        const toBeUpdated = {
            ...params,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        await getRoutesCollection()
            .doc(id)
            .update(toBeUpdated);

        return toBeUpdated;
    }
    
    static async delete (id) {
        const toBeUpdated = {    
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            deleted: true
        };
    
        await getRoutesCollection()
          .doc(id)
          .update(toBeUpdated);
    
        return toBeUpdated;
    }
    
    static async retrieveAll () {
        const result = await getRoutesCollection().get();
    
        return result.docs.map((data) => ({Id: data.id,
            ...data.data()}));
    }
}

module.exports = Route;
