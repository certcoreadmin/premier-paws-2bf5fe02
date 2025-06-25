import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Award, Calendar, Weight, Palette, FileText, 
  ExternalLink, Heart, Shield, Trophy, ArrowLeft, Video,
  User, MapPin
} from "lucide-react";
import { format, differenceInYears } from "date-fns";

export default function ParentProfile({ parent, onBack }) {
  const getPrimaryPhoto = () => {
    if (!parent.photos || parent.photos.length === 0) return null;
    const primary = parent.photos.find(p => p.is_primary);
    return primary || parent.photos[0];
  };

  const [activePhoto, setActivePhoto] = useState(getPrimaryPhoto());

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'Unknown';
    return differenceInYears(new Date(), new Date(birthDate));
  };
  
  const hasPhotos = parent.photos && parent.photos.length > 0;

  return (
    <div className="space-y-8 lg:space-y-12">
      {/* Back Button & Header */}
      <div>
        <Button variant="outline" onClick={onBack} className="mb-6 lg:mb-8 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to All Parents
        </Button>
        <div className="text-center">
          <h1 className="text-3xl lg:text-5xl font-bold text-stone-800 mb-2">
            {parent.name}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-lg lg:text-xl text-stone-600">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-amber-600" />
              <span className="capitalize">{parent.gender}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              <span>{calculateAge(parent.birth_date)} years old</span>
            </div>
            {parent.pedigree?.champion_bloodline && (
              <Badge className="bg-amber-100 text-amber-800 flex items-center gap-1">
                <Award className="w-4 h-4" />
                Champion Bloodline
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      {hasPhotos && (
        <div className="space-y-4">
          <div className="aspect-[16/10] bg-stone-100 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center">
            {activePhoto ? (
              <img 
                src={activePhoto.url} 
                alt={activePhoto.caption || parent.name}
                className="w-full h-full object-cover"
              />
            ) : (
               <Heart className="w-24 h-24 text-stone-400" />
            )}
          </div>
          {parent.photos.length > 1 && (
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {parent.photos.map((photo, index) => (
                <div 
                  key={index} 
                  className={`aspect-square bg-stone-200 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${activePhoto?.url === photo.url ? 'ring-2 ring-amber-500 ring-offset-2' : 'hover:opacity-80'}`}
                  onClick={() => setActivePhoto(photo)}
                >
                  <img 
                    src={photo.url} 
                    alt={photo.caption || `${parent.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Details Grid - Mobile Optimized */}
      <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
        <div className="lg:col-span-3 space-y-6 lg:space-y-8">
          {/* Basic Stats - Mobile Friendly Cards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                <FileText className="w-5 h-5 text-blue-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mobile: Stack vertically, Desktop: Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="text-sm text-stone-600">Born</p>
                      <p className="font-semibold">{parent.birth_date ? format(new Date(parent.birth_date), 'MMM d, yyyy') : 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                    <Weight className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="text-sm text-stone-600">Weight</p>
                      <p className="font-semibold">{parent.current_weight ? `${parent.current_weight} lbs` : 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                    <Palette className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="text-sm text-stone-600">Color</p>
                      <p className="font-semibold">{parent.color || 'N/A'}</p>
                    </div>
                  </div>
                  {parent.registration_info?.registration_number && (
                    <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                      <Trophy className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="text-sm text-stone-600">Registration</p>
                        <p className="font-semibold text-xs">{parent.registration_info.registry}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {parent.pedigree?.champion_bloodline && (
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-amber-600" />
                      <span className="font-semibold text-amber-800">Champion Bloodline</span>
                    </div>
                    <p className="text-amber-700 text-sm">
                      This dog comes from a line of decorated champions, showcasing proven genetics and exceptional conformation.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Personality & Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                <Heart className="w-5 h-5 text-pink-600" />
                Personality & Temperament
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-700 leading-relaxed">
                {parent.description || "This beautiful dog exemplifies the ideal temperament with a gentle, friendly nature and outstanding intelligence. Known for their calm demeanor and excellent interaction with children and other pets."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Video - Better mobile layout */}
        <div className="lg:col-span-2">
          {parent.video_url && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
                  <Video className="w-5 h-5 text-red-600" />
                  Watch in Action
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-stone-900 rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    className="w-full h-full"
                    src={parent.video_url.replace("watch?v=", "embed/")}
                    title={`Video of ${parent.name}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Health Clearances - Mobile Optimized */}
      {parent.health_clearances && parent.health_clearances.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
              <Shield className="w-5 h-5 text-green-600" />
              Health Clearances & Testing
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-auto"
                onClick={() => document.getElementById('health-table').scrollIntoView({ behavior: 'smooth' })}
              >
                View Details
              </Button>
            </CardTitle>
            <p className="text-stone-600 mt-2">
              All health testing is performed by certified organizations and results are publicly available.
            </p>
          </CardHeader>
          <CardContent>
            {/* Mobile: Card layout, Desktop: Table */}
            <div className="block lg:hidden space-y-4" id="health-table">
              {parent.health_clearances.map((clearance, index) => (
                <div key={index} className="border border-green-200 rounded-lg p-4 bg-green-50/50">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-green-800">{clearance.test_type}</h4>
                    <Badge 
                      className={`${
                        clearance.result?.toLowerCase().includes('clear') || 
                        clearance.result?.toLowerCase().includes('normal') ||
                        clearance.result?.toLowerCase().includes('excellent') ||
                        clearance.result?.toLowerCase().includes('good')
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {clearance.result}
                    </Badge>
                  </div>
                  <p className="text-sm text-green-700 mb-2">
                    {clearance.test_date ? format(new Date(clearance.test_date), 'MMM d, yyyy') : 'Date not available'}
                  </p>
                  {clearance.registry_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="p-0 h-auto text-blue-600 hover:text-blue-800"
                    >
                      <a 
                        href={clearance.registry_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm"
                      >
                        View Record
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            {/* Desktop: Table layout */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-green-50">
                    <th className="border border-green-200 p-3 text-left">Test Type</th>
                    <th className="border border-green-200 p-3 text-left">Date</th>
                    <th className="border border-green-200 p-3 text-left">Result</th>
                    <th className="border border-green-200 p-3 text-left">Registry</th>
                  </tr>
                </thead>
                <tbody>
                  {parent.health_clearances.map((clearance, index) => (
                    <tr key={index} className="hover:bg-stone-50">
                      <td className="border border-green-200 p-3 font-medium">
                        {clearance.test_type}
                      </td>
                      <td className="border border-green-200 p-3">
                        {clearance.test_date ? format(new Date(clearance.test_date), 'MMM d, yyyy') : 'N/A'}
                      </td>
                      <td className="border border-green-200 p-3">
                        <Badge 
                          className={`${
                            clearance.result?.toLowerCase().includes('clear') || 
                            clearance.result?.toLowerCase().includes('normal') ||
                            clearance.result?.toLowerCase().includes('excellent') ||
                            clearance.result?.toLowerCase().includes('good')
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {clearance.result}
                        </Badge>
                      </td>
                      <td className="border border-green-200 p-3">
                        {clearance.registry_url ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="p-0 h-auto text-blue-600 hover:text-blue-800"
                          >
                            <a 
                              href={clearance.registry_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1"
                            >
                              View Record
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </Button>
                        ) : (
                          <span className="text-stone-500 text-sm">Available on request</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Why Health Testing Matters</h4>
              <p className="text-blue-700 text-sm">
                Comprehensive health testing helps ensure we're breeding dogs free from genetic diseases 
                and passing on the healthiest possible genetics to their offspring. All our breeding 
                decisions are based on health test results, temperament evaluation, and conformation to breed standard.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}