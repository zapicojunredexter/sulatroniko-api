const admin = require('firebase-admin');
const responses = require('../models/Response');
const collectionsService = require('../../services/collections.service');
const User = require('./User');

const usersCollection = collectionsService.getUsersCollection();

const {
    NotFoundResponse,
    SuccessResponse,
    ServerErrorResponse
} = responses;

const UserNotFound = new NotFoundResponse('User could not be found','User could not be found');
const ServerSuccess = new SuccessResponse('Success', {"success": true});
const ServerError = new ServerErrorResponse('Error', {"success": false});

exports.registerDriver = async (req, res) => {
    try {
        const {body} = req;
        if (!body.email || !body.password) {
            return res.status(400).send({message: "bad request"});
        }
        const {uid} = await admin.auth().createUser({
            email: body.email,
            emailVerified: true,
            password: body.password,
            disabled: false
        });
        const newUser = {
            email: body.email,
            // BirthDate: new Date(body.BirthDate),
            BirthDate: body.BirthDate,
            ContactNumber: body.ContactNumber,
            FirstName: body.FirstName,
            Gender: body.Gender,
            LastName: body.LastName,
            AccountType: 'Driver'

        }
        const user = await User.set(uid, newUser);

        return res.send(user);
    } catch (err) {
        return res.status(ServerError.status).send({"error": err.message});
    }
}

exports.fetchUsers = async (req, res) => {
    try {
        const userRef = usersCollection;
        const response = await userRef.get();

        return res.status(ServerSuccess.status).send(response.docs.map((obj) => obj.data()));
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
}

exports.fetchDrivers = async (req, res) => {
    try {
        const userRef = usersCollection;
        const response = await userRef.where("AccountType","==","Driver").get();

        return res.status(ServerSuccess.status).send(response.docs.map((obj) => obj.data()));
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
}

exports.fetchCommuters = async (req, res) => {
    try {
        const userRef = usersCollection;
        const response = await userRef.where("AccountType","==","Commuter").get();

        return res.status(ServerSuccess.status).send(response.docs.map((obj) => obj.data()));
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
}

exports.setUser = async (req, res) => {
    try {
        const {id} = req.params;
        const {body} = req;

        await User.set(id, body);

        return res.status(ServerSuccess.status).send({...body,
            Id: id});    
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
}

exports.add = async (req, res) => {
    try {
        const {body} = req;
        const {email, password} = body;
        const registrationRes = await admin.auth().createUser({
            email,
            password
        })
        .catch((error) => {
            throw error;
        });
        const {uid} = registrationRes;

        const userRef = usersCollection.doc(uid);
        Reflect.deleteProperty(body,"password");
        await userRef
            .set({
                ...body,
                "id": uid,
                "updatedAtMs": admin.firestore.FieldValue.serverTimestamp()
            },{"merge": true});


        return res.status(ServerSuccess.status).send(ServerSuccess);

        /*
        // if exclude registration flow
        const {body} = req;
        const userRef = db.collection(COLLECTION_NAME);
        const addedUser = await userRef.add({
            ...body,
            "createdAtMs": admin.firestore.FieldValue.serverTimestamp(),
            "deleted": false,
            "updatedAtMs": admin.firestore.FieldValue.serverTimestamp()
        });
        const {id} = addedUser;

        await userRef.doc(id).set({id},{"merge": true});

        return res.status(200).send({"success": true});
        */
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
};

exports.fetchUser = async (req, res) => {
    try {
        const {id} = req.params;
        const userRef = usersCollection;
        const response = await userRef
            .doc(id)
            .get();

        if (!response.exists) {
            return res.status(UserNotFound.status).send(UserNotFound);
        }

        return res.status(ServerSuccess.status).send(response.data());    
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
}

exports.update = async (req, res) => {
    try {
        const {id} = req.params;
        const {body} = req;

        const userRef = usersCollection.doc(id);
        const user = await userRef.get();
        if (!user.exists) {
            return res.status(UserNotFound.status).send(UserNotFound);
        }

        await userRef
            .set({
                ...body,
                "updatedAtMs": admin.firestore.FieldValue.serverTimestamp()
            },{"merge": true});
    
        return res.status(ServerSuccess.status).send(ServerSuccess);
    } catch (error) {
        return res.status(ServerError.error).send({"error": error.message});
    }
};

exports.delete = async (req, res) => {
    try {
        const {id} = req.params;
        const userRef = usersCollection.doc(id);

        const user = await userRef.get();
        if (!user.exists) {
            return res.status(UserNotFound.status).send(UserNotFound);
        }
    
        await userRef
            .set({
                "deleted": true,
                "updatedAtMs": admin.firestore.FieldValue.serverTimestamp()
            },{"merge": true});
    
        return res.status(ServerSuccess.status).send(ServerSuccess);
    } catch (error) {
        return res.status(ServerError.status).send({"error": error.message});
    }
};
