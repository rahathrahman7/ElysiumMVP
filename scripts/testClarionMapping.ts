import { getProductBySlug } from '../lib/products';
import { resolveGallery } from '../lib/imageResolver';

function testClarionMapping() {
  console.log('🧪 Testing Clarion Engagement Ring Metal Mapping...\n');
  
  const product = getProductBySlug('clarion-engagement-ring');
  if (!product) {
    console.error('❌ Clarion product not found');
    return;
  }

  console.log('✅ Product found:', product.title);
  console.log('📸 Available metals:', product.metals?.map(m => m.name).join(', '));
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

  console.log('\n🎉 Clarion mapping test complete!');
}

if (require.main === module) {
  testClarionMapping();
}

export { testClarionMapping };

