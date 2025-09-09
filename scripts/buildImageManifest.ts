import fs from 'fs';
import path from 'path';

interface ImageManifest {
  slug: string;
  variants: {
    metal: string;
    label: string;
    images: {
      front?: string;
      side?: string;
      back?: string;
    };
  }[];
}

interface BuildOptions {
  slug: string;
  folder: string;
  productName: string;
  altSuffix: string;
}

function parseArgs(): BuildOptions {
  const args = process.argv.slice(2);
  const options: Partial<BuildOptions> = {};
  
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace('--', '');
    const value = args[i + 1];
    if (key && value) {
      options[key as keyof BuildOptions] = value;
    }
  }
  
  // Default values for Clarion (backward compatibility)
  return {
    slug: options.slug || 'clarion-engagement-ring',
    folder: options.folder || 'public/products/Clarion',
    productName: options.productName || 'Clarion Engagement Ring',
    altSuffix: options.altSuffix || 'Radiant solitaire, four-claw'
  };
}

function buildImageManifest(options?: BuildOptions): void {
  const opts = options || parseArgs();
  const productDir = path.join(process.cwd(), opts.folder);
  const outputPath = path.join(process.cwd(), `data/products/${opts.slug}.images.json`);
  
  if (!fs.existsSync(productDir)) {
    console.error(`Product directory not found: ${productDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(productDir);
  console.log('Found files:', files);

  // Group files by metal type
  const metalGroups: Record<string, { front?: string; side?: string; back?: string }> = {
    yellow: {},
    rose: {},
    silver: {}
  };

  // Parse file names and group by metal - support different naming patterns
  files.forEach(file => {
    // Skip .DS_Store and other non-image files
    if (!/\.(jpg|jpeg|png)$/i.test(file)) return;
    
    // Try different patterns: rsol-*, orabella-*, Aveline-*, Elara-*, VV-*, Seraphina-*, Luna-*, Celeste-*, or generic pattern
    const patterns = [
      /rsol-(gold|rose|silver)-(front|side|back)\.(jpg|jpeg|png)$/i,
      /orabella-(gold|rose|silver)-(front|side|back)\.(jpg|jpeg|png)$/i,
      /Aveline-(gold|rose|silver)-(front|side|back)\.(jpg|jpeg|png)$/i,
      /Elara-(gold|rose|silver)-(front|side|back)\.(jpg|jpeg|png)$/i,
      /VV-(gold|rose|silver)-(front|side|back)\.(jpg|jpeg|png)$/i,
      /Seraphina-(gold|rose|silver)-(front|side|back)\.(jpg|jpeg|png)$/i,
      /Luna-(gold|rose|silver)-(front|side|back)\.(jpg|jpeg|png)$/i,
      /Celeste-(gold|rose|silver)-(front|side|back)\.(jpg|jpeg|png)$/i,
      /(\w+)-(gold|rose|silver)-(front|side|back)\.(jpg|jpeg|png)$/i
    ];
    
    for (const pattern of patterns) {
      const match = file.match(pattern);
      if (match) {
        const metal = match[1]; // gold, rose, or silver
        const view = match[2];  // front, side, or back
        const metalKey = metal === 'gold' ? 'yellow' : metal;
        const productName = opts.folder.split('/').pop() || 'products';
        const imagePath = `/products/${productName}/${file}`;
        
        if (metalGroups[metalKey]) {
          metalGroups[metalKey][view as keyof typeof metalGroups[typeof metalKey]] = imagePath;
        }
        break;
      }
    }
  });

  console.log('Grouped images:', metalGroups);

  const manifest: ImageManifest = {
    slug: opts.slug,
    variants: [
      {
        metal: 'yellow',
        label: '18k Yellow Gold',
        images: metalGroups.yellow
      },
      {
        metal: 'rose',
        label: '18k Rose Gold',
        images: metalGroups.rose
      },
      {
        metal: 'silver',
        label: 'Silver (shared for 18k White Gold & Platinum)',
        images: metalGroups.silver
      }
    ]
  };

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write manifest
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
  console.log('✅ Image manifest created:', outputPath);
  console.log('Manifest content:', JSON.stringify(manifest, null, 2));
}

if (require.main === module) {
  buildImageManifest();
}

export { buildImageManifest };
