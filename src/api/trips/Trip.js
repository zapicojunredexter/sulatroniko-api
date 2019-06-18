const admin = require('firebase-admin');
const collectionsService = require('../../services/collections.service');

const {getTripsCollection} = collectionsService;

class Trip {
    toString () {
        const {
            TripId,
            ScheduleId,
            DriverId,
            MaxCapacity,
            Status
        } = this;
        
        return JSON.stringify({
            TripId,
            ScheduleId,
            DriverId,
            MaxCapacity,
            Status
        });
    }

    static async create (object) {
        const toBeAdded = {
            ...object,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            deleted: false,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const docRef = getTripsCollection().doc();
        await docRef.set({Id: docRef.id,
            ...toBeAdded});

        return docRef.id;
    }

    static async retrieve (key) {
        const response = await getTripsCollection()
            .doc(key)
            .get();

        if (response.exists) {
            return response.data();
        }

        return null;
    }

    static async retrieveAll () {
        const response = await getTripsCollection().get();

        return response.docs.map((obj) => obj.data());
    }

    static async update (id,object) {
        const toBeEdited = {
            ...object,
            "updatedAt": admin.firestore.FieldValue.serverTimestamp()
        };
        const docRef = getTripsCollection().doc(id);

        await docRef
            .set({...toBeEdited},{"merge": true});

        return true;
    }

    static async delete (id) {
        const toBeEdited = {
            "deleted": true,
            "updatedAt": admin.firestore.FieldValue.serverTimestamp()
        };
        const docRef = getTripsCollection().doc(id);

        await docRef
            .set({...toBeEdited},{"merge": true});

        return true;
    }

}

module.exports = Trip;
