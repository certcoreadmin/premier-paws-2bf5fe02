
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, Calendar, Weight, Palette, Users,
  Shield, Award, FileText, Phone, ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format, differenceInWeeks, differenceInDays } from "date-fns";

// Define WeeklyPupdates component
// This component is mentioned in the outline and needs to be implemented as part of the file.
function WeeklyPupdates({ puppy }) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          Weekly Pupdates for {puppy.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-stone-700 leading-relaxed">
          Check back soon for exciting weekly updates on {puppy.name}'s growth and adventures!
          We'll be sharing new photos and milestones as this little one gets ready to find their forever home.
        </p>
        <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200 text-purple-800 text-sm">
          Latest Update (placeholder): {format(new Date(), 'MMM d, yyyy')} - {puppy.name} is learning new tricks!
        </div>
      </CardContent>
    </Card>
  );
}

export default function PuppyDetails({ puppy, onBack, onApply }) {
  const getAgeInWeeks = () => {
    if (!puppy.birth_date) return 0;
    return differenceInWeeks(new Date(), new Date(puppy.birth_date));
  };

  const getDaysUntilReady = () => {
    if (!puppy.birth_date) return 0;
    const birthDate = new Date(puppy.birth_date);
    const readyDate = new Date(birthDate.getTime() + (8 * 7 * 24 * 60 * 60 * 1000)); // 8 weeks
    const daysLeft = differenceInDays(readyDate, new Date());
    return Math.max(0, daysLeft); // Ensure it doesn't go negative if already past 8 weeks
  };

  const isReadyToGo = () => {
    return getAgeInWeeks() >= 8;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "reserved":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "sold":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  const getPhotoObject = (photo) => {
    if (!photo) return null;
    if (typeof photo === 'string') return { url: photo, caption: '', is_primary: false };
    return photo;
  };
  
  const allPhotos = (puppy.photos || []).map(getPhotoObject);
  const initialPhoto = allPhotos.find(p => p.is_primary) || allPhotos[0] || null;
  const [activePhoto, setActivePhoto] = useState(initialPhoto);

  useEffect(() => {
    // Reset active photo if puppy changes
    const newInitialPhoto = allPhotos.find(p => p.is_primary) || allPhotos[0] || null;
    setActivePhoto(newInitialPhoto);
  }, [puppy.id]); // Dependency on puppy.id to reset active photo when switching puppies

  return (
    <div className="bg-white py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="outline" onClick={onBack} className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Puppies
        </Button>

        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-stone-800 mb-2">
              Meet {puppy.name}
            </h2>
            <p className="text-stone-600">
              {puppy.gender === 'male' ? 'Male' : 'Female'} • {differenceInWeeks(new Date(), new Date(puppy.birth_date))} weeks old
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Photos with Enhanced Interactivity */}
            <div className="space-y-4">
              <div className="aspect-square bg-stone-200 rounded-2xl overflow-hidden shadow-lg relative group">
                {activePhoto ? (
                  <img 
                    src={activePhoto.url} 
                    alt={activePhoto.caption || puppy.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300">
                    <Heart className="w-16 h-16 text-stone-400" />
                  </div>
                )}
                
                {/* Enhanced Status Badge with Animation */}
                <div className="absolute top-4 right-4">
                  <Badge className={`${getStatusColor(puppy.status)} border font-medium text-lg px-4 py-2 animate-pulse`}>
                    {puppy.status === 'available' ? '✨ Available' : 
                     puppy.status === 'pending' ? '⏳ Pending' :
                     puppy.status === 'reserved' ? '💝 Reserved' : 
                     '🏠 Sold'}
                  </Badge>
                </div>

                {/* Puppy "Wag" Animation on Hover */}
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-sm font-medium text-stone-800">
                      {puppy.name} says woof! 🐾
                    </span>
                  </div>
                </div>
              </div>

              {/* Video Player */}
              {puppy.video_url && (
                <div className="aspect-video bg-stone-900 rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    className="w-full h-full"
                    src={puppy.video_url.replace("watch?v=", "embed/")}
                    title={`Video of ${puppy.name}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              {/* Additional Photos with Hover Effects */}
              {allPhotos.length > 1 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {allPhotos.map((photo, index) => (
                    <div 
                      key={index} 
                      className={`aspect-square bg-stone-200 rounded-lg overflow-hidden group cursor-pointer transition-all duration-200 ${activePhoto?.url === photo.url ? 'ring-2 ring-amber-500 ring-offset-2' : 'hover:opacity-80'}`}
                      onClick={() => setActivePhoto(photo)}
                    >
                      <img 
                        src={photo.url} 
                        alt={photo.caption || `${puppy.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Details with Enhanced Personality Section */}
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    Puppy Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-stone-400" />
                      <div>
                        <p className="text-sm text-stone-600">Born</p>
                        <p className="font-medium">{puppy.birth_date ? format(new Date(puppy.birth_date), 'MMM d, yyyy') : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Weight className="w-4 h-4 text-stone-400" />
                      <div>
                        <p className="text-sm text-stone-600">Current Weight</p>
                        <p className="font-medium">{puppy.weight ? `${puppy.weight} lbs` : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Palette className="w-4 h-4 text-stone-400" />
                      <div>
                        <p className="text-sm text-stone-600">Color</p>
                        <p className="font-medium">{puppy.color || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-stone-400" />
                      <div>
                        <p className="text-sm text-stone-600">Age</p>
                        <p className="font-medium">{getAgeInWeeks()} weeks</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Ready to Go Status */}
                  <div className="mt-4 p-3 rounded-lg border">
                    {isReadyToGo() ? (
                      <div className="flex items-center gap-2 text-green-700">
                        <Shield className="w-5 h-5" />
                        <span className="font-medium">Ready to go home now!</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-amber-700">
                        <Calendar className="w-5 h-5" />
                        <span className="font-medium">
                          Ready to go home in {getDaysUntilReady()} days (at 8 weeks)
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              {puppy.price && (
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-stone-800 mb-2">
                        ${puppy.price.toLocaleString()}
                      </h3>
                      <p className="text-stone-600 mb-4">
                        Includes health guarantee, vaccinations, and lifetime support
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 justify-center">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span>2-Year Health Guarantee</span>
                        </div>
                        <div className="flex items-center gap-2 justify-center">
                          <Heart className="w-4 h-4 text-pink-600" />
                          <span>Early Socialization</span>
                        </div>
                        <div className="flex items-center gap-2 justify-center">
                          <Award className="w-4 h-4 text-amber-600" />
                          <span>Champion Bloodlines</span>
                        </div>
                        <div className="flex items-center gap-2 justify-center">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span>Lifetime Support</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Parents */}
              {(puppy.sire || puppy.dam) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-600" />
                      Parents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {puppy.sire && (
                        <div>
                          <p className="text-sm text-stone-600">Sire (Father)</p>
                          <p className="font-medium text-stone-800">{puppy.sire}</p>
                        </div>
                      )}
                      {puppy.dam && (
                        <div>
                          <p className="text-sm text-stone-600">Dam (Mother)</p>
                          <p className="font-medium text-stone-800">{puppy.dam}</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <Link to={createPageUrl("Parents")}>
                        <Button variant="outline" size="sm">
                          View Parent Profiles
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Enhanced Personality with AI-Generated Bio */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-600" />
                    Personality & Temperament
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-stone-700 leading-relaxed mb-4">
                    {puppy.description || 
                     `${puppy.name} is a joyful spirit who greets every sunrise with a wag! This adorable puppy has a wonderful, gentle personality and shows great potential for being an excellent family companion with their sweet nature and intelligence.`}
                  </p>
                  
                  {/* Temperament Traits */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-1">Energy Level</h4>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full w-4/5"></div>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-1">Friendliness</h4>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full w-full"></div>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <h4 className="font-medium text-purple-800 mb-1">Trainability</h4>
                      <div className="w-full bg-purple-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full w-5/6"></div>
                      </div>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-lg">
                      <h4 className="font-medium text-amber-800 mb-1">Adaptability</h4>
                      <div className="w-full bg-amber-200 rounded-full h-2">
                        <div className="bg-amber-600 h-2 rounded-full w-4/5"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {puppy.status === 'available' && (
                  <Link to={createPageUrl("Application")} className="flex-1">
                    <Button size="lg" className="w-full bg-amber-600 hover:bg-amber-700 gap-2">
                      <FileText className="w-5 h-5" />
                      Apply for {puppy.name}
                    </Button>
                  </Link>
                )}
                <Link to={createPageUrl("Contact")} className="flex-1">
                  <Button size="lg" variant="outline" className="w-full gap-2">
                    <Phone className="w-5 h-5" />
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <WeeklyPupdates puppy={puppy} />
        </div>
      </div>
    </div>
  );
}
