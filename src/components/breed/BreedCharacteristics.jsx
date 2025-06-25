import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function BreedCharacteristics() {
  const characteristics = [
    { trait: "Energy Level", score: 85, description: "High energy, needs daily exercise" },
    { trait: "Trainability", score: 95, description: "Highly intelligent and eager to learn" },
    { trait: "Good with Kids", score: 98, description: "Excellent with children of all ages" },
    { trait: "Good with Pets", score: 90, description: "Generally good with other animals" },
    { trait: "Grooming Needs", score: 70, description: "Regular brushing required" },
    { trait: "Shedding", score: 85, description: "Heavy shedding, especially seasonally" },
    { trait: "Barking", score: 40, description: "Moderate barking, not excessive" },
    { trait: "Stranger Friendly", score: 95, description: "Welcoming to new people" }
  ];

  const physicalTraits = [
    { category: "Size", details: ["Males: 65-75 lbs, 23-24 inches", "Females: 55-65 lbs, 21.5-22.5 inches"] },
    { category: "Coat", details: ["Double coat with water-repellent outer layer", "Colors: Light to dark golden shades", "Feathering on legs, tail, and chest"] },
    { category: "Build", details: ["Well-balanced, athletic build", "Strong, muscular hindquarters", "Broad head with friendly expression"] },
    { category: "Movement", details: ["Smooth, powerful gait", "Good reach and drive", "Natural retrieving instincts"] }
  ];

  return (
    <div className="space-y-12">
      {/* Characteristic Ratings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-stone-800">
            Breed Characteristics Rating
          </CardTitle>
          <p className="text-stone-600">
            Understanding Golden Retriever traits can help determine if this breed is right for your lifestyle.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {characteristics.map((char, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-stone-800">{char.trait}</span>
                  <Badge variant="outline">{char.score}/100</Badge>
                </div>
                <Progress value={char.score} className="h-2" />
                <p className="text-sm text-stone-600">{char.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exercise & Activity Needs */}
      <Card>
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold text-stone-800 mb-6">Exercise & Activity Requirements</h3>
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-stone-800 mb-4">Daily Exercise Needs</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <div>
                    <span className="font-medium">60-90 minutes daily</span>
                    <p className="text-stone-600 text-sm">Minimum exercise requirement for adult dogs</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <div>
                    <span className="font-medium">Swimming</span>
                    <p className="text-stone-600 text-sm">Excellent exercise that's easy on joints</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <div>
                    <span className="font-medium">Retrieving games</span>
                    <p className="text-stone-600 text-sm">Satisfies natural instincts and provides exercise</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <div>
                    <span className="font-medium">Mental stimulation</span>
                    <p className="text-stone-600 text-sm">Puzzle toys, training, and new experiences</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-stone-800 mb-4">Ideal Activities</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Fetch", "Swimming", "Hiking", "Jogging", 
                  "Agility", "Obedience", "Therapy Work", "Hunting"
                ].map((activity, index) => (
                  <div key={index} className="bg-amber-50 p-3 rounded-lg text-center">
                    <span className="text-stone-700 font-medium">{activity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Physical Characteristics */}
      <Card>
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold text-stone-800 mb-6">Physical Characteristics</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {physicalTraits.map((trait, index) => (
              <div key={index}>
                <h4 className="font-semibold text-stone-800 mb-3">{trait.category}</h4>
                <ul className="space-y-2">
                  {trait.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-stone-600 text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Living Requirements */}
      <Card>
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold text-stone-800 mb-6">Ideal Living Conditions</h3>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3">✅ Best Suited For</h4>
              <ul className="space-y-2 text-green-700 text-sm">
                <li>• Active families</li>
                <li>• Homes with yards</li>
                <li>• Owners who enjoy outdoor activities</li>
                <li>• Families with children</li>
                <li>• First-time dog owners</li>
              </ul>
            </div>
            <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-amber-800 mb-3">⚠️ Consider Carefully</h4>
              <ul className="space-y-2 text-amber-700 text-sm">
                <li>• Apartment living</li>
                <li>• Very long work hours</li>
                <li>• Limited exercise time</li>
                <li>• Allergy concerns</li>
                <li>• Minimal grooming tolerance</li>
              </ul>
            </div>
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-3">❌ Not Recommended</h4>
              <ul className="space-y-2 text-red-700 text-sm">
                <li>• Sedentary lifestyles</li>
                <li>• Frequent traveling</li>
                <li>• No time for training</li>
                <li>• Expecting a guard dog</li>
                <li>• No tolerance for shedding</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}