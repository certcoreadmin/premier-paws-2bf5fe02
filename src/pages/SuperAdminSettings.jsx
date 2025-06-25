
import React, { useState, useEffect } from "react";
import { GlobalSettings } from "@/api/entities";
import { User as UserEntity } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, Save, Upload, Palette, Globe, 
  Phone, Mail, MapPin, Heart, Award, Shield,
  Plus, Trash2, Image
} from "lucide-react";
import { createPageUrl } from "@/utils";

export default function SuperAdminSettingsPage() {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const currentUser = await UserEntity.me();
      if (currentUser.access_level !== 'super_admin') {
        window.location.href = createPageUrl("Home");
        return;
      }
      setUser(currentUser);
      await loadSettings();
    } catch (error) {
      window.location.href = createPageUrl("Home");
      return;
    }
    setLoading(false);
  };

  const loadSettings = async () => {
    try {
      const settingsList = await GlobalSettings.list();
      if (settingsList.length > 0) {
        setSettings(settingsList[0]);
      } else {
        // Create default settings if none exist
        const defaultSettings = {
          site_name: "Golden Paws Doodles",
          tagline: "Your Perfect Family Companion",
          contact_phone: "(555) 123-4567",
          contact_email: "info@goldenpawsdoodles.com",
          contact_address: "Golden Valley, CA",
          hero_heading: "Your Perfect Family Goldendoodle Starts Here",
          hero_subheading: "Breeding health-tested, family-socialized Goldendoodles with the perfect blend of intelligence and loving companionship.",
          primary_color: "#D97706",
          secondary_color: "#78716C",
          accent_color: "#059669",
          core_principles: [
            {
              title: "Health-Tested Parents",
              description: "Comprehensive genetic and physical health testing for all our parent dogs to ensure healthy puppies.",
              icon: "Shield"
            },
            {
              title: "Family Socialization",
              description: "Our puppies are raised in our home, following a curriculum of socialization for confident, well-adjusted dogs.",
              icon: "Heart"
            },
            {
              title: "Exceptional Temperament",
              description: "We select our breeding dogs for their gentle, intelligent, and loving temperaments, perfect for family life.",
              icon: "Award"
            },
            {
              title: "Lifetime Support",
              description: "We provide ongoing guidance and support for our puppy families throughout the life of their dog.",
              icon: "Users"
            }
          ],
          trust_bar_items: [
            { text: "GANA Blue Ribbon", icon: "Award" },
            { text: "AKC H.E.A.R.T.", icon: "Shield" },
            { text: "Health Tested", icon: "Heart" }
          ]
        };
        const created = await GlobalSettings.create(defaultSettings);
        setSettings(created);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, subField, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index ? { ...item, [subField]: value } : item
      )
    }));
  };

  const addArrayItem = (field, defaultItem) => {
    setSettings(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), defaultItem]
    }));
  };

  const removeArrayItem = (field, index) => {
    setSettings(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (field, file) => {
    setUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      handleInputChange(field, file_url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await GlobalSettings.update(settings.id, settings);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error saving settings");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading super admin settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Error loading settings</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Settings className="w-8 h-8 text-blue-600" />
              Super Admin Settings
            </h1>
            <p className="text-gray-600 mt-2">Configure site-wide settings and branding</p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">
              <Globe className="w-4 h-4 mr-2" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="contact">
              <Phone className="w-4 h-4 mr-2" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="content">
              <Heart className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="branding">
              <Palette className="w-4 h-4 mr-2" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="features">
              <Award className="w-4 h-4 mr-2" />
              Features
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Site Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="site_name">Site Name</Label>
                    <Input
                      id="site_name"
                      value={settings.site_name || ""}
                      onChange={(e) => handleInputChange("site_name", e.target.value)}
                      placeholder="Golden Paws Doodles"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={settings.tagline || ""}
                      onChange={(e) => handleInputChange("tagline", e.target.value)}
                      placeholder="Your Perfect Family Companion"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="hero_heading">Homepage Hero Heading</Label>
                  <Input
                    id="hero_heading"
                    value={settings.hero_heading || ""}
                    onChange={(e) => handleInputChange("hero_heading", e.target.value)}
                    placeholder="Your Perfect Family Goldendoodle Starts Here"
                  />
                </div>

                <div>
                  <Label htmlFor="hero_subheading">Homepage Hero Subheading</Label>
                  <Textarea
                    id="hero_subheading"
                    value={settings.hero_subheading || ""}
                    onChange={(e) => handleInputChange("hero_subheading", e.target.value)}
                    placeholder="Breeding health-tested, family-socialized Goldendoodles..."
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Logo Image</Label>
                    <div className="mt-2">
                      {settings.logo_url && (
                        <div className="mb-4">
                          <img src={settings.logo_url} alt="Logo" className="h-16 object-contain border rounded" />
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files[0] && handleImageUpload("logo_url", e.target.files[0])}
                        disabled={uploading}
                      />
                      {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
                    </div>
                  </div>
                  <div>
                    <Label>Hero Background Image</Label>
                    <div className="mt-2">
                      {settings.main_hero_image_url && (
                        <div className="mb-4">
                          <img src={settings.main_hero_image_url} alt="Hero" className="h-24 w-32 object-cover border rounded" />
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files[0] && handleImageUpload("main_hero_image_url", e.target.files[0])}
                        disabled={uploading}
                      />
                      {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended: 600x750px or similar 4:5 aspect ratio
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="contact_phone">Phone Number</Label>
                    <Input
                      id="contact_phone"
                      value={settings.contact_phone || ""}
                      onChange={(e) => handleInputChange("contact_phone", e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_email">Email Address</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={settings.contact_email || ""}
                      onChange={(e) => handleInputChange("contact_email", e.target.value)}
                      placeholder="info@goldenpawsdoodles.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="contact_address">Address</Label>
                  <Input
                    id="contact_address"
                    value={settings.contact_address || ""}
                    onChange={(e) => handleInputChange("contact_address", e.target.value)}
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="contact_city">City</Label>
                    <Input
                      id="contact_city"
                      value={settings.contact_city || ""}
                      onChange={(e) => handleInputChange("contact_city", e.target.value)}
                      placeholder="Golden Valley"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_state">State</Label>
                    <Input
                      id="contact_state"
                      value={settings.contact_state || ""}
                      onChange={(e) => handleInputChange("contact_state", e.target.value)}
                      placeholder="CA"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_zip_code">ZIP Code</Label>
                    <Input
                      id="contact_zip_code"
                      value={settings.contact_zip_code || ""}
                      onChange={(e) => handleInputChange("contact_zip_code", e.target.value)}
                      placeholder="12345"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="facebook_url">Facebook URL</Label>
                    <Input
                      id="facebook_url"
                      value={settings.facebook_url || ""}
                      onChange={(e) => handleInputChange("facebook_url", e.target.value)}
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram_url">Instagram URL</Label>
                    <Input
                      id="instagram_url"
                      value={settings.instagram_url || ""}
                      onChange={(e) => handleInputChange("instagram_url", e.target.value)}
                      placeholder="https://instagram.com/yourpage"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About & Philosophy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="about_philosophy_text">About/Philosophy Text</Label>
                    <Textarea
                      id="about_philosophy_text"
                      value={settings.about_philosophy_text || ""}
                      onChange={(e) => handleInputChange("about_philosophy_text", e.target.value)}
                      placeholder="Our philosophy and approach to breeding..."
                      rows={6}
                    />
                  </div>

                  <div>
                    <Label htmlFor="mission_statement_text">Mission Statement</Label>
                    <Textarea
                      id="mission_statement_text"
                      value={settings.mission_statement_text || ""}
                      onChange={(e) => handleInputChange("mission_statement_text", e.target.value)}
                      placeholder="Our mission is to..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="footer_about_text">Footer About Text</Label>
                    <Textarea
                      id="footer_about_text"
                      value={settings.footer_about_text || ""}
                      onChange={(e) => handleInputChange("footer_about_text", e.target.value)}
                      placeholder="Short description for footer..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Core Principles (Why Choose Us Section)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(settings.core_principles || []).map((principle, index) => (
                      <div key={index} className="border rounded p-4">
                        <div className="flex justify-between items-start mb-4">
                          <Badge variant="outline">Principle {index + 1}</Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayItem("core_principles", index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>Title</Label>
                            <Input
                              value={principle.title || ""}
                              onChange={(e) => handleArrayChange("core_principles", index, "title", e.target.value)}
                              placeholder="Health-Tested Parents"
                            />
                          </div>
                          <div>
                            <Label>Icon</Label>
                            <Input
                              value={principle.icon || ""}
                              onChange={(e) => handleArrayChange("core_principles", index, "icon", e.target.value)}
                              placeholder="Shield"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <Label>Description</Label>
                          <Textarea
                            value={principle.description || ""}
                            onChange={(e) => handleArrayChange("core_principles", index, "description", e.target.value)}
                            placeholder="Comprehensive genetic and physical health testing..."
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                    <Button
                      onClick={() => addArrayItem("core_principles", { title: "", description: "", icon: "" })}
                      variant="outline"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Principle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>Colors & Branding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="primary_color">Primary Color</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="primary_color"
                        type="color"
                        value={settings.primary_color || "#D97706"}
                        onChange={(e) => handleInputChange("primary_color", e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={settings.primary_color || "#D97706"}
                        onChange={(e) => handleInputChange("primary_color", e.target.value)}
                        placeholder="#D97706"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="secondary_color">Secondary Color</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="secondary_color"
                        type="color"
                        value={settings.secondary_color || "#78716C"}
                        onChange={(e) => handleInputChange("secondary_color", e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={settings.secondary_color || "#78716C"}
                        onChange={(e) => handleInputChange("secondary_color", e.target.value)}
                        placeholder="#78716C"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="accent_color">Accent Color</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="accent_color"
                        type="color"
                        value={settings.accent_color || "#059669"}
                        onChange={(e) => handleInputChange("accent_color", e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={settings.accent_color || "#059669"}
                        onChange={(e) => handleInputChange("accent_color", e.target.value)}
                        placeholder="#059669"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-100 rounded-lg">
                  <h4 className="font-medium mb-2">Color Preview</h4>
                  <div className="flex gap-4">
                    <div 
                      className="w-20 h-20 rounded-lg shadow-md flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: settings.primary_color }}
                    >
                      Primary
                    </div>
                    <div 
                      className="w-20 h-20 rounded-lg shadow-md flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: settings.secondary_color }}
                    >
                      Secondary
                    </div>
                    <div 
                      className="w-20 h-20 rounded-lg shadow-md flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: settings.accent_color }}
                    >
                      Accent
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Trust Bar Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(settings.trust_bar_items || []).map((item, index) => (
                    <div key={index} className="border rounded p-4">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="outline">Trust Item {index + 1}</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem("trust_bar_items", index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Text</Label>
                          <Input
                            value={item.text || ""}
                            onChange={(e) => handleArrayChange("trust_bar_items", index, "text", e.target.value)}
                            placeholder="GANA Blue Ribbon"
                          />
                        </div>
                        <div>
                          <Label>Icon</Label>
                          <Input
                            value={item.icon || ""}
                            onChange={(e) => handleArrayChange("trust_bar_items", index, "icon", e.target.value)}
                            placeholder="Award"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={() => addArrayItem("trust_bar_items", { text: "", icon: "" })}
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Trust Item
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
