const functions = require("firebase-functions");
const admin = require('firebase-admin');

module.exports = {
    "initDefaultApp": () => {
        admin.initializeApp(functions.config().firebase);
    }
};
