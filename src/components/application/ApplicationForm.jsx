
import React, { useState } from "react";
import { Application } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  User as UserIcon, Home, Heart, Phone, 
  MapPin, Users 
} from "lucide-react";

export default function ApplicationForm({ onSuccess, initialPuppyInterest, referralCode }) {
  const [formData, setFormData] = useState({
    applicant_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    housing_type: "",
    yard_fenced: false,
    experience_with_breed: "",
    other_pets: "",
    children_ages: "",
    work_schedule: "",
    puppy_preferences: "",
    puppy_interest: initialPuppyInterest || "", // Initialize with prop
    references: [
      { name: "", relationship: "", phone: "" },
      { name: "", relationship: "", phone: "" }
    ],
    additional_info: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleReferenceChange = (index, field, value) => {
    const newReferences = [...formData.references];
    newReferences[index] = {
      ...newReferences[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      references: newReferences
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.applicant_name.trim()) newErrors.applicant_name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.housing_type) newErrors.housing_type = "Housing type is required";
    if (!formData.experience_with_breed) newErrors.experience_with_breed = "Experience level is required";
    if (!formData.work_schedule.trim()) newErrors.work_schedule = "Work schedule is required";
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const submissionData = { 
        ...formData,
        notes: formData.additional_info // Ensure notes are mapped from additional_info
      };

      // Add or override puppy_interest from prop if provided
      if (initialPuppyInterest) {
        submissionData.puppy_interest = initialPuppyInterest;
      }
      
      // Add referral_code from prop if provided
      if (referralCode) {
        submissionData.referral_code = referralCode;
      }
      
      await Application.create(submissionData);
      onSuccess(); // Call the new onSuccess prop

    } catch (error) {
      console.error("Error submitting application:", error);
      alert("There was an error submitting your application. Please try again.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Progress indicator for mobile */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-stone-800">Adoption Application</h2>
          <div className="text-sm text-stone-600">Step 1 of 1</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
              <UserIcon className="w-5 h-5 text-blue-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="applicant_name">Full Name *</Label>
                <Input
                  id="applicant_name"
                  value={formData.applicant_name}
                  onChange={(e) => handleInputChange("applicant_name", e.target.value)}
                  className={`h-12 ${errors.applicant_name ? "border-red-500" : ""}`}
                />
                {errors.applicant_name && (
                  <p className="text-red-500 text-sm">{errors.applicant_name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`h-12 ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`h-12 ${errors.phone ? "border-red-500" : ""}`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
              <MapPin className="w-5 h-5 text-green-600" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 lg:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={`h-12 ${errors.address ? "border-red-500" : ""}`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className={`h-12 ${errors.city ? "border-red-500" : ""}`}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm">{errors.city}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className={`h-12 ${errors.state ? "border-red-500" : ""}`}
                />
                {errors.state && (
                  <p className="text-red-500 text-sm">{errors.state}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip_code">ZIP Code</Label>
                <Input
                  id="zip_code"
                  value={formData.zip_code}
                  onChange={(e) => handleInputChange("zip_code", e.target.value)}
                  className="h-12"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Housing Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
              <Home className="w-5 h-5 text-purple-600" />
              Housing & Lifestyle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 lg:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="housing_type">Type of Housing *</Label>
              <Select value={formData.housing_type} onValueChange={(value) => handleInputChange("housing_type", value)}>
                <SelectTrigger className={`h-12 ${errors.housing_type ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select housing type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house_with_yard">House with yard</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="condo">Condo/Townhouse</SelectItem>
                  <SelectItem value="farm">Farm/Rural property</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.housing_type && (
                <p className="text-red-500 text-sm">{errors.housing_type}</p>
              )}
            </div>

            <div className="flex items-center space-x-3 p-4 bg-stone-50 rounded-lg">
              <Checkbox 
                id="yard_fenced"
                checked={formData.yard_fenced}
                onCheckedChange={(checked) => handleInputChange("yard_fenced", checked)}
              />
              <Label htmlFor="yard_fenced" className="font-medium">Do you have a fenced yard?</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="work_schedule">Work Schedule & Daily Routine *</Label>
              <Textarea
                id="work_schedule"
                placeholder="Please describe your typical daily schedule and how much time you can dedicate to a puppy..."
                value={formData.work_schedule}
                onChange={(e) => handleInputChange("work_schedule", e.target.value)}
                className={`min-h-24 ${errors.work_schedule ? "border-red-500" : ""}`}
              />
              {errors.work_schedule && (
                <p className="text-red-500 text-sm">{errors.work_schedule}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Experience & Family */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
              <Heart className="w-5 h-5 text-pink-600" />
              Experience & Family
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 lg:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="experience_with_breed">Experience with Golden Retrievers *</Label>
              <Select value={formData.experience_with_breed} onValueChange={(value) => handleInputChange("experience_with_breed", value)}>
                <SelectTrigger className={`h-12 ${errors.experience_with_breed ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No experience with Golden Retrievers</SelectItem>
                  <SelectItem value="some">Some experience (friends/family dogs)</SelectItem>
                  <SelectItem value="extensive">Extensive experience (owned before)</SelectItem>
                </SelectContent>
              </Select>
              {errors.experience_with_breed && (
                <p className="text-red-500 text-sm">{errors.experience_with_breed}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="other_pets">Other Pets in the Home</Label>
              <Textarea
                id="other_pets"
                placeholder="Please list any other pets, their breeds, ages, and temperaments..."
                value={formData.other_pets}
                onChange={(e) => handleInputChange("other_pets", e.target.value)}
                className="min-h-20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="children_ages">Children in the Home</Label>
              <Input
                id="children_ages"
                placeholder="Ages of children or 'None'"
                value={formData.children_ages}
                onChange={(e) => handleInputChange("children_ages", e.target.value)}
                className="h-12"
              />
            </div>
          </CardContent>
        </Card>

        {/* Puppy Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
              <Users className="w-5 h-5 text-amber-600" />
              Puppy Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 lg:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="puppy_interest">Specific Puppy Interest</Label>
              <Input
                id="puppy_interest"
                placeholder="Any specific puppy you're interested in, or 'Open to suggestions'"
                value={formData.puppy_interest}
                onChange={(e) => handleInputChange("puppy_interest", e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="puppy_preferences">Puppy Preferences & Goals</Label>
              <Textarea
                id="puppy_preferences"
                placeholder="Tell us about your ideal puppy - gender preference, activity level, what you hope to do together (family pet, therapy work, showing, etc.)..."
                value={formData.puppy_preferences}
                onChange={(e) => handleInputChange("puppy_preferences", e.target.value)}
                rows={4}
                className="min-h-24"
              />
            </div>
          </CardContent>
        </Card>

        {/* References */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
              <Phone className="w-5 h-5 text-indigo-600" />
              References
            </CardTitle>
            <p className="text-stone-600 text-sm">
              Please provide two references (veterinarian, previous breeder, or personal references)
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.references.map((reference, index) => (
              <div key={index} className="p-4 lg:p-6 border rounded-lg bg-stone-50">
                <h4 className="font-semibold text-stone-800 mb-4">Reference {index + 1}</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`ref_name_${index}`}>Name</Label>
                    <Input
                      id={`ref_name_${index}`}
                      value={reference.name}
                      onChange={(e) => handleReferenceChange(index, "name", e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`ref_relationship_${index}`}>Relationship</Label>
                      <Input
                        id={`ref_relationship_${index}`}
                        placeholder="e.g., Veterinarian, Friend, etc."
                        value={reference.relationship}
                        onChange={(e) => handleReferenceChange(index, "relationship", e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`ref_phone_${index}`}>Phone Number</Label>
                      <Input
                        id={`ref_phone_${index}`}
                        type="tel"
                        value={reference.phone}
                        onChange={(e) => handleReferenceChange(index, "phone", e.target.value)}
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg lg:text-xl">Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="additional_info">Anything Else You'd Like Us to Know?</Label>
              <Textarea
                id="additional_info"
                placeholder="Share anything else that might help us understand your situation and find the perfect match..."
                value={formData.additional_info}
                onChange={(e) => handleInputChange("additional_info", e.target.value)}
                rows={4}
                className="min-h-24"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button - Enhanced for mobile */}
        <div className="text-center pt-4 pb-8">
          <Button 
            type="submit" 
            size="lg" 
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 lg:px-12 h-12 lg:h-14 text-base lg:text-lg font-semibold w-full lg:w-auto"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting Application...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
          <p className="text-stone-500 text-sm mt-4">
            We'll review your application and contact you within 2-3 business days.
          </p>
        </div>
      </form>
    </div>
  );
}
