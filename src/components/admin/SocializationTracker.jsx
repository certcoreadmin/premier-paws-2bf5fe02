import React, { useState } from "react";
import { SocializationLog } from "@/api/entities";
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
  Plus, Heart, Users, Volume2, Hand, Car, TreePine, 
  Camera, Clock, Thermometer, Cloud, Brain, Baby
} from "lucide-react";
import { format } from "date-fns";

const activityTypes = [
  { 
    type: "ens_exercise", 
    name: "ENS Exercise", 
    icon: Brain, 
    description: "Early Neurological Stimulation exercises",
    color: "bg-purple-100 text-purple-800"
  },
  { 
    type: "sound_exposure", 
    name: "Sound Exposure", 
    icon: Volume2, 
    description: "Exposure to various sounds and noises",
    color: "bg-blue-100 text-blue-800"
  },
  { 
    type: "surface_exposure", 
    name: "Surface Exposure", 
    icon: Hand, 
    description: "Different textures and surfaces",
    color: "bg-green-100 text-green-800"
  },
  { 
    type: "human_interaction", 
    name: "Human Interaction", 
    icon: Users, 
    description: "Socialization with different people",
    color: "bg-amber-100 text-amber-800"
  },
  { 
    type: "children_interaction", 
    name: "Children Interaction", 
    icon: Baby, 
    description: "Specific exposure to children",
    color: "bg-pink-100 text-pink-800"
  },
  { 
    type: "other_dogs", 
    name: "Other Dogs", 
    icon: Heart, 
    description: "Interaction with other dogs",
    color: "bg-red-100 text-red-800"
  },
  { 
    type: "car_ride", 
    name: "Car Ride", 
    icon: Car, 
    description: "Vehicle travel experience",
    color: "bg-indigo-100 text-indigo-800"
  },
  { 
    type: "outdoor_exploration", 
    name: "Outdoor Exploration", 
    icon: TreePine, 
    description: "Outside environment exposure",
    color: "bg-emerald-100 text-emerald-800"
  },
  { 
    type: "crate_training", 
    name: "Crate Training", 
    icon: Users, 
    description: "Crate familiarization",
    color: "bg-stone-100 text-stone-800"
  },
  { 
    type: "grooming_practice", 
    name: "Grooming Practice", 
    icon: Hand, 
    description: "Handling and grooming exercises",
    color: "bg-cyan-100 text-cyan-800"
  },
  { 
    type: "handling_exercise", 
    name: "Handling Exercise", 
    icon: Hand, 
    description: "Body handling and touch desensitization",
    color: "bg-orange-100 text-orange-800"
  }
];

const responseOptions = [
  { value: "excellent", label: "Excellent", color: "bg-green-100 text-green-800" },
  { value: "good", label: "Good", color: "bg-blue-100 text-blue-800" },
  { value: "neutral", label: "Neutral", color: "bg-gray-100 text-gray-800" },
  { value: "fearful", label: "Fearful", color: "bg-yellow-100 text-yellow-800" },
  { value: "aggressive", label: "Aggressive", color: "bg-red-100 text-red-800" }
];

