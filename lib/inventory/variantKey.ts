/**
 * Inventory variant keys mirror catalog metal + ring size selections.
 * Example: "18k Yellow Gold" + "G 1/2" → "18k-yellow-gold-g-1/2"
 */
export function metalToVariantSegment(metal: string): string {
  return metal.trim().toLowerCase().replace(/\s+/g, '-');
}

export function sizeToVariantSegment(size: string): string {
  return size.trim().toLowerCase().replace(/\s+/g, '-');
}

export function buildVariantKey(metal: string, size: string): string {
  return `${metalToVariantSegment(metal)}-${sizeToVariantSegment(size)}`;
}

export function buildVariantKeyFromConfiguration(configuration: {
  metal?: string;
  size?: string;
}): string | null {
  if (!configuration.metal) return null;
  const size = configuration.size?.trim() ? configuration.size : 'one-size';
  return buildVariantKey(configuration.metal, size);
}
