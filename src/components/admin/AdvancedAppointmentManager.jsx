
import React, { useState, useEffect } from "react";
import { AppointmentType } from "@/api/entities";
import { RecurringAvailability } from "@/api/entities";
import { AvailabilityBlock } from "@/api/entities";
import { BookedAppointment } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus, Edit, Trash2, Calendar, Clock, Check, X, Users, Mail, Phone,
  Settings, Eye, EyeOff, CalendarDays, CalendarX, BookCheck, AlertCircle,
  ChevronLeft, ChevronRight
} from "lucide-react";
import {
  format, parseISO
} from "date-fns";
import CalendarView from "./CalendarView";

// Appointment Types Management Component
const AppointmentTypesManager = ({ appointmentTypes, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    duration_minutes: 30,
    price: 0,
    description: "",
    color: "#3B82F6",
    is_active: true,
    requires_approval: false,
    required_application_status: "none",
    buffer_minutes: 15,
    advance_booking_days: 30,
    minimum_notice_hours: 24
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingType) {
        await AppointmentType.update(editingType.id, formData);
      } else {
        await AppointmentType.create(formData);
      }
      setIsAdding(false);
      setEditingType(null);
      setFormData({
        name: "",
        duration_minutes: 30,
        price: 0,
        description: "",
        color: "#3B82F6",
        is_active: true,
        requires_approval: false,
        required_application_status: "none",
        buffer_minutes: 15,
        advance_booking_days: 30,
        minimum_notice_hours: 24
      });
      onUpdate();
    } catch (error) {
      console.error("Error saving appointment type:", error);
    }
  };

  const handleEdit = (type) => {
    setEditingType(type);
    setFormData(type);
    setIsAdding(true);
  };

  const handleDelete = async (typeId) => {
    if (confirm("Delete this appointment type? This cannot be undone.")) {
      await AppointmentType.delete(typeId);
      onUpdate();
    }
  };

  const toggleActive = async (type) => {
    await AppointmentType.update(type.id, { is_active: !type.is_active });
    onUpdate();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Appointment Types</h3>
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Type
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>{editingType ? "Edit Appointment Type" : "Add Appointment Type"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Initial Video Call"
                    required
                  />
                </div>
                <div>
                  <Label>Duration (minutes) *</Label>
                  <Input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => handleInputChange("duration_minutes", parseInt(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Price ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Color</Label>
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="What does this appointment include?"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Buffer Time (minutes)</Label>
                  <Input
                    type="number"
                    value={formData.buffer_minutes}
                    onChange={(e) => handleInputChange("buffer_minutes", parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Advance Booking (days)</Label>
                  <Input
                    type="number"
                    value={formData.advance_booking_days}
                    onChange={(e) => handleInputChange("advance_booking_days", parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Minimum Notice (hours)</Label>
                  <Input
                    type="number"
                    value={formData.minimum_notice_hours}
                    onChange={(e) => handleInputChange("minimum_notice_hours", parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label>Required Application Status</Label>
                <Select
                  value={formData.required_application_status}
                  onValueChange={(value) => handleInputChange("required_application_status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No requirement</SelectItem>
                    <SelectItem value="pending">Application submitted</SelectItem>
                    <SelectItem value="approved">Application approved</SelectItem>
                    <SelectItem value="interview_scheduled">Interview scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requires_approval"
                    checked={formData.requires_approval}
                    onCheckedChange={(checked) => handleInputChange("requires_approval", checked)}
                  />
                  <Label htmlFor="requires_approval">Requires approval</Label>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit">
                  {editingType ? "Update" : "Create"} Type
                </Button>
                <Button type="button" variant="outline" onClick={() => {
                  setIsAdding(false);
                  setEditingType(null);
                }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {appointmentTypes.map((type) => (
          <Card key={type.id} className={!type.is_active ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: type.color }}
                  />
                  <div>
                    <h4 className="font-medium">{type.name}</h4>
                    <p className="text-sm text-stone-600">
                      {type.duration_minutes} min • ${type.price}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={type.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {type.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              {type.description && (
                <p className="text-sm text-stone-600 mb-3">{type.description}</p>
              )}

              <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
                <span>Buffer: {type.buffer_minutes}min</span>
                <span>•</span>
                <span>Notice: {type.minimum_notice_hours}h</span>
                <span>•</span>
                <span>Advance: {type.advance_booking_days}d</span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => toggleActive(type)}>
                  {type.is_active ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEdit(type)}>
                  <Edit className="w-3 h-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(type.id)}>
                  <Trash2 className="w-3 h-3 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Recurring Availability Management Component
const RecurringAvailabilityManager = ({ recurringAvailability, appointmentTypes, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "", // Added name field
    day_of_week: "1", // Monday
    start_time: "09:00",
    end_time: "17:00",
    appointment_types: [], // Corrected field name from appointment_type_ids
    is_active: true,
  });

  const daysOfWeek = [
    { value: "0", label: "Sunday" },
    { value: "1", label: "Monday" },
    { value: "2", label: "Tuesday" },
    { value: "3", label: "Wednesday" },
    { value: "4", label: "Thursday" },
    { value: "5", label: "Friday" },
    { value: "6", label: "Saturday" },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAppointmentTypeChange = (typeId, isChecked) => {
    setFormData(prev => {
      const currentIds = new Set(prev.appointment_types); // Corrected field name
      if (isChecked) {
        currentIds.add(typeId);
      } else {
        currentIds.delete(typeId);
      }
      return { ...prev, appointment_types: Array.from(currentIds) }; // Corrected field name
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSave = {
        ...formData,
        day_of_week: parseInt(formData.day_of_week, 10),
      };
      if (editingItem) {
        await RecurringAvailability.update(editingItem.id, dataToSave);
      } else {
        await RecurringAvailability.create(dataToSave);
      }
      setIsAdding(false);
      setEditingItem(null);
      setFormData({
        name: "", // Added name field
        day_of_week: "1",
        start_time: "09:00",
        end_time: "17:00",
        appointment_types: [], // Corrected field name
        is_active: true,
      });
      onUpdate();
    } catch (error) {
      console.error("Error saving recurring availability:", error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      ...item,
      day_of_week: item.day_of_week.toString(),
      appointment_types: item.appointment_types || [], // Corrected field name
    });
    setIsAdding(true);
  };

  const handleDelete = async (itemId) => {
    if (confirm("Delete this recurring availability?")) {
      await RecurringAvailability.delete(itemId);
      onUpdate();
    }
  };

  const toggleActive = async (item) => {
    await RecurringAvailability.update(item.id, { is_active: !item.is_active });
    onUpdate();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Recurring Availability</CardTitle>
          <Button onClick={() => setIsAdding(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Slot
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-md">
            <h4 className="text-md font-semibold">{editingItem ? "Edit Recurring Slot" : "Add Recurring Slot"}</h4>

            <div>
                <Label>Schedule Name *</Label>
                <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Weekday Video Calls"
                    required
                />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Day of Week</Label>
                <Select value={formData.day_of_week} onValueChange={(value) => handleInputChange("day_of_week", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map(day => (
                      <SelectItem key={day.value} value={day.value}>{day.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Time</Label>
                  <Input type="time" value={formData.start_time} onChange={(e) => handleInputChange("start_time", e.target.value)} required />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input type="time" value={formData.end_time} onChange={(e) => handleInputChange("end_time", e.target.value)} required />
                </div>
              </div>
            </div>

            <div>
              <Label>Applicable Appointment Types</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {appointmentTypes.map(type => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`recur-type-${type.id}`}
                      checked={(formData.appointment_types || []).includes(type.id)}
                      onCheckedChange={(checked) => handleAppointmentTypeChange(type.id, checked)}
                    />
                    <Label htmlFor={`recur-type-${type.id}`}>{type.name}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="recur-is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange("is_active", checked)}
              />
              <Label htmlFor="recur-is_active">Active</Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit">
                {editingItem ? "Update" : "Add"} Slot
              </Button>
              <Button type="button" variant="outline" onClick={() => {
                setIsAdding(false);
                setEditingItem(null);
                setFormData({
                  name: "", // Added name
                  day_of_week: "1",
                  start_time: "09:00",
                  end_time: "17:00",
                  appointment_types: [], // Corrected field name
                  is_active: true,
                });
              }}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {recurringAvailability.length === 0 ? (
          <div className="text-center py-8 text-stone-500">
            <CalendarX className="w-12 h-12 mx-auto mb-4" />
            <p>No recurring availability slots set up yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recurringAvailability.map(item => (
              <Card key={item.id} className={!item.is_active ? "opacity-60" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">
                        {item.name}
                      </h4>
                      <p className="text-sm text-stone-600">
                        {daysOfWeek.find(day => parseInt(day.value, 10) === item.day_of_week)?.label}: {item.start_time} - {item.end_time}
                      </p>
                      <p className="text-sm text-stone-600 mt-1">
                        {item.appointment_types && item.appointment_types.length > 0
                          ? `Applies to: ${item.appointment_types.map(id => appointmentTypes.find(t => t.id === id)?.name || id).join(', ')}`
                          : "Applies to all appointment types"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={item.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {item.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => toggleActive(item)}>
                        {item.is_active ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Availability Blocks Management Component
const AvailabilityBlocksManager = ({ availabilityBlocks, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"), // Default to today
    start_time: "09:00",
    end_time: "17:00",
    reason: "",
    is_blocked: true, // Default to blocking
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await AvailabilityBlock.update(editingItem.id, formData);
      } else {
        await AvailabilityBlock.create(formData);
      }
      setIsAdding(false);
      setEditingItem(null);
      setFormData({
        date: format(new Date(), "yyyy-MM-dd"),
        start_time: "09:00",
        end_time: "17:00",
        reason: "",
        is_blocked: true,
      });
      onUpdate();
    } catch (error) {
      console.error("Error saving availability block:", error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      ...item,
      date: item.date // Dates from API might be ISO strings, ensure they are 'yyyy-MM-dd' for input type="date"
    });
    setIsAdding(true);
  };

  const handleDelete = async (itemId) => {
    if (confirm("Delete this availability block?")) {
      await AvailabilityBlock.delete(itemId);
      onUpdate();
    }
  };

  const toggleBlocked = async (item) => {
    await AvailabilityBlock.update(item.id, { is_blocked: !item.is_blocked });
    onUpdate();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Specific Date Blocks</CardTitle>
          <Button onClick={() => setIsAdding(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Block
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-md">
            <h4 className="text-md font-semibold">{editingItem ? "Edit Date Block" : "Add Date Block"}</h4>
            <div>
              <Label>Date</Label>
              <Input type="date" value={formData.date} onChange={(e) => handleInputChange("date", e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <Input type="time" value={formData.start_time} onChange={(e) => handleInputChange("start_time", e.target.value)} required />
              </div>
              <div>
                <Label>End Time</Label>
                <Input type="time" value={formData.end_time} onChange={(e) => handleInputChange("end_time", e.target.value)} required />
              </div>
            </div>
            <div>
              <Label>Reason (Optional)</Label>
              <Textarea value={formData.reason} onChange={(e) => handleInputChange("reason", e.target.value)} placeholder="e.g., Vacation, Public Holiday" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="block-is_blocked"
                checked={formData.is_blocked}
                onCheckedChange={(checked) => handleInputChange("is_blocked", checked)}
              />
              <Label htmlFor="block-is_blocked">Block this time (uncheck to mark as available)</Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit">
                {editingItem ? "Update" : "Add"} Block
              </Button>
              <Button type="button" variant="outline" onClick={() => {
                setIsAdding(false);
                setEditingItem(null);
                setFormData({
                  date: format(new Date(), "yyyy-MM-dd"),
                  start_time: "09:00",
                  end_time: "17:00",
                  reason: "",
                  is_blocked: true,
                });
              }}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {availabilityBlocks.length === 0 ? (
          <div className="text-center py-8 text-stone-500">
            <Calendar className="w-12 h-12 mx-auto mb-4" />
            <p>No specific date blocks set up yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {availabilityBlocks.map(item => (
              <Card key={item.id} className={!item.is_blocked ? "opacity-60" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">
                        {format(parseISO(item.date), 'MMM d, yyyy')}: {item.start_time} - {item.end_time}
                      </h4>
                      {item.reason && <p className="text-sm text-stone-600 mb-1">{item.reason}</p>}
                      <p className="text-sm text-stone-600">
                        Status: {item.is_blocked ? "Blocked" : "Available"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={item.is_blocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                        {item.is_blocked ? "Blocked" : "Open"}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => toggleBlocked(item)}>
                        {item.is_blocked ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};


// Main Component
export default function AdvancedAppointmentManager() {
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [recurringAvailability, setRecurringAvailability] = useState([]);
  const [availabilityBlocks, setAvailabilityBlocks] = useState([]);
  const [bookedAppointments, setBookedAppointments] = useState([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [types, recurring, blocks, appointments] = await Promise.all([
        AppointmentType.list("name"),
        RecurringAvailability.list("day_of_week"),
        AvailabilityBlock.list("-date"),
        BookedAppointment.list("-created_date")
      ]);

      setAppointmentTypes(types);
      setRecurringAvailability(recurring);
      setAvailabilityBlocks(blocks);
      setBookedAppointments(appointments);
    } catch (error) {
      console.error("Error loading appointment data:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Advanced Scheduling System</h2>
          <p className="text-stone-600">Manage appointment types, availability, and bookings</p>
        </div>
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar">
            <CalendarDays className="w-4 h-4 mr-2" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="types">
            <Settings className="w-4 h-4 mr-2" />
            Types ({appointmentTypes.length})
          </TabsTrigger>
          <TabsTrigger value="availability">
            <Calendar className="w-4 h-4 mr-2" />
            Availability
          </TabsTrigger>
          <TabsTrigger value="bookings">
            <BookCheck className="w-4 h-4 mr-2" />
            Bookings ({bookedAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <CalendarView
            appointments={bookedAppointments}
            recurringAvailability={recurringAvailability}
            availabilityBlocks={availabilityBlocks}
            appointmentTypes={appointmentTypes}
            onDateClick={(date) => {
              // Could open a day view or add appointment dialog
              console.log('Date clicked:', format(date, 'yyyy-MM-dd'));
            }}
            onAppointmentClick={(appointment) => {
              // Could open appointment details dialog
              console.log('Appointment clicked:', appointment);
            }}
          />
        </TabsContent>

        <TabsContent value="types">
          <AppointmentTypesManager
            appointmentTypes={appointmentTypes}
            onUpdate={loadAllData}
          />
        </TabsContent>

        <TabsContent value="availability">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <RecurringAvailabilityManager
              recurringAvailability={recurringAvailability}
              appointmentTypes={appointmentTypes}
              onUpdate={loadAllData}
            />
            <AvailabilityBlocksManager
              availabilityBlocks={availabilityBlocks}
              onUpdate={loadAllData}
            />
          </div>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Bookings ({bookedAppointments.length})</CardTitle>
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
                    const appointmentType = appointmentTypes.find(t => t.id === appointment.appointment_type_id);
                    return (
                      <Card key={appointment.id} className="bg-stone-50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {appointmentType && (
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: appointmentType.color }}
                                  />
                                )}
                                <h3 className="font-semibold text-stone-800">{appointment.customer_name}</h3>
                                <Badge className={`bg-${appointment.status === 'confirmed' ? 'green' : appointment.status === 'pending' ? 'yellow' : 'red'}-100 text-${appointment.status === 'confirmed' ? 'green' : appointment.status === 'pending' ? 'yellow' : 'red'}-800`}>
                                  {appointment.status}
                                </Badge>
                              </div>

                              <div className="grid md:grid-cols-2 gap-4 text-sm mb-3">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-stone-400" />
                                  <span>{appointment.customer_email}</span>
                                </div>
                                {appointment.customer_phone && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-stone-400" />
                                    <span>{appointment.customer_phone}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-stone-400" />
                                  <span>{format(parseISO(appointment.date), 'MMM d, yyyy')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-stone-400" />
                                  <span>{appointment.start_time} - {appointment.end_time}</span>
                                </div>
                              </div>

                              {appointmentType && (
                                <div className="mb-2">
                                  <span className="text-sm font-medium text-stone-700">Type:</span>
                                  <span className="text-sm text-stone-600 ml-2">{appointmentType.name}</span>
                                </div>
                              )}

                              {appointment.purpose && (
                                <div className="mb-3">
                                  <span className="text-sm font-medium text-stone-700">Purpose:</span>
                                  <p className="text-sm text-stone-600 mt-1">{appointment.purpose}</p>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-2">
                              {appointment.status === 'pending' && (
                                <>
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                    <Check className="w-4 h-4 mr-1" />
                                    Confirm
                                  </Button>
                                  <Button size="sm" variant="destructive">
                                    <X className="w-4 h-4 mr-1" />
                                    Cancel
                                  </Button>
                                </>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
