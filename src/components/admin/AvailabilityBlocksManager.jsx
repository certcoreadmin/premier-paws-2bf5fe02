import React, { useState } from 'react';
import { AvailabilityBlock } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { format, parseISO, isPast } from 'date-fns';

export const AvailabilityBlocksManager = ({ availabilityBlocks, onUpdate }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingBlock, setEditingBlock] = useState(null);
    const [formData, setFormData] = useState({
        date: "",
        start_time: "09:00",
        end_time: "17:00",
        type: "block",
        reason: "",
    });

    const resetForm = () => {
        setIsAdding(false);
        setEditingBlock(null);
        setFormData({
            date: "",
            start_time: "09:00",
            end_time: "17:00",
            type: "block",
            reason: "",
        });
    };
    
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBlock) {
                await AvailabilityBlock.update(editingBlock.id, formData);
            } else {
                await AvailabilityBlock.create(formData);
            }
            resetForm();
            onUpdate();
        } catch (error) {
            console.error("Error saving availability block:", error);
        }
    };

    const handleEdit = (block) => {
        setEditingBlock(block);
        setFormData(block);
        setIsAdding(true);
    };

    const handleDelete = async (blockId) => {
        if (confirm("Delete this date override?")) {
            await AvailabilityBlock.delete(blockId);
            onUpdate();
        }
    };
    
    const upcomingBlocks = availabilityBlocks.filter(b => !isPast(parseISO(b.date)));

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Date Overrides</CardTitle>
                    <Button onClick={() => { setIsAdding(true); setEditingBlock(null); }} variant="outline" size="sm" className="gap-2">
                        <Plus className="w-4 h-4" /> Add
                    </Button>
                </div>
                 <p className="text-sm text-stone-600">Block off holidays or add special availability.</p>
            </CardHeader>
            <CardContent>
                {isAdding && (
                    <div className="p-4 border rounded-lg bg-stone-50 mb-6">
                        <h4 className="font-medium mb-4">{editingBlock ? "Edit Override" : "Add New Override"}</h4>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Date</Label>
                                    <Input type="date" value={formData.date} onChange={(e) => handleInputChange('date', e.target.value)} required />
                                </div>
                                <div>
                                    <Label>Type</Label>
                                    <Select value={formData.type} onValueChange={(v) => handleInputChange('type', v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="block">Block Time Off</SelectItem>
                                            <SelectItem value="add">Add Extra Availability</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                             <div className="grid md:grid-cols-2 gap-4">
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
                                <Label>Reason / Description</Label>
                                <Input value={formData.reason} onChange={(e) => handleInputChange('reason', e.target.value)} placeholder="e.g., Holiday, Vet Appointment" />
                            </div>
                            <div className="flex gap-4">
                                <Button type="submit">{editingBlock ? "Update" : "Create"} Override</Button>
                                <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
                            </div>
                        </form>
                    </div>
                )}
                
                <div className="space-y-3">
                    {upcomingBlocks.length === 0 && <p className="text-stone-500 text-center py-4">No upcoming date overrides.</p>}
                    {upcomingBlocks.map(block => (
                        <div key={block.id} className={`flex items-center justify-between p-3 border rounded-md ${block.type === 'block' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                            <div>
                                <p className="font-semibold">{format(parseISO(block.date), 'MMM d, yyyy')} - <span className="capitalize">{block.type}</span></p>
                                <p className="text-sm text-stone-600">
                                    {block.start_time} to {block.end_time} {block.reason && `(${block.reason})`}
                                </p>
                            </div>
                             <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(block)}><Edit className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(block.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};