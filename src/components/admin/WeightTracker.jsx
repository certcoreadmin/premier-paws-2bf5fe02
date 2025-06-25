import React, { useState } from "react";
import { PuppyWeightRecord } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Scale, Plus, TrendingUp, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function WeightTracker({ puppies, weightRecords, litterId, onUpdate }) {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedPuppy, setSelectedPuppy] = useState("");
  const [formData, setFormData] = useState({
    date_recorded: format(new Date(), 'yyyy-MM-dd'),
    weight_grams: "",
    notes: "",
    health_status: "good"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPuppy) return;

    const birthDate = puppies.find(p => p.id === selectedPuppy)?.birth_date;
    if (!birthDate) return;

    const ageDays = Math.floor((new Date(formData.date_recorded) - new Date(birthDate)) / (1000 * 60 * 60 * 24));

    try {
      await PuppyWeightRecord.create({
        puppy_id: selectedPuppy,
        litter_id: litterId,
        date_recorded: formData.date_recorded,
        age_days: ageDays,
        weight_grams: parseInt(formData.weight_grams),
        weight_pounds: parseInt(formData.weight_grams) / 453.592,
        notes: formData.notes,
        health_status: formData.health_status,
        recorded_by: "Admin"
      });

      setFormData({
        date_recorded: format(new Date(), 'yyyy-MM-dd'),
        weight_grams: "",
        notes: "",
        health_status: "good"
      });
      setSelectedPuppy("");
      setIsAdding(false);
      onUpdate();
    } catch (error) {
      console.error("Error recording weight:", error);
    }
  };

  const getPuppyWeightHistory = (puppyId) => {
    return weightRecords
      .filter(record => record.puppy_id === puppyId)
      .sort((a, b) => new Date(a.date_recorded) - new Date(b.date_recorded));
  };

  const getWeightGain = (puppyId) => {
    const history = getPuppyWeightHistory(puppyId);
    if (history.length < 2) return null;
    
    const latest = history[history.length - 1];
    const previous = history[history.length - 2];
    const gain = latest.weight_grams - previous.weight_grams;
    const days = Math.abs(new Date(latest.date_recorded) - new Date(previous.date_recorded)) / (1000 * 60 * 60 * 24);
    
    return { gain, dailyAverage: gain / days };
  };

  return (
    <div className="space-y-6">
      {/* Quick Weight Entry */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5" />
              Weight Tracking
            </CardTitle>
            <Button onClick={() => setIsAdding(!isAdding)} className="gap-2">
              <Plus className="w-4 h-4" />
              Record Weight
            </Button>
          </div>
        </CardHeader>
        
        {isAdding && (
          <CardContent className="border-t">
            <form onSubmit={handleSubmit} className="grid md:grid-cols-5 gap-4 items-end">
              <div>
                <Label>Puppy</Label>
                <Select value={selectedPuppy} onValueChange={setSelectedPuppy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select puppy" />
                  </SelectTrigger>
                  <SelectContent>
                    {puppies.map(puppy => (
                      <SelectItem key={puppy.id} value={puppy.id}>
                        {puppy.name} ({puppy.gender})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={formData.date_recorded}
                  onChange={(e) => setFormData(prev => ({...prev, date_recorded: e.target.value}))}
                />
              </div>
              
              <div>
                <Label>Weight (grams)</Label>
                <Input
                  type="number"
                  value={formData.weight_grams}
                  onChange={(e) => setFormData(prev => ({...prev, weight_grams: e.target.value}))}
                  placeholder="450"
                />
              </div>
              
              <div>
                <Label>Health</Label>
                <Select value={formData.health_status} onValueChange={(value) => setFormData(prev => ({...prev, health_status: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="concern">Concern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button type="submit" disabled={!selectedPuppy || !formData.weight_grams}>
                Save
              </Button>
            </form>
            
            {formData.notes !== undefined && (
              <div className="mt-4">
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
                  placeholder="Any observations or concerns..."
                  rows={2}
                />
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Weight Summary Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {puppies.map(puppy => {
          const history = getPuppyWeightHistory(puppy.id);
          const latest = history[history.length - 1];
          const weightGain = getWeightGain(puppy.id);
          
          return (
            <Card key={puppy.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {puppy.photos?.[0] && (
                      <img src={puppy.photos[0]} alt={puppy.name} className="w-8 h-8 rounded-full object-cover" />
                    )}
                    <div>
                      <div className="font-medium">{puppy.name}</div>
                      <div className="text-xs text-stone-600">{puppy.gender} • {puppy.color}</div>
                    </div>
                  </div>
                  {latest && (
                    <Badge className={`text-xs ${
                      latest.health_status === 'excellent' ? 'bg-green-100 text-green-800' :
                      latest.health_status === 'good' ? 'bg-blue-100 text-blue-800' :
                      latest.health_status === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {latest.health_status}
                    </Badge>
                  )}
                </div>
                
                {latest ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-stone-600">Current Weight:</span>
                      <span className="font-medium">{(latest.weight_grams / 1000).toFixed(2)} kg</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-stone-600">Age:</span>
                      <span className="text-sm">{latest.age_days} days</span>
                    </div>
                    
                    {weightGain && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-stone-600">Recent Gain:</span>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          <span className="text-sm font-medium text-green-600">
                            +{weightGain.gain}g
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-stone-600">Records:</span>
                      <span className="text-sm">{history.length} entries</span>
                    </div>
                    
                    <div className="text-xs text-stone-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Last: {format(new Date(latest.date_recorded), 'MMM d')}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-stone-500 text-sm">
                    No weight records yet
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Weight History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Weight Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Puppy</th>
                  <th className="text-left p-2">Age (days)</th>
                  <th className="text-left p-2">Weight (kg)</th>
                  <th className="text-left p-2">Health</th>
                  <th className="text-left p-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {weightRecords.slice(0, 20).map(record => {
                  const puppy = puppies.find(p => p.id === record.puppy_id);
                  return (
                    <tr key={record.id} className="border-b hover:bg-stone-50">
                      <td className="p-2">{format(new Date(record.date_recorded), 'MMM d')}</td>
                      <td className="p-2 font-medium">{puppy?.name}</td>
                      <td className="p-2">{record.age_days}</td>
                      <td className="p-2">{(record.weight_grams / 1000).toFixed(2)}</td>
                      <td className="p-2">
                        <Badge className={`text-xs ${
                          record.health_status === 'excellent' ? 'bg-green-100 text-green-800' :
                          record.health_status === 'good' ? 'bg-blue-100 text-blue-800' :
                          record.health_status === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {record.health_status}
                        </Badge>
                      </td>
                      <td className="p-2 text-stone-600">{record.notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}