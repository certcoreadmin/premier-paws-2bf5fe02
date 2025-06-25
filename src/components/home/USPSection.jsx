import React from "react";
import { CheckCircle } from "lucide-react";

export default function USPSection() {
  const benefits = [
    "Champion bloodlines with proven genetics",
    "Comprehensive health testing & 2-year guarantee", 
    "Early neurological stimulation program",
    "Extensive socialization with children & other pets",
    "Lifetime breeder support & guidance",
    "Professional puppy training foundation"
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] bg-stone-200 rounded-2xl overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1554692918-08fa0cb0a4c7?w=600&h=450&fit=crop&auto=format"
                alt="Adorable puppies playing together"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full opacity-20"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full opacity-15"></div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-stone-800 mb-6">
                What Makes Our Program
                <span className="block text-emerald-600">Truly Exceptional</span>
              </h2>
              <p className="text-xl text-stone-600 leading-relaxed">
                We don't just breed dogs – we create lifelong family members through a 
                meticulous process that prioritizes health, temperament, and the perfect 
                match between puppy and family.
              </p>
            </div>

            <div className="grid gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-6 h-6 bg-emberald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-stone-700 font-medium">{benefit}</p>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
              <h3 className="font-semibold text-emerald-800 mb-2">Our Promise to You</h3>
              <p className="text-emerald-700">
                Every puppy comes with a comprehensive health guarantee, lifetime support, 
                and our commitment to being there for every milestone in your dog's life.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}