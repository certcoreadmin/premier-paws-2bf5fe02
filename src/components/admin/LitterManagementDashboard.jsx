import React, { useState, useEffect } from "react";
import { Litter } from "@/api/entities";
import { Dog } from "@/api/entities";
import { LitterRecord } from "@/api/entities";
import { PuppyWeightRecord } from "@/api/entities";
import { LitterMilestone } from "@/api/entities";
import { SocializationLog } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Baby, Scale, CheckCircle, Camera, Calendar, 
  TrendingUp, Heart, Users, Plus, Edit
} from "lucide-react";

import WeightTracker from "./WeightTracker";
import MilestoneManager from "./MilestoneManager";
import SocializationTracker from "./SocializationTracker";
import LitterBirthRecord from "./LitterBirthRecord";

export default function LitterManagementDashboard() {
  const [litters, setLitters] = useState([]);
  const [selectedLitter, setSelectedLitter] = useState(null);
  const [puppies, setPuppies] = useState([]);
  const [weightRecords, setWeightRecords] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [socializationLogs, setSocializationLogs] = useState([]);
  const [litterRecord, setLitterRecord] = useState(null);

  useEffect(() => {
    loadLitters();
  }, []);

  useEffect(() => {
    if (selectedLitter) {
      loadLitterData(selectedLitter.id);
    }
  }, [selectedLitter]);

  const loadLitters = async () => {
    try {
      const litterList = await Litter.list("-created_date");
      setLitters(litterList);
      if (litterList.length > 0 && !selectedLitter) {
        setSelectedLitter(litterList[0]);
      }
    } catch (error) {
      console.error("Error loading litters:", error);
    }
  };

  const loadLitterData = async (litterId) => {
    try {
      const [
        litterPuppies,
        weights,
        litterMilestones,
        socLogs,
        birthRecord
      ] = await Promise.all([
        Dog.filter({ type: "puppy", litter_id: litterId }),
        PuppyWeightRecord.filter({ litter_id: litterId }, "-date_recorded"),
        LitterMilestone.filter({ litter_id: litterId }, "scheduled_date"),
        SocializationLog.filter({ litter_id: litterId }, "-date"),
        LitterRecord.filter({ litter_id: litterId }).then(records => records[0] || null)
      ]);

      setPuppies(litterPuppies);
      setWeightRecords(weights);
      setMilestones(litterMilestones);
      setSocializationLogs(socLogs);
      setLitterRecord(birthRecord);
    } catch (error) {
      console.error("Error loading litter data:", error);
    }
  };

  const getLitterStatusBadge = (litter) => {
    const statusColors = {
      planned: "bg-blue-100 text-blue-800",
      confirmed_pregnant: "bg-green-100 text-green-800",
      born: "bg-amber-100 text-amber-800",
      ready: "bg-purple-100 text-purple-800",
      completed: "bg-gray-100 text-gray-800"
    };

    return (
      <Badge className={statusColors[litter.status] || "bg-stone-100 text-stone-800"}>
        {litter.status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getAgeInDays = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    const diffTime = Math.abs(today - birth);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getOverdueMilestones = () => {
    const today = new Date().toISOString().split('T')[0];
    return milestones.filter(m => 
      m.status === 'pending' && m.scheduled_date < today
    );
  };

  const getUpcomingMilestones = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return milestones.filter(m => 
      m.status === 'pending' && 
      new Date(m.scheduled_date) <= nextWeek &&
      new Date(m.scheduled_date) >= today
    );
  };

  if (!selectedLitter) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Baby className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-600">No litters found. Create your first litter to get started.</p>
        </CardContent>
      </Card>
    );
  }

  const litterAge = litterRecord ? getAgeInDays(litterRecord.birth_date) : null;
  const overdueMilestones = getOverdueMilestones();
  const upcomingMilestones = getUpcomingMilestones();

  return (
    <div className="space-y-6">
      {/* Litter Selection Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{selectedLitter.name}</h1>
                {getLitterStatusBadge(selectedLitter)}
              </div>
              <p className="text-stone-600">
                {litterAge ? `${litterAge} days old` : 'Age unknown'} • {puppies.length} puppies
              </p>
            </div>
            <div className="flex gap-2">
              <select 
                value={selectedLitter.id} 
                onChange={(e) => {
                  const litter = litters.find(l => l.id === e.target.value);
                  setSelectedLitter(litter);
                }}
                className="px-3 py-2 border rounded-md"
              >
                {litters.map(litter => (
                  <option key={litter.id} value={litter.id}>
                    {litter.name} ({litter.status})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{puppies.length}</div>
            <div className="text-sm text-stone-600">Puppies</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{milestones.filter(m => m.status === 'completed').length}</div>
            <div className="text-sm text-stone-600">Milestones Done</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{weightRecords.length}</div>
            <div className="text-sm text-stone-600">Weight Records</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{socializationLogs.length}</div>
            <div className="text-sm text-stone-600">Social Activities</div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts for Overdue/Upcoming */}
      {(overdueMilestones.length > 0 || upcomingMilestones.length > 0) && (
        <div className="space-y-2">
          {overdueMilestones.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">
                    {overdueMilestones.length} overdue milestone{overdueMilestones.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
          
          {upcomingMilestones.length > 0 && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-amber-800">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">
                    {upcomingMilestones.length} milestone{upcomingMilestones.length !== 1 ? 's' : ''} due this week
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="weights">Weight Tracking</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="socialization">Socialization</TabsTrigger>
          <TabsTrigger value="birth">Birth Record</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Puppy List */}
            <Card>
              <CardHeader>
                <CardTitle>Litter Roster</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {puppies.map(puppy => {
                    const latestWeight = weightRecords
                      .filter(w => w.puppy_id === puppy.id)
                      .sort((a, b) => new Date(b.date_recorded) - new Date(a.date_recorded))[0];
                    
                    return (
                      <div key={puppy.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {puppy.photos?.[0] && (
                            <img src={puppy.photos[0]} alt={puppy.name} className="w-10 h-10 rounded-full object-cover" />
                          )}
                          <div>
                            <div className="font-medium">{puppy.name}</div>
                            <div className="text-sm text-stone-600">{puppy.gender} • {puppy.color}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          {latestWeight && (
                            <div className="text-sm font-medium">
                              {(latestWeight.weight_grams / 1000).toFixed(2)} kg
                            </div>
                          )}
                          <Badge className={`text-xs ${
                            puppy.status === 'available' ? 'bg-green-100 text-green-800' : 
                            puppy.status === 'reserved' ? 'bg-red-100 text-red-800' : 
                            'bg-stone-100 text-stone-800'
                          }`}>
                            {puppy.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Recent weight entries */}
                  {weightRecords.slice(0, 5).map(record => (
                    <div key={record.id} className="flex items-center gap-3 text-sm">
                      <Scale className="w-4 h-4 text-blue-500" />
                      <span>Weight recorded for {puppies.find(p => p.id === record.puppy_id)?.name}</span>
                      <span className="text-stone-500">{record.date_recorded}</span>
                    </div>
                  ))}
                  
                  {/* Recent milestones */}
                  {milestones.filter(m => m.status === 'completed').slice(0, 3).map(milestone => (
                    <div key={milestone.id} className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{milestone.milestone_name || milestone.milestone_type}</span>
                      <span className="text-stone-500">{milestone.completed_date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="weights">
          <WeightTracker 
            puppies={puppies}
            weightRecords={weightRecords}
            litterId={selectedLitter.id}
            onUpdate={() => loadLitterData(selectedLitter.id)}
          />
        </TabsContent>

        <TabsContent value="milestones">
          <MilestoneManager
            litterId={selectedLitter.id}
            milestones={milestones}
            puppies={puppies}
            onUpdate={() => loadLitterData(selectedLitter.id)}
          />
        </TabsContent>

        <TabsContent value="socialization">
          <SocializationTracker
            litterId={selectedLitter.id}
            puppies={puppies}
            socializationLogs={socializationLogs}
            onUpdate={() => loadLitterData(selectedLitter.id)}
          />
        </TabsContent>

        <TabsContent value="birth">
          <LitterBirthRecord
            litter={selectedLitter}
            litterRecord={litterRecord}
            puppies={puppies}
            onUpdate={() => loadLitterData(selectedLitter.id)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}