import React, { useState } from 'react';
import { RecurringAvailability } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2 } from 'lucide-react';

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const RecurringAvailabilityManager = ({ recurringAvailability, appointmentTypes, onUpdate }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingRule, setEditingRule] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        day_of_week: 1,
        start_time: "09:00",
        end_time: "17:00",
        appointment_types: [], // Fixed: changed from appointment_type_ids to appointment_types
        is_active: true
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAppointmentTypeToggle = (typeId) => {
        const currentTypes = formData.appointment_types || [];
        const newTypes = currentTypes.includes(typeId)
            ? currentTypes.filter(id => id !== typeId)
            : [...currentTypes, typeId];
        handleInputChange('appointment_types', newTypes);
    };

    const resetForm = () => {
        setIsAdding(false);
        setEditingRule(null);
        setFormData({
            name: "",
            day_of_week: 1,
            start_time: "09:00",
            end_time: "17:00",
            appointment_types: [],
            is_active: true
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation: ensure name is provided
        if (!formData.name.trim()) {
            alert("Please provide a name for this schedule.");
            return;
        }

        try {
            const dataToSave = {
                ...formData,
                name: formData.name.trim() // Ensure name is trimmed and not empty
            };

            if (editingRule) {
                await RecurringAvailability.update(editingRule.id, dataToSave);
            } else {
                await RecurringAvailability.create(dataToSave);
            }
            resetForm();
            onUpdate();
        } catch (error) {
            console.error("Error saving recurring availability:", error);
            alert("Error saving schedule. Please check all fields and try again.");
        }
    };

    const handleEdit = (rule) => {
        setEditingRule(rule);
        setFormData({
            ...rule,
            appointment_types: rule.appointment_types || []
        });
        setIsAdding(true);
    };
    
    const handleDelete = async (ruleId) => {
        if (confirm("Delete this recurring schedule?")) {
            try {
                await RecurringAvailability.delete(ruleId);
                onUpdate();
            } catch (error) {
                console.error("Error deleting schedule:", error);
                alert("Error deleting schedule.");
            }
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Recurring Schedule</CardTitle>
                    <Button onClick={() => { setIsAdding(true); setEditingRule(null); }} variant="outline" size="sm" className="gap-2">
                        <Plus className="w-4 h-4" /> Add
                    </Button>
                </div>
                <p className="text-sm text-stone-600">Set your standard weekly availability.</p>
            </CardHeader>
            <CardContent>
                {isAdding && (
                    <div className="p-4 border rounded-lg bg-stone-50 mb-6">
                        <h4 className="font-medium mb-4">{editingRule ? "Edit Schedule" : "Add New Schedule"}</h4>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label>Schedule Name *</Label>
                                <Input 
                                    value={formData.name} 
                                    onChange={(e) => handleInputChange('name', e.target.value)} 
                                    placeholder="e.g., Weekday Calls, Saturday Visits" 
                                    required 
                                />
                                <p className="text-xs text-stone-500 mt-1">Give this schedule a descriptive name</p>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <Label>Day of Week</Label>
                                    <Select value={String(formData.day_of_week)} onValueChange={(v) => handleInputChange('day_of_week', parseInt(v))}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {daysOfWeek.map((day, i) => <SelectItem key={i} value={String(i)}>{day}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Start Time</Label>
                                    <Input type="time" value={formData.start_time} onChange={(e) => handleInputChange('start_time', e.target.value)} required/>
                                </div>
                                <div>
                                    <Label>End Time</Label>
                                    <Input type="time" value={formData.end_time} onChange={(e) => handleInputChange('end_time', e.target.value)} required/>
                                </div>
                            </div>
                            <div>
                                <Label>Applicable Appointment Types</Label>
                                <p className="text-xs text-stone-500 mb-2">Select which types are available. If none selected, applies to all.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 border rounded-md">
                                    {(appointmentTypes || []).map(type => (
                                        <div key={type.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`type-${type.id}`}
                                                checked={(formData.appointment_types || []).includes(type.id)}
                                                onCheckedChange={() => handleAppointmentTypeToggle(type.id)}
                                            />
                                            <Label htmlFor={`type-${type.id}`} className="font-normal">{type.name}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                             <div className="flex gap-4">
                                <Button type="submit" disabled={!formData.name.trim()}>
                                    {editingRule ? "Update" : "Create"} Schedule
                                </Button>
                                <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
                            </div>
                        </form>
                    </div>
                )}
                
                <div className="space-y-3">
                    {recurringAvailability.length === 0 && <p className="text-stone-500 text-center py-4">No recurring schedules set.</p>}
                    {recurringAvailability.map(rule => (
                        <div key={rule.id} className="flex items-center justify-between p-3 border rounded-md">
                            <div>
                                <p className="font-semibold">{rule.name}</p>
                                <p className="text-sm text-stone-600">
                                    {daysOfWeek[rule.day_of_week]} from {rule.start_time} to {rule.end_time}
                                </p>
                                {rule.appointment_types && rule.appointment_types.length > 0 && (
                                    <p className="text-xs text-stone-500 mt-1">
                                        Applies to: {rule.appointment_types.map(typeId => 
                                            appointmentTypes.find(t => t.id === typeId)?.name || typeId
                                        ).join(', ')}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(rule)}><Edit className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(rule.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};