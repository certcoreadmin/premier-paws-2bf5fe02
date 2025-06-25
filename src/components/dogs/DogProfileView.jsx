import React, { useState, useEffect } from "react";
import { Dog } from "@/api/entities";
import { GrowthRecord } from "@/api/entities";
import { HealthRecord } from "@/api/entities";
import { VaccinationSchedule } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dog as DogIcon, Heart, FileText, TrendingUp, Syringe, 
  Camera, Edit, Plus, Download, Upload, Calendar, Award,
  Shield, Activity, Users, Phone, MapPin
} from "lucide-react";
import { format, differenceInWeeks } from "date-fns";

export default function DogProfileView({ dogId }) {
  const [dog, setDog] = useState(null);
  const [growthRecords, setGrowthRecords] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [vaccinationSchedules, setVaccinationSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (dogId) {
      loadDogProfile();
    }
  }, [dogId]);

  const loadDogProfile = async () => {
    try {
      const [dogData, growth, health, vaccines] = await Promise.all([
        Dog.filter({ id: dogId }),
        GrowthRecord.filter({ dog_id: dogId }, "-date_recorded"),
        HealthRecord.filter({ dog_id: dogId }, "-date"),
        VaccinationSchedule.filter({ dog_id: dogId })
      ]);
      
      setDog(dogData[0]);
      setGrowthRecords(growth);
      setHealthRecords(health);
      setVaccinationSchedules(vaccines);
    } catch (error) {
      console.error("Error loading dog profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = () => {
    if (!dog?.birth_date) return "Unknown";
    const weeks = differenceInWeeks(new Date(), new Date(dog.birth_date));
    if (weeks < 52) return `${weeks} weeks`;
    const years = Math.floor(weeks / 52);
    const remainingWeeks = weeks % 52;
    return `${years} year${years !== 1 ? 's' : ''} ${remainingWeeks} weeks`;
  };

  const getPrimaryPhoto = () => {
    if (!dog?.photos?.length) return null;
    const primary = dog.photos.find(p => p.is_primary);
    return primary?.url || dog.photos[0]?.url;
  };

  const getHealthStatus = () => {
    const recentRecords = healthRecords.slice(0, 5);
    const hasRecentVaccinations = recentRecords.some(r => 
      r.record_type === 'vaccination' && 
      new Date(r.date) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
    );
    
    return {
      status: hasRecentVaccinations ? "up_to_date" : "needs_attention",
      lastCheckup: healthRecords.find(r => r.record_type === 'vet_visit')?.date
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!dog) {
    return (
      <div className="text-center p-8">
        <DogIcon className="w-16 h-16 text-stone-300 mx-auto mb-4" />
        <p className="text-stone-600">Dog not found</p>
      </div>
    );
  }

  const healthStatus = getHealthStatus();

  return (
    <div className="space-y-6">
      {/* Dog Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 bg-stone-200 rounded-lg overflow-hidden flex-shrink-0">
              {getPrimaryPhoto() ? (
                <img 
                  src={getPrimaryPhoto()} 
                  alt={dog.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <DogIcon className="w-12 h-12 text-stone-400" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-stone-800">{dog.name}</h1>
                <Badge className={dog.type === 'parent' ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}>
                  {dog.type === 'parent' ? 'Breeding Dog' : 'Puppy'}
                </Badge>
                {dog.status && (
                  <Badge className={`bg-${dog.status === 'available' ? 'green' : 'gray'}-100 text-${dog.status === 'available' ? 'green' : 'gray'}-800`}>
                    {dog.status}
                  </Badge>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-stone-600">Gender:</span>
                  <span className="ml-2 font-medium">{dog.gender}</span>
                </div>
                <div>
                  <span className="text-stone-600">Age:</span>
                  <span className="ml-2 font-medium">{calculateAge()}</span>
                </div>
                <div>
                  <span className="text-stone-600">Generation:</span>
                  <span className="ml-2 font-medium">{dog.generation || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-stone-600">Color:</span>
                  <span className="ml-2 font-medium">{dog.color}</span>
                </div>
                <div>
                  <span className="text-stone-600">Weight:</span>
                  <span className="ml-2 font-medium">{dog.current_weight ? `${dog.current_weight} lbs` : 'Not recorded'}</span>
                </div>
                <div>
                  <span className="text-stone-600">Size:</span>
                  <span className="ml-2 font-medium">{dog.size_category || 'N/A'}</span>
                </div>
              </div>
              
              {dog.registration_info?.registration_number && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Award className="w-4 h-4" />
                    <span className="font-medium">Registered</span>
                  </div>
                  <p className="text-blue-700 text-sm mt-1">
                    {dog.registration_info.registry}: {dog.registration_info.registration_number}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Records
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-stone-600">Health Status</p>
                <p className="font-medium">
                  {healthStatus.status === 'up_to_date' ? 'Up to Date' : 'Needs Attention'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-stone-600">Growth Records</p>
                <p className="font-medium">{growthRecords.length} entries</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Syringe className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-stone-600">Vaccinations</p>
                <p className="font-medium">
                  {healthRecords.filter(r => r.record_type === 'vaccination').length} doses
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-stone-600">Photos</p>
                <p className="font-medium">{dog.photos?.length || 0} photos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="health">Health Records</TabsTrigger>
          <TabsTrigger value="growth">Growth Tracking</TabsTrigger>
          <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
          <TabsTrigger value="pedigree">Pedigree</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-stone-600">Birth Date:</span>
                    <p className="font-medium">{dog.birth_date ? format(new Date(dog.birth_date), 'MMM d, yyyy') : 'Not recorded'}</p>
                  </div>
                  <div>
                    <span className="text-stone-600">Coat Type:</span>
                    <p className="font-medium">{dog.coat_type || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-stone-600">Current Height:</span>
                    <p className="font-medium">{dog.current_height ? `${dog.current_height}"` : 'Not recorded'}</p>
                  </div>
                  <div>
                    <span className="text-stone-600">Adoption Fee:</span>
                    <p className="font-medium">{dog.price ? `$${dog.price}` : 'Not set'}</p>
                  </div>
                </div>
                
                {dog.description && (
                  <div>
                    <span className="text-stone-600">Description:</span>
                    <p className="mt-1 text-sm">{dog.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Microchip & Registration */}
            <Card>
              <CardHeader>
                <CardTitle>Identification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dog.microchip_info?.microchip_number && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800 mb-2">
                      <Shield className="w-4 h-4" />
                      <span className="font-medium">Microchipped</span>
                    </div>
                    <p className="text-green-700 text-sm">
                      #{dog.microchip_info.microchip_number}
                    </p>
                    <p className="text-green-600 text-xs">
                      {dog.microchip_info.microchip_company} • 
                      Implanted {dog.microchip_info.implant_date ? format(new Date(dog.microchip_info.implant_date), 'MMM yyyy') : 'Date unknown'}
                    </p>
                  </div>
                )}
                
                {dog.registration_info && (
                  <div>
                    <h4 className="font-medium text-stone-800 mb-2">Registration Details</h4>
                    <div className="space-y-2 text-sm">
                      {dog.registration_info.registration_name && (
                        <div>
                          <span className="text-stone-600">Registered Name:</span>
                          <p className="font-medium">{dog.registration_info.registration_name}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-stone-600">Status:</span>
                        <Badge className="ml-2" variant="outline">
                          {dog.registration_info.registration_status || 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* DNA Profile */}
          {dog.dna_profile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  DNA Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-stone-600">Test Type:</span>
                    <p className="font-medium">{dog.dna_profile.panel_type}</p>
                  </div>
                  <div>
                    <span className="text-stone-600">Genetic Diversity:</span>
                    <p className="font-medium">{dog.dna_profile.genetic_diversity}%</p>
                  </div>
                  <div>
                    <span className="text-stone-600">Test Date:</span>
                    <p className="font-medium">
                      {dog.dna_profile.test_date ? format(new Date(dog.dna_profile.test_date), 'MMM yyyy') : 'Not recorded'}
                    </p>
                  </div>
                </div>
                
                {dog.dna_profile.carrier_status?.length > 0 && (
                  <div className="mt-4">
                    <span className="text-stone-600">Carrier Status:</span>
                    <div className="flex gap-2 mt-2">
                      {dog.dna_profile.carrier_status.map((condition, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {dog.dna_profile.results_url && (
                  <div className="mt-4">
                    <Button variant="outline" size="sm" asChild>
                      <a href={dog.dna_profile.results_url} target="_blank" rel="noopener noreferrer">
                        View Full Results
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="health">
          <HealthRecordsTab 
            healthRecords={healthRecords} 
            dogId={dogId}
            onUpdate={loadDogProfile}
          />
        </TabsContent>

        <TabsContent value="growth">
          <GrowthTrackingTab 
            growthRecords={growthRecords} 
            dog={dog}
            onUpdate={loadDogProfile}
          />
        </TabsContent>

        <TabsContent value="vaccinations">
          <VaccinationsTab 
            vaccinationSchedules={vaccinationSchedules}
            healthRecords={healthRecords.filter(r => r.record_type === 'vaccination')}
            dogId={dogId}
            onUpdate={loadDogProfile}
          />
        </TabsContent>

        <TabsContent value="pedigree">
          <PedigreeTab dog={dog} onUpdate={loadDogProfile} />
        </TabsContent>

        <TabsContent value="photos">
          <PhotoGalleryTab dog={dog} onUpdate={loadDogProfile} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Placeholder components for tabs - we'll implement these next
const HealthRecordsTab = ({ healthRecords, dogId, onUpdate }) => (
  <Card>
    <CardHeader>
      <CardTitle>Health Records ({healthRecords.length})</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-stone-600">Health records management will be implemented next...</p>
    </CardContent>
  </Card>
);

const GrowthTrackingTab = ({ growthRecords, dog, onUpdate }) => (
  <Card>
    <CardHeader>
      <CardTitle>Growth Tracking</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-stone-600">Growth tracking with charts will be implemented next...</p>
    </CardContent>
  </Card>
);

const VaccinationsTab = ({ vaccinationSchedules, healthRecords, dogId, onUpdate }) => (
  <Card>
    <CardHeader>
      <CardTitle>Vaccination Schedule</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-stone-600">Vaccination scheduling will be implemented next...</p>
    </CardContent>
  </Card>
);

const PedigreeTab = ({ dog, onUpdate }) => (
  <Card>
    <CardHeader>
      <CardTitle>Pedigree Information</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-stone-600">Pedigree management will be implemented next...</p>
    </CardContent>
  </Card>
);

const PhotoGalleryTab = ({ dog, onUpdate }) => (
  <Card>
    <CardHeader>
      <CardTitle>Photo Gallery</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-stone-600">Photo gallery management will be implemented next...</p>
    </CardContent>
  </Card>
);