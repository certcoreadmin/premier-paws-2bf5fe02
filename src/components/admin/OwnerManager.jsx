
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Dog } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Users, UserPlus, Eye } from "lucide-react";
import { format } from "date-fns";

export default function OwnerManager() {
  const [owners, setOwners] = useState([]);
  const [puppies, setPuppies] = useState([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignForm, setAssignForm] = useState({
    email: "",
    puppy_id: "",
    gotcha_date: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userList, puppyList] = await Promise.all([
        User.filter({ access_level: "owner" }),
        Dog.filter({ type: "puppy" })
      ]);
      setOwners(userList);
      setPuppies(puppyList);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleAssignPuppy = async (e) => {
    e.preventDefault();
    
    try {
      const users = await User.filter({ email: assignForm.email });
      if (users.length === 0) {
        alert("User not found. They may need to create an account first.");
        return;
      }

      const user = users[0];
      await User.update(user.id, {
        puppy_id: assignForm.puppy_id,
        gotcha_date: assignForm.gotcha_date,
        access_level: "owner"
      });

      await Dog.update(assignForm.puppy_id, {
        status: "sold"
      });

      await loadData();
      setAssignForm({ email: "", puppy_id: "", gotcha_date: "" });
      setIsAssigning(false);
      alert("Puppy assigned successfully!");
    } catch (error) {
      console.error("Error assigning puppy:", error);
      alert("Error assigning puppy");
    }
  };

  const getAssignedPuppy = (owner) => {
    return puppies.find(p => p.id === owner.puppy_id);
  };

  return (
    <div className="space-y-8">
      {isAssigning ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-600" />
              Assign Puppy to Owner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAssignPuppy} className="space-y-4">
              <div>
                <Label htmlFor="owner_email">Owner Email Address</Label>
                <Input
                  id="owner_email"
                  type="email"
                  value={assignForm.email}
                  onChange={(e) => setAssignForm({...assignForm, email: e.target.value})}
                  placeholder="owner@example.com"
                  required
                />
                <p className="text-stone-500 text-sm mt-1">
                  The owner must have an account on the platform
                </p>
              </div>

              <div>
                <Label htmlFor="puppy_select">Select Puppy</Label>
                <Select 
                  value={assignForm.puppy_id} 
                  onValueChange={(value) => setAssignForm({...assignForm, puppy_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a puppy" />
                  </SelectTrigger>
                  <SelectContent>
                    {puppies.filter(p => p.status === "available" || p.status === "reserved").map((puppy) => (
                      <SelectItem key={puppy.id} value={puppy.id}>
                        {puppy.name} - {puppy.gender} - {puppy.color} ({puppy.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="gotcha_date">Gotcha Day (Going Home Date)</Label>
                <Input
                  id="gotcha_date"
                  type="date"
                  value={assignForm.gotcha_date}
                  onChange={(e) => setAssignForm({...assignForm, gotcha_date: e.target.value})}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                  Assign Puppy
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAssigning(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setIsAssigning(true)} className="gap-2">
          <UserPlus className="w-4 h-4" />
          Assign Puppy to Owner
        </Button>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Puppy Owners ({owners.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {owners.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-600">No puppy owners assigned yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {owners.map((owner) => {
                const assignedPuppy = getAssignedPuppy(owner);
                return (
                  <Card key={owner.id} className="bg-stone-50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-stone-800">{owner.full_name}</h3>
                            <Badge className="bg-green-100 text-green-800">Owner</Badge>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-stone-600">Email:</span> {owner.email}
                            </div>
                            <div>
                              <span className="text-stone-600">Member Since:</span> {format(new Date(owner.created_date), 'MMM d, yyyy')}
                            </div>
                            {assignedPuppy && (
                              <>
                                <div>
                                  <span className="text-stone-600">Puppy:</span> {assignedPuppy.name} ({assignedPuppy.gender})
                                </div>
                                {owner.gotcha_date && (
                                  <div>
                                    <span className="text-stone-600">Gotcha Day:</span> {format(new Date(owner.gotcha_date), 'MMM d, yyyy')}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-1">
                            <Eye className="w-3 h-3" />
                            View Portal
                          </Button>
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
    </div>
  );
}
