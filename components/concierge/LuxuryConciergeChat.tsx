"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

interface ChatMessage {
  id: string;
  type: 'user' | 'concierge' | 'system';
  message: string;
  timestamp: Date;
  avatar?: string;
  expertise?: string;
  suggestions?: string[];
}

interface ConciergeExpert {
  id: string;
  name: string;
  title: string;
  avatar: string;
  expertise: string[];
  available: boolean;
  responseTime: string;
}

// Mock experts - replace with your actual expert data
const conciergeExperts: ConciergeExpert[] = [
  {
    id: 'sophia',
    name: 'Sophia Chen',
    title: 'Senior Jewelry Consultant',
    avatar: '/avatars/sophia.jpg',
    expertise: ['Engagement Rings', 'Custom Design', 'Diamond Selection'],
    available: true,
    responseTime: '< 2 min'
  },
  {
    id: 'james',
    name: 'James Morrison',
    title: 'Master Craftsman',
    avatar: '/avatars/james.jpg',
    expertise: ['Bespoke Jewelry', 'Restoration', 'Traditional Techniques'],
    available: true,
    responseTime: '< 5 min'
  },
  {
    id: 'elena',
    name: 'Elena Rodriguez',
    title: 'Gemstone Specialist',
    avatar: '/avatars/elena.jpg',
    expertise: ['Precious Stones', 'Certification', 'Investment Pieces'],
    available: false,
    responseTime: '< 30 min'
  }
];

const quickActions = [
  { id: 'sizing', label: 'Ring Sizing Help', icon: '📏' },
  { id: 'appointment', label: 'Book Consultation', icon: '📅' },
  { id: 'custom', label: 'Custom Design', icon: '✨' },
  { id: 'care', label: 'Jewelry Care', icon: '💎' },
  { id: 'warranty', label: 'Warranty Info', icon: '🛡️' },
  { id: 'shipping', label: 'Delivery Options', icon: '🚚' }
];

