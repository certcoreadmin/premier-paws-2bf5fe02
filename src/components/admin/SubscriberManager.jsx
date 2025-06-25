
import React, { useState, useEffect } from "react";
import { Subscriber } from "@/api/entities";
import { RecommendedProduct } from "@/api/entities"; // Added import for RecommendedProduct
import { SendEmail } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Mail, Users, Send, Download, Calendar, Filter,
  Eye, Trash2, Plus, MessageSquare, Heart, Bell
} from "lucide-react";
import { format } from "date-fns";

export default function SubscriberManager() {
  const [subscribers, setSubscribers] = useState([]);
  const [products, setProducts] = useState([]); // Added state for products
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);
  const [activeTab, setActiveTab] = useState("subscribers");
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [isComposing, setIsComposing] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [emailForm, setEmailForm] = useState({
    subject: "",
    body: "",
    fromName: "Golden Paws Doodles",
    recipientType: "all",
    includeProducts: false, // Added for product recommendations
    selectedProducts: [],   // Added for product recommendations
    discountCode: "",       // Added for product recommendations
    discountDescription: "" // Added for product recommendations
  });

  useEffect(() => {
    loadSubscribers();
    loadProducts(); // Call loadProducts when component mounts
  }, []);

  useEffect(() => {
    filterSubscribers();
  }, [subscribers, filterType, searchTerm]);

  const loadSubscribers = async () => {
    try {
      const subscriberList = await Subscriber.list("-created_date");
      setSubscribers(subscriberList);
    } catch (error) {
      console.error("Error loading subscribers:", error);
    }
  };

  // Added loadProducts function
  const loadProducts = async () => {
    try {
      const productList = await RecommendedProduct.list("-updated_date");
      setProducts(productList);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const filterSubscribers = () => {
    let filtered = subscribers;

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(sub => sub.subscription_type === filterType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(sub =>
        sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sub.name && sub.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredSubscribers(filtered);
  };

  const handleSelectSubscriber = (subscriberId, isSelected) => {
    if (isSelected) {
      setSelectedSubscribers(prev => [...prev, subscriberId]);
    } else {
      setSelectedSubscribers(prev => prev.filter(id => id !== subscriberId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedSubscribers(filteredSubscribers.map(sub => sub.id));
    } else {
      setSelectedSubscribers([]);
    }
  };

  const getRecipientList = () => {
    if (emailForm.recipientType === "selected") {
      // Filter subscribers by selected IDs, ensuring they are active
      return subscribers.filter(sub => selectedSubscribers.includes(sub.id) && sub.status === "active");
    } else if (emailForm.recipientType === "all") {
      return subscribers.filter(sub => sub.status === "active");
    } else {
      return subscribers.filter(sub =>
        sub.subscription_type === emailForm.recipientType &&
        sub.status === "active"
      );
    }
  };

  // Added generateProductRecommendations function
  const generateProductRecommendations = () => {
    if (!emailForm.includeProducts || emailForm.selectedProducts.length === 0) {
      return "";
    }

    const selectedProductData = products.filter(p => emailForm.selectedProducts.includes(p.id));

    let productSection = `\n\n---
🛍️ SPECIAL PRODUCT RECOMMENDATIONS
---
`;

    if (emailForm.discountCode) {
      productSection += `🎉 Exclusive Discount: Use code "${emailForm.discountCode}" ${emailForm.discountDescription ? `for ${emailForm.discountDescription}` : ''}\n\n`;
    }

    selectedProductData.forEach(product => {
      productSection += `📦 ${product.name}\n`;
      productSection += `${product.why_recommended || product.description}\n`;
      if (product.price_range) {
        productSection += `💰 Price: ${product.price_range}\n`;
      }
      if (product.affiliate_url) {
        productSection += `🔗 Shop: ${product.affiliate_url}\n`;
      }
      productSection += `\n`;
    });

    return productSection;
  };

  const handleSendNewsletter = async () => {
    if (!emailForm.subject || !emailForm.body) {
      alert("Please fill in both subject and message");
      return;
    }

    const recipients = getRecipientList();
    if (recipients.length === 0) {
      alert("No recipients selected");
      return;
    }

    if (!confirm(`Send email to ${recipients.length} subscribers?`)) {
      return;
    }

    setIsSending(true);

    try {
      // Generate the full email body with product recommendations
      const fullEmailBody = emailForm.body + generateProductRecommendations();

      // Send emails to all recipients
      for (const subscriber of recipients) {
        await SendEmail({
          from_name: emailForm.fromName,
          to: subscriber.email,
          subject: emailForm.subject,
          body: fullEmailBody
        });

        // Add a small delay to avoid overwhelming the email service
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      alert(`Successfully sent email to ${recipients.length} subscribers!`);
      setIsComposing(false);
      setEmailForm({
        subject: "",
        body: "",
        fromName: "Golden Paws Doodles",
        recipientType: "all",
        includeProducts: false, // Reset
        selectedProducts: [],   // Reset
        discountCode: "",       // Reset
        discountDescription: "" // Reset
      });
    } catch (error) {
      console.error("Error sending newsletter:", error);
      alert("Error sending newsletter. Please try again.");
    }

    setIsSending(false);
  };

  const subscriptionTypeColors = {
    future_litters: "bg-blue-100 text-blue-800",
    blog_updates: "bg-green-100 text-green-800",
    general_newsletter: "bg-purple-100 text-purple-800"
  };

  const subscriptionTypeLabels = {
    future_litters: "Future Litters",
    blog_updates: "Blog Updates",
    general_newsletter: "Newsletter"
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Subscriber Management & Newsletter
          </CardTitle>
          <p className="text-stone-600">
            Manage your email subscribers and send newsletter updates to your community.
          </p>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="subscribers">
            <Users className="w-4 h-4 mr-2" />
            Subscribers ({subscribers.length})
          </TabsTrigger>
          <TabsTrigger value="compose">
            <Mail className="w-4 h-4 mr-2" />
            Send Newsletter
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscribers" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-stone-500" />
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subscribers</SelectItem>
                      <SelectItem value="future_litters">Future Litters</SelectItem>
                      <SelectItem value="blog_updates">Blog Updates</SelectItem>
                      <SelectItem value="general_newsletter">Newsletter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-xs"
                />

                <div className="text-sm text-stone-600">
                  Showing {filteredSubscribers.length} of {subscribers.length} subscribers
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="select-all">Select All</Label>
                </div>

                {selectedSubscribers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-stone-600">
                      {selectedSubscribers.length} selected
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEmailForm(prev => ({...prev, recipientType: "selected"}));
                        setActiveTab("compose");
                      }}
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      Email Selected
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Subscribers List */}
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredSubscribers.map((subscriber) => (
                  <div key={subscriber.id} className="p-4 flex items-center justify-between hover:bg-stone-50">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedSubscribers.includes(subscriber.id)}
                        onCheckedChange={(checked) => handleSelectSubscriber(subscriber.id, checked)}
                      />
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">
                            {subscriber.name || subscriber.email}
                          </h4>
                          <Badge className={subscriptionTypeColors[subscriber.subscription_type]}>
                            {subscriptionTypeLabels[subscriber.subscription_type]}
                          </Badge>
                          {subscriber.status === "unsubscribed" && (
                            <Badge variant="outline" className="text-red-600">
                              Unsubscribed
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-stone-600 flex items-center gap-4">
                          <span>{subscriber.email}</span>
                          <span>•</span>
                          <span>Joined {format(new Date(subscriber.created_date), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSubscribers([subscriber.id]);
                          setEmailForm(prev => ({...prev, recipientType: "selected"}));
                          setActiveTab("compose");
                        }}
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compose" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compose Newsletter</CardTitle>
              <p className="text-stone-600">
                Send updates about new litters, blog posts, or holiday greetings to your subscribers.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="from_name">From Name</Label>
                  <Input
                    id="from_name"
                    value={emailForm.fromName}
                    onChange={(e) => setEmailForm(prev => ({...prev, fromName: e.target.value}))}
                  />
                </div>
                <div>
                  <Label htmlFor="recipient_type">Send To</Label>
                  <Select value={emailForm.recipientType} onValueChange={(value) => setEmailForm(prev => ({...prev, recipientType: value}))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Active Subscribers ({subscribers.filter(s => s.status === "active").length})</SelectItem>
                      <SelectItem value="future_litters">Future Litters Only ({subscribers.filter(s => s.subscription_type === "future_litters" && s.status === "active").length})</SelectItem>
                      <SelectItem value="blog_updates">Blog Updates Only ({subscribers.filter(s => s.subscription_type === "blog_updates" && s.status === "active").length})</SelectItem>
                      <SelectItem value="general_newsletter">Newsletter Only ({subscribers.filter(s => s.subscription_type === "general_newsletter" && s.status === "active").length})</SelectItem>
                      {selectedSubscribers.length > 0 && (
                        <SelectItem value="selected">Selected Subscribers ({selectedSubscribers.length})</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="subject">Subject Line</Label>
                <Input
                  id="subject"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm(prev => ({...prev, subject: e.target.value}))}
                  placeholder="🐶 Exciting News from Golden Paws Doodles!"
                />
              </div>

              <div>
                <Label htmlFor="body">Message</Label>
                <Textarea
                  id="body"
                  value={emailForm.body}
                  onChange={(e) => setEmailForm(prev => ({...prev, body: e.target.value}))}
                  rows={8} // Changed rows to 8 to accommodate product section
                  placeholder="Dear Golden Paws Family,

We hope this message finds you and your furry family members doing well! We have some exciting updates to share...

Best regards,
The Golden Paws Doodles Team"
                />
              </div>

              {/* Product Recommendations Section */}
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox
                      id="includeProducts"
                      checked={emailForm.includeProducts}
                      onCheckedChange={(checked) => setEmailForm(prev => ({...prev, includeProducts: checked}))}
                    />
                    <Label htmlFor="includeProducts" className="font-medium">
                      🛍️ Include Product Recommendations
                    </Label>
                  </div>

                  {emailForm.includeProducts && (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="discountCode">Discount Code (Optional)</Label>
                          <Input
                            id="discountCode"
                            value={emailForm.discountCode}
                            onChange={(e) => setEmailForm(prev => ({...prev, discountCode: e.target.value}))}
                            placeholder="GOLDENPAWS15"
                          />
                        </div>
                        <div>
                          <Label htmlFor="discountDescription">Discount Description</Label>
                          <Input
                            id="discountDescription"
                            value={emailForm.discountDescription}
                            onChange={(e) => setEmailForm(prev => ({...prev, discountDescription: e.target.value}))}
                            placeholder="15% off your first order"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Select Products to Recommend</Label>
                        <div className="mt-2 space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
                          {products.length === 0 ? (
                            <p className="text-sm text-stone-500">No products available. Add recommended products in your CMS.</p>
                          ) : (
                            products.map(product => (
                              <div key={product.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`product-${product.id}`}
                                  checked={emailForm.selectedProducts.includes(product.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setEmailForm(prev => ({
                                        ...prev,
                                        selectedProducts: [...prev.selectedProducts, product.id]
                                      }));
                                    } else {
                                      setEmailForm(prev => ({
                                        ...prev,
                                        selectedProducts: prev.selectedProducts.filter(id => id !== product.id)
                                      }));
                                    }
                                  }}
                                />
                                <Label htmlFor={`product-${product.id}`} className="text-sm flex-1">
                                  {product.name} ({product.category})
                                  {product.featured && <Badge className="ml-2 bg-amber-100 text-amber-800">Featured</Badge>}
                                </Label>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">📧 Email Preview</h4>
                <div className="text-sm text-blue-700">
                  <p><strong>To:</strong> {getRecipientList().length} subscribers</p>
                  <p><strong>Subject:</strong> {emailForm.subject || "No subject"}</p>
                  {emailForm.includeProducts && emailForm.selectedProducts.length > 0 && (
                    <p><strong>Products:</strong> {emailForm.selectedProducts.length} recommendations included</p>
                  )}
                  {emailForm.discountCode && (
                    <p><strong>Discount:</strong> Code "{emailForm.discountCode}"</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleSendNewsletter}
                  disabled={isSending || !emailForm.subject || !emailForm.body}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Newsletter
                    </>
                  )}
                </Button>

                <Button variant="outline" onClick={() => setActiveTab("subscribers")}>
                  Back to Subscribers
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Quick Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📝 Quick Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 text-left"
                  onClick={() => setEmailForm(prev => ({
                    ...prev,
                    subject: "🐶 New Litter Announcement - Golden Paws Doodles",
                    body: `Dear Golden Paws Family,

We're thrilled to announce that we have a new litter of beautiful Golden Retriever puppies on the way!

📅 Expected Arrival: [DATE]
👨‍👩‍👧‍👦 Parents: [DAM NAME] & [SIRE NAME]
🎯 Expected Puppies: [NUMBER]

As one of our valued subscribers, you'll have priority access to reserve your spot. Applications will open [DATE].

We can't wait to share more updates and photos as these little ones grow!

Best regards,
The Golden Paws Doodles Team`,
                    // Ensure product fields are reset for this template
                    includeProducts: false,
                    selectedProducts: [],
                    discountCode: "",
                    discountDescription: ""
                  }))}
                >
                  <div>
                    <div className="font-medium">New Litter</div>
                    <div className="text-sm text-stone-600">Announce upcoming puppies</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 text-left"
                  onClick={() => setEmailForm(prev => ({
                    ...prev,
                    subject: "🛍️ Our Favorite Products + Special Discount!",
                    body: `Dear Golden Paws Family,

We know how much you love spoiling your furry family members, so we wanted to share some of our absolute favorite products that we use and recommend for our own dogs.

These are the same products we trust for our breeding program and personal pets - tested and approved by us!

Best regards,
The Golden Paws Doodles Team`,
                    includeProducts: true,
                    selectedProducts: [], // Set initially empty, user can select after
                    discountCode: "GOLDENPAWS15",
                    discountDescription: "15% off your first order"
                  }))}
                >
                  <div>
                    <div className="font-medium">Product Showcase</div>
                    <div className="text-sm text-stone-600">Share products with discount</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 text-left"
                  onClick={() => setEmailForm(prev => ({
                    ...prev,
                    subject: "🎄 Holiday Greetings + Gift Ideas",
                    body: `Dear Golden Paws Family,

As the holiday season approaches, we wanted to take a moment to express our heartfelt gratitude for being part of our extended Golden Paws family.

Whether you're a puppy parent, waiting for your future companion, or simply following our journey, you make our breeding program special.

We've also put together some of our favorite gift ideas for the special dogs in your life!

With warm regards,
The Golden Paws Doodles Team`,
                    includeProducts: true,
                    selectedProducts: [], // Set initially empty, user can select after
                    discountCode: "HOLIDAY20",
                    discountDescription: "20% off holiday orders"
                  }))}
                >
                  <div>
                    <div className="font-medium">Holiday Newsletter</div>
                    <div className="text-sm text-stone-600">Seasonal with gift ideas</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
