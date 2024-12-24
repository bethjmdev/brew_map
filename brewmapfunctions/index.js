

//===========
//===========

// import { onDocumentCreated } from "firebase-functions/v2/firestore";
// import fetch from "node-fetch";

// export const logWebsite = onDocumentCreated("CoffeeShopWebsites/{shopId}", async (event) => {
//   const data = event.data;

//   const website = data.get("website");
//   console.log(`Website submitted: ${website}`);

//   if (!website) {
//     console.error("Website is undefined. Please check the Firestore document structure.");
//     return null;
//   }

//   try {
//     // Fetch the website's HTML content using node-fetch
//     const response = await fetch(website);

//     if (!response.ok) {
//       console.error(`Failed to fetch the website: ${website} with status: ${response.status}`);
//       return null;
//     }

//     const html = await response.text(); // Get the HTML content
//     console.log("Successfully fetched website content.");

//     // Extract and print the page title
//     const titleMatch = html.match(/<title>(.*?)<\/title>/i);
//     const pageTitle = titleMatch ? titleMatch[1] : "No title found";
//     console.log(`Page Title: ${pageTitle}`);

//     // Extract and print the meta description
//     const metaDescriptionMatch = html.match(/<meta name="description" content="(.*?)"/i);
//     const metaDescription = metaDescriptionMatch ? metaDescriptionMatch[1] : "No meta description found";
//     console.log(`Meta Description: ${metaDescription}`);

//     // Extract and print all <h1> headings
//     const h1Matches = html.match(/<h1>(.*?)<\/h1>/gi) || [];
//     const h1Headings = h1Matches.map(h1 => h1.replace(/<\/?h1>/gi, ""));
//     console.log(`H1 Headings: ${h1Headings.join(", ")}`);

//     // Extract and print all <h2> headings
//     const h2Matches = html.match(/<h2>(.*?)<\/h2>/gi) || [];
//     const h2Headings = h2Matches.map(h2 => h2.replace(/<\/?h2>/gi, ""));
//     console.log(`H2 Headings: ${h2Headings.join(", ")}`);

//     // Extract and print all <p> tags
//     const pMatches = html.match(/<p>(.*?)<\/p>/gi) || [];
//     const paragraphs = pMatches.map(p => p.replace(/<\/?p>/gi, "").trim()).slice(0, 5); // Limit to first 5 for brevity
//     console.log(`Paragraphs: ${paragraphs.join(" | ")}`);

//     // Extract and print all links
//     const linkMatches = html.match(/href="(.*?)"/gi) || [];
//     const links = linkMatches.map(link => link.replace(/href="/, "").replace(/"/, ""));
//     console.log("Links:", links);

//     // Extract and print all image sources
//     const imgMatches = html.match(/<img[^>]+src="(.*?)"/gi) || [];
//     const images = imgMatches.map(img => img.match(/src="(.*?)"/)[1]);
//     console.log("Image Sources:", images);
//   } catch (error) {
//     console.error(`Error scraping the website ${website}:`, error);
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
    // Fetch the main website's HTML content
    const response = await fetch(website);
    if (!response.ok) {
      console.error(`Failed to fetch the website: ${website} with status: ${response.status}`);
      return null;
    }

    const html = await response.text(); // Get the HTML content
    console.log("Successfully fetched main website content.");

    // Search for "Coffee" or "Shop" links
    const coffeeLinkMatch = html.match(/<a[^>]*href="([^"]*)"[^>]*>\s*coffee\s*<\/a>/i);
    const shopLinkMatch = html.match(/<a[^>]*href="([^"]*)"[^>]*>\s*shop\s*<\/a>/i);

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

    const targetHtml = await targetResponse.text(); // Get the HTML content of the target page
    console.log("Successfully fetched target page content.");

    // Scrape details from the target page
    const titleMatch = targetHtml.match(/<title>(.*?)<\/title>/i);
    const pageTitle = titleMatch ? titleMatch[1] : "No title found";
    console.log(`Target Page Title: ${pageTitle}`);

    const descriptionMatch = targetHtml.match(/<meta name="description" content="(.*?)"/i);
    const metaDescription = descriptionMatch ? descriptionMatch[1] : "No meta description found";
    console.log(`Target Meta Description: ${metaDescription}`);

    const h1Matches = targetHtml.match(/<h1>(.*?)<\/h1>/gi) || [];
    const h1Headings = h1Matches.map(h1 => h1.replace(/<\/?h1>/gi, ""));
    console.log(`Target H1 Headings: ${h1Headings.join(", ")}`);

    const productLinks = targetHtml.match(/<a[^>]*href="([^"]*product[^"]*)"/gi) || [];
    const productUrls = productLinks.map(link => link.match(/href="([^"]*)"/)[1]);
    console.log("Product Links on Target Page:", productUrls);
  } catch (error) {
    console.error(`Error scraping the website ${website}:`, error);
  }

  return null; // Always return a promise or null in Cloud Functions
});
