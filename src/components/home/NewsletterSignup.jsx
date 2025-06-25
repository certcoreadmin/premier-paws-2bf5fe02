import React, { useState } from "react";
import { Subscriber } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle } from "lucide-react";

export default function NewsletterSignup() {
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

  if (isSuccess) {
    return (
      <section className="py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Welcome to Our Family!
          </h2>
          <p className="text-xl text-emerald-100">
            You'll be the first to know about upcoming litters and puppy availability.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-emerald-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">
          Be First to Know About Future Litters
        </h2>
        <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
          Join our exclusive notification list and get priority access to upcoming puppy availability, 
          plus expert tips on puppy care and training.
        </p>

        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/95 border-0 h-12"
            />
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/95 border-0 h-12"
            />
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-amber-500 hover:bg-amber-600 text-white h-12 px-8 whitespace-nowrap"
            >
              {isSubmitting ? "Joining..." : "Notify Me"}
            </Button>
          </div>
        </form>
        
        <p className="text-emerald-200 text-sm mt-4">
          No spam, ever. Unsubscribe anytime with one click.
        </p>
      </div>
    </section>
  );
}