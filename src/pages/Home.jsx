import React, { Suspense, lazy } from "react";
import HeroSection from "../components/home/HeroSection";
import TrustBar from "../components/home/TrustBar";

// Lazy load below-the-fold components to reduce initial JS bundle
const TestimonialsSection = lazy(() => import("../components/home/TestimonialsSection"));
const NewsletterSignup = lazy(() => import("../components/home/NewsletterSignup"));

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Above-the-fold content - loads immediately */}
      <HeroSection />
      
      <TrustBar />
      
      {/* Why Choose Us Section - Simplified */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-800 mb-6">
              The Golden Paws Difference
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              Our program is built on a foundation of health, temperament, and an unwavering commitment to raising the perfect family companion.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                emoji: "🛡️",
                title: "Health-Tested Parents",
                description: "Comprehensive genetic and physical health testing for all our parent dogs to ensure healthy puppies."
              },
              {
                emoji: "❤️", 
                title: "Family Socialization",
                description: "Our puppies are raised in our home, following a curriculum of socialization for confident, well-adjusted dogs."
              },
              {
                emoji: "🏆",
                title: "Exceptional Temperament", 
                description: "We select our breeding dogs for their gentle, intelligent, and loving temperaments, perfect for family life."
              },
              {
                emoji: "👥",
                title: "Lifetime Support",
                description: "We provide ongoing guidance and support for our puppy families throughout the life of their dog."
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl" role="img" aria-label={feature.title}>{feature.emoji}</span>
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-3">{feature.title}</h3>
                <p className="text-stone-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Lazy-loaded sections */}
      <Suspense fallback={<div className="h-96 bg-gradient-to-br from-emerald-50 to-stone-50" />}>
        <TestimonialsSection />
      </Suspense>

      <Suspense fallback={<div className="h-64 bg-emerald-600" />}>
        <NewsletterSignup />
      </Suspense>
    </div>
  );
}