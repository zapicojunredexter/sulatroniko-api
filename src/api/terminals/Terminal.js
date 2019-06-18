const admin = require('firebase-admin');
const collectionsService = require('../../services/collections.service');

const {getTerminalsCollection} = collectionsService;

class Terminal {

    /*
        TerminalId,
        TerminalAddress,
        TerminalContactNumber,
        Coordinates

        createdAt
        updatedAt
        deleted
    */
    constructor (params) {
        this.TerminalId = params.TerminalId;
        this.TerminalAddress = params.TerminalAddress;
        this.TerminalContactNumber = params.TerminalContactNumber;
        this.Coordinates = params.Coordinates;

        this.terminalCollection = getTerminalsCollection();
    }

    async create () {
        const {
            TerminalAddress,
            TerminalContactNumber,
            Coordinates
        } = this;

        const toBeAdded = {
            TerminalAddress,
            TerminalContactNumber,
            Coordinates,
            "createdAt": admin.firestore.FieldValue.serverTimestamp(),
            "deleted": false,
            "updatedAt": admin.firestore.FieldValue.serverTimestamp()
        };

        const addedTerminal = await this.terminalCollection.add(toBeAdded);
        const {id} = addedTerminal;

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
            TerminalId,
            TerminalAddress,
            TerminalContactNumber,
            Coordinates
        } = this;

        const toBeEdited = {
            TerminalId,
            TerminalAddress,
            TerminalContactNumber,
            Coordinates,
            "updatedAt": admin.firestore.FieldValue.serverTimestamp()
        };

        const docRef = this.terminalCollection.doc(TerminalId);

        await docRef
            .set({...toBeEdited},{"merge": true});

        return true;
    }


    async delete () {
        const {TerminalId} = this;

        const toBeEdited = {
            "deleted": true,
            "updatedAt": admin.firestore.FieldValue.serverTimestamp()
        };

        const docRef = this.terminalCollection.doc(TerminalId);

        await docRef
            .set({...toBeEdited},{"merge": true});

        return true;
    }

    toString () {
        const {
            TerminalId,
            TerminalAddress,
            TerminalContactNumber,
            Coordinates
        } = this;
        
        return JSON.stringify({
            TerminalId,
            TerminalAddress,
            TerminalContactNumber,
            Coordinates
        });
    }

    static async create (object) {
        const toBeAdded = {
            ...object,
            "createdAt": admin.firestore.FieldValue.serverTimestamp(),
            "deleted": false,
            "updatedAt": admin.firestore.FieldValue.serverTimestamp()
        };

        const addedTerminal = await getTerminalsCollection.add(toBeAdded);
        const {id} = addedTerminal;

        return id;
    }

    static async retrieve (key) {
        const response = await getTerminalsCollection()
            .doc(key)
            .get();

        if (response.exists) {
            return response.data();
        }

        return null;
    }

    static async retrieveAll () {
        const response = await getTerminalsCollection().get();

        return response.docs.map((obj) => obj.data());
    }

    static async update (id,object) {
        const toBeEdited = {
            ...object,
            "updatedAt": admin.firestore.FieldValue.serverTimestamp()
        };
        const docRef = getTerminalsCollection().doc(id);

        await docRef
            .set({...toBeEdited},{"merge": true});

        return true;
    }

    static async delete (id) {
        const toBeEdited = {
            "deleted": true,
            "updatedAt": admin.firestore.FieldValue.serverTimestamp()
        };
        const docRef = getTerminalsCollection().doc(id);

        await docRef
            .set({...toBeEdited},{"merge": true});

        return true;
    }

}

module.exports = Terminal;
