
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Calendar, Shield, Heart, FileText } from "lucide-react";

export default function VisitingInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="w-5 h-5 text-amber-600" />
          Visiting Our Kennel
        </CardTitle>
        <p className="text-stone-600 text-sm">
          We welcome families to visit and meet our dogs and puppies
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-medium text-stone-800">Appointment Required</h4>
              <p className="text-stone-600 text-sm">
                All visits are by appointment only to ensure the best experience for families and our dogs.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-medium text-stone-800">Health & Safety</h4>
              <p className="text-stone-600 text-sm">
                For the safety of our puppies, we ask that visitors not visit other kennels or pet stores 24 hours before visiting.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Heart className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h4 className="font-medium text-stone-800">What to Expect</h4>
              <p className="text-stone-600 text-sm">
                Meet our parent dogs, see where puppies are raised, and learn about our breeding program and philosophy.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <h4 className="font-medium text-amber-800 mb-2">Before Your Visit</h4>
          <ul className="text-amber-700 text-sm space-y-1">
            <li>• Complete our puppy application</li>
            <li>• Schedule appointment via phone or email</li>
            <li>• Avoid contact with other dogs 24 hours prior</li>
            <li>• Bring any questions about our program</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Link to={createPageUrl("Application")} className="flex-1">
            <Button className="w-full gap-2 bg-amber-600 hover:bg-amber-700">
              <FileText className="w-4 h-4" />
              Apply First
            </Button>
          </Link>
          <Button variant="outline" className="flex-1 gap-2">
            <Calendar className="w-4 h-4" />
            Schedule Visit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
