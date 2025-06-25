import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, Star } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function FeaturedPost({ post }) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Star className="w-5 h-5 text-amber-500 fill-current" />
          <span className="text-amber-600 font-medium">Featured Article</span>
        </div>
        <h2 className="text-2xl font-bold text-stone-800">
          Don't Miss This Important Read
        </h2>
      </div>

      <Card className="overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="grid lg:grid-cols-2 gap-0">
          {post.featured_image && (
            <div className="aspect-video lg:aspect-square bg-stone-200 overflow-hidden">
              <img 
                src={post.featured_image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <CardContent className="p-8 flex flex-col justify-center">
            <Badge className="bg-blue-100 text-blue-800 mb-4 w-fit">
              {post.category.replace(/_/g, ' ')}
            </Badge>
            
            <h3 className="text-2xl font-bold text-stone-800 mb-4">
              {post.title}
            </h3>
            
            <div className="flex items-center gap-4 text-stone-500 text-sm mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(post.created_date), 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Premier Paws Team</span>
              </div>
            </div>
            
            <p className="text-stone-600 mb-6 leading-relaxed">
              {post.excerpt || post.content.substring(0, 200) + "..."}
            </p>
            
            <Link to={createPageUrl(`Blog?post=${post.slug}`)}>
              <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                Read Full Article
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}