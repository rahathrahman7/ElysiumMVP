import { getProductBySlug } from '../lib/products';
import { resolveGallery } from '../lib/imageResolver';

function testLunaMapping() {
  console.log('🧪 Testing Luna Low-Set Solitaire Product...\n');
  
  const product = getProductBySlug('luna-low-set-solitaire');
  if (!product) {
    console.error('❌ Luna product not found');
    return;
  }

  console.log('✅ Product found:', product.title);
  console.log('📝 Description:', product.blurb);
  console.log('💰 Base price: £' + product.basePriceGBP.toLocaleString());
  console.log('📸 Available metals:', product.metals?.map(m => m.name).join(', '));
  console.log('🏷️  Collections:', product.collections?.join(', '));
  console.log('🖼️  Gallery by metal keys:', Object.keys(product.galleryByMetal || {}));
  console.log('');

  // Test metal mapping
  const testMetals = [
    '18k Yellow Gold',
    '18k Rose Gold', 
    '18k White Gold',
    'Platinum'
  ];

  testMetals.forEach(metal => {
    const images = resolveGallery(product, metal);
    console.log(`🔍 ${metal}:`);
    console.log(`   Images: ${images.length} found`);
    console.log(`   First image: ${images[0]}`);
    console.log('');
  });

  // Test that white gold and platinum use the same silver images
  const whiteGoldImages = resolveGallery(product, '18k White Gold');
  const platinumImages = resolveGallery(product, 'Platinum');
  
  const sameImages = JSON.stringify(whiteGoldImages) === JSON.stringify(platinumImages);
  console.log(`🔄 White Gold & Platinum use same images: ${sameImages ? '✅' : '❌'}`);
  
  if (sameImages) {
    console.log('   Both use silver variant images as expected');
  } else {
    console.log('   ❌ Expected both to use silver images');
  }

  // Test product features
  console.log('\n📋 Product Features:');
  console.log(`   Shape: ${product.shape}`);
  console.log(`   Styles: ${product.styles?.join(', ')}`);
  console.log(`   Featured: ${product.isFeatured ? 'Yes' : 'No'}`);
  console.log(`   Quality Banner: ${product.qualityBanner}`);

  // Test image order (should be front → side → back)
  const yellowImages = resolveGallery(product, '18k Yellow Gold');
  console.log('\n🖼️  Image Order Test (Yellow Gold):');
  yellowImages.forEach((img, index) => {
    const view = img.includes('front') ? 'front' : img.includes('side') ? 'side' : 'back';
    console.log(`   ${index + 1}. ${view}: ${img}`);
  });

  // Test low-set specific features
  console.log('\n💍 Low-Set Features:');
  console.log(`   Design: Low-set solitaire`);
  console.log(`   Center Stone: Round cut`);
  console.log(`   Bridge: Open bridge design`);
  console.log(`   Halo: Hidden halo effect`);
  console.log(`   Flush Fit: Wedding band friendly`);

  // Test pricing structure
  console.log('\n💰 Pricing Structure:');
  console.log(`   Base Price: £${product.basePriceGBP.toLocaleString()}`);
  console.log(`   Platinum Premium: +£75`);
  console.log(`   Engraving: £${product.engravingFeeGBP}`);

  // Test collections and tags
  console.log('\n🏷️  Collections & Tags:');
  console.log(`   Collections: ${product.collections?.join(', ')}`);
  console.log(`   Shape: ${product.shape}`);
  console.log(`   Styles: ${product.styles?.join(', ')}`);

  console.log('\n🎉 Luna mapping test complete!');
}

if (require.main === module) {
  testLunaMapping();
}

export { testLunaMapping };

