
import React, { useState, useEffect } from "react";
import { Litter } from "@/api/entities";
import { Dog } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Baby, Plus, Edit, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function LitterManager() {
  const [litters, setLitters] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLitter, setEditingLitter] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    sire_id: "",
    dam_id: "",
    expected_due_date: "",
    status: "planned",
    expected_puppy_count: 6,
    reservation_slots: 8,
    slot_prices: [4500, 4200, 4000, 3800, 3600, 3400, 3200, 3000],
    description: "",
    is_active: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [litterList, dogList] = await Promise.all([
      Litter.list("-created_date"),
      Dog.filter({ type: "parent" })
    ]);
    setLitters(litterList);
    setDogs(dogList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLitter) {
        await Litter.update(editingLitter.id, formData);
      } else {
        await Litter.create(formData);
      }
      resetForm();
      loadData();
    } catch (error) {
      console.error("Error saving litter:", error);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingLitter(null);
    setFormData({
      name: "",
      sire_id: "",
      dam_id: "",
      expected_due_date: "",
      status: "planned",
      expected_puppy_count: 6,
      reservation_slots: 8,
      slot_prices: [4500, 4200, 4000, 3800, 3600, 3400, 3200, 3000],
      description: "",
      is_active: true
    });
  };

  const handleEdit = (litter) => {
    setEditingLitter(litter);
    setFormData(litter);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this litter? This cannot be undone.")) {
      await Litter.delete(id);
      loadData();
    }
  };

  const statusColors = {
    planned: "bg-blue-100 text-blue-800",
    confirmed_pregnant: "bg-green-100 text-green-800",
    born: "bg-amber-100 text-amber-800",
    ready: "bg-purple-100 text-purple-800",
    completed: "bg-gray-100 text-gray-800"
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Litter Management</h2>
        <Button onClick={() => setIsEditing(true)}>
          <Plus className="w-4 h-4 mr-2" />Add Litter
        </Button>
      </div>

      {/* Form */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>{editingLitter ? "Edit Litter" : "Add New Litter"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="Litter Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                <Input
                  type="date"
                  placeholder="Expected Due Date"
                  value={formData.expected_due_date}
                  onChange={(e) => setFormData({...formData, expected_due_date: e.target.value})}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Select value={formData.sire_id} onValueChange={(value) => setFormData({...formData, sire_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sire (Father)" />
                  </SelectTrigger>
                  <SelectContent>
                    {dogs.filter(d => d.gender === 'male').map(dog => (
                      <SelectItem key={dog.id} value={dog.id}>{dog.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={formData.dam_id} onValueChange={(value) => setFormData({...formData, dam_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Dam (Mother)" />
                  </SelectTrigger>
                  <SelectContent>
                    {dogs.filter(d => d.gender === 'female').map(dog => (
                      <SelectItem key={dog.id} value={dog.id}>{dog.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Textarea
                placeholder="Litter Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />

              <div className="flex gap-4">
                <Button type="submit">Save</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Litter List */}
      <div className="grid gap-6">
        {litters.map((litter) => (
          <Card key={litter.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{litter.name}</h3>
                    <Badge className={statusColors[litter.status]}>{litter.status}</Badge>
                  </div>
                  <p className="text-stone-600 mb-2">
                    Expected: {format(new Date(litter.expected_due_date), 'MMM d, yyyy')}
                  </p>
                  <p className="text-stone-600">{litter.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(litter)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(litter.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
