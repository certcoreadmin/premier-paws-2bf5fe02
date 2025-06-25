
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, Palette, ArrowRight, Award, User } from "lucide-react";
import { differenceInWeeks } from 'date-fns';

const getStatusColor = (status) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800 border-green-200 animate-pulse";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "reserved": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-stone-100 text-stone-800";
    }
};

const getAgeInWeeks = (birthDate) => {
    if (!birthDate) return 'Newborn';
    const weeks = differenceInWeeks(new Date(), new Date(birthDate));
    if (weeks < 1) return 'Newborn';
    return `${weeks} week${weeks !== 1 ? 's' : ''} old`;
};

const getPhotoUrls = (photos) => {
  if (!photos || photos.length === 0) return [];
  return photos.map(p => (typeof p === 'string' ? p : p.url)).filter(Boolean);
};

export default function PuppyCard({ puppy, onClick, showStatus }) {
  const statusBanner = getStatusColor(puppy.status);
  const photoUrls = getPhotoUrls(puppy.photos);
  
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    if (photoUrls.length > 1) {
      const interval = setInterval(() => {
        setCurrentPhotoIndex(prevIndex => (prevIndex + 1) % photoUrls.length);
      }, 3000); // Change image every 3 seconds
      return () => clearInterval(interval);
    }
  }, [photoUrls.length]);

  const primaryPhotoUrl = photoUrls[currentPhotoIndex] || null;

  return (
    <Card 
      onClick={onClick}
      className="overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer rounded-2xl flex flex-col h-full bg-white"
    >
      <div className="aspect-square bg-stone-200 overflow-hidden relative">
        {primaryPhotoUrl ? (
          <img
            src={primaryPhotoUrl}
            alt={`${puppy.name} photo ${currentPhotoIndex + 1}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback placeholder */}
        <div 
          className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300"
          style={{ display: primaryPhotoUrl ? 'none' : 'flex' }}
        >
          <Heart className="w-16 h-16 text-stone-400" />
        </div>

        {(showStatus || puppy.status !== 'available') && (
            <Badge className={`${statusBanner} absolute top-3 right-3 text-sm px-3 py-1 font-semibold`}>
                {puppy.status.charAt(0).toUpperCase() + puppy.status.slice(1)}
            </Badge>
        )}
        
        {photoUrls.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                {photoUrls.map((_, index) => (
                    <div 
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'}`}
                    />
                ))}
            </div>
        )}

         <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <h3 className="text-3xl font-bold text-white shadow-lg">{puppy.name}</h3>
        </div>
      </div>
      <CardContent className="p-5 flex-grow flex flex-col">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-stone-600 mb-4">
            <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-amber-600" />
                <span className="capitalize font-medium">{puppy.gender}</span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span className="font-medium">{getAgeInWeeks(puppy.birth_date)}</span>
            </div>
            <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-600" />
                <span className="font-medium">{puppy.color || 'Beautiful'}</span>
            </div>
            <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span className="font-medium">{puppy.generation || 'F1b'}</span>
            </div>
        </div>

        <p className="text-stone-700 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
          {puppy.description || `A wonderful ${puppy.gender} puppy with a fantastic temperament, ready to bring joy to a new family. More details available on their profile!`}
        </p>

        <div className="mt-auto pt-4 border-t border-stone-100">
            <Button variant="outline" className="w-full">
                View Profile <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
