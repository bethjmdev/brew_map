

//================
//================
//================
//================
//================
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import fetch from "node-fetch";
import admin from "firebase-admin";

admin.initializeApp();

// Helper function to fetch with headers
const fetchWithHeaders = async (url) => {
  return fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5"
    }
  });
};

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
    // Fetch the main website's HTML content with headers
    const response = await fetchWithHeaders(website);
    if (!response.ok) {
      console.error(`Failed to fetch the website: ${website} with status: ${response.status}`);

      // Add to Firestore for 403 errors
      if (response.status === 403) {
        await admin.firestore().collection("CoffeeBags").add({
          shop_id: shopId,
          shop_name: shopName || "Unknown Shop",
          website: website,
          coffee_bags: ["Website owner will not allow access to bags, sorry!"],
          date_added: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log("Added default message to CoffeeBags for 403 error.");
      }
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

    // If no direct link, look for a "Shop" or "Coffee" link (Two or Three Steps: Step 1)
    const shopOrCoffeeLinkMatch = html.match(/<a[^>]*href="([^"]*)"[^>]*>\s*.*?(shop|coffee).*?<\/a>/i);
    if (!shopOrCoffeeLinkMatch) {
      console.log("No 'Shop' or 'Coffee' link found on the main page. Adding default message to Firestore.");

      // Add to Firestore if no shop or coffee link is found
      await admin.firestore().collection("CoffeeBags").add({
        shop_id: shopId,
        shop_name: shopName || "Unknown Shop",
        website: website,
        coffee_bags: ["The coffee bags are not listed no the website. If you feel passionate about getting the bags listed please go to and call the shop for a list, then email the list shop name and shop address to bethjmdev@gmail.com"],
        date_added: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log("Added default message to CoffeeBags: Bags not listed on website.");
      return null;
    }

    const shopOrCoffeeLink = shopOrCoffeeLinkMatch[1].startsWith("http")
      ? shopOrCoffeeLinkMatch[1]
      : new URL(shopOrCoffeeLinkMatch[1], website).href;
    console.log(`Found intermediate link (Shop/Coffee): ${shopOrCoffeeLink}`);

    // Fetch the intermediate page (Step 2) with headers
    const intermediateResponse = await fetchWithHeaders(shopOrCoffeeLink);
    if (!intermediateResponse.ok) {
      console.error(`Failed to fetch the intermediate page: ${shopOrCoffeeLink} with status: ${intermediateResponse.status}`);
      return null;
    }

    const intermediateHtml = await intermediateResponse.text();
    console.log("Successfully fetched the intermediate page content.");

    // Look for "Coffee", "All Coffee", or "Coffees" link (Two Steps: Step 2 or Three Steps: Step 2)
    const coffeeOrAllCoffeeLinkMatch = intermediateHtml.match(/<a[^>]*href="([^"]*)"[^>]*>\s*.*?(coffee).*?<\/a>/i);
    if (coffeeOrAllCoffeeLinkMatch) {
      // Found coffee or all coffee link
      const coffeeListingUrl = coffeeOrAllCoffeeLinkMatch[1].startsWith("http")
        ? coffeeOrAllCoffeeLinkMatch[1]
        : new URL(coffeeOrAllCoffeeLinkMatch[1], shopOrCoffeeLink).href;
      console.log(`Found link to coffee listing page: ${coffeeListingUrl}`);
      await processCoffeePage(coffeeListingUrl, shopId, shopName, website);
      return;
    }

    // If still no link, perform a third step specifically for "All Coffee" or "All Coffees" (Three Steps: Step 3)
    const deeperCoffeeLinkMatch = intermediateHtml.match(/<a[^>]*href="([^"]*)"[^>]*>\s*.*?(all coffee|all coffees).*?<\/a>/i);
    if (!deeperCoffeeLinkMatch) {
      console.log("No deeper 'All Coffee' or 'All Coffees' link found on the intermediate page.");
      return null;
    }

    const deeperCoffeeListingUrl = deeperCoffeeLinkMatch[1].startsWith("http")
      ? deeperCoffeeLinkMatch[1]
      : new URL(deeperCoffeeLinkMatch[1], shopOrCoffeeLink).href;
    console.log(`Found deeper link to 'All Coffee' or 'All Coffees': ${deeperCoffeeListingUrl}`);
    await processCoffeePage(deeperCoffeeListingUrl, shopId, shopName, website);

  } catch (error) {
    console.error(`Error scraping the website ${website}:`, error);

    // Add default message to CoffeeBags in case of general error
    await admin.firestore().collection("CoffeeBags").add({
      shop_id: shopId,
      shop_name: shopName || "Unknown Shop",
      website: website,
      coffee_bags: ["Website owner will not allow my bot to access the listed bags, sorry! If you feel passionate about having the bags manually entered you can send a list of bags and the shop address to bethjmdev@gmail.com"],
      date_added: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log("Added default message to CoffeeBags for general error.");
  }

  return null; // Always return a promise or null in Cloud Functions
});

// Helper function to process coffee listing page
async function processCoffeePage(url, shopId, shopName, website) {
  try {
    const response = await fetchWithHeaders(url);
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
