const admin = require("firebase-admin");
const functions = require("firebase-functions");
const db = admin.firestore();

const axios = require("axios");
const cheerio = require("cheerio");

exports.findBeans = functions.firestore
    .document("CoffeeShopWebsites/{shopId}")
    .onCreate(async (snapshot, context) => {
      const websiteData = snapshot.data();
      const {website, shop_id: shopId} = websiteData;

      try {
        // Fetch the website's HTML
        const {data} = await axios.get(website);
        const $ = cheerio.load(data);

        const beansAvailable = [];

        // Extract relevant coffee bean data
        $(".coffee-bean-item").each((index, element) => {
          const name = $(element).find(".bean-name").text().trim();
          const roastStyle = $(element).find(".roast-style").text().trim();
          const process = $(element).find(".processing-method").text().trim();
          const flavorNotes = $(element)
              .find(".flavor-notes")
              .text()
              .replace(/Notes:/i, "") // Remove "Notes:" if present
              .trim();

          // Push to beansAvailable array
          beansAvailable.push({
            name,
            roastStyle,
            process,
            flavorNotes,
          });
        });

        // If no beans are found, set a default message
        if (beansAvailable.length === 0) {
          beansAvailable.push("Unable to find beans");
        }

        // Save the data to the CoffeeShops collection
        await db.collection("CoffeeShops").doc(shopId).update({
          beans_available: beansAvailable,
          lastScraped: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`Data scraped and saved for shop_id: ${shopId}`);
      } catch (error) {
        console.error("Error scraping website:", error.message);

        // Save the error message and default beans_available message
        await db
            .collection("CoffeeShops")
            .doc(shopId)
            .update({
              beans_available: ["Unable to find beans"],
              scrapeError: error.message,
              lastScraped: admin.firestore.FieldValue.serverTimestamp(),
            });
      }
    });