export default function LuxuryConciergeChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<ConciergeExpert | null>(null);
  const [showExperts, setShowExperts] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '1',
          type: 'system',
          message: 'Welcome to ELYSIUM Concierge Service',
          timestamp: new Date(),
        },
        {
          id: '2',
          type: 'concierge',
          message: "Hello! I'm here to help you find the perfect piece of jewelry. Whether you're looking for an engagement ring, need sizing assistance, or want to explore our bespoke services, I'm at your service. How may I assist you today?",
          timestamp: new Date(),
          avatar: '/avatars/default-concierge.jpg',
          expertise: 'Luxury Jewelry Consultant',
          suggestions: ['Ring sizing help', 'Browse engagement rings', 'Book consultation', 'Custom design inquiry']
        }
      ]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response with enhanced consultation features
    setTimeout(() => {
      const aiResponseData = generateAIResponse(inputMessage);
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'concierge',
        message: aiResponseData.message,
        timestamp: new Date(),
        avatar: selectedExpert?.avatar || '/avatars/default-concierge.jpg',
        expertise: selectedExpert?.title || 'Luxury Jewelry Consultant',
        suggestions: aiResponseData.suggestions || generateSuggestions(inputMessage)
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      
      // If AI suggests consultation, add consultation booking prompt
      if (aiResponseData.requiresConsultation) {
        setTimeout(() => {
          const consultationPrompt: ChatMessage = {
            id: (Date.now() + 2).toString(),
            type: 'system',
            message: "Would you like me to arrange a personal consultation with one of our specialists? I can schedule a private appointment at our London atelier or arrange a virtual consultation.",
            timestamp: new Date(),
            suggestions: ["Book in-person consultation", "Schedule virtual meeting", "Continue chat"]
          };
          setMessages(prev => [...prev, consultationPrompt]);
        }, 2000);
      }
    }, 1500);
  };

  // Enhanced AI-powered response generation with consultation features
  const generateAIResponse = (userMessage: string): { message: string; suggestions?: string[]; requiresConsultation?: boolean } => {
    const responses = {
      sizing: {
        messages: [
          "I'd be happy to help with ring sizing! We offer a complimentary ring sizer kit that we can mail to you, plus we provide free resizing within 90 days of purchase. Would you like me to send you our digital size guide or arrange for a physical sizer kit?",
          "Perfect sizing is crucial for comfort and security. Our expert fitting service includes home visits for high-value pieces. Shall I arrange a personal fitting consultation?"
        ],
        suggestions: ["Request sizing kit", "Book fitting appointment", "Learn about resizing policy"],
        consultation: false
      },
      engagement: {
        messages: [
          "Congratulations on this exciting milestone! Our engagement ring collection features ethically sourced diamonds and can be fully customized. Would you like to explore our signature collections, or are you interested in creating a completely bespoke piece?",
          "What a beautiful moment to celebrate! I can arrange a private diamond viewing where you'll see our finest stones and discuss creating something uniquely meaningful."
        ],
        suggestions: ["View engagement collection", "Diamond consultation", "Bespoke design", "Proposal planning"],
        consultation: true
      },
      bespoke: {
        messages: [
          "Our bespoke service allows you to create something truly unique. We start with a consultation to understand your vision, then our master craftsmen bring it to life using traditional techniques and the finest materials.",
          "Custom design is where true artistry begins. I can connect you with our head designer who will guide you through the creative process from concept to completion."
        ],
        suggestions: ["Design consultation", "View portfolio", "Timeline details", "Investment guidance"],
        consultation: true
      },
      pricing: {
        messages: [
          "Our pieces range from £2,000 to £50,000+, depending on materials, design complexity, and gemstone selection. We also offer flexible payment options including 0% APR financing for qualified customers.",
          "Investment in fine jewelry should reflect both beauty and value. I can provide detailed pricing based on your preferences and arrange flexible payment solutions."
        ],
        suggestions: ["Request price guide", "Financing options", "Investment advice", "Value assessment"],
        consultation: false
      },
      care: {
        messages: [
          "Proper care ensures your jewelry maintains its brilliance for generations. We provide comprehensive care guides and offer professional cleaning and inspection services.",
          "Our lifetime care program includes annual inspections, professional cleaning, and maintenance. Each piece comes with detailed care instructions and our expert support."
        ],
        suggestions: ["Download care guide", "Schedule cleaning", "Repair services", "Insurance advice"],
        consultation: false
      },
      investment: {
        messages: [
          "Our pieces are crafted as heirloom investments. Each comes with detailed provenance documentation and our heritage guarantee for value retention.",
          "Fine jewelry from ELYSIUM represents both emotional and financial investment. I can provide detailed information about our authentication and valuation services."
        ],
        suggestions: ["Investment guide", "Authentication process", "Value assessment", "Heritage documentation"],
        consultation: true
      }
    };

    const message = userMessage.toLowerCase();
    
    let responseCategory = 'general';
    
    if (message.includes('ring size') || message.includes('size') || message.includes('sizing')) {
      responseCategory = 'sizing';
    } else if (message.includes('engagement') || message.includes('propose') || message.includes('wedding')) {
      responseCategory = 'engagement';
    } else if (message.includes('custom') || message.includes('bespoke') || message.includes('design')) {
      responseCategory = 'bespoke';
    } else if (message.includes('price') || message.includes('cost') || message.includes('budget')) {
      responseCategory = 'pricing';
    } else if (message.includes('care') || message.includes('clean') || message.includes('maintain')) {
      responseCategory = 'care';
    } else if (message.includes('invest') || message.includes('value') || message.includes('heirloom')) {
      responseCategory = 'investment';
    }
    
    if (responseCategory !== 'general' && responses[responseCategory as keyof typeof responses]) {
      const category = responses[responseCategory as keyof typeof responses];
      return {
        message: category.messages[Math.floor(Math.random() * category.messages.length)],
        suggestions: category.suggestions,
        requiresConsultation: category.consultation
      };
    }
    
    return {
      message: "Thank you for your question. I'd love to provide you with detailed information. Could you tell me a bit more about what you're looking for? Are you interested in engagement rings, fine jewelry, or perhaps our bespoke services?",
      suggestions: ["Browse collections", "Book consultation", "Expert guidance", "Custom design"],
      requiresConsultation: true
    };
  };

  const generateSuggestions = (userMessage: string): string[] => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('ring size') || message.includes('sizing')) {
      return ['Request size guide', 'Book fitting appointment', 'Learn about resizing policy'];
    }
    
    if (message.includes('engagement')) {
      return ['View engagement rings', 'Diamond education', 'Book consultation', 'Custom design'];
    }
    
    if (message.includes('custom') || message.includes('bespoke')) {
      return ['Design consultation', 'View portfolio', 'Pricing information', 'Timeline details'];
    }
    
    return ['Browse collections', 'Book appointment', 'Sizing help', 'Custom design'];
  };

  const handleQuickAction = (action: string) => {
    const actionMessages: { [key: string]: string } = {
      sizing: "I'd like help with ring sizing",
      appointment: "I'd like to book a consultation",
      custom: "I'm interested in custom design",
      care: "How do I care for my jewelry?",
      warranty: "Tell me about your warranty",
      shipping: "What are the delivery options?"
    };
    
    setInputMessage(actionMessages[action] || '');
  };

  const handleExpertSelection = (expert: ConciergeExpert) => {
    setSelectedExpert(expert);
    setShowExperts(false);
    
    const expertMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'concierge',
      message: `Hello! I'm ${expert.name}, your ${expert.title}. I specialize in ${expert.expertise.join(', ')}. I'm here to provide you with expert guidance and personalized service. How can I assist you today?`,
      timestamp: new Date(),
      avatar: expert.avatar,
      expertise: expert.title,
    };
    
    setMessages(prev => [...prev, expertMessage]);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative overflow-hidden luxury-glass luxury-hover-glow bg-gradient-to-r from-elysium-gold to-amber-500 text-white p-4 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div className="text-left">
              <div className="font-medium text-sm">Expert Available</div>
              <div className="text-xs opacity-90">Luxury Concierge</div>
            </div>
          </div>
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <div className="luxury-glass rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-b from-white/95 to-white/90 backdrop-blur-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-elysium-obsidian to-elysium-charcoal p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src={selectedExpert?.avatar || '/logo/image.png'}
                  alt="Concierge"
                  width={40}
                  height={40}
                  className="rounded-full ring-2 ring-elysium-gold/50"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div>
                <h3 className="text-white font-medium">
                  {selectedExpert?.name || 'ELYSIUM Concierge'}
                </h3>
                <p className="text-white/70 text-sm">
                  {selectedExpert?.title || 'Luxury Jewelry Consultant'} • Online now
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowExperts(!showExperts)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white"
                title="Choose Expert"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Expert Selection Dropdown */}
        {showExperts && (
          <div className="border-b border-elysium-whisper p-4 bg-white/50">
            <h4 className="font-medium text-elysium-obsidian mb-3">Choose Your Expert</h4>
            <div className="space-y-2">
              {conciergeExperts.map((expert) => (
                <button
                  key={expert.id}
                  onClick={() => handleExpertSelection(expert)}
                  disabled={!expert.available}
                  className={clsx(
                    "w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-all duration-300",
                    expert.available
                      ? "hover:bg-elysium-gold/10 hover:scale-[1.02]"
                      : "opacity-50 cursor-not-allowed",
                    selectedExpert?.id === expert.id && "bg-elysium-gold/20 ring-2 ring-elysium-gold/30"
                  )}
                >
                  <div className="relative">
                    <Image
                      src={expert.avatar}
                      alt={expert.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className={clsx(
                      "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
                      expert.available ? "bg-green-400" : "bg-gray-400"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-elysium-obsidian">{expert.name}</div>
                    <div className="text-sm text-elysium-smoke">{expert.title}</div>
                    <div className="text-xs text-elysium-gold">
                      {expert.expertise.slice(0, 2).join(', ')}
                    </div>
                  </div>
                  {expert.available && (
                    <div className="text-xs text-green-600 font-medium">
                      {expert.responseTime}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              {message.type === 'system' && (
                <div className="text-center">
                  <div className="inline-block px-4 py-2 bg-elysium-gold/10 text-elysium-gold text-sm font-medium rounded-full">
                    {message.message}
                  </div>
                </div>
              )}
              
              {message.type === 'user' && (
                <div className="flex justify-end">
                  <div className="max-w-xs bg-gradient-to-r from-elysium-gold to-amber-500 text-white p-3 rounded-2xl rounded-br-md">
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs opacity-80 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )}
              
              {message.type === 'concierge' && (
                <div className="flex space-x-3">
                  <Image
                    src={message.avatar || '/avatars/default-concierge.jpg'}
                    alt="Concierge"
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-elysium-gold/30 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="bg-white border border-elysium-whisper p-3 rounded-2xl rounded-bl-md shadow-sm">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-medium text-elysium-gold">
                          {message.expertise}
                        </span>
                        <div className="w-1 h-1 bg-elysium-smoke rounded-full" />
                        <span className="text-xs text-elysium-smoke">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-elysium-obsidian leading-relaxed">{message.message}</p>
                    </div>
                    
                    {message.suggestions && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => setInputMessage(suggestion)}
                            className="px-3 py-1 bg-elysium-gold/10 text-elysium-gold text-xs rounded-full hover:bg-elysium-gold/20 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex space-x-3">
              <Image
                src={selectedExpert?.avatar || '/avatars/default-concierge.jpg'}
                alt="Concierge"
                width={32}
                height={32}
                className="rounded-full ring-2 ring-elysium-gold/30 flex-shrink-0"
              />
              <div className="bg-white border border-elysium-whisper p-3 rounded-2xl rounded-bl-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-elysium-gold rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-elysium-gold rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-elysium-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-elysium-whisper bg-white/50">
          <div className="grid grid-cols-3 gap-2 mb-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.id)}
                className="flex flex-col items-center space-y-1 p-2 hover:bg-elysium-gold/10 rounded-xl transition-colors text-center"
              >
                <span className="text-lg">{action.icon}</span>
                <span className="text-xs text-elysium-smoke font-medium leading-tight">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-elysium-whisper bg-white">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about rings, sizing, or book a consultation..."
                className="w-full px-4 py-3 border border-elysium-whisper rounded-2xl focus:ring-2 focus:ring-elysium-gold focus:border-transparent text-sm"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className={clsx(
                "p-3 rounded-2xl font-medium transition-all duration-300",
                inputMessage.trim()
                  ? "bg-gradient-to-r from-elysium-gold to-amber-500 text-white hover:scale-105 shadow-lg"
                  : "bg-elysium-smoke/20 text-elysium-smoke/50 cursor-not-allowed"
              )}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}