import React, { useState, useEffect } from "react";
import { RecommendedProduct } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Star, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "../components/market/ProductCard";

const categories = [
  { value: "all", label: "All Products" },
  { value: "featured", label: "Featured" },
  { value: "food", label: "Food & Nutrition" },
  { value: "toys", label: "Toys & Enrichment" },
  { value: "grooming", label: "Grooming" },
  { value: "training", label: "Training" },
  { value: "health", label: "Health" },
  { value: "supplies", label: "Supplies" },
];

export default function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [activeCategory, products]);

  const loadProducts = async () => {
    try {
      const productList = await RecommendedProduct.list("-updated_date");
      setProducts(productList);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    if (activeCategory === "all") {
      setFilteredProducts(products);
    } else if (activeCategory === "featured") {
      setFilteredProducts(products.filter(p => p.featured));
    } else {
      setFilteredProducts(products.filter(p => p.category === activeCategory));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-stone-50 to-stone-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-stone-800 mb-6">
            Our Favorite Products
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl mx-auto">
            A curated list of products we trust and recommend for your Goldendoodle. We've tested 
            these products with our own dogs to ensure they meet our high standards for quality and safety.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-12">
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="flex flex-wrap h-auto">
                {categories.map(cat => (
                  <TabsTrigger key={cat.value} value={cat.value}>{cat.label}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i}>
                  <Skeleton className="aspect-video w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-stone-600">
                No products found in this category.
              </h3>
              <p className="text-stone-500">
                Check back soon or select a different category.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}