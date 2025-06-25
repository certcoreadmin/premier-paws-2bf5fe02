import React, { useState } from "react";
import { LitterMilestone } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, CheckCircle, Clock, AlertTriangle, Camera, 
  Calendar, Stethoscope, Scissors, Pill, Home, Eye
} from "lucide-react";
import { format, parseISO, isAfter, isBefore } from "date-fns";

const milestoneIcons = {
  eyes_open: Eye,
  ears_open: Eye,
  first_steps: Home,
  dewclaw_removal: Scissors,
  first_deworming: Pill,
  second_deworming: Pill,
  third_deworming: Pill,
  first_vaccination: Stethoscope,
  second_vaccination: Stethoscope,
  start_weaning: Home,
  full_weaning: Home,
  crate_training_start: Home,
  house_training_start: Home,
  ens_complete: CheckCircle,
  temperament_testing: CheckCircle,
  microchipping: Stethoscope,
  vet_check: Stethoscope,
  ready_to_go: Home,
  custom: Calendar
};

const defaultMilestones = [
  { type: "eyes_open", name: "Eyes Opening", defaultAge: 10, description: "Puppies' eyes begin to open" },
  { type: "ears_open", name: "Ears Opening", defaultAge: 14, description: "Hearing development begins" },
  { type: "first_steps", name: "First Steps", defaultAge: 16, description: "Beginning to walk steadily" },
  { type: "dewclaw_removal", name: "Dewclaw Removal", defaultAge: 3, description: "Optional dewclaw removal procedure", requiresVet: true },
  { type: "first_deworming", name: "First Deworming", defaultAge: 14, description: "Initial deworming treatment" },
  { type: "second_deworming", name: "Second Deworming", defaultAge: 28, description: "Follow-up deworming" },
  { type: "third_deworming", name: "Third Deworming", defaultAge: 42, description: "Final deworming before vaccines" },
  { type: "first_vaccination", name: "First Vaccination", defaultAge: 42, description: "First puppy vaccination series", requiresVet: true },
  { type: "second_vaccination", name: "Second Vaccination", defaultAge: 56, description: "Second vaccination booster", requiresVet: true },
  { type: "start_weaning", name: "Start Weaning", defaultAge: 21, description: "Begin introducing solid food" },
  { type: "full_weaning", name: "Fully Weaned", defaultAge: 35, description: "No longer nursing" },
  { type: "ens_complete", name: "ENS Complete", defaultAge: 16, description: "Early Neurological Stimulation program finished" },
  { type: "temperament_testing", name: "Temperament Testing", defaultAge: 49, description: "Puppy temperament evaluation" },
  { type: "microchipping", name: "Microchipping", defaultAge: 49, description: "Microchip implantation", requiresVet: true },
  { type: "vet_check", name: "Vet Health Check", defaultAge: 49, description: "Pre-adoption veterinary examination", requiresVet: true },
  { type: "ready_to_go", name: "Ready for Families", defaultAge: 56, description: "Puppies ready for adoption" }
];

