import React, { useState, useEffect } from "react";
import { AppointmentSlot } from "@/api/entities/AppointmentSlot";
import { BookedAppointment } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Calendar, Clock, User as UserIcon, Mail, Phone, BookCheck, AlertCircle } from "lucide-react";
import { format, parseISO, startOfDay, isSameDay } from "date-fns";
import _ from 'lodash';

export default function ScheduleMeetingForm() {
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [customerDetails, setCustomerDetails] = useState({ name: "", email: "", phone: "", purpose: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    loadAvailableSlots();

    const pendingAppointment = localStorage.getItem('pendingAppointment');
    if (pendingAppointment) {
      const { slot, details } = JSON.parse(pendingAppointment);
      setSelectedSlot(slot);
      setCustomerDetails(details);
      submitSavedAppointment(slot, details);
    }
  }, []);

  const submitSavedAppointment = async (slot, details) => {
    setIsSubmitting(true);
    try {
      await BookedAppointment.create({
        slot_id: slot.id,
        customer_name: details.name,
        customer_email: details.email,
        customer_phone: details.phone,
        purpose: details.purpose,
      });

      await AppointmentSlot.update(slot.id, { is_available: false });
      
      localStorage.removeItem('pendingAppointment');
      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting saved appointment:", error);
      alert("Error submitting your appointment after login. Please try again.");
      localStorage.removeItem('pendingAppointment');
    }
    setIsSubmitting(false);
  };

  const loadAvailableSlots = async () => {
    try {
      const availableSlots = await AppointmentSlot.filter({ is_available: true }, "date,time");
      setSlots(availableSlots);
    } catch (error) {
      console.error("Error loading slots:", error);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot || !customerDetails.name || !customerDetails.email) {
      alert("Please select a slot and fill in your details.");
      return;
    }

    setIsSubmitting(true);

    try {
      await User.me();

      await BookedAppointment.create({
        slot_id: selectedSlot.id,
        customer_name: customerDetails.name,
        customer_email: customerDetails.email,
        customer_phone: customerDetails.phone,
        purpose: customerDetails.purpose,
      });

      await AppointmentSlot.update(selectedSlot.id, { is_available: false });
      setIsSuccess(true);

    } catch (error) {
      console.log("User not authenticated for meeting, prompting login...");
      const pendingAppointment = {
        slot: selectedSlot,
        details: customerDetails
      };
      localStorage.setItem('pendingAppointment', JSON.stringify(pendingAppointment));
      await User.login();
    }
    setIsSubmitting(false);
  };
  
  const uniqueDates = _.uniqBy(slots.map(s => ({ date: startOfDay(parseISO(s.date)) })), (d) => d.date.getTime())
    .map(d => d.date)
    .sort((a, b) => a - b);

  const slotsForSelectedDate = selectedDate ? slots.filter(s => isSameDay(parseISO(s.date), selectedDate)) : [];

  if (isSuccess) {
    return (
      <Alert variant="default" className="max-w-xl mx-auto bg-green-50 border-green-200">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertTitle className="text-green-800 font-bold">Appointment Booked Successfully!</AlertTitle>
        <AlertDescription className="text-green-700">
          Thank you for scheduling a meeting with us. We've received your request and will send a confirmation to your email shortly. We look forward to speaking with you!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5 text-amber-600" />1. Select a Date</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {uniqueDates.length > 0 ? uniqueDates.map(date => (
            <Button key={date.toISOString()} variant={selectedDate && isSameDay(date, selectedDate) ? "default" : "outline"} onClick={() => handleDateSelect(date)} className="w-40">
              {format(date, "EEEE, MMM d")}
            </Button>
          )) : <p className="text-stone-500">No available dates at the moment. Please check back soon!</p>}
        </CardContent>
      </Card>

      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-amber-600" />2. Select a Time</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            {slotsForSelectedDate.length > 0 ? slotsForSelectedDate.map(slot => (
              <Button key={slot.id} variant={selectedSlot?.id === slot.id ? "default" : "outline"} onClick={() => handleSlotSelect(slot)}>
                {slot.time}
              </Button>
            )) : <p className="text-stone-500">No available times for this date.</p>}
          </CardContent>
        </Card>
      )}

      {selectedSlot && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserIcon className="w-5 h-5 text-amber-600" />3. Your Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="name" placeholder="Full Name *" required value={customerDetails.name} onChange={handleInputChange} />
              <Input name="email" type="email" placeholder="Email Address *" required value={customerDetails.email} onChange={handleInputChange} />
              <Input name="phone" type="tel" placeholder="Phone Number" value={customerDetails.phone} onChange={handleInputChange} />
              <Textarea name="purpose" placeholder="Purpose of the meeting (e.g., puppy inquiry, meet the parents) *" required value={customerDetails.purpose} onChange={handleInputChange} />
              <Button type="submit" disabled={isSubmitting} className="w-full">
                <BookCheck className="w-4 h-4 mr-2" />
                {isSubmitting ? "Booking..." : "Book Appointment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}