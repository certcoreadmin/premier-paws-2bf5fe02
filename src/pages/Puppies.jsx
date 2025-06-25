
import React, { useState, useEffect } from "react";
import { Dog } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, Camera, MapPin, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format, differenceInWeeks } from "date-fns";
import PuppyCard from "../components/puppies/PuppyCard";
import PuppyDetails from "../components/puppies/PuppyDetails";
import FutureLitters from "../components/puppies/FutureLitters";
import ApplicationPrompt from "../components/puppies/ApplicationPrompt";
import PuppyMatchmaker from "../components/puppies/PuppyMatchmaker";

export default function PuppiesPage() {
  const [puppies, setPuppies] = useState([]);
  const [selectedPuppy, setSelectedPuppy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Handle referral code tracking
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      sessionStorage.setItem('referralCode', refCode);
    }

    loadPuppies();
  }, []);

  const loadPuppies = async () => {
    try {
      // Force a fresh fetch by adding a timestamp
      const allPuppies = await Dog.filter({ type: "puppy" }, "-updated_date").catch(() => []);
      console.log("Loaded puppies:", allPuppies); // Debug log
      setPuppies(allPuppies);
    } catch (error) {
      console.error("Error loading puppies:", error);
      setPuppies([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a refresh function
  const refreshPuppies = () => {
    setIsLoading(true);
    loadPuppies();
  };

  const availablePuppies = puppies.filter(p => p.status === "available");
  const pendingPuppies = puppies.filter(p => p.status === "pending" || p.status === "reserved");

  if (selectedPuppy) {
    return (
      <div className="bg-white">
        <PuppyDetails 
          puppy={selectedPuppy} 
          onBack={() => setSelectedPuppy(null)}
          onApply={() => {
            // Store puppy interest and navigate to application
            sessionStorage.setItem('puppyInterest', selectedPuppy.name);
            window.location.href = createPageUrl("Application");
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-stone-800 mb-6">
            Available Puppies
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl mx-auto">
            Meet our adorable, health-tested puppies ready to join loving families. 
            Each puppy is raised with love, early socialization, and the highest standards of care.
          </p>
          
          {/* Debug refresh button - remove this later */}
          <Button 
            onClick={refreshPuppies} 
            variant="outline" 
            className="mt-4"
          >
            Refresh Puppies
          </Button>
        </div>
      </section>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Sidebar for Matchmaker */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24">
              <PuppyMatchmaker availablePuppies={availablePuppies} onPuppySelect={setSelectedPuppy} />
            </div>
          </aside>

          {/* Main content for puppy list */}
          <main className="lg:col-span-8 xl:col-span-9">
            {/* Available Puppies */}
            <section className="mb-20">
              {isLoading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                  <p className="text-stone-600">Loading adorable puppies...</p>
                </div>
              ) : availablePuppies.length > 0 ? (
                <>
                  <div className="mb-12">
                    <h2 className="text-3xl font-bold text-stone-800 mb-4">
                      Ready for Their Forever Homes
                    </h2>
                    <p className="text-lg text-stone-600 max-w-3xl">
                      These beautiful puppies are available now. Click on any puppy to learn more about their personality and see more photos.
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
                    {availablePuppies.map((puppy) => (
                      <PuppyCard 
                        key={puppy.id} 
                        puppy={puppy} 
                        onClick={() => setSelectedPuppy(puppy)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl">
                  <Heart className="w-16 h-16 text-stone-300 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-stone-800 mb-4">
                    No Puppies Currently Available
                  </h2>
                  <p className="text-lg text-stone-600 mb-8 max-w-2xl mx-auto">
                    All our current puppies have found their forever homes! 
                    Don't worry - we have exciting litters planned for the future.
                  </p>
                  <Link to={createPageUrl("UpcomingLitters")}>
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      View Upcoming Litters
                    </Button>
                  </Link>
                </div>
              )}
            </section>

            {/* Pending/Reserved Puppies */}
            {pendingPuppies.length > 0 && (
              <section>
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-stone-800 mb-4">
                    Pending Adoption
                  </h2>
                  <p className="text-lg text-stone-600 max-w-3xl">
                    These puppies are currently reserved or have pending applications. 
                    Get on our waiting list for future litters!
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {pendingPuppies.map((puppy) => (
                    <PuppyCard 
                      key={puppy.id} 
                      puppy={puppy} 
                      onClick={() => setSelectedPuppy(puppy)}
                      showStatus={true}
                    />
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
      
      {/* Full width sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FutureLitters />
      </div>
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 py-20 mt-16">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ApplicationPrompt />
         </div>
      </div>
    </div>
  );
}
