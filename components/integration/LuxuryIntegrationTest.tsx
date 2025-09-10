"use client";

/**
 * Integration Test Component for ELYSIUM Luxury Features
 * 
 * This component demonstrates the integration between:
 * 1. Premium Product Configurator
 * 2. Luxury Concierge Chat Widget
 * 3. Enhanced AI-powered consultation features
 * 4. Luxury design system
 */

import { useState } from 'react';
import { LuxuryProductConfigurator } from '../configurator/LuxuryProductConfigurator';
import LuxuryConciergeChat from '../concierge/LuxuryConciergeChat';

// Mock product data for testing
const mockProduct = {
  id: 'test-ring',
  title: 'Eternal Solitaire',
  basePriceGBP: 5000,
  metals: [
    { name: '18k Yellow Gold', priceDeltaGBP: 0, hex: '#FFD700' },
    { name: '18k White Gold', priceDeltaGBP: 200, hex: '#F5F5F5' },
    { name: 'Platinum', priceDeltaGBP: 800, hex: '#E5E4E2' }
  ],
  sizes: ['H', 'I', 'J', 'K', 'L', 'M', 'N'],
  engravingFeeGBP: 150,
  images: ['/images/test-ring.jpg']
};

export default function LuxuryIntegrationTest() {
  const [showConfigurator, setShowConfigurator] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [configuration, setConfiguration] = useState({
    metal: mockProduct.metals[0],
    size: 'L',
    engraving: ''
  });

  const handleConfigurationChange = (field: string, value: any) => {
    setConfiguration(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const totalPrice = mockProduct.basePriceGBP + 
    (configuration.metal?.priceDeltaGBP || 0) +
    (configuration.engraving ? mockProduct.engravingFeeGBP : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-elysium-ivory via-elysium-pearl to-elysium-champagne">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-elysium-whisper">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="font-serif text-4xl text-elysium-charcoal text-center mb-4">
            ELYSIUM Integration Test
          </h1>
          <p className="text-center text-elysium-charcoal/70 max-w-2xl mx-auto">
            Experience our premium product configurator and AI-powered concierge services
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Control Panel */}
          <div className="space-y-8">
            <div className="luxury-glass p-8 rounded-2xl">
              <h2 className="font-serif text-2xl text-elysium-charcoal mb-6">
                Feature Controls
              </h2>
              
              <div className="space-y-4">
                <button
                  onClick={() => setShowConfigurator(!showConfigurator)}
                  className={`w-full px-6 py-4 rounded-xl font-medium transition-all duration-300 ${
                    showConfigurator
                      ? 'bg-elysium-gold text-white shadow-lg'
                      : 'bg-white/50 text-elysium-charcoal hover:bg-white/80'
                  }`}
                >
                  {showConfigurator ? 'Hide' : 'Show'} Product Configurator
                </button>
                
                <button
                  onClick={() => setShowChat(!showChat)}
                  className={`w-full px-6 py-4 rounded-xl font-medium transition-all duration-300 ${
                    showChat
                      ? 'bg-elysium-gold text-white shadow-lg'
                      : 'bg-white/50 text-elysium-charcoal hover:bg-white/80'
                  }`}
                >
                  {showChat ? 'Hide' : 'Show'} Concierge Chat
                </button>
              </div>
            </div>

            {/* Configuration Summary */}
            <div className="luxury-glass p-8 rounded-2xl">
              <h3 className="font-serif text-xl text-elysium-charcoal mb-6">
                Current Configuration
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-elysium-charcoal/70">Metal:</span>
                  <span className="font-medium text-elysium-charcoal">
                    {configuration.metal?.name || 'None selected'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-elysium-charcoal/70">Size:</span>
                  <span className="font-medium text-elysium-charcoal">
                    {configuration.size}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-elysium-charcoal/70">Engraving:</span>
                  <span className="font-medium text-elysium-charcoal">
                    {configuration.engraving || 'None'}
                  </span>
                </div>
                
                <div className="pt-4 border-t border-elysium-whisper">
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-lg text-elysium-charcoal">Total:</span>
                    <span className="font-serif text-2xl text-elysium-gold">
                      £{totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Configurator Display */}
          <div className="space-y-8">
            {showConfigurator && (
              <div className="luxury-glass p-8 rounded-2xl">
                <h3 className="font-serif text-xl text-elysium-charcoal mb-6">
                  Premium Configurator
                </h3>
                
                <LuxuryProductConfigurator
                  product={mockProduct}
                  selectedMetal={configuration.metal}
                  selectedSize={configuration.size}
                  engravingText={configuration.engraving}
                  onMetalChange={(metal) => handleConfigurationChange('metal', metal)}
                  onSizeChange={(size) => handleConfigurationChange('size', size)}
                  onEngravingChange={(engraving) => handleConfigurationChange('engraving', engraving)}
                  totalPrice={totalPrice}
                />
              </div>
            )}

            {/* Integration Features */}
            <div className="luxury-glass p-8 rounded-2xl">
              <h3 className="font-serif text-xl text-elysium-charcoal mb-6">
                Integration Features
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-800">Luxury Design System Active</span>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-800">AI-Powered Responses Ready</span>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-purple-800">Real-time Configuration Sync</span>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-amber-800">Consultation Features Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Concierge Chat */}
      {showChat && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <LuxuryConciergeChat isOpen={true} onClose={() => setShowChat(false)} />
          </div>
        </div>
      )}
    </div>
  );
}