import React, { useState, useEffect } from "react";
import { Litter, Dog, LitterReservation } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Heart, Users, Baby, ArrowRight, Star } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import LitterCard from "../components/litters/LitterCard";
import ReservationForm from "../components/litters/ReservationForm";

export default function UpcomingLittersPage() {
  const [litters, setLitters] = useState([]);
  const [selectedLitter, setSelectedLitter] = useState(null);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLitters();
  }, []);

  const loadLitters = async () => {
    try {
      const litterList = await Litter.filter({ is_active: true }, "-expected_due_date");
      setLitters(litterList);
    } catch (error) {
      console.error("Error loading litters:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReserveSpot = (litter) => {
    setSelectedLitter(litter);
    setShowReservationForm(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p>Loading upcoming litters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-stone-50 to-stone-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center">
              <Baby className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-stone-800 mb-6">
            Upcoming Litters
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl mx-auto">
            Reserve your spot in our carefully planned litters. Each litter represents months of planning 
            to bring together the best genetics, health, and temperament for your perfect family companion.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-stone-800 text-center mb-12">How Litter Reservations Work</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-amber-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-stone-800 mb-2">Choose Your Priority</h3>
              <p className="text-stone-600 text-sm">Select your preferred selection order. Higher priority spots cost more but give you first choice of puppies.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-amber-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-stone-800 mb-2">Wait for Birth</h3>
              <p className="text-stone-600 text-sm">We'll keep you updated throughout the pregnancy and notify you when puppies arrive.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-amber-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-stone-800 mb-2">Make Your Choice</h3>
              <p className="text-stone-600 text-sm">When puppies are 6-7 weeks old, you'll choose your puppy in reservation order.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Litters List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {litters.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {litters.map((litter) => (
                <LitterCard 
                  key={litter.id} 
                  litter={litter} 
                  onReserve={() => handleReserveSpot(litter)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Baby className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-stone-600 mb-2">
                No upcoming litters currently planned.
              </h3>
              <p className="text-stone-500 mb-6">
                Check back soon or join our newsletter to be notified of new litter announcements.
              </p>
              <Link to={createPageUrl("Home")}>
                <Button variant="outline">Join Our Newsletter</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Reservation Form Modal */}
      {showReservationForm && selectedLitter && (
        <ReservationForm 
          litter={selectedLitter}
          onClose={() => {
            setShowReservationForm(false);
            setSelectedLitter(null);
          }}
          onSuccess={() => {
            setShowReservationForm(false);
            setSelectedLitter(null);
            // Optionally reload litters to update availability
            loadLitters();
          }}
        />
      )}
    </div>
  );
}