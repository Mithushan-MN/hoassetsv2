const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '../src/App.js');
const seedDataPath = path.join(__dirname, 'seedData.json');

const appJsContent = fs.readFileSync(appJsPath, 'utf8');
const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));

// Extract imports
// e.g. import LYNX3 from './components/lynx/lynx3';
// Match: import (\w+) from '([^']+)';
const importRegex = /import\s+([A-Z0-9_]+)\s+from\s+['"]([^'"]+)['"]/g;
const componentMap = {}; // { 'LYNX3': 'lynx3.js' }

let match;
while ((match = importRegex.exec(appJsContent)) !== null) {
  let importPath = match[2];
  let fileName = path.basename(importPath);
  if (!fileName.endsWith('.js') && !fileName.endsWith('.jsx')) {
    // If no extension, assume .js for matching
    fileName += '.js';
  }
  componentMap[match[1]] = fileName;
}

// Extract routes
// e.g. <Route path="lynx3" element={<LYNX3 />} />
// Match: <Route\s+path=['"]([^'"]+)['"]\s+element=\{<([A-Z0-9_]+)[^>]*>\}\s*\/>
const routeRegex = /<Route\s+path=['"]([^'"]+)['"]\s+element=\{<([A-Z0-9_]+)[^>]*>\}\s*\/>/g;
const pathMap = {}; // { 'lynx3.js': 'lynx3' }

while ((match = routeRegex.exec(appJsContent)) !== null) {
  const routePath = match[1];
  const componentName = match[2];
  const fileName = componentMap[componentName];
  if (fileName) {
    // some might be .jsx in import but .js in actual file, we'll try to match both
    pathMap[fileName] = routePath;
    pathMap[fileName.replace('.jsx', '.js')] = routePath;
    pathMap[fileName.replace('.js', '.jsx')] = routePath;
  }
}

// Merge path into seedData
const enrichedData = seedData.map(product => {
  product.route_path = pathMap[product.route_file] || encodeURIComponent(product.name);
  return product;
});

fs.writeFileSync(seedDataPath, JSON.stringify(enrichedData, null, 2));
console.log('Enriched seedData.json with route_paths from App.js');
