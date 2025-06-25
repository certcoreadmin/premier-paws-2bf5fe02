
import React, { useState } from "react";
import { LitterRecord } from "@/api/entities";
import { Dog } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Baby, Clock, Scale, Stethoscope, Plus, Edit, Save, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function LitterBirthRecord({ litter, litterRecord, puppies, onUpdate }) {
  const [isEditing, setIsEditing] = useState(!litterRecord);
  const [formData, setFormData] = useState(litterRecord || {
    birth_date: litter.actual_birth_date || litter.expected_due_date || "",
    birth_time_start: "",
    birth_time_end: "",
    total_born: puppies.length || 0,
    total_alive: puppies.length || 0,
    whelping_notes: "",
    complications: "",
    veterinary_assistance: false,
    birth_weights: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const recordData = {
        ...formData,
        litter_id: litter.id
      };

      if (litterRecord) {
        await LitterRecord.update(litterRecord.id, recordData);
      } else {
        await LitterRecord.create(recordData);
      }

      // Update litter with actual birth date if different
      if (formData.birth_date !== litter.actual_birth_date) {
        await Dog.update(litter.id, { actual_birth_date: formData.birth_date });
      }

      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Error saving birth record:", error);
      alert("Error saving birth record");
    }
  };

  const addBirthWeight = () => {
    setFormData(prev => ({
      ...prev,
      birth_weights: [
        ...prev.birth_weights,
        {
          puppy_temp_id: `temp_${Date.now()}`,
          birth_weight: "",
          birth_time: "",
          gender: "male",
          color_markings: "",
          notes: ""
        }
      ]
    }));
  };

  const updateBirthWeight = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      birth_weights: prev.birth_weights.map((weight, i) => 
        i === index ? { ...weight, [field]: value } : weight
      )
    }));
  };

  const removeBirthWeight = (index) => {
    setFormData(prev => ({
      ...prev,
      birth_weights: prev.birth_weights.filter((_, i) => i !== index)
    }));
  };

  const linkPuppyToBirthRecord = async (puppyId, birthWeightIndex) => {
    // This would link a specific puppy to a birth weight record
    // Implementation would depend on how you want to structure this relationship
    console.log("Linking puppy", puppyId, "to birth record", birthWeightIndex);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Baby className="w-5 h-5" />
              Birth Record - {litter.name}
            </CardTitle>
            {!isEditing && litterRecord && (
              <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                <Edit className="w-4 h-4" />
                Edit Record
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Birth Information */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Actual Birth Date</Label>
                  <Input
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, birth_date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>First Puppy Born (Time)</Label>
                  <Input
                    type="time"
                    value={formData.birth_time_start}
                    onChange={(e) => setFormData(prev => ({ ...prev, birth_time_start: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Last Puppy Born (Time)</Label>
                  <Input
                    type="time"
                    value={formData.birth_time_end}
                    onChange={(e) => setFormData(prev => ({ ...prev, birth_time_end: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Total Puppies Born</Label>
                  <Input
                    type="number"
                    value={formData.total_born}
                    onChange={(e) => setFormData(prev => ({ ...prev, total_born: parseInt(e.target.value) }))}
                    min="0"
                    required
                  />
                </div>
                <div>
                  <Label>Puppies Born Alive</Label>
                  <Input
                    type="number"
                    value={formData.total_alive}
                    onChange={(e) => setFormData(prev => ({ ...prev, total_alive: parseInt(e.target.value) }))}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Whelping Notes</Label>
                <Textarea
                  value={formData.whelping_notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, whelping_notes: e.target.value }))}
                  placeholder="General notes about the whelping process..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Complications (if any)</Label>
                <Textarea
                  value={formData.complications}
                  onChange={(e) => setFormData(prev => ({ ...prev, complications: e.target.value }))}
                  placeholder="Any complications during birth..."
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vet_assistance"
                  checked={formData.veterinary_assistance}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, veterinary_assistance: checked }))}
                />
                <Label htmlFor="vet_assistance">Veterinary assistance was required</Label>
              </div>

              {/* Individual Birth Weights */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label className="text-lg font-medium">Individual Puppy Birth Records</Label>
                  <Button type="button" onClick={addBirthWeight} variant="outline" size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Puppy
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.birth_weights.map((weight, index) => (
                    <div key={weight.puppy_temp_id} className="p-4 border rounded-lg bg-stone-50">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium">Puppy #{index + 1}</h4>
                        <Button 
                          type="button" 
                          onClick={() => removeBirthWeight(index)}
                          variant="ghost" 
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-3 gap-3">
                        <div>
                          <Label>Birth Weight (grams)</Label>
                          <Input
                            type="number"
                            value={weight.birth_weight}
                            onChange={(e) => updateBirthWeight(index, 'birth_weight', parseFloat(e.target.value))}
                            placeholder="450"
                            step="0.1"
                          />
                        </div>
                        <div>
                          <Label>Birth Time</Label>
                          <Input
                            type="time"
                            value={weight.birth_time}
                            onChange={(e) => updateBirthWeight(index, 'birth_time', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Gender</Label>
                          <Select 
                            value={weight.gender} 
                            onValueChange={(value) => updateBirthWeight(index, 'gender', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 mt-3">
                        <div>
                          <Label>Color/Markings</Label>
                          <Input
                            value={weight.color_markings}
                            onChange={(e) => updateBirthWeight(index, 'color_markings', e.target.value)}
                            placeholder="Cream with white chest"
                          />
                        </div>
                        <div>
                          <Label>Notes</Label>
                          <Input
                            value={weight.notes}
                            onChange={(e) => updateBirthWeight(index, 'notes', e.target.value)}
                            placeholder="Any special notes..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Birth Record
                </Button>
                {litterRecord && (
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          ) : (
            /* Display Mode */
            <div className="space-y-6">
              {/* Birth Summary */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-lg font-bold">
                      {format(new Date(litterRecord.birth_date), 'MMM d, yyyy')}
                    </div>
                    <div className="text-sm text-stone-600">Birth Date</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-lg font-bold">
                      {litterRecord.birth_time_start && litterRecord.birth_time_end
                        ? `${litterRecord.birth_time_start} - ${litterRecord.birth_time_end}`
                        : 'Time not recorded'}
                    </div>
                    <div className="text-sm text-stone-600">Birth Times</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Baby className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <div className="text-lg font-bold">
                      {litterRecord.total_alive}/{litterRecord.total_born}
                    </div>
                    <div className="text-sm text-stone-600">Alive/Total</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Stethoscope className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <div className="text-lg font-bold">
                      {litterRecord.veterinary_assistance ? 'Yes' : 'No'}
                    </div>
                    <div className="text-sm text-stone-600">Vet Assistance</div>
                  </CardContent>
                </Card>
              </div>

              {/* Whelping Notes */}
              {litterRecord.whelping_notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Whelping Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-stone-700">{litterRecord.whelping_notes}</p>
                  </CardContent>
                </Card>
              )}

              {/* Complications */}
              {litterRecord.complications && (
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-red-800">Complications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-700">{litterRecord.complications}</p>
                  </CardContent>
                </Card>
              )}

              {/* Birth Weights */}
              {litterRecord.birth_weights && litterRecord.birth_weights.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Individual Birth Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3">Order</th>
                            <th className="text-left p-3">Birth Time</th>
                            <th className="text-left p-3">Gender</th>
                            <th className="text-left p-3">Weight (g)</th>
                            <th className="text-left p-3">Color/Markings</th>
                            <th className="text-left p-3">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {litterRecord.birth_weights.map((weight, index) => (
                            <tr key={weight.puppy_temp_id} className="border-b hover:bg-stone-50">
                              <td className="p-3 font-medium">#{index + 1}</td>
                              <td className="p-3">{weight.birth_time || '-'}</td>
                              <td className="p-3">
                                <Badge className={weight.gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}>
                                  {weight.gender}
                                </Badge>
                              </td>
                              <td className="p-3 font-medium">{weight.birth_weight}g</td>
                              <td className="p-3">{weight.color_markings || '-'}</td>
                              <td className="p-3 text-stone-600">{weight.notes || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
