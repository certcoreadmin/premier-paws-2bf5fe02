import React, { useState, useEffect } from "react";
import { BlogPost } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Play, Camera, Heart } from "lucide-react";
import { format, differenceInWeeks } from "date-fns";

export default function WeeklyPupdates({ puppy }) {
  const [updates, setUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPuppyUpdates();
  }, [puppy]);

  const loadPuppyUpdates = async () => {
    try {
      // Look for blog posts tagged with this puppy's name or litter
      const puppyUpdates = await BlogPost.filter({
        published: true,
        category: "breeder_updates"
      }, "-created_date", 5);
      
      // Filter for posts that mention this puppy
      const relevantUpdates = puppyUpdates.filter(post => 
        post.tags?.includes(puppy.name.toLowerCase()) || 
        post.title.toLowerCase().includes(puppy.name.toLowerCase()) ||
        post.content.toLowerCase().includes(puppy.name.toLowerCase())
      );
      
      setUpdates(relevantUpdates);
    } catch (error) {
      console.error("Error loading puppy updates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPuppyAge = () => {
    if (!puppy.birth_date) return 0;
    return differenceInWeeks(new Date(), new Date(puppy.birth_date));
  };

  const generateWeeklyContent = (weekNumber) => {
    const weeklyMilestones = {
      1: "Eyes are still closed, but we're doing early neurological stimulation to help with brain development.",
      2: "Eyes are starting to open! We're seeing the first glimpses of their personalities.",
      3: "Walking around more confidently and starting to play with siblings.",
      4: "Personalities really starting to shine! Beginning basic socialization with gentle handling.",
      5: "Starting to eat puppy food and becoming more interactive. So much fun!",
      6: "Puppy personalities in full swing! Playing, exploring, and being absolutely adorable.",
      7: "Getting ready for their new families. Vet checks and final preparations underway.",
      8: "Ready to go home! All grown up and ready for their forever families."
    };
    
    return weeklyMilestones[weekNumber] || "Growing bigger and more beautiful every day!";
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          Weekly Pupdates for {puppy.name}
        </CardTitle>
        <p className="text-stone-600">
          Follow {puppy.name}'s journey from tiny newborn to ready-for-home companion
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-stone-500">Loading updates...</p>
        ) : updates.length > 0 ? (
          <div className="space-y-6">
            {updates.map((update, index) => (
              <div key={update.id} className="border-l-4 border-purple-200 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">
                    {format(new Date(update.created_date), 'MMMM d, yyyy')}
                  </span>
                </div>
                <h4 className="font-semibold text-stone-800 mb-2">{update.title}</h4>
                {update.featured_image && (
                  <img 
                    src={update.featured_image} 
                    alt={update.title}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                )}
                <p className="text-stone-700 text-sm">{update.excerpt}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Generate placeholder weekly updates based on puppy's age */}
            {Array.from({ length: Math.min(getPuppyAge() + 1, 8) }, (_, index) => {
              const weekNumber = index + 1;
              return (
                <div key={weekNumber} className="border-l-4 border-purple-200 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">
                      Week {weekNumber}
                    </span>
                  </div>
                  <p className="text-stone-700">{generateWeeklyContent(weekNumber)}</p>
                  
                  {/* Placeholder for future photos/videos */}
                  <div className="mt-3 flex gap-2">
                    <div className="w-20 h-20 bg-purple-50 rounded-lg flex items-center justify-center border border-purple-200">
                      <Camera className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="w-20 h-20 bg-purple-50 rounded-lg flex items-center justify-center border border-purple-200">
                      <Play className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div className="text-center mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-purple-800 font-medium">More updates coming soon!</p>
              <p className="text-purple-600 text-sm">
                We post new photos and videos every week as {puppy.name} grows.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}