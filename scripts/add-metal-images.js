const fs = require('fs');
const path = require('path');

// Read the products.json file
const productsPath = path.join(process.cwd(), 'public', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Metal name to imageUrl mapping
const metalImageMap = {
  '18k Yellow Gold': '/icons/swatches/18k-yellow-gold.png',
  '18k Rose Gold': '/icons/swatches/18k-rose-gold.png',
  '18k White Gold': '/icons/swatches/18k-white-gold.png',
  'Platinum': '/icons/swatches/platinum.png',
  'Two-Tone Rose/Platinum': '/icons/swatches/two-tone-rose-platinum.png',
  'Two-Tone Yellow/Platinum': '/icons/swatches/two-tone-yellow-platinum.png',
};

// Update each product's metal options
let updatedCount = 0;
let metalCount = 0;

products.forEach((product) => {
  if (product.metals && Array.isArray(product.metals)) {
    product.metals.forEach((metal) => {
      if (metalImageMap[metal.name]) {
        metal.imageUrl = metalImageMap[metal.name];
        metalCount++;
      }
    });
    updatedCount++;
  }
});

// Write the updated products back to the file
fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');

console.log(`✓ Updated ${updatedCount} products`);
console.log(`✓ Added imageUrl to ${metalCount} metal options`);
console.log(`✓ Products saved to ${productsPath}`);
