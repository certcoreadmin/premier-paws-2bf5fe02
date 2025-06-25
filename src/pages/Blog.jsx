import React, { useState, useEffect } from "react";
import { BlogPost } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ReactMarkdown from "react-markdown";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  // Check for specific post in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const postSlug = urlParams.get('post');
    if (postSlug && posts.length > 0) {
      const post = posts.find(p => p.slug === postSlug);
      if (post) {
        setSelectedPost(post);
      }
    }
  }, [posts]);

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [activeCategory, posts]);

  const loadPosts = async () => {
    try {
      const publishedPosts = await BlogPost.filter({ published: true }, "-created_date");
      setPosts(publishedPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPosts = () => {
    if (activeCategory === "all") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.category === activeCategory));
    }
  };

  const categoryLabels = {
    all: "All Posts",
    breed_education: "Breed Guide",
    puppy_care: "Puppy Care",
    health: "Health & Wellness",
    training: "Training Tips",
    breeder_updates: "Kennel Updates"
  };

  // If viewing a specific post
  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <button
            onClick={() => setSelectedPost(null)}
            className="mb-8 text-amber-600 hover:text-amber-700 font-medium flex items-center gap-2"
          >
            ← Back to All Posts
          </button>
          
          <article>
            {selectedPost.featured_image && (
              <div className="aspect-video bg-stone-200 overflow-hidden rounded-2xl mb-8">
                <img 
                  src={selectedPost.featured_image} 
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <header className="mb-8">
              <Badge className="mb-4">{categoryLabels[selectedPost.category]}</Badge>
              <h1 className="text-4xl font-bold text-stone-800 mb-4">{selectedPost.title}</h1>
              <div className="flex items-center gap-4 text-stone-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(selectedPost.created_date), 'MMMM d, yyyy')}
                </span>
              </div>
            </header>
            
            <div className="prose prose-lg max-w-none prose-headings:text-stone-800 prose-p:text-stone-700 prose-a:text-amber-600">
              <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-stone-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-stone-800 mb-6">Goldendoodle Blog</h1>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            Expert advice, breed information, and updates from Golden Paws Doodles. 
            Everything you need to know about raising happy, healthy Goldendoodles.
          </p>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-12">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
              {Object.entries(categoryLabels).map(([key, label]) => (
                <TabsTrigger key={key} value={key}>{label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-stone-200"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-stone-200 rounded mb-4"></div>
                    <div className="h-4 bg-stone-200 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card 
                  key={post.id} 
                  className="group hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="aspect-video bg-stone-200 overflow-hidden">
                    {post.featured_image ? (
                      <img 
                        src={post.featured_image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-100 to-stone-200 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-stone-400" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <Badge className="mb-3">{categoryLabels[post.category]}</Badge>
                    <h3 className="text-xl font-semibold text-stone-800 mb-3 group-hover:text-amber-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-stone-600 mb-4 line-clamp-3">
                      {post.excerpt || post.content.substring(0, 150) + "..."}
                    </p>
                    <div className="flex items-center justify-between text-sm text-stone-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(post.created_date), 'MMM d, yyyy')}
                      </span>
                      <span className="flex items-center gap-1 text-amber-600 font-medium">
                        Read More <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-stone-600">No posts in this category yet.</h3>
              <p className="text-stone-500">Check back soon for new content!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}