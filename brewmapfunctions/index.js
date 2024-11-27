const functions = require("firebase-functions");

exports.logOnAdd = functions.firestore
    .document("CoffeeShopWebsites/{docId}")
    .onCreate((snap, context) => {
        console.log("hi");
        return null;
    });
