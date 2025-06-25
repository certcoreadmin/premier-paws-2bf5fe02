
import React, { useState, useEffect, Suspense } from "react";
import { User, Dog } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast"; // New import for useToast
import { Button } from "@/components/ui/button"; // New import for Button
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // New imports for Sheet components
import {
  Heart, Calendar, Camera, Shield, ShoppingBag, User as UserIcon, MessageSquare, // Existing icons
  Award, Share2, Menu, ChevronLeft, ChevronRight // New icons for sidebar/referrals
} from "lucide-react";
import { format, differenceInDays, differenceInMonths } from "date-fns";
import { createPageUrl } from "@/utils";

// Existing components
import PuppyProfile from "../components/owner/PuppyProfile";
import MilestoneTracker from "../components/owner/MilestoneTracker";
import HealthRecords from "../components/owner/HealthRecords";
import PhotoGallery from "../components/owner/PhotoGallery";
import RecommendedProducts from "../components/owner/RecommendedProducts";
import ShareStory from "../components/owner/ShareStory";
import ReferralProgram from "../components/owner/ReferralProgram"; // New component for referral program

// Define the sections for the owner portal sidebar/menu
const ownerSections = [
  { id: "profile", label: "Puppy Profile", icon: UserIcon },
  { id: "health", label: "Health Records", icon: Heart }, // Changed from Shield to Heart as per outline
  { id: "milestones", label: "Milestones", icon: Award },
  { id: "gallery", label: "Photo Gallery", icon: Camera },
  { id: "referrals", label: "Referral Program", icon: Share2 },
  { id: "products", label: "Recommended Products", icon: ShoppingBag },
  { id: "story", label: "Share Your Story", icon: MessageSquare },
];

export default function OwnerPortalPage() {
  const [user, setUser] = useState(null);
  const [puppy, setPuppy] = useState(null); // Keep puppy state for header info
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("profile"); // New state for active section
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // New state for sidebar collapse
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // New state for mobile menu

  // Use the useToast hook (though not directly used in this component, it's typically used by child components)
  const { toast } = useToast();

  useEffect(() => {
    checkAccess();
  }, []);

  // Renamed from loadOwnerData to checkAccess as per outline
  const checkAccess = async () => {
    try {
      const currentUser = await User.me();

      // Allow 'owner' and 'super_admin' access levels
      if (currentUser.access_level !== 'owner' && currentUser.access_level !== 'super_admin') {
        // Redirect non-owner/non-super_admin users to home page
        window.location.href = createPageUrl("Home");
        return;
      }

      setUser(currentUser); // Set user first

      // Load puppy data if puppy_id exists for display in header and relevant components
      if (currentUser.puppy_id) {
        const puppyData = await Dog.filter({ id: currentUser.puppy_id });
        setPuppy(puppyData[0] || null);
      } else {
        setPuppy(null); // Explicitly set puppy to null if no ID
      }
    } catch (error) {
      console.error("Error loading owner data:", error);
      // User not authenticated or other error - redirect to home page
      window.location.href = createPageUrl("Home"); // Redirect on error
      return; // Ensure the function stops execution after redirect
    } finally {
      setLoading(false);
    }
  };

  // Function to trigger a re-fetch of user data from child components
  const handleUserUpdate = () => {
    checkAccess();
  };

  // Helper function to calculate days with puppy
  const getDaysWithPuppy = () => {
    if (!user || !user.gotcha_date) return null;
    return differenceInDays(new Date(), new Date(user.gotcha_date));
  };

  // Helper function to calculate puppy age
  const getPuppyAge = () => {
    if (!puppy || !puppy.birth_date) return null;
    const months = differenceInMonths(new Date(), new Date(puppy.birth_date));
    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''} old`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} months` : ''} old`;
    }
  };

  // Function to render the content based on the active section
  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <PuppyProfile user={user} puppy={puppy} />; // Pass both user and puppy
      case "health":
        return <HealthRecords puppyId={puppy?.id} />;
      case "milestones":
        return <MilestoneTracker puppyId={puppy?.id} />;
      case "gallery":
        return <PhotoGallery puppyId={puppy?.id} />;
      case "referrals":
        return <ReferralProgram user={user} onUserUpdate={handleUserUpdate} />;
      case "products":
        return <RecommendedProducts />;
      case "story":
        return <ShareStory user={user} puppy={puppy} />; // Pass both user and puppy
      default:
        return <PuppyProfile user={user} puppy={puppy} />; // Default to profile
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p>Loading your puppy portal...</p>
        </div>
      </div>
    );
  }

  // If user is null after loading, means access denied or redirect failed
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-800 mb-4">Access Denied</h1>
          <p className="text-stone-600">You do not have access to the owner portal. Please log in or contact us if you believe this is an error.</p>
        </div>
      </div>
    );
  }

  // If user is owner but doesn't have a puppy assigned yet
  if (!puppy) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-stone-800 mb-4">Welcome to the Owner's Corner!</h1>
            <p className="text-xl text-stone-600 mb-8">
              Your personal puppy portal will be activated once your puppy has been assigned to your account.
            </p>
            <p className="text-stone-500">
              Please contact us if you believe you should have access to a puppy profile.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar for Desktop */}
      <div className={`bg-white border-r border-stone-200 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } hidden lg:flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-stone-800">Owner's Corner</h2>
                <p className="text-xs text-stone-600">Welcome, {user.full_name}</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Sidebar Menu */}
        <div className="flex-1 p-2 space-y-1 overflow-y-auto">
          {ownerSections.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                activeSection === item.id
                  ? 'bg-amber-100 text-amber-800'
                  : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
              } ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </div>
      </div>
      
      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild className="lg:hidden fixed top-24 left-4 z-40">
          <Button variant="outline" size="icon" className="bg-white/80 backdrop-blur-sm">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <div className="p-2 space-y-1 mt-8">
            {ownerSections.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  activeSection === item.id
                    ? 'bg-amber-100 text-amber-800'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header Section (remains largely same, but part of main content) */}
        <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Welcome to the Owner's Corner!</h1>
                <p className="text-amber-100 text-lg">
                  {puppy.name}'s Personal Hub • {getPuppyAge()}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-4 text-center">
                  <Calendar className="w-8 h-8 text-white mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-white">
                    {getDaysWithPuppy() || 0}
                  </h3>
                  <p className="text-amber-100">Days Together</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-4 text-center">
                  <Heart className="w-8 h-8 text-white mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-white">
                    {user.gotcha_date ? format(new Date(user.gotcha_date), 'MMM d, yyyy') : 'N/A'}
                  </h3>
                  <p className="text-amber-100">Gotcha Day</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20">
                <CardContent className="p-4 text-center">
                  <Shield className="w-8 h-8 text-white mx-auto mb-2" />
                  <h3 className="text-2xl font-bold text-white">
                    Lifetime
                  </h3>
                  <p className="text-amber-100">Support</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Dynamic Content Section */}
        <section className="flex-1 p-6 lg:p-8">
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          }>
            {renderContent()}
          </Suspense>
        </section>
      </div>
    </div>
  );
}
