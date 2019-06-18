const admin = require('firebase-admin');
const collectionsService = require('../../services/collections.service');

const {getSchedulesCollection} = collectionsService;

class Schedule {

    /*
        ScheduleId
        DepartFrom
        DepartTo
        DepartureTime
        EstTravelTime

        createdAt
        updatedAt
        deleted
    */
    constructor (params) {
        this.ScheduleId = params.ScheduleId;
        this.DepartFrom = params.DepartFrom;
        this.DepartTo = params.DepartTo;
        this.DepartureTime = params.DepartureTime;
        this.EstTravelTime = params.EstTravelTime;

        this.scheduleCollection = getSchedulesCollection();
    }

    async create () {
        const {
            DepartFrom,
            DepartTo,
            DepartureTime,
            EstTravelTime
        } = this;

        const toBeAdded = {
            DepartFrom,
            DepartTo,
            DepartureTime,
            EstTravelTime,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            deleted: false,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const addedRecord = await this.scheduleCollection.add(toBeAdded);
        const {id} = addedRecord;

        return id;
    }

    retrieve () {
        return null;
    }

    retrieveAll () {
        return [];
    }

    async update () {
        const {
            ScheduleId,
            DepartFrom,
            DepartTo,
            DepartureTime,
            EstTravelTime
        } = this;

        const toBeEdited = {
            ScheduleId,
            DepartFrom,
            DepartTo,
            DepartureTime,
            EstTravelTime,
            "updatedAt": admin.firestore.FieldValue.serverTimestamp()
        };

        const docRef = this.scheduleCollection.doc(ScheduleId);

        await docRef
            .set({...toBeEdited},{"merge": true});

        return true;
    }


    async delete () {
        const {ScheduleId} = this;

        const toBeEdited = {
            "deleted": true,
            "updatedAt": admin.firestore.FieldValue.serverTimestamp()
        };

        const docRef = this.scheduleCollection.doc(ScheduleId);

        await docRef
            .set({...toBeEdited},{"merge": true});

        return true;
    }

    toString () {
        const {
            ScheduleId,
            DepartFrom,
            DepartTo,
            DepartureTime,
            EstTravelTime
        } = this;
        
        return JSON.stringify({
            ScheduleId,
            DepartFrom,
            DepartTo,
            DepartureTime,
            EstTravelTime
        });
    }

    static async create (object) {
        const toBeAdded = {
            ...object,
            "createdAt": admin.firestore.FieldValue.serverTimestamp(),
            "deleted": false,
            "updatedAt": admin.firestore.FieldValue.serverTimestamp()
        };

        const addedTerminal = await getSchedulesCollection.add(toBeAdded);
        const {id} = addedTerminal;

        return id;
    }

    static async retrieve (key) {
        const response = await getSchedulesCollection()
            .doc(key)
            .get();

        /*
        const test = await getSchedulesCollection()
        .doc(key)
        .collection("Trips")
        .get();
        const withUser = await Promise.all(test.docs.map(async (object) => {
            const user = await object.data().UserRef.get();

            return {
                kinsasdas: object.data().kinsasdas,
                User: user.data()
            }
        }));
        console.log("BAW LANG", withUser);
        */

        if (response.exists) {
            return response.data();
        }

        return null;
    }

    static async retrieveAll () {
        const response = await getSchedulesCollection().get();

        return response.docs.map((obj) => obj.data());
    }

    static async update (id,object) {
        const toBeEdited = {
            ...object,
            "updatedAt": admin.firestore.FieldValue.serverTimestamp()
        };
        const docRef = getSchedulesCollection().doc(id);

        await docRef
            .set({...toBeEdited},{"merge": true});

        return true;
    }

    static async delete (id) {
        const toBeEdited = {
            "deleted": true,
            "updatedAt": admin.firestore.FieldValue.serverTimestamp()
        };
        const docRef = getSchedulesCollection().doc(id);

        await docRef
            .set({...toBeEdited},{"merge": true});

        return true;
    }

}

module.exports = Schedule;
