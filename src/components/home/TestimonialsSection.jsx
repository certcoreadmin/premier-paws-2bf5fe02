import React, { useState, useEffect } from "react";
import { Testimonial } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const approvedTestimonials = await Testimonial.filter({ status: "approved" }, "-created_date", 3);
        setTestimonials(approvedTestimonials);
      } catch (error) {
        console.error("Failed to load testimonials", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTestimonials();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 to-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-stone-800 mb-6">
            What Our Families Say
          </h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            The joy and satisfaction of our puppy families is the heart of everything we do. 
            Here's what they have to say about their Premier Paws experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {isLoading ? (
            Array(3).fill(0).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-8">
                  <Skeleton className="h-24 w-full mb-4" />
                  <Skeleton className="h-6 w-1/2" />
                </CardContent>
              </Card>
            ))
          ) : (
            testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                {testimonial.photo_url && (
                  <div className="aspect-[4/3] bg-stone-200 overflow-hidden rounded-t-lg">
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
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-emerald-200" />
                    <p className="text-stone-700 leading-relaxed italic pl-6">
                      "{testimonial.story}"
                    </p>
                  </div>
                  
                  <div className="border-t border-stone-200 pt-4 mt-auto">
                    <div className="font-semibold text-stone-800">{testimonial.owner_name}</div>
                    <div className="text-sm text-emerald-600 font-medium mt-1">
                      Proud family of {testimonial.dog_name}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}