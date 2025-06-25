import React, { useState, useEffect } from "react";
import { GlobalSettings } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, Heart, Shield, Award } from "lucide-react";

export default function HeroSection() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settingsList = await GlobalSettings.list();
      if (settingsList.length > 0) {
        setSettings(settingsList[0]);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Use optimized image URL - bypass API when possible
  const getOptimizedImageUrl = (customUrl) => {
    if (!customUrl) {
      return "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=1000&fit=crop&auto=format&q=85";
    }
    
    // If it's a base44 API URL, try to optimize it
    if (customUrl.includes('base44.app/api')) {
      return customUrl;
    }
    
    // For other URLs, add optimization parameters
    if (customUrl.includes('unsplash.com')) {
      return `${customUrl}&w=800&h=1000&fit=crop&auto=format&q=85`;
    }
    
    return customUrl;
  };

  const heroImageUrl = getOptimizedImageUrl(settings?.main_hero_image_url);
  const heroHeading = settings?.hero_heading || "Your Perfect Family Goldendoodle Starts Here";
  const heroSubheading = settings?.hero_subheading || "Breeding health-tested, family-socialized Goldendoodles with the perfect blend of intelligence and loving companionship.";

  return (
    <section className="relative min-h-[70vh] lg:min-h-[80vh] flex items-center bg-gradient-to-br from-amber-50 via-stone-50 to-cream-50">
      {/* Simplified background - no blur effects that cause repaints */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 via-transparent to-stone-100/30"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-stone-800 leading-tight">
                <span className="block">Your Perfect</span>
                <span className="block text-amber-600">Family Goldendoodle</span>
                <span className="block">Starts Here</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-stone-600 max-w-lg leading-relaxed">
                {heroSubheading}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Why Families Choose Us</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-amber-600" />
                  <span className="text-stone-700 font-medium">GANA Blue Ribbon Breeder</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-amber-600" />
                  <span className="text-stone-700 font-medium">AKC BRED with H.E.A.R.T.</span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-amber-600" />
                  <span className="text-stone-700 font-medium">Home-Raised & Socialized</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl("Puppies")}>
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white gap-2 w-full sm:w-auto">
                  Available Puppies
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl("Parents")}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-amber-600 text-amber-600 hover:bg-amber-50">
                  Meet Our Dogs
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image - Optimized for LCP */}
          <div className="relative order-first lg:order-last">
            <div 
              className="aspect-[4/5] bg-stone-200 rounded-3xl overflow-hidden shadow-2xl"
              style={{ width: '100%', height: 'auto' }}
            >
              {loading ? (
                <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 animate-pulse"></div>
              ) : (
                <img 
                  src={heroImageUrl}
                  alt="Beautiful Golden Retriever mother with her adorable puppies playing in a sunny home setting"
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width="800"
                  height="1000"
                  style={{ 
                    aspectRatio: '4/5',
                    objectFit: 'cover'
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}