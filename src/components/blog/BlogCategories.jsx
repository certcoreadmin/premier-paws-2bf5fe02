import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Heart, Shield, Brain, 
  Megaphone, ArrowRight 
} from "lucide-react";

export default function BlogCategories() {
  const categories = [
    {
      name: "Breed Education",
      slug: "breed_education",
      icon: BookOpen,
      description: "Learn everything about Golden Retrievers - temperament, characteristics, and what makes them special.",
      color: "bg-blue-100 text-blue-800",
      iconColor: "text-blue-600"
    },
    {
      name: "Puppy Care",
      slug: "puppy_care", 
      icon: Heart,
      description: "Essential guidance for raising happy, healthy puppies from birth through their first year.",
      color: "bg-green-100 text-green-800",
      iconColor: "text-green-600"
    },
    {
      name: "Health & Wellness",
      slug: "health",
      icon: Shield,
      description: "Health information, preventive care, and understanding genetic testing in breeding.",
      color: "bg-red-100 text-red-800", 
      iconColor: "text-red-600"
    },
    {
      name: "Training Tips",
      slug: "training",
      icon: Brain,
      description: "Professional training advice and techniques for Golden Retrievers of all ages.",
      color: "bg-purple-100 text-purple-800",
      iconColor: "text-purple-600"
    },
    {
      name: "Breeder Updates",
      slug: "breeder_updates",
      icon: Megaphone,
      description: "Latest news from our kennel, breeding plans, and announcements about upcoming litters.",
      color: "bg-amber-100 text-amber-800",
      iconColor: "text-amber-600"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-stone-800 mb-4">
          Explore by Category
        </h2>
        <p className="text-stone-600 max-w-2xl mx-auto">
          Find exactly what you're looking for with our organized content categories. 
          From breed information to training tips, we cover everything Golden Retriever.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center`}>
                  <category.icon className={`w-5 h-5 ${category.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <Badge className={`${category.color} text-xs`}>
                    {category.slug.replace(/_/g, ' ')}
                  </Badge>
                </div>
              </div>
              
              <p className="text-stone-600 text-sm mb-4 leading-relaxed">
                {category.description}
              </p>
              
              <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-800 transition-colors">
                <span>Browse articles</span>
                <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}