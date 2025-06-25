
import React from "react";
import { Heart, Award, Shield, Users, Target, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PhilosophyPage() {
  const principles = [
    {
      icon: Heart,
      title: "Health First Philosophy",
      description: "Every breeding decision begins with comprehensive health testing. We believe that a healthy foundation is the greatest gift we can give to our puppies and their families.",
      details: [
        "Complete OFA health clearances for hips, elbows, and heart",
        "Genetic testing through Embark for 200+ health conditions",
        "Annual eye exams by board-certified ophthalmologists",
        "Transparent sharing of all health records and test results"
      ]
    },
    {
      icon: Users,
      title: "Temperament Excellence",
      description: "We carefully select breeding pairs not just for physical traits, but for their exceptional temperaments that make wonderful family companions.",
      details: [
        "Extensive temperament testing using proven methodologies",
        "Focus on dogs with calm, confident, and friendly personalities",
        "Early neurological stimulation for optimal brain development",
        "Comprehensive socialization program from birth to placement"
      ]
    },
    {
      icon: Award,
      title: "Conformation to Standard",
      description: "Our breeding program honors the breed standard while prioritizing health and temperament, producing dogs that are both beautiful and functional.",
      details: [
        "Champion bloodlines with proven genetics",
        "Active participation in conformation shows and breed events",
        "Commitment to preserving breed type and characteristics",
        "Collaboration with respected mentors and breed experts"
      ]
    },
    {
      icon: Shield,
      title: "Lifetime Commitment",
      description: "Our relationship with you doesn't end when you take your puppy home. We're here to support you throughout your dog's entire life.",
      details: [
        "Comprehensive 2-year health guarantee",
        "Lifetime breeder support and guidance",
        "Take-back policy - we'll always welcome our dogs home",
        "Ongoing education and training resources"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-stone-50 to-stone-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-stone-800 mb-6">
            Our Breeding Philosophy
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl mx-auto">
            At Golden Paws Doodles, we believe that exceptional dogs are created at the intersection 
            of careful planning, unwavering commitment to health, and a deep understanding 
            of what makes the perfect family companion.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-8 text-center">
              <Target className="w-12 h-12 text-amber-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-stone-800 mb-4">Our Mission</h2>
              <p className="text-lg text-stone-700 leading-relaxed">
                "To produce healthy, well-socialized puppies with exceptional temperaments 
                that will bring joy, companionship, and love to their families for a lifetime, 
                while advancing and preserving the breed we are passionate about."
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-800 mb-6">
              Our Core Principles
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              These fundamental beliefs guide every decision we make in our breeding program, 
              from selecting our breeding dogs to placing our puppies in their forever homes.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {principles.map((principle, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                        <principle.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-stone-800 mb-3">
                        {principle.title}
                      </h3>
                      <p className="text-stone-600 mb-6 leading-relaxed">
                        {principle.description}
                      </p>
                      
                      <ul className="space-y-2">
                        {principle.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-stone-700 text-sm">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Sparkles className="w-12 h-12 text-amber-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              Our Commitment to Excellence
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-stone-800 mb-3">To Our Dogs</h3>
                <p className="text-stone-600">
                  Every dog in our program lives as a beloved family member first. They receive 
                  the best veterinary care, premium nutrition, daily exercise, and endless love. 
                  Our dogs are our partners, not just breeding stock.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-stone-800 mb-3">To Our Puppies</h3>
                <p className="text-stone-600">
                  From the moment they're born, our puppies receive individualized attention, 
                  early neurological stimulation, and comprehensive socialization. Each puppy 
                  is prepared for success in their new family.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-stone-800 mb-3">To Our Families</h3>
                <p className="text-stone-600">
                  We carefully match each puppy with the perfect family and provide ongoing 
                  support throughout the dog's life. Your success and happiness with your 
                  new family member is our ultimate goal.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-stone-800 mb-3">To The Breed</h3>
                <p className="text-stone-600">
                  We're dedicated to preserving and improving the breed we love through 
                  ethical breeding practices, education, and active participation in the 
                  breed community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-stone-800 mb-8">
            Why Our Philosophy Matters
          </h2>
          <div className="bg-amber-50 p-8 rounded-2xl border border-amber-200">
            <p className="text-lg text-stone-700 leading-relaxed">
              When you choose a Golden Paws puppy, you're not just getting a dog – you're 
              joining a family of people who believe that the bond between humans and dogs 
              is sacred. Our philosophy ensures that every puppy we produce has the best 
              possible start in life and the greatest chance of becoming the perfect 
              companion you've always dreamed of.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
