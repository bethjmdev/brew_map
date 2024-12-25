


import { onDocumentCreated } from "firebase-functions/v2/firestore";
import fetch from "node-fetch";
import admin from "firebase-admin";

admin.initializeApp();

export const logWebsite = onDocumentCreated("CoffeeShopWebsites/{shopId}", async (event) => {
  const data = event.data;

  const shopId = event.params.shopId; // Extract shopId from the Firestore document path
  let website = data.get("website");
  const shopName = data.get("shop_name"); // Optional, passed from the React side

  console.log(`Website submitted: ${website}`);
  console.log(`Shop ID: ${shopId}`);
  console.log(`Shop Name: ${shopName || "Not provided"}`);

  // Add protocol if missing
  if (!/^https?:\/\//i.test(website)) {
    website = `https://${website}`;
    console.log(`Updated Website URL with protocol: ${website}`);
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

    // Check for a direct link to "Coffee" or "All Coffee" (Single Step)
    const coffeeLinkMatch = html.match(/<a[^>]*href="([^"]*)"[^>]*>\s*.*?coffee.*?<\/a>/i);
    if (coffeeLinkMatch) {
      // Direct link found
      const coffeeLink = coffeeLinkMatch[1].startsWith("http")
        ? coffeeLinkMatch[1]
        : new URL(coffeeLinkMatch[1], website).href;
      console.log(`Found direct link to coffee page: ${coffeeLink}`);
      await processCoffeePage(coffeeLink, shopId, shopName, website);
      return;
    }

    // If no direct link, look for a "Shop" or "Coffee" link (Two Steps: Step 1)
    const shopOrCoffeeLinkMatch = html.match(/<a[^>]*href="([^"]*)"[^>]*>\s*.*?(shop|coffee).*?<\/a>/i);
    if (!shopOrCoffeeLinkMatch) {
      console.log("No 'Shop' or 'Coffee' link found on the main page.");
      return null;
    }

    const shopOrCoffeeLink = shopOrCoffeeLinkMatch[1].startsWith("http")
      ? shopOrCoffeeLinkMatch[1]
      : new URL(shopOrCoffeeLinkMatch[1], website).href;
    console.log(`Found intermediate link (Shop/Coffee): ${shopOrCoffeeLink}`);

    // Fetch the intermediate page
    const intermediateResponse = await fetch(shopOrCoffeeLink);
    if (!intermediateResponse.ok) {
      console.error(`Failed to fetch the intermediate page: ${shopOrCoffeeLink} with status: ${intermediateResponse.status}`);
      return null;
    }

    const intermediateHtml = await intermediateResponse.text();
    console.log("Successfully fetched the intermediate page content.");

    // Look for "Coffee", "All Coffee", or "Coffees" link (Two Steps: Step 2)
    const allCoffeeLinkMatch = intermediateHtml.match(/<a[^>]*href="([^"]*)"[^>]*>\s*.*?(coffee|all coffee|coffees).*?<\/a>/i);
    if (!allCoffeeLinkMatch) {
      console.log("No 'Coffee', 'All Coffee', or 'Coffees' link found on the intermediate page.");
      return null;
    }

    const coffeeListingUrl = allCoffeeLinkMatch[1].startsWith("http")
      ? allCoffeeLinkMatch[1]
      : new URL(allCoffeeLinkMatch[1], shopOrCoffeeLink).href;
    console.log(`Found link to coffee listing page: ${coffeeListingUrl}`);

    // Process the final coffee listing page
    await processCoffeePage(coffeeListingUrl, shopId, shopName, website);

  } catch (error) {
    console.error(`Error scraping the website ${website}:`, error);
  }

  return null; // Always return a promise or null in Cloud Functions
});

// Helper function to process coffee listing page
async function processCoffeePage(url, shopId, shopName, website) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch the coffee listing page: ${url} with status: ${response.status}`);
      return;
    }

    const html = await response.text();
    console.log("Successfully fetched the coffee listing page content.");

    const productLinks = html.match(/<a[^>]*href="([^"]*product[^"]*)"/gi) || [];
    const productUrls = productLinks.map(link => link.match(/href="([^"]*)"/)[1]);

    // Extract and format coffee names
    const coffeeNames = [
      ...new Set(productUrls.map(url => url.split('/').pop().replace(/-/g, ' ')))
    ];

    // Filter out unwanted names containing specific keywords
    const filteredCoffeeNames = coffeeNames.filter(name => {
      const lowerName = name.toLowerCase();
      return !lowerName.includes("gift card") && !lowerName.includes("subscribe");
    });

    console.log("Filtered Coffee Names:", filteredCoffeeNames);

    // Save data to Firestore
    await admin.firestore().collection("CoffeeBags").add({
      shop_id: shopId,
      shop_name: shopName || "Unknown Shop",
      website: website,
      coffee_bags: filteredCoffeeNames,
      date_added: admin.firestore.FieldValue.serverTimestamp() // Current timestamp
    });

    console.log("Data successfully saved to CoffeeBags collection.");
  } catch (error) {
    console.error(`Error processing the coffee listing page: ${url}`, error);
  }
}
