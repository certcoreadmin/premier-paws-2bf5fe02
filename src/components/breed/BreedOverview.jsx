import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Award, Users, Activity } from "lucide-react";

export default function BreedOverview() {
  const breedStats = [
    { label: "Size", value: "Large", icon: "📏" },
    { label: "Weight", value: "55-75 lbs", icon: "⚖️" },
    { label: "Lifespan", value: "10-12 years", icon: "🕐" },
    { label: "Energy Level", value: "High", icon: "⚡" },
    { label: "Good with Kids", value: "Excellent", icon: "👶" },
    { label: "Trainability", value: "High", icon: "🎓" }
  ];

  return (
    <div className="space-y-12">
      {/* Breed Hero */}
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-stone-800 mb-4">
              Meet the Golden Retriever
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              Golden Retrievers are medium to large-sized dogs known for their friendly, 
              intelligent, and devoted nature. Originally bred in Scotland in the 1860s 
              for retrieving waterfowl, they've become one of America's most popular 
              family companions.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {breedStats.map((stat, index) => (
              <div key={index} className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{stat.icon}</span>
                  <span className="text-sm font-medium text-stone-600">{stat.label}</span>
                </div>
                <div className="font-semibold text-stone-800">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/3] bg-stone-200 rounded-2xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=450&fit=crop&auto=format"
              alt="Beautiful Golden Retriever"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Breed History */}
      <Card>
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-3">
            <Award className="w-6 h-6 text-amber-600" />
            Breed History & Purpose
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-stone-800 mb-3">Origins</h4>
              <p className="text-stone-600 leading-relaxed mb-4">
                The Golden Retriever was developed in the Scottish Highlands during the 1860s 
                by Lord Tweedmouth. He wanted to create the ideal gundog that could retrieve 
                game from both water and land in the challenging Scottish terrain.
              </p>
              <p className="text-stone-600 leading-relaxed">
                The breed was created by crossing the now-extinct Yellow Retriever with the 
                Tweed Water Spaniel, along with bloodline contributions from Irish Setters 
                and Bloodhounds.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-stone-800 mb-3">Modern Purpose</h4>
              <p className="text-stone-600 leading-relaxed mb-4">
                Today's Golden Retrievers excel in many roles beyond hunting. They're 
                outstanding family companions, therapy dogs, service dogs, and competitors 
                in dog sports like obedience, agility, and field trials.
              </p>
              <p className="text-stone-600 leading-relaxed">
                Their intelligence, trainability, and gentle nature make them one of the 
                most versatile and beloved breeds in the world.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Temperament */}
      <Card>
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-3">
            <Heart className="w-6 h-6 text-pink-600" />
            Temperament & Personality
          </h3>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h4 className="font-semibold text-stone-800 mb-2">Friendly & Outgoing</h4>
              <p className="text-stone-600 text-sm">
                Golden Retrievers are naturally social and love meeting new people and animals. 
                They rarely show aggression and are typically welcoming to strangers.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-stone-800 mb-2">Family Oriented</h4>
              <p className="text-stone-600 text-sm">
                They thrive on family interaction and don't do well when left alone for long 
                periods. They want to be part of all family activities.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-stone-800 mb-2">Eager to Please</h4>
              <p className="text-stone-600 text-sm">
                Their intelligence combined with their desire to please makes them highly 
                trainable and responsive to positive reinforcement methods.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}