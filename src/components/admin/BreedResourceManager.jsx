
import React, { useState, useEffect } from "react";
import { BreedResource } from "@/api/entities";
import { FAQ } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Save, BookOpen, HelpCircle, Upload, Eye, EyeOff } from "lucide-react";

const ResourceForm = ({ resource, onSave, onCancel }) => {
  const [formData, setFormData] = useState(resource || {
    title: "",
    category: "overview",
    section: "",
    content: "",
    display_order: 0,
    is_active: true,
    metadata: {},
    featured_image: ""
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMetadataChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value }
    }));
  };

  const handleImageUpload = async (file) => {
    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      handleInputChange('featured_image', file_url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading image");
    }
    setIsUploading(false);
  };

  const submit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const categories = [
    { value: "overview", label: "Breed Overview" },
    { value: "characteristics", label: "Characteristics" },
    { value: "care", label: "Care Guide" },
    { value: "health", label: "Health Information" },
    { value: "training", label: "Training & Behavior" },
    { value: "faq", label: "FAQ Content" }
  ];

  return (
    <Card className="my-6 bg-stone-50">
      <CardHeader>
        <CardTitle>{resource ? "Edit Resource" : "Add New Resource"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={e => handleInputChange('title', e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Category *</Label>
              <Select value={formData.category} onValueChange={v => handleInputChange('category', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Section/Subsection</Label>
              <Input
                value={formData.section}
                onChange={e => handleInputChange('section', e.target.value)}
                placeholder="e.g., 'Temperament', 'Exercise Needs'"
              />
            </div>
            <div>
              <Label>Display Order</Label>
              <Input
                type="number"
                value={formData.display_order}
                onChange={e => handleInputChange('display_order', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div>
            <Label>Content *</Label>
            <Textarea
              value={formData.content}
              onChange={e => handleInputChange('content', e.target.value)}
              rows={8}
              placeholder="Content supports markdown formatting..."
              required
            />
          </div>

          <div>
            <Label>Featured Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={e => e.target.files[0] && handleImageUpload(e.target.files[0])}
              disabled={isUploading}
            />
            {isUploading && <p className="text-sm text-stone-500">Uploading...</p>}
            {formData.featured_image && (
              <img src={formData.featured_image} alt="Preview" className="w-32 h-32 object-cover rounded mt-2" />
            )}
          </div>

          {/* Metadata for characteristics */}
          {formData.category === 'characteristics' && (
            <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
              <Label className="text-blue-800">Characteristics Metadata (Optional)</Label>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">Rating (1-100)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.metadata.rating || ''}
                    onChange={e => handleMetadataChange('rating', parseInt(e.target.value))}
                    placeholder="85"
                  />
                </div>
                <div>
                  <Label className="text-sm">Icon Name</Label>
                  <Input
                    value={formData.metadata.icon || ''}
                    onChange={e => handleMetadataChange('icon', e.target.value)}
                    placeholder="Heart, Activity, Users"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={checked => handleInputChange('is_active', checked)}
            />
            <Label htmlFor="is_active">Active (visible on website)</Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              {resource ? "Update" : "Create"} Resource
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

const FAQForm = ({ faq, onSave, onCancel }) => {
  const [formData, setFormData] = useState(faq || {
    question: "",
    answer: "",
    category: "general",
    display_order: 0,
    is_featured: false,
    is_active: true,
    tags: []
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagsChange = (tagString) => {
    const tags = tagString.split(',').map(tag => tag.trim()).filter(tag => tag);
    handleInputChange('tags', tags);
  };

  const submit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const faqCategories = [
    { value: "breed_info", label: "Breed Information" },
    { value: "health", label: "Health & Care" },
    { value: "training", label: "Training" },
    { value: "adoption", label: "Adoption Process" },
    { value: "care", label: "Daily Care" },
    { value: "general", label: "General" }
  ];

  return (
    <Card className="my-6 bg-stone-50">
      <CardHeader>
        <CardTitle>{faq ? "Edit FAQ" : "Add New FAQ"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>Question *</Label>
            <Input
              value={formData.question}
              onChange={e => handleInputChange('question', e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Answer *</Label>
            <Textarea
              value={formData.answer}
              onChange={e => handleInputChange('answer', e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={v => handleInputChange('category', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {faqCategories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Display Order</Label>
              <Input
                type="number"
                value={formData.display_order}
                onChange={e => handleInputChange('display_order', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div>
            <Label>Tags (comma-separated)</Label>
            <Input
              value={formData.tags.join(', ')}
              onChange={e => handleTagsChange(e.target.value)}
              placeholder="golden retriever, puppies, training"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={checked => handleInputChange('is_featured', checked)}
              />
              <Label htmlFor="is_featured">Featured FAQ</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active_faq"
                checked={formData.is_active}
                onCheckedChange={checked => handleInputChange('is_active', checked)}
              />
              <Label htmlFor="is_active_faq">Active</Label>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              {faq ? "Update" : "Create"} FAQ
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

export default function BreedResourceManager() {
  const [resources, setResources] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [editingResource, setEditingResource] = useState(null);
  const [editingFaq, setEditingFaq] = useState(null);
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [activeTab, setActiveTab] = useState("resources");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resourceList, faqList] = await Promise.all([
        BreedResource.list("-display_order"),
        FAQ.list("-display_order")
      ]);
      setResources(resourceList);
      setFaqs(faqList);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleSaveResource = async (resourceData) => {
    try {
      if (editingResource) {
        await BreedResource.update(editingResource.id, resourceData);
      } else {
        await BreedResource.create(resourceData);
      }
      setEditingResource(null);
      setIsAddingResource(false);
      await loadData();
    } catch (error) {
      console.error("Error saving resource:", error);
    }
  };

  const handleSaveFaq = async (faqData) => {
    try {
      if (editingFaq) {
        await FAQ.update(editingFaq.id, faqData);
      } else {
        await FAQ.create(faqData);
      }
      setEditingFaq(null);
      setIsAddingFaq(false);
      await loadData();
    } catch (error) {
      console.error("Error saving FAQ:", error);
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      await BreedResource.delete(resourceId);
      await loadData();
    }
  };

  const handleDeleteFaq = async (faqId) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      await FAQ.delete(faqId);
      await loadData();
    }
  };

  const toggleResourceStatus = async (resource) => {
    await BreedResource.update(resource.id, { ...resource, is_active: !resource.is_active });
    await loadData();
  };

  const toggleFaqStatus = async (faq) => {
    await FAQ.update(faq.id, { ...faq, is_active: !faq.is_active });
    await loadData();
  };

  const groupedResources = resources.reduce((acc, resource) => {
    if (!acc[resource.category]) acc[resource.category] = [];
    acc[resource.category].push(resource);
    return acc;
  }, {});

  const groupedFaqs = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) acc[faq.category] = [];
    acc[faq.category].push(faq);
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-600" />
          Golden Retriever Resource Center Manager
        </CardTitle>
        <p className="text-stone-600">
          Manage breed education content, care guides, and frequently asked questions.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resources">
              <BookOpen className="w-4 h-4 mr-2" />
              Resources ({resources.length})
            </TabsTrigger>
            <TabsTrigger value="faqs">
              <HelpCircle className="w-4 h-4 mr-2" />
              FAQs ({faqs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resources" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Breed Resources</h3>
              <Button onClick={() => setIsAddingResource(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Resource
              </Button>
            </div>

            {isAddingResource && (
              <ResourceForm
                onSave={handleSaveResource}
                onCancel={() => setIsAddingResource(false)}
              />
            )}

            {editingResource && (
              <ResourceForm
                resource={editingResource}
                onSave={handleSaveResource}
                onCancel={() => setEditingResource(null)}
              />
            )}

            <div className="space-y-6">
              {Object.entries(groupedResources).map(([category, categoryResources]) => (
                <div key={category}>
                  <h4 className="font-medium text-stone-800 mb-3 capitalize">
                    {category.replace('_', ' ')} ({categoryResources.length})
                  </h4>
                  <div className="space-y-2">
                    {categoryResources.map(resource => (
                      <Card key={resource.id} className={resource.is_active ? "" : "opacity-60"}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h5 className="font-medium">{resource.title}</h5>
                                {resource.section && (
                                  <Badge variant="outline">{resource.section}</Badge>
                                )}
                                <Badge className={resource.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                                  {resource.is_active ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              <p className="text-sm text-stone-600 line-clamp-2">
                                {resource.content.substring(0, 150)}...
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleResourceStatus(resource)}
                              >
                                {resource.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => setEditingResource(resource)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteResource(resource.id)}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="faqs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
              <Button onClick={() => setIsAddingFaq(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add FAQ
              </Button>
            </div>

            {isAddingFaq && (
              <FAQForm
                onSave={handleSaveFaq}
                onCancel={() => setIsAddingFaq(false)}
              />
            )}

            {editingFaq && (
              <FAQForm
                faq={editingFaq}
                onSave={handleSaveFaq}
                onCancel={() => setEditingFaq(null)}
              />
            )}

            <div className="space-y-6">
              {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
                <div key={category}>
                  <h4 className="font-medium text-stone-800 mb-3 capitalize">
                    {category.replace('_', ' ')} ({categoryFaqs.length})
                  </h4>
                  <div className="space-y-2">
                    {categoryFaqs.map(faq => (
                      <Card key={faq.id} className={faq.is_active ? "" : "opacity-60"}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h5 className="font-medium">{faq.question}</h5>
                                {faq.is_featured && (
                                  <Badge className="bg-amber-100 text-amber-800">Featured</Badge>
                                )}
                                <Badge className={faq.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                                  {faq.is_active ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              <p className="text-sm text-stone-600 mb-2">
                                {faq.answer.substring(0, 150)}...
                              </p>
                              {faq.tags && faq.tags.length > 0 && (
                                <div className="flex gap-1">
                                  {faq.tags.map(tag => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleFaqStatus(faq)}
                              >
                                {faq.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => setEditingFaq(faq)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteFaq(faq.id)}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
