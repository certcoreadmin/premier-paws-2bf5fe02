
import React, { useState, useEffect } from "react";
import { Dog } from "@/api/entities"; // Changed from "@/api/entities" to "@/api/entities"
import { InvokeLLM } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Wand2, Save, RefreshCw, Heart } from "lucide-react";

export default function AIDescriptionGenerator() {
  const [puppies, setPuppies] = useState([]);
  const [selectedPuppy, setSelectedPuppy] = useState("");
  const [keywords, setKeywords] = useState("");
  const [generatedDescription, setGeneratedDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPuppies();
  }, []);

  const loadPuppies = async () => {
    try {
      const puppyList = await Dog.filter({ type: "puppy" }, "-birth_date");
      setPuppies(puppyList);
    } catch (error) {
      console.error("Error loading puppies:", error);
    }
  };

  const generateDescription = async () => {
    if (!selectedPuppy || !keywords) return;

    setIsGenerating(true);
    try {
      const puppy = puppies.find(p => p.id === selectedPuppy);
      
      const prompt = `Write an engaging, warm, and professional description for a Goldendoodle puppy available for adoption from a premium breeder called "Golden Paws Doodles".

Puppy Details:
- Name: ${puppy.name}
- Gender: ${puppy.gender}
- Generation: ${puppy.generation || 'F1b'}
- Coat: ${puppy.coat_type || 'Wavy'}
- Color: ${puppy.color || 'Apricot'}
- Age: ${puppy.birth_date ? Math.floor((new Date() - new Date(puppy.birth_date)) / (1000 * 60 * 60 * 24 * 7)) + ' weeks old' : 'Young puppy'}
- Parent Info: Both parents are fully health-tested (OFA, Embark).

Personality Keywords to focus on: ${keywords}

Please write a compelling 2-3 paragraph description that:
1.  Highlights the puppy's unique personality based on the keywords.
2.  Creates an emotional connection, making the puppy sound special and unique.
3.  Mentions that they are raised in a loving home environment with early socialization (our "puppy curriculum").
4.  Subtly references their health-tested lineage.
5.  Maintains a professional yet warm and inviting tone.
6.  Is around 150 words. Do not just list the traits; weave them into a narrative.

Example tone: "Meet ${puppy.name}, a little bundle of joy with a heart as golden as his coat! From the moment you meet him, you'll be captivated by his..."`;

      const response = await InvokeLLM({
        prompt: prompt
      });

      setGeneratedDescription(response);
    } catch (error) {
      console.error("Error generating description:", error);
      alert("Error generating description. Please try again.");
    }
    setIsGenerating(false);
  };

  const saveDescription = async () => {
    if (!selectedPuppy || !generatedDescription) return;

    setIsSaving(true);
    try {
      await Dog.update(selectedPuppy, {
        description: generatedDescription
      });
      
      alert("Description saved successfully!");
      
      // Update local state
      setPuppies(prev => prev.map(p => 
        p.id === selectedPuppy 
          ? { ...p, description: generatedDescription }
          : p
      ));
      
      // Reset form
      setSelectedPuppy("");
      setKeywords("");
      setGeneratedDescription("");
    } catch (error) {
      console.error("Error saving description:", error);
      alert("Error saving description. Please try again.");
    }
    setIsSaving(false);
  };

  const selectedPuppyData = puppies.find(p => p.id === selectedPuppy);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-amber-600" />
            AI-Powered Puppy Description Generator
          </CardTitle>
          <p className="text-stone-600">
            Generate engaging, unique descriptions for your puppies using AI. 
            Simply provide a few personality keywords and let AI craft a compelling narrative.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Puppy Selection */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Select Puppy
            </label>
            <Select value={selectedPuppy} onValueChange={setSelectedPuppy}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a puppy to generate description for..." />
              </SelectTrigger>
              <SelectContent>
                {puppies.map((puppy) => (
                  <SelectItem key={puppy.id} value={puppy.id}>
                    {puppy.name} - {puppy.gender} - {puppy.color}
                    {puppy.description && <Badge className="ml-2 text-xs">Has Description</Badge>}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current Puppy Info */}
          {selectedPuppyData && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-800 mb-2">Selected Puppy: {selectedPuppyData.name}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600">Gender:</span> {selectedPuppyData.gender}
                  </div>
                  <div>
                    <span className="text-blue-600">Color:</span> {selectedPuppyData.color}
                  </div>
                  <div>
                    <span className="text-blue-600">Status:</span> {selectedPuppyData.status}
                  </div>
                  <div>
                    <span className="text-blue-600">Age:</span> {
                      selectedPuppyData.birth_date 
                        ? Math.floor((new Date() - new Date(selectedPuppyData.birth_date)) / (1000 * 60 * 60 * 24 * 7)) + ' weeks'
                        : 'Unknown'
                    }
                  </div>
                </div>
                {selectedPuppyData.description && (
                  <div className="mt-3">
                    <span className="text-blue-600 text-sm">Current Description:</span>
                    <p className="text-blue-700 text-sm mt-1 italic">
                      {selectedPuppyData.description.substring(0, 150)}...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Keywords Input */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Personality Keywords
            </label>
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g., playful, cuddly, adventurous, gentle, confident, outgoing"
              className="w-full"
            />
            <p className="text-stone-500 text-sm mt-1">
              Enter words that describe this puppy's personality and characteristics, separated by commas
            </p>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateDescription}
            disabled={!selectedPuppy || !keywords || isGenerating}
            className="w-full bg-amber-600 hover:bg-amber-700 gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating Description...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Generate AI Description
              </>
            )}
          </Button>

          {/* Generated Description */}
          {generatedDescription && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Generated Description
                </label>
                <Textarea
                  value={generatedDescription}
                  onChange={(e) => setGeneratedDescription(e.target.value)}
                  rows={8}
                  className="w-full"
                />
                <p className="text-stone-500 text-sm mt-1">
                  You can edit the generated description before saving
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={saveDescription}
                  disabled={isSaving}
                  className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Description
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={generateDescription}
                  variant="outline"
                  disabled={isGenerating}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-amber-800 mb-3">💡 Tips for Better Descriptions</h3>
          <ul className="space-y-2 text-amber-700 text-sm">
            <li>• Use specific personality traits: "gentle," "playful," "confident," "cuddly"</li>
            <li>• Include behavioral observations: "loves children," "first to greet visitors," "calm and observant"</li>
            <li>• Mention physical characteristics: "beautiful coat," "striking eyes," "perfect size"</li>
            <li>• Add activity preferences: "loves fetch," "enjoys swimming," "great hiking companion"</li>
            <li>• The more specific your keywords, the more personalized the description will be</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
