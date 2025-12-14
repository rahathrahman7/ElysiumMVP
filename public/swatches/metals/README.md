# Metal Swatch Images

This directory contains realistic metal swatch images for the product configurator.

## Required Images

You need to create **6 photorealistic metal swatch images**:

1. `18k-yellow-gold.png` - 18k Yellow Gold texture
2. `18k-rose-gold.png` - 18k Rose Gold texture
3. `18k-white-gold.png` - 18k White Gold texture
4. `platinum.png` - Platinum texture
5. `two-tone-rose-platinum.png` - Two-Tone Rose/Platinum
6. `two-tone-yellow-platinum.png` - Two-Tone Yellow/Platinum

## Image Specifications

- **Dimensions:** 192 x 192 pixels
- **Format:** PNG with transparency support
- **Quality:** High resolution, photorealistic metal textures
- **Lighting:** Consistent lighting across all swatches
- **Background:** Transparent or subtle neutral background
- **File size:** Optimize for web (aim for < 50KB per image)

## Visual Style Guidelines

- Show actual metal texture/grain for realism
- Include subtle highlights and shadows for depth
- Maintain ELYSIUM luxury aesthetic (professional, premium)
- Ensure clear visual differentiation between similar gold tones
- Consistent perspective and angle across all swatches

## How to Create These Images

### Option 1: AI-Generated (Recommended)
Use AI tools like Midjourney or DALL-E with prompts such as:

```
"Professional product photography, 18k yellow gold metal surface texture,
macro shot, luxury jewelry material, even lighting, high quality, realistic,
isolated on transparent background, 192x192px"
```

Post-process for consistency (lighting, contrast, cropping).

### Option 2: Stock Photography
Purchase from Adobe Stock, Shutterstock, or similar.
Search terms: "gold texture", "platinum metal surface", "rose gold material"

### Option 3: Professional Photography
Commission photography of actual metal samples (highest quality but most expensive).

## After Creating Images

Once you have the images:

1. Place all 6 PNG files in this directory (`public/swatches/metals/`)
2. The MetalSwatch component will automatically display them
3. If an image fails to load, the component falls back to the HEX color circle

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
