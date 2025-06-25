import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Cookie, Settings, X } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setShowBanner(false);
    // Initialize analytics and other services here
  };

  const handleAcceptSelected = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    setShowBanner(false);
    setShowSettings(false);
    // Initialize only selected services here
  };

  const handleRejectAll = () => {
    const minimalConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    localStorage.setItem('cookieConsent', JSON.stringify(minimalConsent));
    setShowBanner(false);
  };

  const updatePreference = (type, value) => {
    setPreferences(prev => ({ ...prev, [type]: value }));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="max-w-4xl mx-auto shadow-2xl border-amber-200 bg-white">
        {!showSettings ? (
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Cookie className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-stone-800 mb-2">
                  We Care About Your Privacy
                </h3>
                <p className="text-stone-600 mb-4">
                  We use cookies to enhance your browsing experience, provide personalized content, 
                  and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={handleAcceptAll}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    Accept All
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowSettings(true)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Customize
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={handleRejectAll}
                  >
                    Reject All
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        ) : (
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-stone-800">Cookie Preferences</h3>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowSettings(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-stone-800">Necessary Cookies</h4>
                  <p className="text-sm text-stone-600">Required for the website to function properly.</p>
                </div>
                <Checkbox checked={true} disabled />
              </div>

              <div className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-stone-800">Analytics Cookies</h4>
                  <p className="text-sm text-stone-600">Help us understand how visitors interact with our website.</p>
                </div>
                <Checkbox 
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => updatePreference('analytics', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-stone-800">Marketing Cookies</h4>
                  <p className="text-sm text-stone-600">Used to deliver personalized advertisements.</p>
                </div>
                <Checkbox 
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => updatePreference('marketing', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-stone-800">Functional Cookies</h4>
                  <p className="text-sm text-stone-600">Enable enhanced functionality and personalization.</p>
                </div>
                <Checkbox 
                  checked={preferences.functional}
                  onCheckedChange={(checked) => updatePreference('functional', checked)}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button 
                onClick={handleAcceptSelected}
                className="bg-amber-600 hover:bg-amber-700"
              >
                Save Preferences
              </Button>
              <Button 
                variant="outline" 
                onClick={handleAcceptAll}
              >
                Accept All
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}