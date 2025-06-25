
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  FileText, Heart, Home, Users, 
  CheckCircle, ArrowRight, Phone 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import ApplicationForm from "../components/application/ApplicationForm";
import ApplicationSuccess from "../components/application/ApplicationSuccess";
import ProcessSteps from "../components/application/ProcessSteps";

export default function ApplicationPage() {
  const [applicationStatus, setApplicationStatus] = useState("form"); // 'form' or 'success'
  const location = useLocation();
  const [puppyInterest, setPuppyInterest] = useState(null);
  const [referralCode, setReferralCode] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setPuppyInterest(params.get('puppy'));

    const storedRefCode = sessionStorage.getItem('referralCode');
    if(storedRefCode) {
        setReferralCode(storedRefCode);
    }
  }, [location]);

  const handleSuccess = () => {
    setApplicationStatus("success");
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {applicationStatus === "form" ? (
              <>
                <h1 className="text-4xl font-bold text-stone-800 mb-4">Puppy Adoption Application</h1>
                <p className="text-lg text-stone-600 mb-8">
                  Thank you for your interest! Please fill out the application below to begin the process of welcoming a Golden Paws Doodle into your home.
                </p>
                <ApplicationForm 
                  onSuccess={handleSuccess} 
                  initialPuppyInterest={puppyInterest}
                  referralCode={referralCode}
                />
              </>
            ) : (
              <ApplicationSuccess />
            )}
          </div>
          <div className="lg:col-span-1">
            <ProcessSteps />
          </div>
        </div>
      </div>
    </div>
  );
}
