import React from "react";
import { Award, Shield, Heart, CheckCircle } from "lucide-react";

export default function TrustBar() {
  const credentials = [
    {
      icon: Award,
      title: "GANA Blue Ribbon Breeder",
      description: "Goldendoodle Association of North America"
    },
    {
      icon: Shield,
      title: "AKC BRED with H.E.A.R.T.",
      description: "American Kennel Club Program"
    },
    {
      icon: CheckCircle,
      title: "Good Dog Excellent",
      description: "Top-rated breeder status"
    },
    {
      icon: Heart,
      title: "Embark Health Tested",
      description: "Comprehensive genetic screening"
    }
  ];

  return (
    <section className="py-12 bg-white border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h3 className="text-lg font-semibold text-stone-800 mb-2">
            Trusted & Recognized
          </h3>
          <p className="text-stone-600">
            Our commitment to excellence is recognized by leading organizations
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {credentials.map((credential, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <credential.icon className="w-8 h-8 text-amber-600" />
              </div>
              <h4 className="font-semibold text-stone-800 mb-1">{credential.title}</h4>
              <p className="text-sm text-stone-600">{credential.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}