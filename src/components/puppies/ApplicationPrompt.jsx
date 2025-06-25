import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { FileText, Phone, Heart, CheckCircle } from "lucide-react";

export default function ApplicationPrompt() {
  return (
    <div className="text-center text-white">
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
          <Heart className="w-8 h-8 text-white" />
        </div>
      </div>
      
      <h2 className="text-3xl font-bold mb-6">
        Ready to Welcome Your Perfect Puppy?
      </h2>
      <p className="text-xl text-pink-100 mb-8 max-w-3xl mx-auto">
        Our application process is designed to ensure the perfect match between 
        our puppies and their forever families. Start your journey today!
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/10 p-6 rounded-lg">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-white mb-2">1. Submit Application</h3>
          <p className="text-pink-100 text-sm">Complete our comprehensive application form</p>
        </div>
        <div className="bg-white/10 p-6 rounded-lg">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-white mb-2">2. Phone Interview</h3>
          <p className="text-pink-100 text-sm">Personal consultation to discuss your needs</p>
        </div>
        <div className="bg-white/10 p-6 rounded-lg">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-white mb-2">3. Puppy Match</h3>
          <p className="text-pink-100 text-sm">We'll help you find your perfect companion</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to={createPageUrl("Application")}>
          <Button size="lg" className="bg-white text-pink-600 hover:bg-pink-50 gap-2">
            <FileText className="w-5 h-5" />
            Start Application
          </Button>
        </Link>
        <Link to={createPageUrl("Contact")}>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pink-600 gap-2">
            <Phone className="w-5 h-5" />
            Contact Us First
          </Button>
        </Link>
      </div>
    </div>
  );
}