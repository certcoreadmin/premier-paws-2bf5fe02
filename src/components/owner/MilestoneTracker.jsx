
import React, { useState, useEffect } from 'react';
import { PuppyMilestone, UploadFile } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Calendar, Edit, Save, X, Trophy } from 'lucide-react';
import { format } from 'date-fns';

export default function MilestoneTracker({ puppyId }) {
  const [milestones, setMilestones] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    date: '',
    milestone_type: 'custom',
    photos: []
  });

  useEffect(() => {
    loadMilestones();
  }, [puppyId]);

  const loadMilestones = async () => {
    if (!puppyId) return;
    try {
      const puppyMilestones = await PuppyMilestone.filter({ puppy_id: puppyId }, '-date');
      setMilestones(puppyMilestones);
    } catch (error) {
      console.error('Error loading milestones:', error);
    }
  };

  const handleInputChange = (field, value) => {
    const target = editingMilestone ? setEditingMilestone : setNewMilestone;
    target(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const isEditing = !!editingMilestone;
    const dataToSave = isEditing ? editingMilestone : { ...newMilestone, puppy_id: puppyId };

    try {
      if (isEditing) {
        await PuppyMilestone.update(editingMilestone.id, dataToSave);
      } else {
        await PuppyMilestone.create(dataToSave);
      }
      resetForm();
      await loadMilestones();
    } catch (error) {
      console.error('Error saving milestone:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this milestone?')) return;
    try {
      await PuppyMilestone.delete(id);
      await loadMilestones();
    } catch (error) {
      console.error('Error deleting milestone:', error);
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingMilestone(null);
    setNewMilestone({ title: '', description: '', date: '', milestone_type: 'custom', photos: [] });
  };
  
  const FormComponent = ({ data, isEditing }) => (
    <Card className="my-4 bg-stone-50">
      <CardContent className="p-6 space-y-4">
        <Input 
          placeholder="Milestone Title (e.g., First Swim)" 
          value={data.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
        />
        <div className="grid md:grid-cols-2 gap-4">
          <Input 
            type="date"
            value={data.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
          />
           <Select value={data.milestone_type} onValueChange={(value) => handleInputChange('milestone_type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Milestone Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="custom">Custom Milestone</SelectItem>
              <SelectItem value="gotcha_day">Gotcha Day</SelectItem>
              <SelectItem value="first_vet">First Vet Visit</SelectItem>
              <SelectItem value="training_graduation">Training Graduation</SelectItem>
              <SelectItem value="birthday">Birthday</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Textarea 
          placeholder="Description" 
          value={data.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
        <div className="flex gap-2">
          <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" /> Save</Button>
          <Button variant="outline" onClick={resetForm}><X className="w-4 h-4 mr-2" /> Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-600" />
          Milestone Tracker
        </CardTitle>
        {!isAdding && !editingMilestone && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Milestone
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isAdding && <FormComponent data={newMilestone} isEditing={false} />}
        
        <div className="space-y-4">
          {milestones.length === 0 && !isAdding && (
            <p className="text-stone-500 text-center py-4">No milestones added yet. Click "Add Milestone" to start!</p>
          )}
          {milestones.map((milestone) => (
            editingMilestone?.id === milestone.id ? (
              <FormComponent key={milestone.id} data={editingMilestone} isEditing={true} />
            ) : (
              <Card key={milestone.id}>
                <CardContent className="p-4 flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-stone-800">{milestone.title}</p>
                    <p className="text-sm text-stone-600">{milestone.description}</p>
                    <p className="text-xs text-stone-500 mt-2 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {format(new Date(milestone.date), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setEditingMilestone(milestone)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(milestone.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
