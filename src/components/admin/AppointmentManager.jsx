
import React, { useState, useEffect } from "react";
import { AppointmentSlot } from "@/api/entities/AppointmentSlot";
import { BookedAppointment } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Calendar, Clock, Check, X, Users, Mail, Phone, BookCheck } from "lucide-react";
import { format, parseISO } from "date-fns";

export default function AppointmentManager() {
  const [slots, setSlots] = useState([]);
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [newSlotData, setNewSlotData] = useState({ date: '', time: '09:00', duration_minutes: 30 });
  const [editingSlot, setEditingSlot] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const allSlots = await AppointmentSlot.list("date,time");
      const allBookedAppointments = await BookedAppointment.list("-created_date");
      setSlots(allSlots);
      setBookedAppointments(allBookedAppointments);
    } catch (error) {
      console.error("Error loading appointment data:", error);
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!newSlotData.date || !newSlotData.time) return;

    try {
      await AppointmentSlot.create(newSlotData);
      setNewSlotData({ date: '', time: '09:00', duration_minutes: 30 });
      setIsAddingSlot(false);
      await loadData();
    } catch (error) {
      console.error("Error adding slot:", error);
      alert("Error adding appointment slot");
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!confirm("Are you sure you want to delete this time slot?")) return;
    
    try {
      await AppointmentSlot.delete(slotId);
      await loadData();
    } catch (error) {
      console.error("Error deleting slot:", error);
      alert("Error deleting appointment slot");
    }
  };

  const toggleSlotAvailability = async (slot) => {
    try {
      await AppointmentSlot.update(slot.id, { is_available: !slot.is_available });
      await loadData();
    } catch (error) {
      console.error("Error updating slot:", error);
      alert("Error updating slot availability");
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      await BookedAppointment.update(appointmentId, { status });
      await loadData();
    } catch (error) {
      console.error("Error updating appointment status:", error);
      alert("Error updating appointment status");
    }
  };

  const getSlotById = (slotId) => {
    return slots.find(slot => slot.id === slotId);
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800"
  };

  return (
    <div className="space-y-8">
      {/* Add New Slot Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-600" />
            Meeting Schedule Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isAddingSlot ? (
            <Button onClick={() => setIsAddingSlot(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Available Time Slot
            </Button>
          ) : (
            <form onSubmit={handleAddSlot} className="space-y-4 bg-stone-50 p-4 rounded-lg">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newSlotData.date}
                    onChange={(e) => setNewSlotData({...newSlotData, date: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newSlotData.time}
                    onChange={(e) => setNewSlotData({...newSlotData, time: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select 
                    value={newSlotData.duration_minutes.toString()} 
                    onValueChange={(value) => setNewSlotData({...newSlotData, duration_minutes: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-4">
                <Button type="submit">Add Time Slot</Button>
                <Button type="button" variant="outline" onClick={() => setIsAddingSlot(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Available Slots */}
      <Card>
        <CardHeader>
          <CardTitle>Available Time Slots ({slots.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {slots.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-600">No time slots created yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {slots.map((slot) => (
                <Card key={slot.id} className={`${slot.is_available ? 'bg-white' : 'bg-stone-100'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-stone-500" />
                        <span className="font-medium">
                          {format(parseISO(slot.date), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <Badge className={slot.is_available ? "bg-green-100 text-green-800" : "bg-stone-100 text-stone-600"}>
                        {slot.is_available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-stone-500" />
                      <span>{slot.time} ({slot.duration_minutes} min)</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSlotAvailability(slot)}
                        className="flex-1"
                      >
                        {slot.is_available ? 'Mark Unavailable' : 'Mark Available'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booked Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Booked Appointments ({bookedAppointments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {bookedAppointments.length === 0 ? (
            <div className="text-center py-8">
              <BookCheck className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-600">No appointments booked yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookedAppointments.map((appointment) => {
                const slot = getSlotById(appointment.slot_id);
                return (
                  <Card key={appointment.id} className="bg-stone-50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-stone-800">{appointment.customer_name}</h3>
                            <Badge className={statusColors[appointment.status]}>
                              {appointment.status}
                            </Badge>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-stone-400" />
                              <span>{appointment.customer_email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-stone-400" />
                              <span>{appointment.customer_phone}</span>
                            </div>
                            {slot && (
                              <>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-stone-400" />
                                  <span>{format(parseISO(slot.date), 'MMM d, yyyy')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-stone-400" />
                                  <span>{slot.time}</span>
                                </div>
                              </>
                            )}
                          </div>
                          
                          <div className="mt-3">
                            <p className="text-sm text-stone-600">
                              <strong>Purpose:</strong> {appointment.purpose}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {appointment.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                              >
                                <X className="w-4 h-4 mr-1" />
                                Cancel
                              </Button>
                            </>
                          )}
                          {appointment.status === 'confirmed' && (
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
