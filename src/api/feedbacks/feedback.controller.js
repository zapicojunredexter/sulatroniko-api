/* eslint-disable max-statements */
const admin = require('firebase-admin');
const collectionsService = require('../../services/collections.service');
const arrObjUtil = require('../../utils/array.object.util');

exports.fetchFeedbacks = async (req, res) => {
    try {
        const usersCollection = collectionsService.getUsersCollection();
        const usersResponse = await usersCollection.where("AccountType","==","Driver").get();
        const usersArray = usersResponse.docs.map((data) => data.data());
        const usersObject = arrObjUtil.arrayToObject(usersArray, 'Id');

        const feedbacksCollection = collectionsService.getFeedbacksCollection();
        const feedbacksResponse = await feedbacksCollection.get();
        const feedbacksArray = feedbacksResponse.docs.map((data) => data.data());
        const feedbacksWithUser = feedbacksArray.map((data) => ({
            ...data,
            User: usersObject[data.DriverId]
        }));
        
        
        return res.send({feedbacksWithUser});
    } catch (error) {
        return res.status(500).send({"error": error.message});
    }
};

exports.fetchDriverFeedbacks = async (req, res) => {
    try {        
        const {id} = req.params;

        const usersCollection = collectionsService.getUsersCollection();
        const usersResponse = await usersCollection.doc(id).get();
        if (!usersResponse.exists) {
            return res.status(404).send({message: 'Driver does not exists'});
        }

        const feedbacksCollection = collectionsService.getFeedbacksCollection();
        const feedbacksResponse = await feedbacksCollection.where("DriverId","==",id).get();
        const feedbacksArray = feedbacksResponse.docs.map((data) => data.data());
        
        const response = {
            Driver: usersResponse.data(),
            Feedbacks: feedbacksArray
        };

        return res.send(response);
    } catch (error) {
        return res.status(500).send({"error": error.message});
    }
};

exports.addFeedback = async (req, res) => {
    try {
        const {body} = req;
        const feedbacksCollection = collectionsService.getFeedbacksCollection();

        const toBeAdded = {
            ...body,
            deleted: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        const responseAdd = await feedbacksCollection.add(toBeAdded);
        await feedbacksCollection.doc(responseAdd.id).update({Id: responseAdd.id});

        return res.send({
            success: true,
            status: 200
        });
    } catch (error) {
        return res.status(500).send({"error": error.message});
    }
}
