import React, { useState, useEffect } from "react";
import { BlogPost, Subscriber } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, Download, Heart, Activity, Brain, 
  Home, Users, Scissors, Trophy, CheckCircle 
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import BreedOverview from "../components/breed/BreedOverview";
import BreedCharacteristics from "../components/breed/BreedCharacteristics";
import CareGuide from "../components/breed/CareGuide";
import DownloadChecklist from "../components/breed/DownloadChecklist";

export default function BreedResourcesPage() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const breedArticles = await BlogPost.filter(
        { category: "breed_education", published: true }, 
        "-created_date", 
        6
      );
      setArticles(breedArticles);
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-stone-800 mb-6">
            Golden Retriever Resource Center
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl mx-auto">
            Everything you need to know about Golden Retrievers - from breed characteristics 
            and care requirements to training tips and health information. Your complete guide 
            to understanding this wonderful breed.
          </p>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="characteristics" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span className="hidden sm:inline">Traits</span>
              </TabsTrigger>
              <TabsTrigger value="care" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Care</span>
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Resources</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <BreedOverview />
            </TabsContent>

            <TabsContent value="characteristics">
              <BreedCharacteristics />
            </TabsContent>

            <TabsContent value="care">
              <CareGuide />
            </TabsContent>

            <TabsContent value="resources">
              <div className="space-y-12">
                <DownloadChecklist />
                
                {/* Educational Articles */}
                <div>
                  <h3 className="text-2xl font-bold text-stone-800 mb-8">Educational Articles</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                      <Card key={article.id} className="hover:shadow-lg transition-shadow duration-300">
                        {article.featured_image && (
                          <div className="aspect-video bg-stone-200 overflow-hidden rounded-t-lg">
                            <img 
                              src={article.featured_image} 
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <CardContent className="p-6">
                          <Badge variant="secondary" className="mb-3">
                            {article.category.replace(/_/g, ' ')}
                          </Badge>
                          <h4 className="text-lg font-semibold text-stone-800 mb-3 line-clamp-2">
                            {article.title}
                          </h4>
                          <p className="text-stone-600 mb-4 line-clamp-3">
                            {article.excerpt}
                          </p>
                          <Link 
                            to={createPageUrl(`Blog?post=${article.slug}`)}
                            className="text-amber-600 hover:text-amber-700 font-medium"
                          >
                            Read More →
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-stone-800 mb-12 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {[
              {
                q: "Are Golden Retrievers good with children?",
                a: "Yes! Golden Retrievers are exceptionally good with children. They're known for their gentle, patient nature and natural protective instincts. However, like all dogs, they should be properly socialized and supervised around young children."
              },
              {
                q: "How much exercise do Golden Retrievers need?",
                a: "Golden Retrievers are active dogs that need at least 60-90 minutes of exercise daily. This should include walks, playtime, and mental stimulation. They especially love swimming and retrieving games."
              },
              {
                q: "Do Golden Retrievers shed a lot?",
                a: "Yes, Golden Retrievers are heavy shedders, especially during seasonal changes. Regular brushing (3-4 times per week) and professional grooming every 6-8 weeks helps manage shedding."
              },
              {
                q: "What health issues are common in Golden Retrievers?",
                a: "Golden Retrievers can be prone to hip dysplasia, elbow dysplasia, heart conditions, and certain cancers. This is why health testing of breeding dogs is so important - it helps reduce the risk of these conditions."
              },
              {
                q: "How long do Golden Retrievers typically live?",
                a: "Golden Retrievers typically live 10-12 years. With proper care, health testing of parents, and regular veterinary care, many live happy, healthy lives throughout this lifespan."
              }
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-stone-800 mb-3">
                    {faq.q}
                  </h3>
                  <p className="text-stone-600 leading-relaxed">
                    {faq.a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}