export default function MilestoneManager({ litterId, milestones, puppies, onUpdate }) {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [formData, setFormData] = useState({
    milestone_type: "",
    milestone_name: "",
    scheduled_date: "",
    notes: "",
    applies_to_puppies: [],
    veterinarian: ""
  });
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  const calculateMilestoneDate = (birthDate, ageDays) => {
    if (!birthDate) return "";
    const birth = new Date(birthDate);
    const milestone = new Date(birth.getTime() + (ageDays * 24 * 60 * 60 * 1000));
    return format(milestone, 'yyyy-MM-dd');
  };

  const generateDefaultMilestones = async () => {
    if (!puppies.length || !puppies[0].birth_date) {
      alert("Need puppies with birth dates to generate milestones");
      return;
    }

    const birthDate = puppies[0].birth_date;
    
    try {
      const promises = defaultMilestones.map(milestone => 
        LitterMilestone.create({
          litter_id: litterId,
          milestone_type: milestone.type,
          milestone_name: milestone.name,
          scheduled_date: calculateMilestoneDate(birthDate, milestone.defaultAge),
          notes: milestone.description,
          applies_to_puppies: [], // Empty means all puppies
          veterinarian: milestone.requiresVet ? "" : null
        })
      );

      await Promise.all(promises);
      onUpdate();
      alert("Default milestones generated successfully!");
    } catch (error) {
      console.error("Error generating milestones:", error);
      alert("Error generating milestones");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const milestoneData = {
        litter_id: litterId,
        milestone_type: formData.milestone_type,
        milestone_name: formData.milestone_name || defaultMilestones.find(m => m.type === formData.milestone_type)?.name,
        scheduled_date: formData.scheduled_date,
        notes: formData.notes,
        applies_to_puppies: formData.applies_to_puppies,
        veterinarian: formData.veterinarian || null
      };

      if (selectedMilestone) {
        await LitterMilestone.update(selectedMilestone.id, milestoneData);
      } else {
        await LitterMilestone.create(milestoneData);
      }

      resetForm();
      onUpdate();
    } catch (error) {
      console.error("Error saving milestone:", error);
      alert("Error saving milestone");
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setSelectedMilestone(null);
    setFormData({
      milestone_type: "",
      milestone_name: "",
      scheduled_date: "",
      notes: "",
      applies_to_puppies: [],
      veterinarian: ""
    });
  };

  const completeMilestone = async (milestone) => {
    try {
      await LitterMilestone.update(milestone.id, {
        ...milestone,
        status: 'completed',
        completed_date: format(new Date(), 'yyyy-MM-dd')
      });
      onUpdate();
    } catch (error) {
      console.error("Error completing milestone:", error);
    }
  };

  const handlePhotoUpload = async (files, milestoneId) => {
    setUploadingPhotos(true);
    const uploadedUrls = [];
    
    for (const file of files) {
      try {
        const { file_url } = await UploadFile({ file });
        uploadedUrls.push(file_url);
      } catch (error) {
        console.error("Upload error:", error);
      }
    }

    const milestone = milestones.find(m => m.id === milestoneId);
    const existingPhotos = milestone.photos || [];
    
    try {
      await LitterMilestone.update(milestoneId, {
        ...milestone,
        photos: [...existingPhotos, ...uploadedUrls]
      });
      onUpdate();
    } catch (error) {
      console.error("Error saving photos:", error);
    }
    
    setUploadingPhotos(false);
  };

  const handlePuppyToggle = (puppyId) => {
    const current = formData.applies_to_puppies || [];
    const updated = current.includes(puppyId)
      ? current.filter(id => id !== puppyId)
      : [...current, puppyId];
    setFormData(prev => ({ ...prev, applies_to_puppies: updated }));
  };

  const getMilestoneStatus = (milestone) => {
    const today = new Date();
    const scheduledDate = new Date(milestone.scheduled_date);
    
    if (milestone.status === 'completed') return 'completed';
    if (isBefore(scheduledDate, today)) return 'overdue';
    if (isAfter(scheduledDate, new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000))) return 'upcoming';
    return 'due_soon';
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: { class: "bg-green-100 text-green-800", icon: CheckCircle, text: "Completed" },
      overdue: { class: "bg-red-100 text-red-800", icon: AlertTriangle, text: "Overdue" },
      due_soon: { class: "bg-amber-100 text-amber-800", icon: Clock, text: "Due Soon" },
      upcoming: { class: "bg-blue-100 text-blue-800", icon: Calendar, text: "Upcoming" }
    };
    return badges[status] || badges.upcoming;
  };

  const groupedMilestones = milestones.reduce((groups, milestone) => {
    const status = getMilestoneStatus(milestone);
    if (!groups[status]) groups[status] = [];
    groups[status].push(milestone);
    return groups;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Litter Milestones
            </CardTitle>
            <div className="flex gap-2">
              {milestones.length === 0 && (
                <Button onClick={generateDefaultMilestones} variant="outline" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Generate Default
                </Button>
              )}
              <Button onClick={() => setIsAdding(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Milestone
              </Button>
            </div>
          </div>
        </CardHeader>

        {isAdding && (
          <CardContent className="border-t">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Milestone Type</Label>
                  <Select value={formData.milestone_type} onValueChange={(value) => {
                    const defaultMilestone = defaultMilestones.find(m => m.type === value);
                    setFormData(prev => ({
                      ...prev,
                      milestone_type: value,
                      milestone_name: defaultMilestone?.name || "",
                      notes: defaultMilestone?.description || ""
                    }));
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select milestone type" />
                    </SelectTrigger>
                    <SelectContent>
                      {defaultMilestones.map(milestone => (
                        <SelectItem key={milestone.type} value={milestone.type}>
                          {milestone.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Custom Milestone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Custom Name (Optional)</Label>
                  <Input
                    value={formData.milestone_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, milestone_name: e.target.value }))}
                    placeholder="Custom milestone name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Scheduled Date</Label>
                  <Input
                    type="date"
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduled_date: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label>Veterinarian (if applicable)</Label>
                  <Input
                    value={formData.veterinarian}
                    onChange={(e) => setFormData(prev => ({ ...prev, veterinarian: e.target.value }))}
                    placeholder="Dr. Smith"
                  />
                </div>
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes about this milestone..."
                  rows={2}
                />
              </div>

              <div>
                <Label>Applies to Specific Puppies (leave empty for all)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {puppies.map(puppy => (
                    <div key={puppy.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`puppy-${puppy.id}`}
                        checked={(formData.applies_to_puppies || []).includes(puppy.id)}
                        onCheckedChange={() => handlePuppyToggle(puppy.id)}
                      />
                      <Label htmlFor={`puppy-${puppy.id}`} className="text-sm">
                        {puppy.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit">Save Milestone</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Milestone Groups */}
      {Object.entries(groupedMilestones).map(([status, statusMilestones]) => {
        const badge = getStatusBadge(status);
        return (
          <Card key={status}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <badge.icon className="w-5 h-5" />
                {badge.text} ({statusMilestones.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusMilestones.map(milestone => {
                  const Icon = milestoneIcons[milestone.milestone_type] || Calendar;
                  const appliedPuppies = milestone.applies_to_puppies?.length > 0 
                    ? puppies.filter(p => milestone.applies_to_puppies.includes(p.id))
                    : puppies;
                  
                  return (
                    <div key={milestone.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex items-start gap-3 flex-1">
                        <Icon className="w-5 h-5 mt-1 text-stone-600" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">
                              {milestone.milestone_name || milestone.milestone_type.replace('_', ' ')}
                            </h4>
                            <Badge className={badge.class}>
                              {badge.text}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-stone-600 space-y-1">
                            <div>Scheduled: {format(parseISO(milestone.scheduled_date), 'MMM d, yyyy')}</div>
                            {milestone.completed_date && (
                              <div>Completed: {format(parseISO(milestone.completed_date), 'MMM d, yyyy')}</div>
                            )}
                            {milestone.veterinarian && (
                              <div>Veterinarian: {milestone.veterinarian}</div>
                            )}
                            {appliedPuppies.length < puppies.length && (
                              <div>Applies to: {appliedPuppies.map(p => p.name).join(', ')}</div>
                            )}
                            {milestone.notes && (
                              <div className="italic">{milestone.notes}</div>
                            )}
                          </div>

                          {milestone.photos && milestone.photos.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {milestone.photos.map((photo, idx) => (
                                <img
                                  key={idx}
                                  src={photo}
                                  alt={`Milestone ${idx + 1}`}
                                  className="w-16 h-16 object-cover rounded"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {milestone.status !== 'completed' && (
                          <Button
                            size="sm"
                            onClick={() => completeMilestone(milestone)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Complete
                          </Button>
                        )}
                        
                        <div className="relative">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handlePhotoUpload(e.target.files, milestone.id)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={uploadingPhotos}
                          />
                          <Button size="sm" variant="outline" disabled={uploadingPhotos}>
                            <Camera className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}