export default function SocializationTracker({ litterId, puppies, socializationLogs, onUpdate }) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    activity_type: "",
    activity_name: "",
    description: "",
    duration_minutes: 15,
    puppies_involved: [],
    individual_responses: [],
    temperature: "",
    weather_conditions: ""
  });
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const calculateAgeWeeks = (birthDate, activityDate) => {
    if (!birthDate || !activityDate) return 0;
    const birth = new Date(birthDate);
    const activity = new Date(activityDate);
    const diffTime = Math.abs(activity - birth);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const birthDate = puppies[0]?.birth_date;
    const ageWeeks = calculateAgeWeeks(birthDate, formData.date);
    
    try {
      const logData = {
        litter_id: litterId,
        date: formData.date,
        age_weeks: ageWeeks,
        activity_type: formData.activity_type,
        activity_name: formData.activity_name,
        description: formData.description,
        duration_minutes: parseInt(formData.duration_minutes),
        puppies_involved: formData.puppies_involved,
        individual_responses: formData.individual_responses,
        temperature: parseFloat(formData.temperature) || null,
        weather_conditions: formData.weather_conditions,
        photos: [],
        videos: []
      };

      await SocializationLog.create(logData);
      resetForm();
      onUpdate();
    } catch (error) {
      console.error("Error saving socialization log:", error);
      alert("Error saving log");
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      activity_type: "",
      activity_name: "",
      description: "",
      duration_minutes: 15,
      puppies_involved: [],
      individual_responses: [],
      temperature: "",
      weather_conditions: ""
    });
  };

  const handlePuppyToggle = (puppyId) => {
    const current = formData.puppies_involved || [];
    const updated = current.includes(puppyId)
      ? current.filter(id => id !== puppyId)
      : [...current, puppyId];
    
    // Also update individual responses
    const responses = formData.individual_responses || [];
    const updatedResponses = updated.map(id => {
      const existing = responses.find(r => r.puppy_id === id);
      return existing || { puppy_id: id, response: "good", notes: "" };
    });

    setFormData(prev => ({ 
      ...prev, 
      puppies_involved: updated,
      individual_responses: updatedResponses
    }));
  };

  const handleResponseChange = (puppyId, field, value) => {
    const responses = formData.individual_responses || [];
    const updated = responses.map(r => 
      r.puppy_id === puppyId ? { ...r, [field]: value } : r
    );
    setFormData(prev => ({ ...prev, individual_responses: updated }));
  };

  const handleMediaUpload = async (files, logId, type = 'photos') => {
    setUploadingMedia(true);
    const uploadedUrls = [];
    
    for (const file of files) {
      try {
        const { file_url } = await UploadFile({ file });
        uploadedUrls.push(file_url);
      } catch (error) {
        console.error("Upload error:", error);
      }
    }

    const log = socializationLogs.find(l => l.id === logId);
    const existingMedia = log[type] || [];
    
    try {
      await SocializationLog.update(logId, {
        ...log,
        [type]: [...existingMedia, ...uploadedUrls]
      });
      onUpdate();
    } catch (error) {
      console.error("Error saving media:", error);
    }
    
    setUploadingMedia(false);
  };

  const getActivityIcon = (activityType) => {
    const activity = activityTypes.find(a => a.type === activityType);
    return activity?.icon || Heart;
  };

  const getActivityColor = (activityType) => {
    const activity = activityTypes.find(a => a.type === activityType);
    return activity?.color || "bg-stone-100 text-stone-800";
  };

  const getResponseColor = (response) => {
    const responseOption = responseOptions.find(r => r.value === response);
    return responseOption?.color || "bg-gray-100 text-gray-800";
  };

  const groupedLogs = socializationLogs.reduce((groups, log) => {
    const week = `Week ${log.age_weeks}`;
    if (!groups[week]) groups[week] = [];
    groups[week].push(log);
    return groups;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Socialization & Enrichment Log
            </CardTitle>
            <Button onClick={() => setIsAdding(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Log Activity
            </Button>
          </div>
        </CardHeader>

        {isAdding && (
          <CardContent className="border-t">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label>Activity Type</Label>
                  <Select value={formData.activity_type} onValueChange={(value) => {
                    const activity = activityTypes.find(a => a.type === value);
                    setFormData(prev => ({
                      ...prev,
                      activity_type: value,
                      activity_name: activity?.name || "",
                      description: activity?.description || ""
                    }));
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityTypes.map(activity => (
                        <SelectItem key={activity.type} value={activity.type}>
                          {activity.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Custom Activity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: e.target.value }))}
                    min="5"
                    max="120"
                  />
                </div>
              </div>

              <div>
                <Label>Custom Activity Name (if different)</Label>
                <Input
                  value={formData.activity_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, activity_name: e.target.value }))}
                  placeholder="Custom activity name"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the activity in detail..."
                  rows={3}
                  required
                />
              </div>

              {/* Weather info for outdoor activities */}
              {(formData.activity_type === 'outdoor_exploration' || formData.activity_type === 'car_ride') && (
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                  <div>
                    <Label className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4" />
                      Temperature (°F)
                    </Label>
                    <Input
                      type="number"
                      value={formData.temperature}
                      onChange={(e) => setFormData(prev => ({ ...prev, temperature: e.target.value }))}
                      placeholder="72"
                    />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Cloud className="w-4 h-4" />
                      Weather Conditions
                    </Label>
                    <Input
                      value={formData.weather_conditions}
                      onChange={(e) => setFormData(prev => ({ ...prev, weather_conditions: e.target.value }))}
                      placeholder="Sunny, cloudy, light rain..."
                    />
                  </div>
                </div>
              )}

              <div>
                <Label>Puppies Involved (leave empty for all)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {puppies.map(puppy => (
                    <div key={puppy.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`activity-puppy-${puppy.id}`}
                        checked={(formData.puppies_involved || []).includes(puppy.id)}
                        onCheckedChange={() => handlePuppyToggle(puppy.id)}
                      />
                      <Label htmlFor={`activity-puppy-${puppy.id}`} className="text-sm">
                        {puppy.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual responses */}
              {formData.puppies_involved.length > 0 && (
                <div>
                  <Label>Individual Puppy Responses</Label>
                  <div className="space-y-3 mt-2">
                    {formData.puppies_involved.map(puppyId => {
                      const puppy = puppies.find(p => p.id === puppyId);
                      const response = formData.individual_responses.find(r => r.puppy_id === puppyId);
                      
                      return (
                        <div key={puppyId} className="flex items-center gap-4 p-3 border rounded-lg">
                          <div className="font-medium w-20">{puppy?.name}</div>
                          <Select 
                            value={response?.response || "good"} 
                            onValueChange={(value) => handleResponseChange(puppyId, 'response', value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {responseOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Notes about this puppy's response..."
                            value={response?.notes || ""}
                            onChange={(e) => handleResponseChange(puppyId, 'notes', e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button type="submit">Save Activity Log</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Activity Summary */}
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        {activityTypes.map(activity => {
          const count = socializationLogs.filter(log => log.activity_type === activity.type).length;
          const Icon = activity.icon;
          
          return (
            <Card key={activity.type}>
              <CardContent className="p-4 text-center">
                <Icon className="w-8 h-8 mx-auto mb-2 text-stone-600" />
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-stone-600">{activity.name}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Weekly Activity Log */}
      {Object.entries(groupedLogs)
        .sort(([a], [b]) => {
          const weekA = parseInt(a.split(' ')[1]);
          const weekB = parseInt(b.split(' ')[1]);
          return weekB - weekA; // Most recent first
        })
        .map(([week, weekLogs]) => {
          return (
            <Card key={week}>
              <CardHeader>
                <CardTitle>{week} ({weekLogs.length} activities)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weekLogs.map(log => {
                    const Icon = getActivityIcon(log.activity_type);
                    const participatingPuppies = log.puppies_involved?.length > 0 
                      ? puppies.filter(p => log.puppies_involved.includes(p.id))
                      : puppies;
                    
                    return (
                      <div key={log.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-stone-600" />
                            <div>
                              <h4 className="font-medium">
                                {log.activity_name || log.activity_type.replace('_', ' ')}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-stone-600">
                                <span>{format(new Date(log.date), 'MMM d')}</span>
                                <Clock className="w-3 h-3" />
                                <span>{log.duration_minutes} min</span>
                                {log.temperature && (
                                  <>
                                    <Thermometer className="w-3 h-3" />
                                    <span>{log.temperature}°F</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge className={getActivityColor(log.activity_type)}>
                              {log.activity_type.replace('_', ' ')}
                            </Badge>
                            
                            <div className="relative">
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => handleMediaUpload(e.target.files, log.id, 'photos')}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={uploadingMedia}
                              />
                              <Button size="sm" variant="outline" disabled={uploadingMedia}>
                                <Camera className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <p className="text-stone-700 mb-3">{log.description}</p>

                        {log.weather_conditions && (
                          <p className="text-sm text-stone-600 mb-3">
                            Weather: {log.weather_conditions}
                          </p>
                        )}

                        {participatingPuppies.length < puppies.length && (
                          <div className="mb-3">
                            <span className="text-sm font-medium">Participants: </span>
                            <span className="text-sm text-stone-600">
                              {participatingPuppies.map(p => p.name).join(', ')}
                            </span>
                          </div>
                        )}

                        {log.individual_responses && log.individual_responses.length > 0 && (
                          <div className="mb-3">
                            <div className="text-sm font-medium mb-2">Individual Responses:</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {log.individual_responses.map(response => {
                                const puppy = puppies.find(p => p.id === response.puppy_id);
                                return (
                                  <div key={response.puppy_id} className="flex items-center gap-2 text-sm">
                                    <span className="font-medium">{puppy?.name}:</span>
                                    <Badge className={getResponseColor(response.response)}>
                                      {response.response}
                                    </Badge>
                                    {response.notes && (
                                      <span className="text-stone-600 text-xs">
                                        {response.notes}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {log.photos && log.photos.length > 0 && (
                          <div className="flex gap-2 mt-3">
                            {log.photos.map((photo, idx) => (
                              <img
                                key={idx}
                                src={photo}
                                alt={`Activity ${idx + 1}`}
                                className="w-20 h-20 object-cover rounded"
                              />
                            ))}
                          </div>
                        )}
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