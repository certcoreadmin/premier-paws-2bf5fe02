

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, Home, ChevronDown, Menu, X, Phone, User, Settings, Award, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User as UserEntity } from "@/api/entities";
import { GlobalSettings } from "@/api/entities";
import CookieConsent from "../components/common/CookieConsent";

const navigationStructure = [
  {
    title: "Home",
    url: createPageUrl("Home"),
    icon: Home
  },
  {
    title: "Our Dogs",
    url: createPageUrl("Parents")
  },
  {
    title: "About",
    items: [
      { title: "Our Philosophy", url: createPageUrl("Philosophy") },
      { title: "Testimonials", url: createPageUrl("Testimonials") },
      { title: "Contact", url: createPageUrl("Contact") }
    ]
  },
  {
    title: "More",
    items: [
      { title: "Blog", url: createPageUrl("Blog") },
      { title: "Goldendoodle Guide", url: createPageUrl("BreedResources") },
      { title: "Upcoming Litters", url: createPageUrl("UpcomingLitters") },
      { title: "Marketplace", url: createPageUrl("Marketplace") },
    ]
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  const [headerShrunk, setHeaderShrunk] = React.useState(false);
  const [globalSettings, setGlobalSettings] = React.useState(null);

  React.useEffect(() => {
    loadGlobalSettings();
    checkUser();
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadGlobalSettings = async () => {
    const defaultSettings = {
      site_name: "Golden Paws Doodles",
      tagline: "Your Perfect Family Companion",
      contact_phone: "(555) 123-4567",
      contact_email: "info@goldenpawsdoodles.com",
      contact_address: "Golden Valley, CA",
      primary_color: "#D97706", // Equivalent to amber-600
      secondary_color: "#78716C", // Equivalent to stone-600
      accent_color: "#059669", // Example accent color
      logo_url: null, // No custom logo by default
      footer_about_text: "Breeding health-tested, family-socialized Goldendoodles with the perfect blend of intelligence and loving companionship.",
      trust_bar_items: [
        { text: "GANA Blue Ribbon", icon: "Award" },
        { text: "AKC H.E.A.R.T.", icon: "Shield" },
        { text: "Health Tested", icon: "Heart" }
      ],
      main_hero_image_url: null, // Default for new hero image field
    };

    try {
      const settingsList = await GlobalSettings.list();
      if (settingsList.length > 0) {
        setGlobalSettings(settingsList[0]);
      } else {
        // No settings found in DB, use hardcoded defaults
        setGlobalSettings(defaultSettings);
      }
    } catch (error) {
      console.error("Error loading global settings:", error);
      // If there's an actual error (e.g., network down, module not found), fall back to defaults
      setGlobalSettings(defaultSettings);
    }
  };

  const handleScroll = () => {
    setHeaderShrunk(window.scrollY > 100);
  };

  const checkUser = async () => {
    try {
      const currentUser = await UserEntity.me();
      setUser(currentUser);
    } catch (error) {
      // User is not authenticated - this is fine for public pages
      setUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleLogout = async () => {
    try {
      await UserEntity.logout();
      setUser(null);
      window.location.href = createPageUrl("Home");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleLogin = async () => {
    try {
      await UserEntity.login();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const isCurrentPage = (url) => location.pathname === url;

  const isActiveSection = (section) => {
    if (section.url) return isCurrentPage(section.url);
    return section.items?.some(item => isCurrentPage(item.url));
  };

  const isAdminPage = currentPageName === 'AdminPanel';
  const isOwnerPortal = currentPageName === 'OwnerPortal';
  const isSuperAdminPage = currentPageName === 'SuperAdminSettings';

  // Apply dynamic styling based on global settings
  const customStyles = `
    html {
      overflow-y: scroll;
    }
    ${globalSettings ? `
    :root {
      --primary-color: ${globalSettings.primary_color || '#D97706'};
      --secondary-color: ${globalSettings.secondary_color || '#78716C'};
      --accent-color: ${globalSettings.accent_color || '#059669'};
    }
    .bg-amber-600 { background-color: var(--primary-color) !important; }
    .hover\\:bg-amber-700:hover { background-color: var(--primary-color) !important; filter: brightness(0.9); }
    .text-amber-600 { color: var(--primary-color) !important; }
    .border-amber-600 { border-color: var(--primary-color) !important; }
    .bg-amber-50 { background-color: ${globalSettings.primary_color || '#D97706'}1A !important; } /* Use 10% opacity for light background */
    .bg-amber-100 { background-color: ${globalSettings.primary_color || '#D97706'}33 !important; } /* Use 20% opacity for active background */
    .text-amber-800 { color: var(--primary-color) !important; filter: brightness(0.8); } /* Darken primary for text */
    .text-amber-700 { color: var(--primary-color) !important; filter: brightness(0.9); } /* Slightly darken primary for text */
    .from-amber-500 { --tw-gradient-from: var(--primary-color) !important; --tw-gradient-to: var(--primary-color) !important; }
    .to-amber-600 { --tw-gradient-to: var(--primary-color) !important; }
  ` : ''}`;

  // Use direct CDN URL for hero image instead of API route
  const heroImageUrl = globalSettings?.main_hero_image_url || "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=1000&fit=crop&auto=format&q=80";

  return (
    <>
      {/* Move critical resources to document head */}
      <head>
        {/* Preload hero image with highest priority */}
        <link
          rel="preload"
          as="image"
          href={heroImageUrl}
          fetchPriority="high"
          type="image/jpeg"
        />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        
        {/* SEO Meta */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{globalSettings?.site_name || "Golden Paws Doodles"} - {globalSettings?.tagline || "Premium Goldendoodle Breeder"}</title>
        {globalSettings?.site_name && (
          <>
            <meta name="description" content={`${globalSettings.site_name} - ${globalSettings.tagline || "Premium health-tested Goldendoodle breeder"}`} />
            <meta property="og:title" content={`${globalSettings.site_name} - ${globalSettings.tagline}`} />
            <meta property="og:description" content={globalSettings.footer_about_text || "Breeding health-tested, family-socialized Goldendoodles"} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://demo.pawspixeldesign.com" />
            {globalSettings.logo_url && <meta property="og:image" content={globalSettings.logo_url} />}
          </>
        )}
      </head>

      <div className="min-h-screen bg-stone-50">
        {/* Dynamic CSS for theming based on global settings */}
        <style dangerouslySetInnerHTML={{ __html: customStyles }} />

        {/* Header */}
        <header className={`bg-white/95 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-50 transition-all duration-300 ${headerShrunk ? 'h-16' : 'h-20'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-full">
              {/* Logo - Fixed for mobile */}
              <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
                <div className={`bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 ${headerShrunk ? 'w-10 h-10' : 'w-12 h-12'}`}>
                  {globalSettings?.logo_url ? (
                    <img
                      src={globalSettings.logo_url}
                      alt={`${globalSettings?.site_name || "Golden Paws Doodles"} Logo`}
                      className={`${headerShrunk ? 'w-8 h-8' : 'w-10 h-10'} object-contain`}
                    />
                  ) : (
                    <Heart className={`text-white ${headerShrunk ? 'w-5 h-5' : 'w-6 h-6'}`} />
                  )}
                </div>
                <div className="min-w-0">
                  <h1 className={`font-bold text-stone-800 transition-all duration-300 leading-tight ${headerShrunk ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'}`}>
                    <span className="block sm:inline">{globalSettings?.site_name || "Golden Paws"}</span>
                    <span className="block sm:inline sm:ml-1">{globalSettings?.site_name ? "" : "Doodles"}</span>
                  </h1>
                  {!headerShrunk && (
                    <p className="text-xs sm:text-sm text-stone-600 -mt-1 hidden md:block leading-tight">
                      {globalSettings?.tagline || "Your Perfect Family Companion"}
                    </p>
                  )}
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navigationStructure.map((section, index) => (
                  section.items ? (
                    <DropdownMenu key={index}>
                      <DropdownMenuTrigger asChild>
                        <button className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActiveSection(section)
                            ? "bg-amber-100 text-amber-800"
                            : "text-stone-700 hover:bg-stone-100 hover:text-stone-900"
                        }`}>
                          {section.title}
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56">
                        {section.items.map((item, itemIndex) => (
                          <DropdownMenuItem key={itemIndex} asChild>
                            <Link
                              to={item.url}
                              className={`w-full ${isCurrentPage(item.url) ? 'bg-amber-50 text-amber-700' : ''}`}
                            >
                              {item.title}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link
                      key={index}
                      to={section.url}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isCurrentPage(section.url)
                          ? "bg-amber-100 text-amber-800"
                          : "text-stone-700 hover:bg-stone-100 hover:text-stone-900"
                      }`}
                    >
                      {section.title}
                    </Link>
                  )
                ))}
              </nav>

              {/* Header Actions - Improved for mobile */}
              <div className="flex items-center gap-2">
                {/* Primary CTA - Responsive */}
                <div className="hidden sm:flex items-center gap-3">
                  <Link to={createPageUrl("Puppies")}>
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white transform hover:scale-105 transition-all duration-200 text-sm px-4 py-2">
                      Available Puppies
                    </Button>
                  </Link>
                </div>

                {/* Mobile CTA - Compact */}
                <div className="flex sm:hidden">
                  <Link to={createPageUrl("Puppies")}>
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 py-2">
                      Puppies
                    </Button>
                  </Link>
                </div>

                {/* User Menu - Show for authenticated users OR Login button for public */}
                <div className="hidden lg:block">
                  {!isCheckingAuth && (
                    <>
                      {user && (user.access_level === 'admin' || user.access_level === 'super_admin' || user.access_level === 'owner') ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2 w-full justify-start px-2">
                              <User className="w-4 h-4" />
                              <span className="truncate text-sm">{user.full_name}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {user.access_level === 'super_admin' && (
                              <>
                                <DropdownMenuItem asChild>
                                  <Link to={createPageUrl("SuperAdminSettings")}>
                                    <Settings className="w-4 h-4 mr-2" />
                                    Super Admin Settings
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link to={createPageUrl("AdminPanel")}>
                                    <Settings className="w-4 h-4 mr-2" />
                                    Admin Panel
                                  </Link>
                                </DropdownMenuItem>
                              </>
                            )}
                            {user.access_level === 'admin' && (
                              <DropdownMenuItem asChild>
                                <Link to={createPageUrl("AdminPanel")}>
                                  <Settings className="w-4 h-4 mr-2" />
                                  Admin Panel
                                </Link>
                              </DropdownMenuItem>
                            )}
                            {user.access_level === 'owner' && (
                              <DropdownMenuItem asChild>
                                <Link to={createPageUrl("OwnerPortal")}>
                                  <Heart className="w-4 h-4 mr-2" />
                                  Owner's Corner
                                </Link>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={handleLogout}>
                              Logout
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleLogin}
                          className="border-amber-600 text-amber-600 hover:bg-amber-50"
                        >
                          <User className="w-4 h-4 mr-2" />
                          Login
                        </Button>
                      )}
                    </>
                  )}
                </div>

                {/* Mobile Menu Trigger */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild className="lg:hidden">
                    <Button variant="ghost" size="icon" className="h-10 w-10">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <div className="flex flex-col gap-6 mt-8">
                      {/* Mobile Logo */}
                      <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                          {globalSettings?.logo_url ? (
                              <img
                                src={globalSettings.logo_url}
                                alt={`${globalSettings?.site_name || "Golden Paws Doodles"} Logo`}
                                className="w-8 h-8 object-contain"
                              />
                            ) : (
                              <Heart className="w-5 h-5 text-white" />
                            )}
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-stone-800">
                            {globalSettings?.site_name || "Golden Paws Doodles"}
                          </h2>
                        </div>
                      </div>

                      {/* Mobile Navigation */}
                      <div className="space-y-2">
                        {navigationStructure.map((section, index) => (
                          <div key={index}>
                            {section.items ? (
                              <div className="space-y-2">
                                <div className="font-medium px-3 py-2 rounded-lg text-stone-700">
                                  {section.title}
                                </div>
                                <div className="pl-4 space-y-1">
                                  {section.items.map((item, itemIndex) => (
                                    <Link
                                      key={itemIndex}
                                      to={item.url}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                        isCurrentPage(item.url)
                                          ? "bg-amber-100 text-amber-700"
                                          : "text-stone-600 hover:bg-stone-100"
                                      }`}
                                    >
                                      {item.title}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <Link
                                to={section.url}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-3 py-2 rounded-lg font-medium transition-colors ${
                                  isCurrentPage(section.url)
                                    ? "bg-amber-100 text-amber-700"
                                    : "text-stone-700 hover:bg-stone-100"
                                }`}
                              >
                                {section.title}
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Mobile CTAs */}
                      <div className="space-y-3 pt-4 border-t border-stone-200">
                        <Link to={createPageUrl("Puppies")} onClick={() => setMobileMenuOpen(false)}>
                          <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                            🐕 Available Puppies
                          </Button>
                        </Link>
                        <Link to={createPageUrl("Contact")} onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full border-amber-600 text-amber-600">
                            📞 Contact Us
                          </Button>
                        </Link>
                      </div>

                      {/* Mobile User Menu - For authenticated users OR Login for public */}
                      {!isCheckingAuth && (
                        <div className="pt-4 border-t border-stone-200">
                          {user && (user.access_level === 'admin' || user.access_level === 'super_admin' || user.access_level === 'owner') ? (
                            <div className="space-y-2">
                              {user.access_level === 'super_admin' && (
                                <>
                                  <Link to={createPageUrl("SuperAdminSettings")} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-stone-700 hover:bg-stone-100">
                                     <Settings className="w-5 h-5" />
                                     <span>Super Admin Settings</span>
                                  </Link>
                                  <Link to={createPageUrl("AdminPanel")} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-stone-700 hover:bg-stone-100">
                                     <Settings className="w-5 h-5" />
                                     <span>Admin Panel</span>
                                  </Link>
                                </>
                              )}
                              {user.access_level === 'owner' && (
                                <Link to={createPageUrl("OwnerPortal")} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-stone-700 hover:bg-stone-100">
                                   <Heart className="w-5 h-5" />
                                   <span>Owner's Corner</span>
                                </Link>
                              )}
                              {user.access_level === 'admin' && (
                                <Link to={createPageUrl("AdminPanel")} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-stone-700 hover:bg-stone-100">
                                   <Settings className="w-5 h-5" />
                                   <span>Admin Panel</span>
                                </Link>
                              )}
                              <Button variant="outline" onClick={handleLogout} className="w-full">Logout</Button>
                            </div>
                          ) : (
                            <Button onClick={handleLogin} variant="outline" className="w-full border-amber-600 text-amber-600">
                              <User className="w-4 h-4 mr-2" />
                              Login
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        {/* Footer - Hide on Admin Panel, Owner Portal, and Super Admin Settings */}
        {!isAdminPage && !isOwnerPortal && !isSuperAdminPage && (
          <footer className="bg-stone-800 text-stone-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="grid md:grid-cols-4 gap-8">
                <div className="md:col-span-2">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {globalSettings?.site_name || "Golden Paws Doodles"}
                  </h3>
                  <p className="text-stone-400 max-w-md">
                    {globalSettings?.footer_about_text ||
                    "Breeding health-tested, family-socialized Goldendoodles with the perfect blend of intelligence and loving companionship."}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link to={createPageUrl("Parents")} className="hover:text-white transition-colors">The Doodle Parents</Link></li>
                    <li><Link to={createPageUrl("Puppies")} className="hover:text-white transition-colors">Puppy Nursery</Link></li>
                    <li><Link to={createPageUrl("UpcomingLitters")} className="hover:text-white transition-colors">Upcoming Litters</Link></li>
                    <li><Link to={createPageUrl("Application")} className="hover:text-white transition-colors">Adoption Application</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-4">Contact Info</h4>
                  <div className="space-y-2 text-sm">
                    <p>📧 {globalSettings?.contact_email || "info@goldenpawsdoodles.com"}</p>
                    <p>📞 {globalSettings?.contact_phone || "(555) 123-4567"}</p>
                    <p>📍 {globalSettings?.contact_address || "Golden Valley, CA"}</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-stone-700 mt-12 pt-8 text-center text-sm text-stone-400">
                <p>&copy; {new Date().getFullYear()} {globalSettings?.site_name || "Golden Paws Doodles"}. All rights reserved.</p>
              </div>
            </div>
          </footer>
        )}

        {/* Cookie Consent Banner */}
        <CookieConsent />
      </div>
    </>
  );
}

