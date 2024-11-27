const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

// Initialize Firebase Admin SDK
admin.initializeApp();

exports.simpleScrapeTest = functions.firestore
  .document("CoffeeShopWebsites/{docId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const websiteUrl = data.website;

    if (!websiteUrl) {
      console.error("No website URL provided in the document");
      return null;
    }

    try {
      // Fetch website content
      const response = await axios.get(websiteUrl);

      // Log the website's title to the console
      const content = response.data;
      console.log(`Fetched content for URL: ${websiteUrl}`);
      console.log("Sample content:", content.slice(0, 100)); // Log the first 100 characters
    } catch (error) {
      console.error("Error fetching the website:", error.message);
    }

    return null;
  });
