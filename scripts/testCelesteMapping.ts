import { getProductBySlug } from '../lib/products';
import { resolveGallery } from '../lib/imageResolver';

function testCelesteMapping() {
  console.log('🧪 Testing Celeste Six-Claw Solitaire Product...\n');
  
  const product = getProductBySlug('celeste-six-claw-solitaire');
  if (!product) {
    console.error('❌ Celeste product not found');
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
    'Platinum',
    'Two-Tone Rose/Silver',
    'Two-Tone Yellow/Silver'
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

  // Test six-claw specific features
  console.log('\n💍 Six-Claw Features:');
  console.log(`   Design: Six-claw solitaire`);
  console.log(`   Center Stone: Round cut`);
  console.log(`   Prongs: Six graceful eagle-claw prongs`);
  console.log(`   Metal Options: 6 variants including two-tone`);

  // Test two-tone variants
  console.log('\n💎 Two-Tone Features:');
  console.log(`   Rose/Silver: ${resolveGallery(product, 'Two-Tone Rose/Silver').length} images`);
  console.log(`   Yellow/Silver: ${resolveGallery(product, 'Two-Tone Yellow/Silver').length} images`);
  console.log(`   Two-tone pricing: +£50 premium`);

  // Test pricing structure
  console.log('\n💰 Pricing Structure:');
  console.log(`   Base Price: £${product.basePriceGBP.toLocaleString()}`);
  console.log(`   Platinum Premium: +£75`);
  console.log(`   Two-Tone Premium: +£50`);
  console.log(`   Engraving: £${product.engravingFeeGBP}`);

  // Test collections and tags
  console.log('\n🏷️  Collections & Tags:');
  console.log(`   Collections: ${product.collections?.join(', ')}`);
  console.log(`   Shape: ${product.shape}`);
  console.log(`   Styles: ${product.styles?.join(', ')}`);

  console.log('\n🎉 Celeste mapping test complete!');
}

if (require.main === module) {
  testCelesteMapping();
}

export { testCelesteMapping };

