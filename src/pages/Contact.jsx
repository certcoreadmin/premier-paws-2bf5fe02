import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Phone, Mail, MapPin, Clock, 
  MessageCircle, Send, Heart 
} from "lucide-react";

import ContactForm from "../components/contact/ContactForm";
import ContactInfo from "../components/contact/ContactInfo";
import VisitingInfo from "../components/contact/VisitingInfo";

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-stone-800 mb-6">
            Get In Touch
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-3xl mx-auto">
            We'd love to hear from you! Whether you're interested in our puppies, 
            have questions about Goldendoodles, or just want to say hello, 
            we're here to help.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <ContactForm isSubmitted={isSubmitted} setIsSubmitted={setIsSubmitted} />
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <ContactInfo />
              <VisitingInfo />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-800 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-stone-600">
              Quick answers to common questions we receive
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Do you have puppies available now?",
                a: "Puppy availability changes frequently. Please check our Puppy Nursery page for current availability or join our VIP list to be notified about future litters."
              },
              {
                q: "Can we visit and meet the puppies?",
                a: "Yes! We welcome approved families to visit and meet our puppies. Visits are by appointment only and typically scheduled after your application has been reviewed."
              },
              {
                q: "What's included with each puppy?",
                a: "Each puppy comes with health records, current vaccinations, microchip, starter food, blanket with mom's scent, and our comprehensive puppy packet with care instructions."
              },
              {
                q: "Do you ship puppies?",
                a: "We prefer local pickup, but we can arrange ground transportation for families within a reasonable distance. We do not ship puppies via air cargo."
              },
              {
                q: "What kind of health guarantee do you provide?",
                a: "We provide a 2-year health guarantee against genetic defects. All our breeding dogs have completed health testing including hips, elbows, heart, eyes, and genetic panels."
              },
              {
                q: "How much do your puppies cost?",
                a: "Our Goldendoodle puppies range from $3,000 to $4,500 depending on the litter and individual puppy. Please see specific puppy profiles for exact pricing."
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