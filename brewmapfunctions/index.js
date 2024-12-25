

import { onDocumentCreated } from "firebase-functions/v2/firestore";
import fetch from "node-fetch";
import admin from "firebase-admin";

admin.initializeApp();

export const logWebsite = onDocumentCreated("CoffeeShopWebsites/{shopId}", async (event) => {
  const data = event.data;

  const shopId = event.params.shopId; // Extract shopId from the Firestore document path
  const website = data.get("website");

  console.log(`Website submitted: ${website}`);
  console.log(`Shop ID: ${shopId}`);

  if (!website) {
    console.error("Website is undefined. Please check the Firestore document structure.");
    return null;
  }

  try {
    // Fetch the main website's HTML content
    const response = await fetch(website);
    if (!response.ok) {
      console.error(`Failed to fetch the website: ${website} with status: ${response.status}`);
      return null;
    }

    const html = await response.text();
    console.log("Successfully fetched main website content.");

    // Search for links with keywords like "Coffee" or "Shop"
    const coffeeLinkMatch = html.match(/<a[^>]*href="([^"]*)"[^>]*>\s*.*?coffee.*?<\/a>/i);
    const shopLinkMatch = html.match(/<a[^>]*href="([^"]*)"[^>]*>\s*.*?shop.*?<\/a>/i);

    // Prioritize Coffee > Shop
    const targetLink = coffeeLinkMatch
      ? coffeeLinkMatch[1]
      : shopLinkMatch
      ? shopLinkMatch[1]
      : null;

    if (!targetLink) {
      console.log("No Coffee or Shop link found on the main page.");
      return null;
    }

    // Resolve relative URLs if necessary
    const targetUrl = targetLink.startsWith("http") ? targetLink : new URL(targetLink, website).href;
    console.log(`Found target link: ${targetUrl}`);

    // Fetch the target page's HTML content
    const targetResponse = await fetch(targetUrl);
    if (!targetResponse.ok) {
      console.error(`Failed to fetch the target page: ${targetUrl} with status: ${targetResponse.status}`);
      return null;
    }

    const targetHtml = await targetResponse.text();
    console.log("Successfully fetched target page content.");

    const productLinks = targetHtml.match(/<a[^>]*href="([^"]*product[^"]*)"/gi) || [];
    const productUrls = productLinks.map(link => link.match(/href="([^"]*)"/)[1]);

    // Extract and format coffee names
    const coffeeNames = [
      ...new Set(productUrls.map(url => url.split('/').pop().replace(/-/g, ' ')))
    ];
    console.log("Coffee Names Extracted:", coffeeNames);

    // Save data to Firestore
    await admin.firestore().collection("CoffeeBags").add({
      shop_id: shopId,
      website: website,
      coffee_bags: coffeeNames,
      date_added: admin.firestore.FieldValue.serverTimestamp() // Current timestamp
    });

    console.log("Data successfully saved to CoffeeBags collection.");

  } catch (error) {
    console.error(`Error scraping the website ${website}:`, error);
  }

  return null; // Always return a promise or null in Cloud Functions
});
