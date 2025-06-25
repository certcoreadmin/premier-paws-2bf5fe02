import React, { useState, useEffect } from "react";
import { HeatCycle } from "@/api/entities";
import { Dog } from "@/api/entities";
import { BreedingPlan } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, Heart, TrendingUp, Clock, AlertCircle, Plus, 
  Edit, Eye, Activity, TestTube, Baby, Target, CheckCircle,
  Bell, ArrowRight, ChevronRight
} from "lucide-react";
import { format, addDays, differenceInDays, parseISO, addMonths, isBefore, isAfter } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function HeatCycleTracker() {
  const [females, setFemales] = useState([]);
  const [heatCycles, setHeatCycles] = useState([]);
  const [breedingPlans, setBreedingPlans] = useState([]);
  const [selectedFemale, setSelectedFemale] = useState(null);
  const [isAddingCycle, setIsAddingCycle] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  const [cycleForm, setCycleForm] = useState({
    dog_id: "",
    proestrus_start: "",
    estrus_start: "",
    estrus_end: "",
    cycle_end: "",
    is_planned_breeding: false,
    veterinary_notes: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [femaleList, cycleList, planList] = await Promise.all([
        Dog.filter({ type: "parent", gender: "female" }),
        HeatCycle.list("-proestrus_start"),
        BreedingPlan.list("-created_date")
      ]);
      setFemales(femaleList);
      setHeatCycles(cycleList);
      setBreedingPlans(planList);
    } catch (error) {
      console.error("Error loading heat cycle data:", error);
    }
  };

  const calculateAverageCycleLength = (dogId) => {
    const dogCycles = heatCycles.filter(cycle => cycle.dog_id === dogId && cycle.cycle_length_days);
    if (dogCycles.length === 0) return 180; // Default 6 months
    
    const totalDays = dogCycles.reduce((sum, cycle) => sum + cycle.cycle_length_days, 0);
    return Math.round(totalDays / dogCycles.length);
  };

  const predictNextHeat = (dogId) => {
    const dogCycles = heatCycles.filter(cycle => cycle.dog_id === dogId).sort((a, b) => 
      new Date(b.proestrus_start) - new Date(a.proestrus_start)
    );
    
    if (dogCycles.length === 0) return null;
    
    const lastCycle = dogCycles[0];
    const avgLength = calculateAverageCycleLength(dogId);
    const lastStart = parseISO(lastCycle.proestrus_start);
    const predictedNext = addDays(lastStart, avgLength);
    
    const confidence = dogCycles.length > 2 ? "high" : dogCycles.length > 1 ? "medium" : "low";
    
    return {
      predictedDate: predictedNext,
      confidence,
      daysUntil: differenceInDays(predictedNext, new Date()),
      avgCycleLength: avgLength
    };
  };

  const getCurrentStatus = (dogId) => {
    const activeCycle = heatCycles.find(cycle => 
      cycle.dog_id === dogId && cycle.status === "active"
    );
    
    if (!activeCycle) return "Not in heat";
    
    const today = new Date();
    const proestrus = parseISO(activeCycle.proestrus_start);
    const estrus = activeCycle.estrus_start ? parseISO(activeCycle.estrus_start) : null;
    const estrusEnd = activeCycle.estrus_end ? parseISO(activeCycle.estrus_end) : null;
    
    if (estrusEnd && isAfter(today, estrusEnd)) return "Diestrus";
    if (estrus && isAfter(today, estrus)) return "Estrus (Receptive)";
    if (isAfter(today, proestrus)) return "Proestrus";
    
    return "Not in heat";
  };

  const handleSubmitCycle = async (e) => {
    e.preventDefault();
    try {
      let cycleData = { ...cycleForm };
      if (cycleForm.proestrus_start && cycleForm.cycle_end) {
        const start = parseISO(cycleForm.proestrus_start);
        const end = parseISO(cycleForm.cycle_end);
        cycleData.cycle_length_days = differenceInDays(end, start);
      }
      
      await HeatCycle.create(cycleData);
      setIsAddingCycle(false);
      setCycleForm({
        dog_id: "",
        proestrus_start: "",
        estrus_start: "",
        estrus_end: "",
        cycle_end: "",
        is_planned_breeding: false,
        veterinary_notes: ""
      });
      await loadData();
    } catch (error) {
      console.error("Error saving heat cycle:", error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      "Not in heat": "bg-gray-100 text-gray-800",
      "Proestrus": "bg-yellow-100 text-yellow-800", 
      "Estrus (Receptive)": "bg-red-100 text-red-800",
      "Diestrus": "bg-blue-100 text-blue-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getConfidenceColor = (confidence) => {
    const colors = {
      high: "text-green-600",
      medium: "text-yellow-600",
      low: "text-red-600"
    };
    return colors[confidence] || "text-gray-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Heat Cycle Tracker</h2>
        <Button onClick={() => setIsAddingCycle(true)} className="bg-pink-600 hover:bg-pink-700">
          <Plus className="w-4 h-4 mr-2" />
          Record Heat Cycle
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {females.map((female) => {
              const status = getCurrentStatus(female.id);
              const prediction = predictNextHeat(female.id);
              
              return (
                <Card key={female.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{female.name}</CardTitle>
                      <Badge className={getStatusColor(status)}>
                        {status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {prediction && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Next Heat Predicted:</span>
                          <span className="font-medium">
                            {format(prediction.predictedDate, 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Days Until:</span>
                          <span className={`font-medium ${prediction.daysUntil < 30 ? 'text-red-600' : 'text-gray-900'}`}>
                            {prediction.daysUntil > 0 ? prediction.daysUntil : 'Overdue'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Confidence:</span>
                          <span className={`font-medium ${getConfidenceColor(prediction.confidence)}`}>
                            {prediction.confidence.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFemale(female)}
                      className="w-full"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Breeding Calendar Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {females.map((female) => {
                  const prediction = predictNextHeat(female.id);
                  if (!prediction) return null;
                  
                  return (
                    <div key={female.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{female.name}</h4>
                        <p className="text-sm text-gray-600">
                          Next heat: {format(prediction.predictedDate, 'MMMM dd, yyyy')}
                        </p>
                        <p className="text-xs text-gray-500">
                          Avg cycle: {prediction.avgCycleLength} days
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getConfidenceColor(prediction.confidence)}>
                          {prediction.confidence} confidence
                        </Badge>
                        <p className="text-sm mt-1">
                          {prediction.daysUntil > 0 ? `${prediction.daysUntil} days` : 'Overdue'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Heat Cycle History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {heatCycles.map((cycle) => {
                  const female = females.find(f => f.id === cycle.dog_id);
                  if (!female) return null;
                  
                  return (
                    <div key={cycle.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{female.name}</h4>
                        <p className="text-sm text-gray-600">
                          Started: {format(parseISO(cycle.proestrus_start), 'MMM dd, yyyy')}
                        </p>
                        {cycle.cycle_length_days && (
                          <p className="text-xs text-gray-500">
                            Duration: {cycle.cycle_length_days} days
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge className={cycle.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {cycle.status}
                        </Badge>
                        {cycle.is_planned_breeding && (
                          <p className="text-xs text-blue-600 mt-1">Planned Breeding</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Cycle Modal */}
      {isAddingCycle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Record Heat Cycle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitCycle} className="space-y-4">
                <div>
                  <Label htmlFor="dog_id">Female Dog</Label>
                  <Select value={cycleForm.dog_id} onValueChange={(value) => setCycleForm({...cycleForm, dog_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select female dog" />
                    </SelectTrigger>
                    <SelectContent>
                      {females.map((female) => (
                        <SelectItem key={female.id} value={female.id}>
                          {female.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="proestrus_start">Proestrus Start Date *</Label>
                  <Input
                    type="date"
                    value={cycleForm.proestrus_start}
                    onChange={(e) => setCycleForm({...cycleForm, proestrus_start: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="estrus_start">Estrus Start Date</Label>
                  <Input
                    type="date"
                    value={cycleForm.estrus_start}
                    onChange={(e) => setCycleForm({...cycleForm, estrus_start: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="estrus_end">Estrus End Date</Label>
                  <Input
                    type="date"
                    value={cycleForm.estrus_end}
                    onChange={(e) => setCycleForm({...cycleForm, estrus_end: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="cycle_end">Cycle End Date</Label>
                  <Input
                    type="date"
                    value={cycleForm.cycle_end}
                    onChange={(e) => setCycleForm({...cycleForm, cycle_end: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="veterinary_notes">Veterinary Notes</Label>
                  <Textarea
                    value={cycleForm.veterinary_notes}
                    onChange={(e) => setCycleForm({...cycleForm, veterinary_notes: e.target.value})}
                    placeholder="Any veterinary observations or notes..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_planned_breeding"
                    checked={cycleForm.is_planned_breeding}
                    onChange={(e) => setCycleForm({...cycleForm, is_planned_breeding: e.target.checked})}
                  />
                  <Label htmlFor="is_planned_breeding">This is a planned breeding cycle</Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Save Heat Cycle
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddingCycle(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}