const admin = require("firebase-admin");
admin.initializeApp();

exports.findBeans = require("./findBeans");
