
import React, { useState, useEffect } from "react";
import { RecommendedProduct } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Save, Star, ExternalLink, ShoppingBag } from "lucide-react";

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    image_url: "",
    affiliate_url: "",
    price_range: "",
    rating: 5,
    why_recommended: "",
    puppy_age: "all",
    featured: false
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const productList = await RecommendedProduct.list("-updated_date");
      setProducts(productList);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (file) => {
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, image_url: file_url }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingProduct) {
        await RecommendedProduct.update(editingProduct.id, formData);
      } else {
        await RecommendedProduct.create(formData);
      }
      
      await loadProducts();
      resetForm();
      alert(editingProduct ? "Product updated successfully!" : "Product added successfully!");
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product");
    }
    setIsSubmitting(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      image_url: product.image_url || "",
      affiliate_url: product.affiliate_url || "",
      price_range: product.price_range || "",
      rating: product.rating || 5,
      why_recommended: product.why_recommended || "",
      puppy_age: product.puppy_age || "all",
      featured: product.featured || false
    });
    setIsEditing(true);
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await RecommendedProduct.delete(productId);
      await loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      image_url: "",
      affiliate_url: "",
      price_range: "",
      rating: 5,
      why_recommended: "",
      puppy_age: "all",
      featured: false
    });
    setEditingProduct(null);
    setIsEditing(false);
  };

  const categories = [
    { value: "food", label: "Food & Nutrition" },
    { value: "toys", label: "Toys & Enrichment" },
    { value: "grooming", label: "Grooming Supplies" },
    { value: "training", label: "Training Tools" },
    { value: "health", label: "Health & Wellness" },
    { value: "insurance", label: "Pet Insurance" },
    { value: "books", label: "Books & Education" },
    { value: "supplies", label: "General Supplies" }
  ];

  return (
    <div className="space-y-8">
      {/* Add/Edit Product Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-600" />
            {isEditing ? "Edit Product" : "Add New Product"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="why_recommended">Why We Recommend This</Label>
              <Textarea
                id="why_recommended"
                value={formData.why_recommended}
                onChange={(e) => handleInputChange("why_recommended", e.target.value)}
                rows={2}
                placeholder="Explain why you recommend this product to puppy families..."
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price_range">Price Range</Label>
                <Input
                  id="price_range"
                  value={formData.price_range}
                  onChange={(e) => handleInputChange("price_range", e.target.value)}
                  placeholder="e.g., $20-30"
                />
              </div>
              <div>
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Select value={formData.rating.toString()} onValueChange={(value) => handleInputChange("rating", parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        {rating} Star{rating !== 1 ? 's' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="puppy_age">Recommended Age</Label>
                <Select value={formData.puppy_age} onValueChange={(value) => handleInputChange("puppy_age", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ages</SelectItem>
                    <SelectItem value="puppy">Puppies (0-1 year)</SelectItem>
                    <SelectItem value="adult">Adults (1-7 years)</SelectItem>
                    <SelectItem value="senior">Seniors (7+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="affiliate_url">Affiliate/Purchase URL</Label>
              <Input
                id="affiliate_url"
                type="url"
                value={formData.affiliate_url}
                onChange={(e) => handleInputChange("affiliate_url", e.target.value)}
                placeholder="https://amazon.com/... or https://chewy.com/..."
              />
            </div>

            <div>
              <Label htmlFor="image_upload">Product Image</Label>
              <Input
                id="image_upload"
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])}
                className="mb-2"
              />
              {formData.image_url && (
                <div className="mt-2">
                  <img src={formData.image_url} alt="Preview" className="w-24 h-24 object-cover rounded" />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange("featured", checked)}
              />
              <Label htmlFor="featured">Feature this product</Label>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-amber-600 hover:bg-amber-700 gap-2"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? "Saving..." : (isEditing ? "Update Product" : "Add Product")}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                {product.image_url && (
                  <div className="aspect-video bg-stone-200">
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-stone-800 line-clamp-2">{product.name}</h3>
                    {product.featured && (
                      <Badge className="bg-amber-100 text-amber-800">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{product.category}</Badge>
                    {product.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-current" />
                        <span className="text-xs">{product.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-stone-600 text-sm mb-3 line-clamp-3">{product.description}</p>
                  
                  {product.price_range && (
                    <p className="text-green-600 font-medium text-sm mb-3">{product.price_range}</p>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="flex-1"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                    {product.affiliate_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a href={product.affiliate_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
