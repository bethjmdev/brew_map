const functions = require("firebase-functions");
const axios = require("axios");
const cheerio = require("cheerio");

// Simple HTTP function for testing
exports.scrapeWebsite = functions.https.onRequest(async (req, res) => {
  const testUrl = "https://example.com"; // Replace with the URL you want to test

  try {
    // Fetch the website content
    const response = await axios.get(testUrl);

    // Parse the HTML with Cheerio
    const $ = cheerio.load(response.data);

    // Extract the header text
    const header = $("header").text().trim();

    console.log(`Scraped Header: ${header}`);
    res.status(200).send(`Scraped Header: ${header}`);
  } catch (error) {
    console.error("Error scraping the website:", error.message);
    res.status(500).send(`Error: ${error.message}`);
  }
});
