import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from "lucide-react";

export default function ContactInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-emerald-600" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-medium text-stone-800">Phone</h3>
              <p className="text-stone-600">(555) 123-4567</p>
              <p className="text-stone-500 text-sm">Call or text anytime</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-medium text-stone-800">Email</h3>
              <p className="text-stone-600">info@goldenpawsdoodles.com</p>
              <p className="text-stone-500 text-sm">We reply within 24 hours</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium text-stone-800">Location</h3>
              <p className="text-stone-600">Golden Valley, CA</p>
              <p className="text-stone-500 text-sm">Visits by appointment only</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-200">
          <h3 className="font-medium text-stone-800 mb-4">Follow Us</h3>
          <div className="flex gap-3">
            <Button variant="outline" size="icon" className="hover:bg-blue-50">
              <Facebook className="w-4 h-4 text-blue-700" />
            </Button>
            <Button variant="outline" size="icon" className="hover:bg-pink-50">
              <Instagram className="w-4 h-4 text-pink-600" />
            </Button>
          </div>
          <p className="text-stone-500 text-sm mt-2">
            See daily photos and updates from our kennel
          </p>
        </div>
      </CardContent>
    </Card>
  );
}