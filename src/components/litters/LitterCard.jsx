import React, { useState, useEffect } from "react";
import { Dog, LitterReservation } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Heart, Users, Star, Clock } from "lucide-react";
import { format, differenceInDays } from "date-fns";

export default function LitterCard({ litter, onReserve }) {
  const [parents, setParents] = useState({ sire: null, dam: null });
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLitterDetails();
  }, [litter]);

  const loadLitterDetails = async () => {
    try {
      const [sireData, damData, reservationData] = await Promise.all([
        Dog.filter({ id: litter.sire_id }),
        Dog.filter({ id: litter.dam_id }),
        LitterReservation.filter({ litter_id: litter.id })
      ]);

      setParents({
        sire: sireData[0] || null,
        dam: damData[0] || null
      });
      setReservations(reservationData);
    } catch (error) {
      console.error("Error loading litter details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (litter.status) {
      case "planned": return "bg-blue-100 text-blue-800";
      case "confirmed_pregnant": return "bg-green-100 text-green-800";
      case "born": return "bg-purple-100 text-purple-800";
      case "ready": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailableSlots = () => {
    const reservedSlots = reservations.filter(r => r.status !== 'cancelled').length;
    return litter.reservation_slots - reservedSlots;
  };

  const getDaysUntilDue = () => {
    return differenceInDays(new Date(litter.expected_due_date), new Date());
  };

  const getNextAvailableSlot = () => {
    const takenSlots = reservations
      .filter(r => r.status !== 'cancelled')
      .map(r => r.slot_number)
      .sort((a, b) => a - b);
    
    for (let i = 1; i <= litter.reservation_slots; i++) {
      if (!takenSlots.includes(i)) {
        return i;
      }
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-stone-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-stone-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const nextSlot = getNextAvailableSlot();
  const nextSlotPrice = nextSlot && litter.slot_prices && litter.slot_prices[nextSlot - 1] 
    ? litter.slot_prices[nextSlot - 1] 
    : null;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-stone-50">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl text-stone-800">{litter.name}</CardTitle>
            <p className="text-stone-600 mt-1">
              {parents.sire?.name} × {parents.dam?.name}
            </p>
          </div>
          <Badge className={getStatusColor()}>
            {litter.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Expected Due Date */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-stone-400" />
            <span className="text-stone-600">
              Expected: {format(new Date(litter.expected_due_date), 'MMMM d, yyyy')}
            </span>
            {getDaysUntilDue() > 0 && (
              <Badge variant="outline" className="ml-2">
                <Clock className="w-3 h-3 mr-1" />
                {getDaysUntilDue()} days
              </Badge>
            )}
          </div>

          {/* Parents Photos */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-stone-700 mb-2">Sire: {parents.sire?.name}</p>
              <div className="aspect-square bg-stone-200 rounded-lg overflow-hidden">
                {parents.sire?.photos?.[0] ? (
                  <img 
                    src={parents.sire.photos[0]} 
                    alt={parents.sire.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Heart className="w-8 h-8 text-stone-400" />
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-stone-700 mb-2">Dam: {parents.dam?.name}</p>
              <div className="aspect-square bg-stone-200 rounded-lg overflow-hidden">
                {parents.dam?.photos?.[0] ? (
                  <img 
                    src={parents.dam.photos[0]} 
                    alt={parents.dam.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Heart className="w-8 h-8 text-stone-400" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {litter.description && (
            <p className="text-stone-600 text-sm leading-relaxed">
              {litter.description}
            </p>
          )}

          {/* Availability */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-200">
            <div>
              <p className="text-sm text-stone-600">
                {getAvailableSlots()} of {litter.reservation_slots} spots available
              </p>
              {nextSlot && nextSlotPrice && (
                <p className="text-sm font-medium text-stone-800">
                  Next available: #{nextSlot} pick (${nextSlotPrice.toLocaleString()})
                </p>
              )}
            </div>
            
            {getAvailableSlots() > 0 ? (
              <Button 
                onClick={onReserve}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Star className="w-4 h-4 mr-2" />
                Reserve Spot
              </Button>
            ) : (
              <Badge variant="secondary">Fully Reserved</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}