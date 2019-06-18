const admin = require('firebase-admin');
const collectionsService = require('../../services/collections.service');

const {getBookingsCollection} = collectionsService;

class Trip {

    /*
        BookingId
        CommuterId
        Status
        SeatNumber
        SeatsBought

        createdAt
        updatedAt
        deleted
    */
    constructor (params) {
        this.BookingId = params.BookingId;
        this.CommuterId = params.CommuterId;
        this.Status = params.Status;
        this.SeatNumber = params.SeatNumber;
        this.SeatsBought = params.SeatsBought;

        this.bookingCollection = getBookingsCollection();
    }

    toString () {
        const {
            BookingId,
            CommuterId,
            Status,
            SeatNumber,
            SeatsBought
        } = this;
        
        return JSON.stringify({
            BookingId,
            CommuterId,
            Status,
            SeatNumber,
            SeatsBought
        });
    }

    static async create (object) {
        const toBeAdded = {
            ...object,
            "Status": "Bought",
            "createdAt": admin.firestore.FieldValue.serverTimestamp(),
            "deleted": false,
            "updatedAt": admin.firestore.FieldValue.serverTimestamp()
        };

        const addedTerminal = await getBookingsCollection().add(toBeAdded);
        const {id} = addedTerminal;

        return id;
    }

    static async retrieve (key) {
        const response = await getBookingsCollection()
            .doc(key)
            .get();

        if (response.exists) {
            const data = response.data();

            return {
                Id: key,
                ...data,
                createdAt: data.createdAt.toDate()
            };
        }

        return null;
    }

    static async retrieveAll () {
        const response = await getBookingsCollection().get();

        return response.docs.map((obj) => {
            const data = obj.data();

            return {
                ...data,
                createdAt: data.createdAt.toDate()
            };
        });
    }

    static async update (id,object) {
        const toBeEdited = {
            ...object,
            "updatedAt": admin.firestore.FieldValue.serverTimestamp()
        };
        const docRef = getBookingsCollection().doc(id);

        await docRef
            .set({...toBeEdited},{"merge": true});

        return true;
    }

    static async delete (id) {
        const toBeEdited = {
            "deleted": true,
            "updatedAt": admin.firestore.FieldValue.serverTimestamp()
        };
        const docRef = getBookingsCollection().doc(id);

        await docRef
            .set({...toBeEdited},{"merge": true});

        return true;
    }

}

module.exports = Trip;
