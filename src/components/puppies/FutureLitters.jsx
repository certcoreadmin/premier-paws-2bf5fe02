import React, { useState } from "react";
import { Subscriber } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, Heart, Mail, Bell, 
  CheckCircle, Award, Shield 
} from "lucide-react";

export default function FutureLitters() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await Subscriber.create({
        email,
        name: name || null,
        subscription_type: "future_litters"
      });
      setIsSuccess(true);
      setEmail("");
      setName("");
    } catch (error) {
      console.error("Error subscribing:", error);
    }
    setIsSubmitting(false);
  };

  const futurePlans = [
    {
      pairing: "Aurora × Thunder",
      expectedDate: "Spring 2025",
      description: "Repeat of our exceptional current litter - champion bloodlines with outstanding temperaments",
      highlights: ["Proven successful pairing", "Excellent health clearances", "Beautiful conformation"]
    },
    {
      pairing: "New Champion Female × Thunder", 
      expectedDate: "Fall 2025",
      description: "Exciting new pairing introducing fresh bloodlines while maintaining our quality standards",
      highlights: ["New genetic diversity", "Multiple champion titles", "Exceptional temperament testing"]
    }
  ];

  if (isSuccess) {
    return (
      <div className="text-center">
        <Card className="max-w-2xl mx-auto bg-emerald-50 border-emerald-200">
          <CardContent className="p-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-emerald-800 mb-4">
              You're on the List! 🎉
            </h3>
            <p className="text-emerald-700 mb-6">
              You'll be among the first to know about upcoming litters and puppy availability. 
              We'll send you updates on breeding plans, pregnancy announcements, and puppy photos.
            </p>
            <Button 
              onClick={() => setIsSuccess(false)}
              variant="outline"
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
            >
              Subscribe Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-stone-800 mb-6">
          Future Litters & Breeding Plans
        </h2>
        <p className="text-xl text-stone-600 max-w-3xl mx-auto">
          Planning ahead for your perfect puppy? Join our priority notification list 
          and be the first to know about upcoming litters and available puppies.
        </p>
      </div>

      {/* Planned Litters */}
      <div className="grid lg:grid-cols-2 gap-8">
        {futurePlans.map((plan, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                {plan.pairing}
              </CardTitle>
              <Badge variant="outline" className="w-fit">
                Expected: {plan.expectedDate}
              </Badge>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-stone-700 mb-4">{plan.description}</p>
              <div className="space-y-2">
                <h4 className="font-medium text-stone-800">Highlights:</h4>
                <ul className="space-y-1">
                  {plan.highlights.map((highlight, highlightIndex) => (
                    <li key={highlightIndex} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span className="text-stone-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Notification Signup */}
      <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                <Bell className="w-8 h-8 text-pink-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-stone-800 mb-4">
              Join Our Priority List
            </h3>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Be the first to know about breeding announcements, pregnancy updates, 
              and get first pick of available puppies. Our subscribers receive:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-stone-800 mb-2">Early Notifications</h4>
              <p className="text-stone-600 text-sm">Get breeding and pregnancy announcements before anyone else</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-stone-800 mb-2">Puppy Updates</h4>
              <p className="text-stone-600 text-sm">Weekly photos and videos of growing puppies</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-stone-800 mb-2">Priority Access</h4>
              <p className="text-stone-600 text-sm">First choice of available puppies before public announcement</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white border-pink-300 focus:border-pink-500"
              />
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white border-pink-300 focus:border-pink-500"
              />
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="bg-pink-600 hover:bg-pink-700 text-white whitespace-nowrap"
              >
                {isSubmitting ? "Joining..." : "Join List"}
              </Button>
            </div>
          </form>
          
          <p className="text-pink-700 text-sm mt-4 text-center">
            No spam, ever. Unsubscribe anytime with one click.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}