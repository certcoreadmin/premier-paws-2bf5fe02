import React, { useState, useEffect } from "react";
import { LitterReservation } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Star, DollarSign } from "lucide-react";

export default function ReservationForm({ litter, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    slot_number: "",
    gender_preference: "no_preference",
    color_preference: "",
    size_preference: "no_preference",
    notes: ""
  });
  
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSlotPrice, setSelectedSlotPrice] = useState(0);

  useEffect(() => {
    loadAvailableSlots();
  }, [litter]);

  const loadAvailableSlots = async () => {
    try {
      const reservations = await LitterReservation.filter({ litter_id: litter.id });
      const takenSlots = reservations
        .filter(r => r.status !== 'cancelled')
        .map(r => r.slot_number);
      
      const available = [];
      for (let i = 1; i <= litter.reservation_slots; i++) {
        if (!takenSlots.includes(i)) {
          const price = litter.slot_prices && litter.slot_prices[i - 1] ? litter.slot_prices[i - 1] : 500;
          available.push({ slot: i, price });
        }
      }
      setAvailableSlots(available);
    } catch (error) {
      console.error("Error loading available slots:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'slot_number') {
      const slot = availableSlots.find(s => s.slot === parseInt(value));
      setSelectedSlotPrice(slot ? slot.price : 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await LitterReservation.create({
        ...formData,
        litter_id: litter.id,
        slot_number: parseInt(formData.slot_number),
        amount_paid: selectedSlotPrice,
        reservation_date: new Date().toISOString().split('T')[0]
      });

      onSuccess();
    } catch (error) {
      console.error("Error creating reservation:", error);
      alert("Error creating reservation. Please try again.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>Reserve Your Spot</CardTitle>
            <p className="text-stone-600">{litter.name}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-stone-800">Contact Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer_name">Full Name *</Label>
                  <Input
                    id="customer_name"
                    value={formData.customer_name}
                    onChange={(e) => handleInputChange("customer_name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customer_phone">Phone Number *</Label>
                  <Input
                    id="customer_phone"
                    type="tel"
                    value={formData.customer_phone}
                    onChange={(e) => handleInputChange("customer_phone", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="customer_email">Email Address *</Label>
                <Input
                  id="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => handleInputChange("customer_email", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Slot Selection */}
            <div className="space-y-4">
              <h3 className="font-semibold text-stone-800">Selection Priority</h3>
              <div>
                <Label htmlFor="slot_number">Choose Your Pick Order *</Label>
                <Select value={formData.slot_number.toString()} onValueChange={(value) => handleInputChange("slot_number", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your priority slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSlots.map((slot) => (
                      <SelectItem key={slot.slot} value={slot.slot.toString()}>
                        <div className="flex items-center justify-between w-full">
                          <span>#{slot.slot} Pick</span>
                          <Badge variant="outline" className="ml-2">
                            ${slot.price.toLocaleString()}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedSlotPrice > 0 && (
                  <div className="mt-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-amber-600" />
                      <span className="font-medium text-amber-800">
                        Reservation Fee: ${selectedSlotPrice.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-amber-700 text-sm mt-1">
                      This reserves your selection priority. Full puppy price due at pickup.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-4">
              <h3 className="font-semibold text-stone-800">Puppy Preferences</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="gender_preference">Gender Preference</Label>
                  <Select value={formData.gender_preference} onValueChange={(value) => handleInputChange("gender_preference", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no_preference">No Preference</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="size_preference">Size Preference</Label>
                  <Select value={formData.size_preference} onValueChange={(value) => handleInputChange("size_preference", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no_preference">No Preference</SelectItem>
                      <SelectItem value="smallest">Smallest</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="largest">Largest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="color_preference">Color Preference</Label>
                  <Input
                    id="color_preference"
                    placeholder="e.g., Cream, Apricot"
                    value={formData.color_preference}
                    onChange={(e) => handleInputChange("color_preference", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Special Requests or Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any special requests or information you'd like us to know..."
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
              />
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !formData.slot_number}
                className="flex-1 bg-amber-600 hover:bg-amber-700"
              >
                {isSubmitting ? "Processing..." : `Reserve Spot - $${selectedSlotPrice.toLocaleString()}`}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}