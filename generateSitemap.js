const fs = require("fs");
const path = require("path");
const glob = require("glob");

// Configuration
const BASE_URL = "https://rotationsinfo.com"; // Replace with your website URL
const SRC_DIR = path.join(__dirname, "src");
const PUBLIC_DIR = path.join(__dirname, "public");
const SITEMAP_PATH = path.join(PUBLIC_DIR, "sitemap.xml");

// Function to extract routes from React components
const extractRoutes = () => {
  const routes = new Set(["/"]); // Always include home route

  // Find all JS/JSX files in src directory
  const files = glob.sync("**/*.{js,jsx}", { cwd: SRC_DIR });

  files.forEach((file) => {
    const content = fs.readFileSync(path.join(SRC_DIR, file), "utf-8");

    // Look for Route components in React Router
    const routeMatches = content.match(/Route.*?path=["'](.*?)["']/g);
    if (routeMatches) {
      routeMatches.forEach((match) => {
        const route = match.match(/path=["'](.*?)["']/)[1];
        // Clean up route and add to set
        const cleanRoute = route
          .replace(/:[^/]+/g, "") // Remove route parameters
          .replace(/\*/g, "") // Remove wildcards
          .replace(/\/+/g, "/") // Clean up multiple slashes
          .replace(/\/$/, ""); // Remove trailing slash

        if (cleanRoute && cleanRoute !== "") {
          routes.add(cleanRoute);
        }
      });
    }

    // Look for Link components
    const linkMatches = content.match(/Link.*?to=["'](.*?)["']/g);
    if (linkMatches) {
      linkMatches.forEach((match) => {
        const route = match.match(/to=["'](.*?)["']/)[1];
        if (route.startsWith("/")) {
          routes.add(route);
        }
      });
    }
  });

  return Array.from(routes);
};

// Generate sitemap XML content
const generateSitemap = (routes) => {
  const today = new Date().toISOString();

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map(
      (route) => `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === "/" ? "1.0" : "0.8"}</priority>
  </url>`
    )
    .join("")}
</urlset>`;

  return sitemapContent;
};

// Main execution
try {
  // Ensure public directory exists
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  // Extract routes and generate sitemap
  const routes = extractRoutes();
  console.log("Found routes:", routes);

  // Write sitemap file
  fs.writeFileSync(SITEMAP_PATH, generateSitemap(routes));
  console.log(`Sitemap generated successfully at ${SITEMAP_PATH}`);
} catch (error) {
  console.error("Error generating sitemap:", error);
}
