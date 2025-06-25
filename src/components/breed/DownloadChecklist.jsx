
import React, { useState } from "react";
import { Subscriber } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, CheckCircle, Mail } from "lucide-react";

export default function DownloadChecklist() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false); // Changed from isSuccess

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Add subscriber to database
      await Subscriber.create({
        email: email,
        name: name,
        subscription_type: "future_litters", // Changed subscription type
        preferences: ["checklist_download"] // Added preferences
      });

      setSubmitted(true); // Changed from setIsSuccess(true)
      
      // Trigger actual file download
      const link = document.createElement('a');
      link.href = '/puppy-checklist.pdf'; // Changed to static PDF path
      link.download = 'Golden-Paws-Puppy-Checklist.pdf'; // Changed download filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Error submitting form:", error); // Updated error message
      alert("There was an error. Please try again."); // Added alert
    }

    setIsSubmitting(false);
  };

  // generateChecklistContent function is removed as the download is now a static PDF

  if (submitted) { // Changed from isSuccess
    return (
      <Card className="bg-emerald-50 border-emerald-200">
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-emerald-800 mb-4">
            Download Started!
          </h3>
          <p className="text-emerald-700 mb-6">
            Your comprehensive Golden Retriever puppy checklist is downloading now. 
            You'll also receive our exclusive puppy care tips via email.
          </p>
          <Button 
            onClick={() => setSubmitted(false)} // Changed from setIsSuccess(false)
            variant="outline"
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
          >
            Download Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <Download className="w-6 h-6 text-amber-600" />
          Free New Puppy Checklist
        </CardTitle>
        <p className="text-stone-600">
          Get our comprehensive checklist covering everything you need to prepare for your new Golden Retriever puppy.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-stone-800 mb-4">What's Included:</h4>
            <ul className="space-y-2 text-stone-600 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                Complete supply shopping list
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                Puppy-proofing home checklist
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                First week care schedule
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                Training preparation guide
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                Veterinary care timeline
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                Bonus: First month milestone tracker
              </li>
            </ul>
          </div>
          
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white border-amber-300 focus:border-amber-500"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white border-amber-300 focus:border-amber-500"
                />
              </div>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white gap-2"
              >
                {isSubmitting ? (
                  "Preparing Download..."
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download Free Checklist
                  </>
                )}
              </Button>
            </form>
            <p className="text-xs text-stone-500 mt-3 text-center">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
