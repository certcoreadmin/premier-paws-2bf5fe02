
import React, { useState, useEffect } from "react";
import { Dog } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Award, Shield, ArrowLeft } from "lucide-react";
import { differenceInYears } from "date-fns";
import ParentProfile from "../components/parents/ParentProfile";

export default function ParentsPage() {
  const [parents, setParents] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadParents();
  }, []);

  const loadParents = async () => {
    try {
      const parentDogs = await Dog.filter({ type: "parent" }, "-updated_date").catch(() => []);
      setParents(parentDogs);
    } catch (error) {
      console.error("Error loading parents:", error);
      setParents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getAge = (birthDate) => {
    if (!birthDate) return "Age unknown";
    const years = differenceInYears(new Date(), new Date(birthDate));
    return years === 1 ? "1 year old" : `${years} years old`;
  };

  const getPrimaryPhotoUrl = (photos) => {
    if (!photos || photos.length === 0) return null;
    const primary = photos.find(p => p.is_primary);
    return primary ? primary.url : photos[0]?.url;
  };

  if (selectedParent) {
    return (
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ParentProfile
            parent={selectedParent}
            onBack={() => setSelectedParent(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-stone-800 mb-6">
            Meet Our Exceptional Breeding Dogs
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl mx-auto">
            Every puppy starts with exceptional parents. Our breeding dogs are carefully selected
            for outstanding health, temperament, and conformation to breed standards. Get to know
            the remarkable dogs behind our puppies.
          </p>
        </div>
      </section>

      {/* Parents Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-stone-600">Loading our amazing dogs...</p>
            </div>
          ) : parents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {parents.map((parent) => (
                <Card key={parent.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer rounded-2xl"
                      onClick={() => setSelectedParent(parent)}>
                  {/* Photo */}
                  <div className="aspect-square bg-stone-200 overflow-hidden">
                    {parent.photos && parent.photos.length > 0 ? (
                      <img
                        src={getPrimaryPhotoUrl(parent.photos)}
                        alt={parent.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300">
                        <Heart className="w-16 h-16 text-stone-400" />
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-stone-800">{parent.name}</h3>
                        <p className="text-stone-600 capitalize">
                          {parent.gender} • {getAge(parent.birth_date)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        {parent.pedigree?.champion_bloodline && (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                            <Award className="w-3 h-3 mr-1" />
                            Champion
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {parent.color && (
                        <p className="text-sm text-stone-600">
                          <span className="font-medium">Color:</span> {parent.color}
                        </p>
                      )}
                      {parent.size_category && (
                        <p className="text-sm text-stone-600">
                          <span className="font-medium">Size:</span> {parent.size_category}
                        </p>
                      )}
                      {parent.current_weight && (
                        <p className="text-sm text-stone-600">
                          <span className="font-medium">Weight:</span> {parent.current_weight} lbs
                        </p>
                      )}
                    </div>

                    {parent.health_clearances && parent.health_clearances.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                        <Shield className="w-3 h-3" />
                        <span>Health Clearances: {parent.health_clearances.length} tests</span>
                      </div>
                    )}

                    <div className="mt-4 text-center">
                      <Button variant="outline" className="w-full group-hover:bg-amber-50 group-hover:border-amber-600 group-hover:text-amber-700">
                        Learn More About {parent.name}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-stone-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-stone-800 mb-4">
                No Parent Information Available
              </h2>
              <p className="text-lg text-stone-600">
                We're currently updating our parent profiles. Please check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Health Testing Section */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-stone-800 mb-8">
            Our Commitment to Health Testing
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-stone-800 mb-2">OFA Health Clearances</h3>
              <p className="text-stone-600">
                Hips, elbows, heart, and eye clearances for all breeding dogs
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-stone-800 mb-2">Genetic Testing</h3>
              <p className="text-stone-600">
                Comprehensive Embark testing for 200+ genetic health conditions
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-stone-800 mb-2">Transparent Results</h3>
              <p className="text-stone-600">
                All health testing results are available for review by puppy families
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
