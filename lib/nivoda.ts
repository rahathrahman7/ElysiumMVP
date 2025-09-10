// Nivoda API Integration
// GraphQL client for diamond sourcing

export interface NivodaDiamond {
  id: string;
  certificate: {
    id: string;
    certNumber: string;
    carats: number;
    color: string;
    clarity: string;
    cut: string;
    polish: string;
    symmetry: string;
    lab: string;
    shape: string;
  };
  price: {
    total: number;
    currency: string;
  };
  measurements: {
    length: number;
    width: number;
    depth: number;
    table: number;
    crown: number;
    pavilion: number;
  };
  fluorescence: string;
  images?: string[];
  videos?: string[];
  availability: {
    isAvailable: boolean;
    location: string;
  };
}

export interface DiamondSearchFilters {
  shapes?: string[];
  caratFrom?: number;
  caratTo?: number;
  colors?: string[];
  clarities?: string[];
  cuts?: string[];
  priceFrom?: number;
  priceTo?: number;
  labs?: string[];
  fluorescence?: string[];
  availability?: string[];
}

class NivodaAPI {
  private endpoint: string;
  private credentials: { username: string; password: string } | null = null;

  constructor() {
    // Use production endpoint
    this.endpoint = 'https://integrations.nivoda.net/api/diamonds';
  }

  setCredentials(username: string, password: string) {
    this.credentials = { username, password };
  }

  private getAuthHeader() {
    if (!this.credentials) {
      throw new Error('Nivoda credentials not set');
    }
    
    const encoded = Buffer.from(`${this.credentials.username}:${this.credentials.password}`).toString('base64');
    return `Basic ${encoded}`;
  }

  async searchDiamonds(filters: DiamondSearchFilters = {}): Promise<NivodaDiamond[]> {
    const query = this.buildSearchQuery(filters);
    
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.getAuthHeader(),
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Nivoda API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      return data.data.diamonds || [];
    } catch (error) {
      console.error('Error fetching diamonds from Nivoda:', error);
      throw error;
    }
  }

  private buildSearchQuery(filters: DiamondSearchFilters): string {
    const filterArgs = this.buildFilterArguments(filters);
    
    return `
      query SearchDiamonds {
        diamonds(${filterArgs}) {
          id
          certificate {
            id
            certNumber
            carats
            color
            clarity
            cut
            polish
            symmetry
            lab
            shape
          }
          price {
            total
            currency
          }
          measurements {
            length
            width
            depth
            table
            crown
            pavilion
          }
          fluorescence
          images
          videos
          availability {
            isAvailable
            location
          }
        }
      }
    `;
  }

  private buildFilterArguments(filters: DiamondSearchFilters): string {
    const args: string[] = [];
    
    if (filters.shapes?.length) {
      args.push(`shapes: [${filters.shapes.map(s => `"${s}"`).join(', ')}]`);
    }
    
    if (filters.caratFrom !== undefined) {
      args.push(`carat_from: ${filters.caratFrom}`);
    }
    
    if (filters.caratTo !== undefined) {
      args.push(`carat_to: ${filters.caratTo}`);
    }
    
    if (filters.colors?.length) {
      args.push(`colors: [${filters.colors.map(c => `"${c}"`).join(', ')}]`);
    }
    
    if (filters.clarities?.length) {
      args.push(`clarities: [${filters.clarities.map(c => `"${c}"`).join(', ')}]`);
    }
    
    if (filters.cuts?.length) {
      args.push(`cuts: [${filters.cuts.map(c => `"${c}"`).join(', ')}]`);
    }
    
    if (filters.priceFrom !== undefined) {
      args.push(`price_from: ${filters.priceFrom}`);
    }
    
    if (filters.priceTo !== undefined) {
      args.push(`price_to: ${filters.priceTo}`);
    }
    
    if (filters.labs?.length) {
      args.push(`labs: [${filters.labs.map(l => `"${l}"`).join(', ')}]`);
    }
    
    if (filters.fluorescence?.length) {
      args.push(`fluorescence: [${filters.fluorescence.map(f => `"${f}"`).join(', ')}]`);
    }
    
    if (filters.availability?.length) {
      args.push(`availability: [${filters.availability.map(a => `"${a}"`).join(', ')}]`);
    }
    
    // Add pagination
    args.push('first: 50'); // Limit to 50 results initially
    
    return args.join(', ');
  }

  async getDiamondById(id: string): Promise<NivodaDiamond | null> {
    const query = `
      query GetDiamond {
        diamond(id: "${id}") {
          id
          certificate {
            id
            certNumber
            carats
            color
            clarity
            cut
            polish
            symmetry
            lab
            shape
          }
          price {
            total
            currency
          }
          measurements {
            length
            width
            depth
            table
            crown
            pavilion
          }
          fluorescence
          images
          videos
          availability {
            isAvailable
            location
          }
        }
      }
    `;

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.getAuthHeader(),
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Nivoda API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      return data.data.diamond || null;
    } catch (error) {
      console.error('Error fetching diamond from Nivoda:', error);
      throw error;
    }
  }
}

// Singleton instance
export const nivodaAPI = new NivodaAPI();

// Helper functions for Elysium integration
export function getDiamondsForRing(ringShape: string, caratRange: [number, number] = [0.5, 3.0]) {
  const shapeMap: Record<string, string[]> = {
    'round': ['ROUND'],
    'oval': ['OVAL'],
    'radiant': ['RADIANT'],
    'pear': ['PEAR'],
    'toi-et-moi': ['ROUND', 'PEAR'], // For Vow & Veil style rings
  };

  return nivodaAPI.searchDiamonds({
    shapes: shapeMap[ringShape] || ['ROUND'],
    caratFrom: caratRange[0],
    caratTo: caratRange[1],
    colors: ['D', 'E', 'F'], // Premium colors matching Elysium quality
    clarities: ['IF', 'VVS1', 'VVS2', 'VS1'], // High clarity grades
    labs: ['GIA', 'IGI'], // Trusted certification labs
  });
}

export function formatDiamondPrice(diamond: NivodaDiamond): string {
  if (diamond.price.currency === 'USD') {
    // Convert USD to GBP (approximate rate, should be updated with real rates)
    const gbpPrice = diamond.price.total * 0.79;
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0,
    }).format(gbpPrice);
  }
  
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: diamond.price.currency,
    maximumFractionDigits: 0,
  }).format(diamond.price.total);
}

export function getDiamondDescription(diamond: NivodaDiamond): string {
  const { certificate } = diamond;
  return `${certificate.carats}ct ${certificate.color} ${certificate.clarity} ${certificate.cut} ${certificate.shape} - ${certificate.lab} Certified`;
}