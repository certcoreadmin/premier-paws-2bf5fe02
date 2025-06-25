
import React, { useState, useEffect, lazy, Suspense } from "react";
import { User as UserEntity } from "@/api/entities";
import { Button } from "@/components/ui/button";
import {
  Settings, Users, ShoppingBag, FileText,
  MessageSquare, Baby, BookOpen, Calendar, Menu, X,
  ChevronLeft, ChevronRight, Award, Shield, Heart, Activity, PenTool, Zap, Dna, Gift, Mail, Briefcase, Globe, Bot
} from "lucide-react";
import { createPageUrl } from "@/utils";

import AIDescriptionGenerator from "../components/admin/AIDescriptionGenerator";
import ProductManager from "../components/admin/ProductManager";
import OwnerManager from "../components/admin/OwnerManager";
import DogManager from "../components/admin/DogManager";
import BlogManager from "../components/admin/BlogManager";
import ApplicationManager from "../components/admin/ApplicationManager";
import TestimonialManager from "../components/admin/TestimonialManager";
import BreedResourceManager from "../components/admin/BreedResourceManager";
import LitterManagementDashboard from "../components/admin/LitterManagementDashboard";
import HeatCycleTracker from "../components/admin/HeatCycleTracker";
import BreedingDashboard from "../components/admin/BreedingDashboard";
import ReferralManager from "../components/admin/ReferralManager";
import SubscriberManager from "../components/admin/SubscriberManager";
import ContractManager from "../components/admin/ContractManager";

const AdvancedAppointmentManager = lazy(() => import("../components/admin/AdvancedAppointmentManager"));

const adminMenuConfig = [
  {
    group: "Kennel Management",
    icon: Briefcase,
    items: [
      { id: "dogs", label: "Dogs", icon: Heart, description: "Manage parent dogs and puppies" },
      { id: "litters", label: "Litters", icon: Baby, description: "Plan and manage litters" },
      { id: "breeding", label: "Breeding & Genetics", icon: Dna, description: "Heat cycles, pedigrees, and plans" },
    ],
  },
  {
    group: "Client Relations",
    icon: Users,
    items: [
      { id: "applications", label: "Applications", icon: FileText, description: "Review adoption applications" },
      { id: "scheduling", label: "Scheduling", icon: Calendar, description: "Advanced appointment management" },
      { id: "contracts", label: "Contracts", icon: FileText, description: "Manage and track contracts" },
      { id: "owners", label: "Owners", icon: Users, description: "Manage puppy owners" },
      { id: "referrals", label: "Referrals", icon: Gift, description: "Manage owner referrals" },
      { id: "subscribers", label: "Email & Subscribers", icon: Mail, description: "Newsletter and subscriber management" },
    ],
  },
  {
    group: "Website Content",
    icon: Globe,
    items: [
      { id: "blog", label: "Blog", icon: PenTool, description: "Create and manage blog posts" },
      { id: "testimonials", label: "Testimonials", icon: MessageSquare, description: "Approve testimonials" },
      { id: "products", label: "Products", icon: ShoppingBag, description: "Manage recommended products" },
      { id: "resources", label: "Resources", icon: BookOpen, description: "Breed education content" },
    ],
  },
  {
    group: "Tools",
    icon: Bot,
    items: [
      { id: "tools", label: "AI Tools", icon: Zap, description: "AI-powered content generation" }
    ],
  }
];

const allAdminSections = adminMenuConfig.flatMap(group => group.items);

export default function AdminPanelPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dogs");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const currentUser = await UserEntity.me();
      if (currentUser.access_level !== 'admin' && currentUser.access_level !== 'super_admin') {
        window.location.href = createPageUrl("Home");
        return;
      }
      setUser(currentUser);
    } catch (error) {
      window.location.href = createPageUrl("Home");
      return;
    }
    setLoading(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dogs":
        return <DogManager />;
      case "litters":
        return <LitterManagementDashboard />;
      case "breeding":
        return <BreedingDashboard />;
      case "applications":
        return <ApplicationManager />;
      case "referrals":
        return <ReferralManager />;
      case "subscribers":
        return <SubscriberManager />;
      case "contracts":
        return <ContractManager />;
      case "scheduling":
        return <Suspense fallback={
          <div className="min-h-full flex items-center justify-center text-stone-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mr-2"></div>
            Loading scheduling module...
          </div>
        }><AdvancedAppointmentManager /></Suspense>;
      case "blog":
        return <BlogManager />;
      case "testimonials":
        return <TestimonialManager />;
      case "products":
        return <ProductManager />;
      case "resources":
        return <BreedResourceManager />;
      case "owners":
        return <OwnerManager />;
      case "tools":
        return <AIDescriptionGenerator />;
      default:
        return <DogManager />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p>Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <div className={`bg-white border-r border-stone-200 transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-72'
      } hidden lg:flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between h-[73px]">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-stone-800">Admin Panel</h2>
                <p className="text-xs text-stone-600">Manage your kennel</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8 shrink-0"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Sidebar Menu */}
        <div className="flex-1 p-2 space-y-1 overflow-y-auto">
          {adminMenuConfig.map((group) => (
            <div key={group.group} className="space-y-1">
              {!sidebarCollapsed && (
                <h3 className="px-3 py-2 text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-2">
                  <group.icon className="w-4 h-4" />
                  {group.group}
                </h3>
              )}
              {sidebarCollapsed && (
                 <div className="flex justify-center py-2">
                    <group.icon className="w-5 h-5 text-stone-500" title={group.group}/>
                 </div>
              )}
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-amber-100 text-amber-800'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                  } ${sidebarCollapsed ? 'justify-center' : ''}`}
                  title={sidebarCollapsed ? item.label : ''}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{item.label}</div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className={`p-4 border-t border-stone-200 ${sidebarCollapsed ? 'hidden' : ''}`}>
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4 text-amber-600" />
                <span>GANA</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Health Tested</span>
              </div>
            </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white border-r border-stone-200 flex flex-col">
            {/* Mobile Header */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-stone-800">Admin Panel</h2>
                  <p className="text-xs text-stone-600">Manage your kennel</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Menu */}
            <div className="flex-1 p-2 space-y-1 overflow-y-auto">
              {adminMenuConfig.map((group) => (
                <div key={group.group} className="space-y-1">
                   <h3 className="px-3 py-2 text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-2">
                      <group.icon className="w-4 h-4" />
                      {group.group}
                    </h3>
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                        activeSection === item.id
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                      }`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-stone-600">{item.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between h-[73px]">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden h-8 w-8"
            >
              <Menu className="w-4 h-4" />
            </Button>
            
            <div>
              <h1 className="text-xl font-bold text-stone-800">
                {allAdminSections.find(item => item.id === activeSection)?.label || 'Admin Panel'}
              </h1>
              <p className="text-sm text-stone-600">
                {allAdminSections.find(item => item.id === activeSection)?.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-stone-600">
              Welcome back, <span className="font-medium">{user.full_name}</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          <Suspense fallback={
            <div className="min-h-full flex items-center justify-center text-stone-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mr-2"></div>
              Loading module...
            </div>
          }>
            {renderContent()}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
