import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, Scissors, Utensils, Stethoscope } from "lucide-react";

export default function CareGuide() {
  const groomingSchedule = [
    { task: "Brushing", frequency: "3-4 times per week", description: "Daily during shedding season" },
    { task: "Bathing", frequency: "Every 6-8 weeks", description: "Or as needed if dirty/smelly" },
    { task: "Nail trimming", frequency: "Every 2-3 weeks", description: "Check weekly, trim as needed" },
    { task: "Ear cleaning", frequency: "Weekly", description: "Check for debris, moisture, odor" },
    { task: "Teeth brushing", frequency: "Daily", description: "Minimum 3 times per week" },
    { task: "Professional grooming", frequency: "Every 6-8 weeks", description: "Full grooming and trim" }
  ];

  const nutritionGuidelines = [
    { age: "Puppy (8-18 months)", amount: "3-4 cups daily", meals: "3-4 meals", notes: "High-quality puppy formula" },
    { age: "Adult (1-7 years)", amount: "2-3 cups daily", meals: "2 meals", notes: "Adjust based on activity level" },
    { age: "Senior (7+ years)", amount: "2-2.5 cups daily", meals: "2 meals", notes: "Senior formula, monitor weight" }
  ];

  const healthScreenings = [
    { test: "Hip Dysplasia (OFA)", age: "2+ years", frequency: "Once", description: "X-ray evaluation of hip joints" },
    { test: "Elbow Dysplasia (OFA)", age: "2+ years", frequency: "Once", description: "X-ray evaluation of elbow joints" },
    { test: "Heart Clearance", age: "1+ years", frequency: "Annual", description: "Cardiac examination by specialist" },
    { test: "Eye Exam (CERF)", age: "1+ years", frequency: "Annual", description: "Ophthalmologist examination" },
    { test: "Genetic Testing", age: "Any age", frequency: "Once", description: "DNA test for hereditary conditions" }
  ];

  return (
    <div className="space-y-8">
      <Tabs defaultValue="grooming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="grooming" className="flex items-center gap-2">
            <Scissors className="w-4 h-4" />
            Grooming
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex items-center gap-2">
            <Utensils className="w-4 h-4" />
            Nutrition
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4" />
            Health
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Training
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grooming">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-purple-600" />
                Grooming Requirements
              </CardTitle>
              <p className="text-stone-600">
                Golden Retrievers have a double coat that requires regular maintenance to keep it healthy and beautiful.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4">
                  {groomingSchedule.map((item, index) => (
                    <div key={index} className="flex items-start justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex-1">
                        <h4 className="font-semibold text-stone-800">{item.task}</h4>
                        <p className="text-stone-600 text-sm mt-1">{item.description}</p>
                      </div>
                      <Badge variant="outline" className="ml-4">
                        {item.frequency}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-3">💡 Pro Grooming Tips</h4>
                  <ul className="space-y-2 text-amber-700 text-sm">
                    <li>• Start grooming routines early to get your puppy comfortable</li>
                    <li>• Use a slicker brush and undercoat rake for best results</li>
                    <li>• Pay special attention to areas that mat easily (behind ears, legs, tail)</li>
                    <li>• Never shave a Golden Retriever - their coat provides temperature regulation</li>
                    <li>• Increase brushing frequency during spring and fall shedding seasons</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-green-600" />
                Nutrition Guidelines
              </CardTitle>
              <p className="text-stone-600">
                Proper nutrition is essential for your Golden Retriever's health, energy, and longevity.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-green-50">
                        <th className="border border-green-200 p-3 text-left">Life Stage</th>
                        <th className="border border-green-200 p-3 text-left">Daily Amount</th>
                        <th className="border border-green-200 p-3 text-left">Meal Frequency</th>
                        <th className="border border-green-200 p-3 text-left">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nutritionGuidelines.map((guideline, index) => (
                        <tr key={index} className="hover:bg-stone-50">
                          <td className="border border-green-200 p-3 font-medium">{guideline.age}</td>
                          <td className="border border-green-200 p-3">{guideline.amount}</td>
                          <td className="border border-green-200 p-3">{guideline.meals}</td>
                          <td className="border border-green-200 p-3 text-sm">{guideline.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-3">✅ Recommended Foods</h4>
                    <ul className="space-y-1 text-green-700 text-sm">
                      <li>• High-quality commercial dog food</li>
                      <li>• Life stage appropriate formulas</li>
                      <li>• Foods with real meat as first ingredient</li>
                      <li>• Omega-3 fatty acids for coat health</li>
                      <li>• Glucosamine for joint support</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-3">❌ Foods to Avoid</h4>
                    <ul className="space-y-1 text-red-700 text-sm">
                      <li>• Chocolate and caffeine</li>
                      <li>• Grapes and raisins</li>
                      <li>• Onions and garlic</li>
                      <li>• High-fat foods (can cause pancreatitis)</li>
                      <li>• Excessive treats (max 10% of daily calories)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                Health & Veterinary Care
              </CardTitle>
              <p className="text-stone-600">
                Regular health screenings and preventive care are essential for Golden Retrievers.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-stone-800 mb-4">Recommended Health Screenings</h4>
                  <div className="space-y-3">
                    {healthScreenings.map((screening, index) => (
                      <div key={index} className="flex items-start justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex-1">
                          <h5 className="font-medium text-stone-800">{screening.test}</h5>
                          <p className="text-stone-600 text-sm mt-1">{screening.description}</p>
                          <div className="flex gap-4 mt-2">
                            <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                              Age: {screening.age}
                            </span>
                            <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                              {screening.frequency}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-3">Common Health Concerns</h4>
                    <ul className="space-y-2 text-orange-700 text-sm">
                      <li>• Hip and elbow dysplasia</li>
                      <li>• Heart conditions (subvalvular aortic stenosis)</li>
                      <li>• Eye problems (cataracts, progressive retinal atrophy)</li>
                      <li>• Cancer (lymphoma, hemangiosarcoma)</li>
                      <li>• Allergies and skin conditions</li>
                      <li>• Bloat (gastric dilatation-volvulus)</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-3">Prevention Tips</h4>
                    <ul className="space-y-2 text-blue-700 text-sm">
                      <li>• Choose puppies from health-tested parents</li>
                      <li>• Maintain healthy weight</li>
                      <li>• Regular exercise and mental stimulation</li>
                      <li>• Annual veterinary check-ups</li>
                      <li>• Keep up with vaccinations and parasite prevention</li>
                      <li>• Monitor for early signs of illness</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-600" />
                Training & Socialization
              </CardTitle>
              <p className="text-stone-600">
                Golden Retrievers are highly trainable and eager to please, making them excellent students.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-stone-800 mb-4">Basic Training Timeline</h4>
                    <div className="space-y-3">
                      <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                        <h5 className="font-medium text-pink-800">8-16 weeks</h5>
                        <p className="text-pink-700 text-sm">House training, basic commands (sit, stay, come), crate training</p>
                      </div>
                      <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                        <h5 className="font-medium text-pink-800">4-6 months</h5>
                        <p className="text-pink-700 text-sm">Leash walking, impulse control, basic manners</p>
                      </div>
                      <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                        <h5 className="font-medium text-pink-800">6+ months</h5>
                        <p className="text-pink-700 text-sm">Advanced training, specialized activities, ongoing reinforcement</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-800 mb-4">Training Tips</h4>
                    <ul className="space-y-2 text-stone-600 text-sm">
                      <li>• Use positive reinforcement methods</li>
                      <li>• Keep training sessions short (5-10 minutes)</li>
                      <li>• Be consistent with commands and expectations</li>
                      <li>• Start socialization early and continue throughout life</li>
                      <li>• Provide mental stimulation to prevent boredom</li>
                      <li>• Consider puppy classes and ongoing training</li>
                      <li>• Exercise before training sessions for better focus</li>
                      <li>• End training on a positive note</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
                  <h4 className="font-semibold text-emerald-800 mb-3">🎯 Essential Commands to Master</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["Sit", "Stay", "Come", "Down", "Leave it", "Drop it", "Wait", "Heel"].map((command, index) => (
                      <div key={index} className="bg-white p-2 rounded text-center">
                        <span className="text-emerald-700 font-medium">{command}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}