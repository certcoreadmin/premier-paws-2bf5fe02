
import React, { useState, useEffect } from 'react';
import { PuppyPhoto, UploadFile } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Camera, Save, X } from 'lucide-react';

export default function PhotoGallery({ puppyId }) {
  const [photos, setPhotos] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newPhoto, setNewPhoto] = useState({ photo_url: '', caption: '', age_at_photo: '' });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadPhotos();
  }, [puppyId]);

  const loadPhotos = async () => {
    if (!puppyId) return;
    try {
      const puppyPhotos = await PuppyPhoto.filter({ puppy_id: puppyId }, '-created_date');
      setPhotos(puppyPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setNewPhoto(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      handleInputChange('photo_url', file_url);
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("There was an error uploading your photo.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!newPhoto.photo_url) {
      alert("Please upload a photo first.");
      return;
    }
    try {
      await PuppyPhoto.create({ ...newPhoto, puppy_id: puppyId });
      resetForm();
      await loadPhotos();
    } catch (error) {
      console.error('Error saving photo:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    try {
      await PuppyPhoto.delete(id);
      await loadPhotos();
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setNewPhoto({ photo_url: '', caption: '', age_at_photo: '' });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-purple-600" />
          Photo Gallery
        </CardTitle>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Photo
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isAdding && (
          <Card className="my-4 bg-stone-50">
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium">Upload Photo</label>
                <Input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
                {isUploading && <p className="text-sm text-stone-500">Uploading...</p>}
                {newPhoto.photo_url && <img src={newPhoto.photo_url} alt="Preview" className="w-24 h-24 object-cover rounded mt-2" />}
              </div>
              <Input 
                placeholder="Age at photo (e.g., 6 months old)" 
                value={newPhoto.age_at_photo}
                onChange={(e) => handleInputChange('age_at_photo', e.target.value)}
              />
              <Textarea 
                placeholder="Caption" 
                value={newPhoto.caption}
                onChange={(e) => handleInputChange('caption', e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isUploading}><Save className="w-4 h-4 mr-2" /> Save Photo</Button>
                <Button variant="outline" onClick={resetForm}><X className="w-4 h-4 mr-2" /> Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {photos.length === 0 && !isAdding && (
          <p className="text-stone-500 text-center py-4">No photos added yet. Share your favorite moments!</p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <Card key={photo.id} className="group relative">
              <div className="aspect-square bg-stone-200 rounded-lg overflow-hidden">
                <img src={photo.photo_url} alt={photo.caption} className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                <p>{photo.caption}</p>
                <p className="font-bold">{photo.age_at_photo}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-1 right-1 h-7 w-7 bg-white/70 hover:bg-white"
                onClick={() => handleDelete(photo.id)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
