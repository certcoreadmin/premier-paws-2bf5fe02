
import React, { useState, useEffect } from "react";
import { Testimonial } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const approvedTestimonials = await Testimonial.filter({ status: "approved" }, "-created_date");
      setTestimonials(approvedTestimonials);
    } catch (error) {
      console.error("Error loading testimonials:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-stone-50 to-stone-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-stone-800 mb-6">
            Stories from Our Doodle Families
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl mx-auto">
            The heart of our program is the joy our puppies bring to their new homes. 
            Read what our wonderful families have to say about their experience with Golden Paws Doodles.
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full rounded-t-lg" />
                  <CardContent className="p-6">
                    <Skeleton className="h-16 w-full mb-4" />
                    <Skeleton className="h-6 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-stone-600">No testimonials yet.</h3>
              <p className="text-stone-500">Check back soon to read stories from our families!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 flex flex-col rounded-2xl overflow-hidden">
                  {testimonial.photo_url && (
                    <div className="aspect-[4/3] bg-stone-200 overflow-hidden">
                      <img src={testimonial.photo_url} alt={testimonial.dog_name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardContent className="p-8 flex-grow flex flex-col">
                    <div className="flex items-center gap-1 mb-4">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    
                    <div className="relative mb-6 flex-grow">
                      <Quote className="absolute -top-2 -left-2 w-8 h-8 text-amber-200" />
                      <p className="text-stone-700 leading-relaxed italic pl-6">
                        "{testimonial.story}"
                      </p>
                    </div>
                    
                    <div className="border-t border-stone-200 pt-4 mt-auto">
                      <div className="font-semibold text-stone-800">{testimonial.owner_name}</div>
                      <div className="text-sm text-amber-600 font-medium">
                        Proud family of {testimonial.dog_name}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
