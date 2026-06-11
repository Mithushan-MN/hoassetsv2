const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../src/components');
const outputData = [];

// Helper function to read all files recursively
const walkSync = (dir, filelist = []) => {
  if (!fs.existsSync(dir)) return filelist;
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.js') || dirFile.endsWith('.jsx')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const files = walkSync(componentsDir);

files.forEach(file => {
  // Skip main component files that aren't specific product pages
  if (file.includes('homePageGrid') || file.includes('App') || file.includes('navbar') || file.includes('Footer') || file.includes('TabSections') || file.includes('mainpage')) return;
  
  const content = fs.readFileSync(file, 'utf8');
  
  // Extract product name from <h2 className="under">PRODUCT_NAME</h2> or <h2 className="underr">PRODUCT_NAME</h2>
  const nameMatch = content.match(/<h2[^>]*>([^<]+)<\/h2>/);
  if (!nameMatch) return;
  
  let productName = nameMatch[1].trim();
  
  // Try to determine category from folder name
  const folderName = path.basename(path.dirname(file));
  let category = folderName.toUpperCase();
  if (category === 'COMPONENTS') category = 'OTHER';

  const product = {
    name: productName,
    category: category,
    route_file: path.basename(file),
    assets: []
  };

  // Find all cards
  // Regex to match <div className="card home_card"> ... </div>
  // Because HTML parsing with regex is hard, we look for h4 and a tags.
  // We can look for <a href="..."> ... <img src="..."> ... <h4...>TITLE</h4>
  const regex = /<a[^>]+href="([^"]+)"[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"[^>]*>[\s\S]*?<h4[^>]*>([^<]+)<\/h4>/g;
  
  let match;
  while ((match = regex.exec(content)) !== null) {
    product.assets.push({
      url: match[1],
      icon: match[2],
      title: match[3].trim()
    });
  }
  
  // If no assets found using <a> wrapping <img>, maybe the <a> is outside or missing
  // Let's do a more generic search if empty
  if (product.assets.length === 0) {
      const regexAlt = /<img[^>]+src="([^"]+)"[^>]*>[\s\S]*?<a[^>]+href="([^"]+)"[^>]*>[\s\S]*?<h4[^>]*>([^<]+)<\/h4>/g;
      let matchAlt;
      while ((matchAlt = regexAlt.exec(content)) !== null) {
          product.assets.push({
            url: matchAlt[2],
            icon: matchAlt[1],
            title: matchAlt[3].trim()
          });
      }
  }

  // A third pattern just in case: <a href> ... <img src> inside, and <h4 title> outside <a>
  if (product.assets.length === 0) {
      const blockRegex = /<div className="card-body"[^>]*>([\s\S]*?)<\/div>/g;
      let blockMatch;
      while ((blockMatch = blockRegex.exec(content)) !== null) {
          const block = blockMatch[1];
          const aMatch = block.match(/<a[^>]+href="([^"]+)"/);
          const imgMatch = block.match(/<img[^>]+src="([^"]+)"/);
          const h4Match = block.match(/<h4[^>]*>([^<]+)<\/h4>/);
          if (aMatch && imgMatch && h4Match) {
              product.assets.push({
                  url: aMatch[1],
                  icon: imgMatch[1],
                  title: h4Match[1].trim()
              });
          }
      }
  }

  if (product.assets.length > 0) {
    outputData.push(product);
  }
});

fs.writeFileSync(path.join(__dirname, 'seedData.json'), JSON.stringify(outputData, null, 2));
console.log(`Extracted ${outputData.length} products to seedData.json`);
