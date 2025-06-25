
import React, { useState, useEffect } from "react";
import { Dog } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Save, Dog as DogIcon, Baby, X, Upload, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

const DogForm = ({ dog, onSave, onCancel }) => {
  const [formData, setFormData] = useState(dog || {
    name: "", type: "puppy", gender: "male", birth_date: "", photos: [],
    health_clearances: [], video_url: "", description: "", generation: "F1b",
    size_category: "Standard", coat_type: "Wavy", color: "", current_weight: "",
    current_height: "", price: "", personality_profile: "",
    registration_info: {
      registration_number: "",
      registry: "GANA",
      registration_name: "",
      registration_status: "pending"
    },
    microchip_info: {
      microchip_number: "",
      microchip_company: "",
      implant_date: "",
      registered_to: ""
    },
    pedigree: {
      sire_id: "",
      dam_id: "",
      champion_bloodline: false
    }
  });
  const [isUploading, setIsUploading] = useState(false);
  const [parentDogs, setParentDogs] = useState({ sires: [], dams: [] });

  useEffect(() => {
    const fetchParents = async () => {
      const parents = await Dog.filter({ type: "parent" });
      setParentDogs({
        sires: parents.filter(p => p.gender === 'male'),
        dams: parents.filter(p => p.gender === 'female'),
      });
    };
    fetchParents();
  }, []);

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleHealthClearanceChange = (index, field, value) => {
    const newClearances = [...(formData.health_clearances || [])];
    if (newClearances[index]) { // Ensure the clearance object exists
      newClearances[index][field] = value;
    }
    handleInputChange('health_clearances', newClearances);
  };

  const addHealthClearance = () => {
    handleInputChange('health_clearances', [
      ...(formData.health_clearances || []),
      { test_type: "", test_date: "", result: "", registry_url: "" }
    ]);
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [field]: value }
    }));
  };

  const handlePhotoUpload = async (files) => {
    setIsUploading(true);
    const uploadedPhotoObjects = [];
    for (const file of files) {
      try {
        const { file_url } = await UploadFile({ file });
        uploadedPhotoObjects.push({
          url: file_url,
          caption: "",
          is_primary: false,
        });
      } catch (error) {
        console.error("Upload error", error);
      }
    }

    let newPhotos = [...(formData.photos || []), ...uploadedPhotoObjects];
    // If no primary photo exists after upload, set the first one as primary.
    if (!newPhotos.some(p => p.is_primary) && newPhotos.length > 0) {
      newPhotos[0].is_primary = true;
    }
    handleInputChange('photos', newPhotos);
    setIsUploading(false);
  };

  const handlePhotoDetailChange = (index, field, value) => {
    const newPhotos = [...(formData.photos || [])];
    if (newPhotos[index]) { // Ensure the photo object exists
      newPhotos[index][field] = value;
    }
    handleInputChange('photos', newPhotos);
  };

  const setPrimaryPhoto = (indexToSet) => {
    const newPhotos = (formData.photos || []).map((photo, index) => ({
      ...photo,
      is_primary: index === indexToSet
    }));
    handleInputChange('photos', newPhotos);
  };

  const deletePhoto = (indexToDelete) => {
    let newPhotos = (formData.photos || []).filter((_, index) => index !== indexToDelete);
    // If the deleted photo was primary and there are still photos,
    // make the new first photo primary if no other primary exists.
    if (!newPhotos.some(p => p.is_primary) && newPhotos.length > 0) {
      newPhotos[0] = { ...newPhotos[0], is_primary: true };
    }
    handleInputChange('photos', newPhotos);
  };

  const submit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="my-6 bg-stone-50">
      <CardHeader>
        <CardTitle>{dog ? `Editing ${dog.name}` : "Add New Dog"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-6">
          {/* Core Info */}
          <div className="grid md:grid-cols-3 gap-4">
            <div><Label>Name</Label><Input value={formData.name} onChange={e => handleInputChange('name', e.target.value)} required /></div>
            <div><Label>Type</Label><Select value={formData.type} onValueChange={v => handleInputChange('type', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="parent">Parent</SelectItem><SelectItem value="puppy">Puppy</SelectItem></SelectContent></Select></div>
            <div><Label>Gender</Label><Select value={formData.gender} onValueChange={v => handleInputChange('gender', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent></Select></div>
          </div>

          {/* Details */}
          <div className="grid md:grid-cols-3 gap-4">
             <div><Label>Birth Date</Label><Input type="date" value={formData.birth_date} onChange={e => handleInputChange('birth_date', e.target.value)} /></div>
             <div><Label>Generation</Label><Select value={formData.generation || "F1b"} onValueChange={v => handleInputChange('generation', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="F1">F1</SelectItem><SelectItem value="F1b">F1b</SelectItem><SelectItem value="F2">F2</SelectItem><SelectItem value="F2b">F2b</SelectItem><SelectItem value="Multigen">Multigen</SelectItem></SelectContent></Select></div>
             <div><Label>Size Category</Label><Select value={formData.size_category || "Standard"} onValueChange={v => handleInputChange('size_category', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Petite">Petite</SelectItem><SelectItem value="Mini">Mini</SelectItem><SelectItem value="Standard">Standard</SelectItem></SelectContent></Select></div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
             <div><Label>Weight (lbs)</Label><Input type="number" value={formData.current_weight} onChange={e => handleInputChange('current_weight', e.target.value)} /></div>
             <div><Label>Height (inches)</Label><Input type="number" value={formData.current_height} onChange={e => handleInputChange('current_height', e.target.value)} /></div>
             <div><Label>Color</Label><Input value={formData.color} onChange={e => handleInputChange('color', e.target.value)} /></div>
             <div><Label>Coat Type</Label><Select value={formData.coat_type || "Wavy"} onValueChange={v => handleInputChange('coat_type', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Curly">Curly</SelectItem><SelectItem value="Wavy">Wavy</SelectItem><SelectItem value="Straight">Straight</SelectItem></SelectContent></Select></div>
          </div>

          {/* Registration Info */}
          <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
            <Label className="text-blue-800 font-medium">Registration Information</Label>
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Registry</Label><Select value={formData.registration_info?.registry || "GANA"} onValueChange={v => handleNestedChange('registration_info', 'registry', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="GANA">GANA</SelectItem><SelectItem value="CKC">CKC</SelectItem><SelectItem value="ACHC">ACHC</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select></div>
              <div><Label>Registration Number</Label><Input value={formData.registration_info?.registration_number || ""} onChange={e => handleNestedChange('registration_info', 'registration_number', e.target.value)} /></div>
              <div><Label>Registered Name</Label><Input value={formData.registration_info?.registration_name || ""} onChange={e => handleNestedChange('registration_info', 'registration_name', e.target.value)} /></div>
              <div><Label>Status</Label><Select value={formData.registration_info?.registration_status || "pending"} onValueChange={v => handleNestedChange('registration_info', 'registration_status', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="full">Full</SelectItem><SelectItem value="limited">Limited</SelectItem><SelectItem value="none">None</SelectItem></SelectContent></Select></div>
            </div>
          </div>

          {/* Microchip Info */}
          <div className="space-y-4 p-4 border rounded-lg bg-green-50">
            <Label className="text-green-800 font-medium">Microchip Information</Label>
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Microchip Number</Label><Input value={formData.microchip_info?.microchip_number || ""} onChange={e => handleNestedChange('microchip_info', 'microchip_number', e.target.value)} /></div>
              <div><Label>Company</Label><Input value={formData.microchip_info?.microchip_company || ""} onChange={e => handleNestedChange('microchip_info', 'microchip_company', e.target.value)} placeholder="HomeAgain, 24PetWatch, etc." /></div>
              <div><Label>Implant Date</Label><Input type="date" value={formData.microchip_info?.implant_date || ""} onChange={e => handleNestedChange('microchip_info', 'implant_date', e.target.value)} /></div>
              <div><Label>Registered To</Label><Input value={formData.microchip_info?.registered_to || ""} onChange={e => handleNestedChange('microchip_info', 'registered_to', e.target.value)} /></div>
            </div>
          </div>

          {/* Pedigree */}
          <div className="space-y-4 p-4 border rounded-lg bg-purple-50">
            <Label className="text-purple-800 font-medium">Pedigree Information</Label>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Sire (Father)</Label>
                <Select value={formData.pedigree?.sire_id || ""} onValueChange={v => handleNestedChange('pedigree', 'sire_id', v)}>
                  <SelectTrigger><SelectValue placeholder="Select Sire..."/></SelectTrigger>
                  <SelectContent>
                    {parentDogs.sires.map(sire => (
                      <SelectItem key={sire.id} value={sire.id}>{sire.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Dam (Mother)</Label>
                <Select value={formData.pedigree?.dam_id || ""} onValueChange={v => handleNestedChange('pedigree', 'dam_id', v)}>
                  <SelectTrigger><SelectValue placeholder="Select Dam..."/></SelectTrigger>
                  <SelectContent>
                    {parentDogs.dams.map(dam => (
                      <SelectItem key={dam.id} value={dam.id}>{dam.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="champion_bloodline"
                checked={formData.pedigree?.champion_bloodline || false}
                onCheckedChange={checked => handleNestedChange('pedigree', 'champion_bloodline', checked)}
              />
              <Label htmlFor="champion_bloodline">Champion Bloodline</Label>
            </div>
          </div>

          {/* Description & Video */}
          <div><Label>Description</Label><Textarea value={formData.description} onChange={e => handleInputChange('description', e.target.value)} /></div>
          {formData.type === 'puppy' && <div><Label>Price</Label><Input type="number" value={formData.price} onChange={e => handleInputChange('price', e.target.value)} /></div>}
          <div><Label>Video URL (e.g., YouTube, Vimeo)</Label><Input value={formData.video_url} onChange={e => handleInputChange('video_url', e.target.value)} placeholder="https://youtube.com/watch?v=..."/></div>

          {/* Photos Management */}
          <div className="space-y-4 p-4 border rounded-lg bg-orange-50">
            <Label className="text-orange-800 font-medium">Photo Management</Label>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(formData.photos || []).map((photo, i) => (
                <Card key={i} className="overflow-hidden relative group">
                  <img src={photo.url} alt={photo.caption || `Dog photo ${i + 1}`} className="w-full h-32 object-cover" />
                  {photo.is_primary && (
                    <Badge className="absolute top-1 left-1 bg-amber-500 text-white">Primary</Badge>
                  )}
                  <div className="p-2 space-y-2">
                    <Input
                      placeholder="Caption..."
                      value={photo.caption || ''}
                      onChange={(e) => handlePhotoDetailChange(i, 'caption', e.target.value)}
                      className="text-xs h-8"
                    />
                    <div className="flex gap-1 justify-center">
                       <Button type="button" size="icon" variant="ghost" onClick={() => deletePhoto(i)} className="h-7 w-7">
                         <Trash2 className="w-4 h-4 text-red-500"/>
                       </Button>
                       <Button type="button" size="icon" variant="ghost" onClick={() => setPrimaryPhoto(i)} className="h-7 w-7" disabled={photo.is_primary}>
                         <Star className={`w-4 h-4 ${photo.is_primary ? 'text-amber-500 fill-amber-500' : 'text-stone-400'}`}/>
                       </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div>
              <Label>Upload New Photos</Label>
              <Input type="file" multiple accept="image/*" onChange={e => handlePhotoUpload(e.target.files)} disabled={isUploading}/>
              {isUploading && <p className="text-sm text-stone-500">Uploading...</p>}
            </div>
          </div>

          {/* Health Clearances (Parents Only) */}
          {formData.type === 'parent' && (
            <div className="space-y-4">
              <Label>Health Clearances</Label>
              {(formData.health_clearances || []).map((hc, index) => (
                <div key={index} className="grid grid-cols-4 gap-2 p-2 border rounded">
                  <Input placeholder="Test Type" value={hc.test_type} onChange={e => handleHealthClearanceChange(index, 'test_type', e.target.value)} />
                  <Input type="date" value={hc.test_date} onChange={e => handleHealthClearanceChange(index, 'test_date', e.target.value)} />
                  <Input placeholder="Result" value={hc.result} onChange={e => handleHealthClearanceChange(index, 'result', e.target.value)} />
                  <Input placeholder="Registry URL" value={hc.registry_url} onChange={e => handleHealthClearanceChange(index, 'registry_url', e.target.value)} />
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addHealthClearance}>Add Clearance</Button>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit"><Save className="w-4 h-4 mr-2" />{dog ? "Update Dog" : "Save Dog"}</Button>
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default function DogManager() {
  const [dogs, setDogs] = useState([]);
  const [editingDog, setEditingDog] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => { loadDogs(); }, []);

  const loadDogs = async () => {
    const dogList = await Dog.list("-created_date");
    setDogs(dogList);
  };

  const handleSave = async (dogData) => {
    try {
      if (editingDog) {
        await Dog.update(editingDog.id, dogData);
      } else {
        await Dog.create(dogData);
      }
      setEditingDog(null);
      setIsAdding(false);
      await loadDogs();
    } catch (error) {
      console.error("Error saving dog:", error);
    }
  };

  const handleDelete = async (dogId) => {
    if (window.confirm("Are you sure you want to delete this dog?")) {
      await Dog.delete(dogId);
      await loadDogs();
    }
  };

  const getPrimaryPhotoUrl = (photos) => {
    if (!photos || photos.length === 0) return null;
    const primary = photos.find(p => p.is_primary);
    return primary ? primary.url : photos[0]?.url;
  };

  const dogLists = {
    parents: dogs.filter(d => d.type === 'parent'),
    puppies: dogs.filter(d => d.type === 'puppy'),
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Dog Management</CardTitle>
        <Button onClick={() => setIsAdding(true)}><Plus className="w-4 h-4 mr-2" /> Add Dog</Button>
      </CardHeader>
      <CardContent>
        {(isAdding || editingDog) && (
          <DogForm
            dog={editingDog}
            onSave={handleSave}
            onCancel={() => {
              setEditingDog(null);
              setIsAdding(false);
            }}
          />
        )}

        <Tabs defaultValue="puppies">
          <TabsList>
            <TabsTrigger value="puppies"><Baby className="w-4 h-4 mr-2" />Puppies ({dogLists.puppies.length})</TabsTrigger>
            <TabsTrigger value="parents"><DogIcon className="w-4 h-4 mr-2" />Parents ({dogLists.parents.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="puppies">
            {dogLists.puppies.map(dog => (
              <Card key={dog.id} className="mb-2">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={getPrimaryPhotoUrl(dog.photos)} alt={dog.name} className="w-12 h-12 rounded-full object-cover bg-stone-200" />
                    <div>
                      <p className="font-semibold">{dog.name}</p>
                      <p className="text-sm text-stone-600">{dog.gender} - {dog.color}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <Badge variant={dog.status === 'available' ? 'default' : 'secondary'}>{dog.status}</Badge>
                     <Button variant="outline" size="sm" onClick={() => setEditingDog(dog)}><Edit className="w-3 h-3 mr-1"/>Edit</Button>
                     <Button variant="ghost" size="icon" onClick={() => handleDelete(dog.id)}><Trash2 className="w-4 h-4 text-red-500"/></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
           <TabsContent value="parents">
            {dogLists.parents.map(dog => (
              <Card key={dog.id} className="mb-2">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={getPrimaryPhotoUrl(dog.photos)} alt={dog.name} className="w-12 h-12 rounded-full object-cover bg-stone-200" />
                    <div>
                      <p className="font-semibold">{dog.name}</p>
                      <p className="text-sm text-stone-600">{dog.gender}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <Button variant="outline" size="sm" onClick={() => setEditingDog(dog)}><Edit className="w-3 h-3 mr-1"/>Edit</Button>
                     <Button variant="ghost" size="icon" onClick={() => handleDelete(dog.id)}><Trash2 className="w-4 h-4 text-red-500"/></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
