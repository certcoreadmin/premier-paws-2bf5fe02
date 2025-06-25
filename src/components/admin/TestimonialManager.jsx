import React, { useState, useEffect } from "react";
import { Testimonial } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Check, X, MessageSquare, Image as ImageIcon, Plus, Save, Upload } from "lucide-react";

const TestimonialForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    owner_name: "",
    dog_name: "",
    story: "",
    photo_url: ""
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (file) => {
    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, photo_url: file_url }));
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Error uploading photo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.owner_name || !formData.dog_name || !formData.story) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        ...formData,
        status: "approved", // Admin-created testimonials are automatically approved
        user_id: "admin" // Special identifier for admin-created testimonials
      });
    } catch (error) {
      console.error("Error saving testimonial:", error);
      alert("Error saving testimonial");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6 bg-amber-50 border-amber-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-amber-600" />
          Add New Testimonial
        </CardTitle>
        <CardDescription>
          Create a testimonial on behalf of a puppy family
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="owner_name">Family Name *</Label>
              <Input
                id="owner_name"
                value={formData.owner_name}
                onChange={(e) => handleInputChange("owner_name", e.target.value)}
                placeholder="The Johnson Family"
                required
              />
            </div>
            <div>
              <Label htmlFor="dog_name">Dog's Name *</Label>
              <Input
                id="dog_name"
                value={formData.dog_name}
                onChange={(e) => handleInputChange("dog_name", e.target.value)}
                placeholder="Bella"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="story">Testimonial Story *</Label>
            <Textarea
              id="story"
              value={formData.story}
              onChange={(e) => handleInputChange("story", e.target.value)}
              placeholder="Share the family's experience with their Golden Paws Doodle..."
              rows={6}
              required
            />
          </div>

          <div>
            <Label htmlFor="photo">Photo (Optional)</Label>
            <div className="flex items-center gap-4 mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('photo-upload').click()}
                disabled={isUploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload Photo"}
              </Button>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files[0] && handlePhotoUpload(e.target.files[0])}
                className="hidden"
              />
            </div>
            {formData.photo_url && (
              <div className="mt-3">
                <img
                  src={formData.photo_url}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Testimonial"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default function TestimonialManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { loadTestimonials(); }, []);

  const loadTestimonials = async () => {
    setIsLoading(true);
    try {
      const list = await Testimonial.list("-created_date");
      setTestimonials(list);
    } catch (error) {
      console.error("Error loading testimonials:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateStatus = async (id, status) => {
    try {
      await Testimonial.update(id, { status });
      await loadTestimonials();
    } catch (error) {
      console.error("Error updating testimonial status:", error);
      alert("Error updating testimonial status");
    }
  };

  const handleSaveTestimonial = async (testimonialData) => {
    try {
      await Testimonial.create(testimonialData);
      await loadTestimonials();
      setShowForm(false);
      alert("Testimonial created successfully!");
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Testimonial Management</CardTitle>
            <CardDescription>Review and approve stories submitted by puppy families.</CardDescription>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Testimonial
          </Button>
        </CardHeader>
      </Card>

      {showForm && (
        <TestimonialForm
          onSave={handleSaveTestimonial}
          onCancel={() => setShowForm(false)}
        />
      )}

      <Card>
        <CardContent className="p-6">
          {isLoading && <p>Loading testimonials...</p>}
          {!isLoading && testimonials.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-stone-200 rounded-lg">
              <MessageSquare className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-stone-700">No testimonials yet.</h3>
              <p className="text-stone-500">Add your first testimonial or wait for families to submit their stories!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {testimonials.map(t => (
                <Card key={t.id} className="overflow-hidden">
                  <div className="flex gap-4">
                    {t.photo_url && (
                       <div className="w-1/3 md:w-1/4 xl:w-1/5 flex-shrink-0">
                           <img src={t.photo_url} alt={`Photo for ${t.dog_name}`} className="w-full h-full object-cover"/>
                       </div>
                    )}
                    <div className="flex-1">
                      <CardHeader className="flex flex-row items-start justify-between pb-2">
                          <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-lg text-stone-800">{t.owner_name} & {t.dog_name}</p>
                                {t.user_id === "admin" && (
                                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                                    Admin Created
                                  </Badge>
                                )}
                              </div>
                              <Badge className={
                                  t.status === 'approved' ? 'bg-green-100 text-green-800' :
                                  t.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                                  'bg-yellow-100 text-yellow-800'
                              }>
                                  {t.status}
                              </Badge>
                          </div>
                          {t.status === 'pending' && (
                              <div className="flex gap-2">
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => updateStatus(t.id, 'approved')}>
                                      <Check className="w-4 h-4 mr-2"/> Approve
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => updateStatus(t.id, 'rejected')}>
                                     <X className="w-4 h-4 mr-2"/> Reject
                                  </Button>
                              </div>
                          )}
                      </CardHeader>
                      <CardContent>
                          <p className="text-stone-700 italic">"{t.story}"</p>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}