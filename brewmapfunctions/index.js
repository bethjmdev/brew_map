
// import { onDocumentCreated } from "firebase-functions/v2/firestore";
// import fetch from "node-fetch";

// export const logWebsite = onDocumentCreated("CoffeeShopWebsites/{shopId}", async (event) => {
//   const data = event.data; // Firestore QueryDocumentSnapshot

//   // Extract the website using the .get() method
//   const website = data.get("website"); // This safely retrieves the "website" field

//   // Log the website
//   console.log(`Website submitted: ${website}`);

//   if (!website) {
//     console.error("Website is undefined. Please check the Firestore document structure.");
//     return null; // Exit early if no website
//   }

//   try {
//     const response = await fetch(website);

//     if (response.ok) {
//       console.log(`Successfully accessed the website: ${website}`);
//       console.log(true); // Print "true" in logs if successful
//     } else {
//       console.error(`Failed to access the website: ${website} with status: ${response.status}`);
//       console.log(false); // Print "false" in logs if unsuccessful
//     }
//   } catch (error) {
//     console.error(`Error accessing the website ${website}:`, error);
//     console.log(false); // Print "false" in logs if an error occurs
//   }

//   return null; // Always return a promise or null in Cloud Functions
// });


import { onDocumentCreated } from "firebase-functions/v2/firestore";
import fetch from "node-fetch";

export const logWebsite = onDocumentCreated("CoffeeShopWebsites/{shopId}", async (event) => {
  const data = event.data;

  const website = data.get("website");
  console.log(`Website submitted: ${website}`);

  if (!website) {
    console.error("Website is undefined. Please check the Firestore document structure.");
    return null;
  }

  try {
    // Fetch the website's HTML content using node-fetch
    const response = await fetch(website);

    if (!response.ok) {
      console.error(`Failed to fetch the website: ${website} with status: ${response.status}`);
      return null;
    }

    const html = await response.text(); // Get the HTML content
    console.log("Successfully fetched website content.");

    // Extract specific information using simple string matching or regex
    // Example: Extract the <title> tag content
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const pageTitle = titleMatch ? titleMatch[1] : "No title found";
    console.log(`Page Title: ${pageTitle}`);

    // Example: Extract all href links using regex
    const linkMatches = html.match(/href="(.*?)"/gi);
    const links = linkMatches ? linkMatches.map(link => link.replace(/href="/, '').replace(/"/, '')) : [];
    console.log("Extracted Links:", links);

    // Example: Extract specific content (adjust regex for your needs)
    const specificContentMatch = html.match(/<div class="specific-class">(.*?)<\/div>/i);
    const specificContent = specificContentMatch ? specificContentMatch[1] : "No specific content found";
    console.log(`Specific Content: ${specificContent}`);
  } catch (error) {
    console.error(`Error scraping the website ${website}:`, error);
  }

  return null; // Always return a promise or null in Cloud Functions
});
