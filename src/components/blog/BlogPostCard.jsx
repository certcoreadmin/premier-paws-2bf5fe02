import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function BlogPostCard({ post }) {
  const categoryColors = {
    breed_education: "bg-blue-100 text-blue-800",
    puppy_care: "bg-green-100 text-green-800",
    health: "bg-red-100 text-red-800",
    training: "bg-purple-100 text-purple-800",
    breeder_updates: "bg-amber-100 text-amber-800"
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {post.featured_image && (
        <div className="aspect-video bg-stone-200 overflow-hidden">
          <img 
            src={post.featured_image} 
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="mb-4">
          <Badge className={`${categoryColors[post.category] || 'bg-stone-100 text-stone-800'} mb-3`}>
            {post.category.replace(/_/g, ' ')}
          </Badge>
          
          <h3 className="text-xl font-semibold text-stone-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>
          
          <div className="flex items-center gap-4 text-stone-500 text-sm mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(post.created_date), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>Premier Paws</span>
            </div>
          </div>
        </div>
        
        {post.excerpt && (
          <p className="text-stone-600 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-3 h-3 text-stone-400" />
            <div className="flex gap-1 flex-wrap">
              {post.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.tags.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        <Link 
          to={createPageUrl(`Blog?post=${post.slug}`)}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 group"
        >
          Read More 
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </CardContent>
    </Card>
  );
}