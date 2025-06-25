
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink, ShoppingBag } from "lucide-react";

const categoryLabels = {
    food: "Food & Nutrition",
    toys: "Toys & Enrichment",
    grooming: "Grooming",
    training: "Training",
    health: "Health",
    supplies: "Supplies"
};

export default function ProductCard({ product }) {
  return (
    <Card className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video bg-stone-200 overflow-hidden">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300">
            <ShoppingBag className="w-16 h-16 text-stone-400" />
          </div>
        )}
      </div>

      <CardContent className="p-6 flex-grow flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-stone-800 line-clamp-2">{product.name}</h3>
          {product.featured && (
            <Badge className="bg-amber-100 text-amber-800 shrink-0">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>
        
        <Badge variant="outline" className="mb-3 w-fit">{categoryLabels[product.category] || product.category}</Badge>
        
        <p className="text-stone-600 text-sm mb-4 flex-grow">
          {product.why_recommended || product.description}
        </p>
        
        <div className="mt-auto flex items-center justify-between">
          {product.rating && (
            <div className="flex items-center gap-1">
              {Array(product.rating).fill(0).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-500 fill-current" />
              ))}
              <span className="text-xs text-stone-500">({product.rating})</span>
            </div>
          )}
          {product.affiliate_url && (
            <Button asChild size="sm">
              <a href={product.affiliate_url} target="_blank" rel="noopener noreferrer" className="gap-2">
                View Product <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
