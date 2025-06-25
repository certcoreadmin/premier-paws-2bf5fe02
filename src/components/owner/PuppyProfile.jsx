import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Calendar, Weight, Palette, Users, Shield, Award, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function PuppyProfile({ puppy, user }) {
  if (!puppy) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <Heart className="w-6 h-6 text-pink-600" />
          {puppy.name}'s Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Photo */}
          <div className="space-y-4">
            <div className="aspect-square bg-stone-200 rounded-lg overflow-hidden shadow-md">
              {puppy.photos && puppy.photos.length > 0 ? (
                <img src={puppy.photos[0]} alt={puppy.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300">
                  <Heart className="w-16 h-16 text-stone-400" />
                </div>
              )}
            </div>
            <p className="text-center text-stone-600 text-sm">The day you brought {puppy.name} home!</p>
          </div>
          
          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-stone-500" />
              <div>
                <p className="text-sm text-stone-600">Birthday</p>
                <p className="font-medium text-stone-800">{format(new Date(puppy.birth_date), 'MMMM d, yyyy')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-stone-500" />
              <div>
                <p className="text-sm text-stone-600">Gender</p>
                <p className="font-medium text-stone-800 capitalize">{puppy.gender}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-stone-500" />
              <div>
                <p className="text-sm text-stone-600">Color</p>
                <p className="font-medium text-stone-800">{puppy.color}</p>
              </div>
            </div>
             <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-stone-500" />
              <div>
                <p className="text-sm text-stone-600">Generation</p>
                <p className="font-medium text-stone-800">{puppy.generation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Parents */}
        <Card className="bg-stone-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-blue-600" />
              Proud Parents
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-stone-700">Sire (Father)</p>
              <p className="text-stone-600">{puppy.sire || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-700">Dam (Mother)</p>
              <p className="text-stone-600">{puppy.dam || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

      </CardContent>
    </Card>
  );
}