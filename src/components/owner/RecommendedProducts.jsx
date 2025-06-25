import React, { useState, useEffect } from 'react';
import { RecommendedProduct } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ExternalLink, ShoppingBag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function RecommendedProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const productList = await RecommendedProduct.list("-featured");
      setProducts(productList);
    } catch (error) {
      console.error("Error loading recommended products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = {
    food: "Food & Nutrition",
    toys: "Toys & Enrichment",
    grooming: "Grooming Supplies",
    training: "Training Tools",
    health: "Health & Wellness",
    insurance: "Pet Insurance",
    books: "Books & Education",
    supplies: "General Supplies"
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            Our Favorite Products
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i}>
              <Skeleton className="aspect-video w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-blue-600" />
          Our Favorite Products
        </CardTitle>
        <p className="text-stone-600">A curated list of products we trust and recommend for your Goldendoodle.</p>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
           <p className="text-stone-500 text-center py-4">No recommended products available at this time.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden flex flex-col">
                {product.image_url && (
                  <div className="aspect-video bg-stone-200">
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-4 flex-grow flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-stone-800 line-clamp-2">{product.name}</h3>
                    {product.featured && (
                      <Badge className="bg-amber-100 text-amber-800 shrink-0">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{categories[product.category] || product.category}</Badge>
                  </div>
                  
                  <p className="text-stone-600 text-sm mb-3 flex-grow">{product.why_recommended || product.description}</p>
                  
                  <div className="mt-auto">
                    {product.affiliate_url && (
                       <Button asChild className="w-full">
                         <a href={product.affiliate_url} target="_blank" rel="noopener noreferrer" className="gap-2">
                           View Product <ExternalLink className="w-4 h-4" />
                         </a>
                       </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}