import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Mail, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ApplicationSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center bg-white p-8 sm:p-12 rounded-2xl shadow-lg">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-4">
          Thank You for Applying!
        </h1>
        <p className="text-lg text-stone-600 leading-relaxed mb-8">
          We've received your application to join the Golden Paws family. 
          We're honored by your interest and will carefully review your information.
        </p>

        <div className="space-y-6 text-left border-t border-b border-stone-200 py-8">
            <h2 className="text-xl font-semibold text-center text-stone-800 mb-4">What's Next?</h2>
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5"/>
                </div>
                <div>
                    <h3 className="font-semibold text-stone-700">Application Review</h3>
                    <p className="text-stone-600 text-sm">Our team will carefully review your application within the next <strong>3-5 business days</strong>. We take this process very seriously to ensure the best possible homes for our puppies.</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5"/>
                </div>
                <div>
                    <h3 className="font-semibold text-stone-700">We'll Be In Touch</h3>
                    <p className="text-stone-600 text-sm">If your application is a potential match for one of our puppies, we will contact you via email to schedule a brief introductory phone call. Please be sure to check your spam folder.</p>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                    <UserCheck className="w-5 h-5"/>
                </div>
                <div>
                    <h3 className="font-semibold text-stone-700">Approval & Next Steps</h3>
                    <p className="text-stone-600 text-sm">After a successful interview, we will discuss next steps, including puppy selection and placing a reservation deposit.</p>
                </div>
            </div>
        </div>

        <div className="mt-8">
          <Link to={createPageUrl("Home")}>
            <Button variant="outline">
              Back to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}