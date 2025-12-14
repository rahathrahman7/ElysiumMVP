# Metal Swatch Images

This directory contains realistic metal swatch images for the product configurator.

## Required Images

You need to create **6 photorealistic metal swatch images**:

1. `18k-yellow-gold.png` - 18k Yellow Gold
2. `18k-rose-gold.png` - 18k Rose Gold
3. `18k-white-gold.png` - 18k White Gold
4. `platinum.png` - Platinum
5. `two-tone-rose-platinum.png` - Two-Tone Rose/Platinum
6. `two-tone-yellow-platinum.png` - Two-Tone Yellow/Platinum

## Image Specifications

- **Dimensions:** 192 x 192 pixels
- **Format:** PNG with transparency support
- **Quality:** High resolution, photorealistic metal surfaces
- **Lighting:** Consistent even lighting across all swatches
- **Background:** Transparent or subtle neutral background
- **File size:** Optimize for web (aim for < 50KB per image)

## Visual Style Guidelines

- **Clean, smooth polished metal finish** - NO grain or texture
- Clean reflective surface with subtle highlights
- Maintain ELYSIUM luxury aesthetic (professional, premium)
- Ensure clear visual differentiation between similar gold tones
- Consistent perspective and angle across all swatches

## AI Generation Prompts (Nano Banana)

Use these prompts with "Resize to 192x192px" instruction:

**18k Yellow Gold:**
```
Professional macro photography of 18k yellow gold metal surface, luxury jewelry material, warm golden color, smooth polished finish, clean reflective surface, even studio lighting, high quality photorealistic render, no grain or texture, pure polished metal. Resize to 192x192px.
```

**18k Rose Gold:**
```
Professional macro photography of 18k rose gold metal surface, luxury jewelry material, warm pink-gold copper tone, smooth polished finish, clean reflective surface, even studio lighting, high quality photorealistic render, no grain or texture, pure polished metal. Resize to 192x192px.
```

**18k White Gold:**
```
Professional macro photography of 18k white gold metal surface, luxury jewelry material, bright silvery-white finish, smooth polished finish, clean reflective surface, even studio lighting, high quality photorealistic render, no grain or texture, pure polished metal. Resize to 192x192px.
```

**Platinum:**
```
Professional macro photography of platinum metal surface, luxury jewelry material, cool silver-gray color with slight blue undertone, smooth polished finish, clean reflective surface, even studio lighting, high quality photorealistic render, no grain or texture, pure polished metal. Resize to 192x192px.
```

**Two-Tone Rose/Platinum:**
```
Professional macro photography of two-tone metal surface showing 18k rose gold and platinum split vertically down the center, luxury jewelry material, clear division between warm pink-gold and cool platinum silver, smooth polished finish on both sides, clean reflective surface, even studio lighting, high quality photorealistic render, no grain or texture. Resize to 192x192px.
```

**Two-Tone Yellow/Platinum:**
```
Professional macro photography of two-tone metal surface showing 18k yellow gold and platinum split vertically down the center, luxury jewelry material, clear division between warm golden and cool platinum silver, smooth polished finish on both sides, clean reflective surface, even studio lighting, high quality photorealistic render, no grain or texture. Resize to 192x192px.
```

## After Creating Images

Once you have the images:

1. Place all 6 PNG files in this directory (`public/icons/swatches/`)
2. Update your product data to reference them:
   ```json
   {
     "name": "18k Yellow Gold",
     "hex": "#FFD700",
     "imageUrl": "/icons/swatches/18k-yellow-gold.png",
     "priceDeltaGBP": 0
   }
   ```
3. The MetalSwatch component will automatically display them
4. If an image fails to load, the component falls back to the HEX color circle

## Optional: Retina Display Support

For enhanced quality on retina displays, create @2x versions:
- **Dimensions:** 384 x 384 pixels
- **Naming:** `18k-yellow-gold@2x.png`, etc.
- Use Next.js Image srcSet to serve appropriate version

## Testing

After adding images, verify:
- Images display correctly at all breakpoints (mobile, tablet, desktop)
- Loading performance is good (< 2s on 3G)
- Fallback to HEX colors works if image is missing
- Visual consistency across all 6 swatches
- Clean, polished look with no grain or texture
