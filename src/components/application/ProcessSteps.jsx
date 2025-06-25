import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Phone, Heart, Home } from "lucide-react";

export default function ProcessSteps() {
  const steps = [
    {
      icon: FileText,
      title: "Submit Application",
      description: "Complete our comprehensive application form with details about your family, lifestyle, and puppy preferences.",
      color: "bg-blue-500"
    },
    {
      icon: Phone, 
      title: "Phone Interview",
      description: "We'll schedule a personal conversation to discuss your application and answer any questions you may have.",
      color: "bg-green-500"
    },
    {
      icon: Heart,
      title: "Puppy Selection",
      description: "Based on temperament testing and your preferences, we'll help you choose the perfect puppy for your family.",
      color: "bg-pink-500"
    },
    {
      icon: Home,
      title: "Welcome Home",
      description: "Take your new family member home with complete health records, supplies, and our lifetime support.",
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-stone-800 mb-4">
          Our Adoption Process
        </h2>
        <p className="text-stone-600">
          We've designed our process to ensure the perfect match between our puppies and their forever families.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6 text-center">
              <div className="relative mb-4">
                <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-stone-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-stone-800 mb-3">
                {step.title}
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                {step.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}