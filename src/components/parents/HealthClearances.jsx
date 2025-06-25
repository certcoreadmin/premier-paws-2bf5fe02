import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ExternalLink } from "lucide-react";

export default function HealthClearances() {
  const healthTests = [
    {
      category: "Orthopedic",
      tests: [
        {
          name: "Hip Dysplasia (OFA)",
          description: "X-ray evaluation of hip joint formation",
          why: "Prevents painful arthritis and mobility issues",
          when: "After 24 months of age",
          registry: "Orthopedic Foundation for Animals"
        },
        {
          name: "Elbow Dysplasia (OFA)",
          description: "X-ray evaluation of elbow joint formation",
          why: "Prevents lameness and joint pain",
          when: "After 24 months of age",
          registry: "Orthopedic Foundation for Animals"
        }
      ]
    },
    {
      category: "Cardiac",
      tests: [
        {
          name: "Heart Clearance",
          description: "Examination by board-certified cardiologist",
          why: "Screens for congenital heart defects",
          when: "Annually after 12 months",
          registry: "OFA Cardiac Database"
        }
      ]
    },
    {
      category: "Ophthalmologic",
      tests: [
        {
          name: "Eye Exam (CERF/OFA)",
          description: "Comprehensive eye examination",
          why: "Detects hereditary eye diseases",
          when: "Annually",
          registry: "Canine Eye Registration Foundation"
        }
      ]
    },
    {
      category: "Genetic",
      tests: [
        {
          name: "Embark Genetic Panel",
          description: "DNA test for 200+ genetic conditions",
          why: "Identifies genetic disease carriers",
          when: "Once, any age",
          registry: "Embark Veterinary"
        }
      ]
    }
  ];

  const categoryColors = {
    "Orthopedic": "bg-blue-100 text-blue-800 border-blue-200",
    "Cardiac": "bg-red-100 text-red-800 border-red-200", 
    "Ophthalmologic": "bg-green-100 text-green-800 border-green-200",
    "Genetic": "bg-purple-100 text-purple-800 border-purple-200"
  };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        {healthTests.map((category, categoryIndex) => (
          <Card key={categoryIndex} className="h-fit">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Badge className={`${categoryColors[category.category]} border`}>
                  {category.category}
                </Badge>
                <h3 className="font-semibold text-stone-800">{category.category} Testing</h3>
              </div>
              
              <div className="space-y-4">
                {category.tests.map((test, testIndex) => (
                  <div key={testIndex} className="border-l-4 border-stone-200 pl-4">
                    <h4 className="font-medium text-stone-800 mb-2">{test.name}</h4>
                    <p className="text-stone-600 text-sm mb-2">{test.description}</p>
                    
                    <div className="space-y-1 text-xs">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-stone-600">
                          <strong>Why:</strong> {test.why}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-stone-600">
                          <strong>When:</strong> {test.when}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-stone-600">
                          <strong>Registry:</strong> {test.registry}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transparency Note */}
      <Card className="bg-emerald-50 border-emerald-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-emerald-800 mb-3">Our Transparency Promise</h3>
          <p className="text-emerald-700 mb-4">
            We believe in complete transparency when it comes to health testing. All our breeding dogs' 
            health clearances are documented and verifiable through official registries.
          </p>
          <div className="flex items-center gap-2 text-emerald-600">
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm font-medium">
              View all health records on OFA.org and Embark.com using our dogs' registration numbers
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}