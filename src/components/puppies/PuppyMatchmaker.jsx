import React, { useState, useEffect } from "react";
import { Dog } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Sparkles, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PuppyMatchmaker() {
  const [availablePuppies, setAvailablePuppies] = useState([]);
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      message: "Hi there! 🐶 I'm your AI Puppy Matchmaker. Tell me what you're looking for in your perfect Goldendoodle companion, and I'll help you find the best matches from our currently available puppies!",
      timestamp: new Date()
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchedPuppies, setMatchedPuppies] = useState([]);

  useEffect(() => {
    loadAvailablePuppies();
  }, []);

  const loadAvailablePuppies = async () => {
    try {
      const puppies = await Dog.filter({ type: "puppy", status: "available" }, "-birth_date");
      setAvailablePuppies(puppies);
    } catch (error) {
      console.error("Error loading available puppies:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isProcessing) return;

    const userMessage = {
      role: "user",
      message: userInput,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setUserInput("");
    setIsProcessing(true);

    try {
      const aiResponse = await findPuppyMatches(userInput);
      
      const assistantMessage = {
        role: "assistant",
        message: aiResponse.response,
        matches: aiResponse.matches,
        timestamp: new Date()
      };

      setChatHistory(prev => [...prev, assistantMessage]);
      setMatchedPuppies(aiResponse.matches || []);
    } catch (error) {
      console.error("Error processing request:", error);
      const errorMessage = {
        role: "assistant",
        message: "I'm sorry, I encountered an error while searching for your perfect puppy match. Please try again!",
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    }

    setIsProcessing(false);
  };

  const findPuppyMatches = async (userRequest) => {
    const puppyData = availablePuppies.map(puppy => ({
      id: puppy.id,
      name: puppy.name,
      gender: puppy.gender,
      color: puppy.color,
      generation: puppy.generation,
      coat_type: puppy.coat_type,
      weight: puppy.weight,
      birth_date: puppy.birth_date,
      description: puppy.description,
      price: puppy.price,
      personality_keywords: extractPersonalityKeywords(puppy.description)
    }));

    const prompt = `You are an expert Goldendoodle puppy matchmaker for Golden Paws Doodles. A potential family has described what they're looking for in a puppy. Your job is to analyze their request and match them with the best available puppies from our current inventory.

USER REQUEST: "${userRequest}"

AVAILABLE PUPPIES:
${JSON.stringify(puppyData, null, 2)}

INSTRUCTIONS:
1. Analyze the user's request for preferences about:
   - Gender (male/female)
   - Personality traits (calm, playful, confident, gentle, etc.)
   - Size preferences
   - Family situation (first-time owners, active families, kids, etc.)
   - Any other specific requirements

2. Score each available puppy (1-10) based on how well they match the user's criteria

3. Return your response in this EXACT JSON format:
{
  "response": "A friendly, conversational response explaining the matches (2-3 sentences)",
  "matches": [
    {
      "puppy_id": "actual_puppy_id",
      "match_score": 9,
      "match_reason": "Brief explanation why this puppy is a great match"
    }
  ]
}

IMPORTANT RULES:
- Only recommend puppies that are currently available (status: "available")
- If no puppies match well, suggest joining the waiting list for future litters
- Keep the tone warm, friendly, and helpful
- Include specific puppy names and traits in your response
- Limit to top 3 matches maximum`;

    const aiResponse = await InvokeLLM({
      prompt: prompt,
      response_json_schema: {
        type: "object",
        properties: {
          response: { type: "string" },
          matches: {
            type: "array",
            items: {
              type: "object",
              properties: {
                puppy_id: { type: "string" },
                match_score: { type: "number" },
                match_reason: { type: "string" }
              }
            }
          }
        }
      }
    });

    // Get full puppy details for matched puppies
    const matchedPuppyDetails = aiResponse.matches?.map(match => {
      const puppy = availablePuppies.find(p => p.id === match.puppy_id);
      return puppy ? { ...puppy, match_score: match.match_score, match_reason: match.match_reason } : null;
    }).filter(Boolean) || [];

    return {
      response: aiResponse.response,
      matches: matchedPuppyDetails
    };
  };

  const extractPersonalityKeywords = (description) => {
    if (!description) return [];
    const personalityWords = ['playful', 'calm', 'gentle', 'confident', 'cuddly', 'adventurous', 'friendly', 'intelligent', 'loyal', 'energetic', 'sweet', 'outgoing'];
    return personalityWords.filter(word => 
      description.toLowerCase().includes(word.toLowerCase())
    );
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          AI Puppy Matchmaker
        </CardTitle>
        <p className="text-stone-600">
          Tell me what you're looking for, and I'll help you find your perfect puppy match!
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chat History */}
        <div className="h-96 overflow-y-auto space-y-4 p-4 bg-white rounded-lg border">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3/4 p-3 rounded-lg ${
                chat.role === 'user' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-stone-100 text-stone-800'
              }`}>
                <p className="text-sm">{chat.message}</p>
                <p className="text-xs opacity-70 mt-1">{formatTime(chat.timestamp)}</p>
                
                {/* Matched Puppies Display */}
                {chat.matches && chat.matches.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm font-medium">Here are your best matches:</p>
                    {chat.matches.map((puppy) => (
                      <div key={puppy.id} className="bg-white p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-stone-200 rounded-lg overflow-hidden">
                            {puppy.photos && puppy.photos[0] ? (
                              <img 
                                src={puppy.photos[0]} 
                                alt={puppy.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Heart className="w-6 h-6 text-stone-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-stone-800">{puppy.name}</h4>
                              <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                                {puppy.match_score}/10 Match
                              </Badge>
                            </div>
                            <p className="text-xs text-stone-600 mb-2">{puppy.gender} • {puppy.color}</p>
                            <p className="text-xs text-stone-700">{puppy.match_reason}</p>
                            <Link to={`${createPageUrl("Puppies")}?puppy=${puppy.id}`}>
                              <Button size="sm" className="mt-2 bg-amber-600 hover:bg-amber-700 text-white text-xs">
                                View {puppy.name}'s Profile
                                <ArrowRight className="w-3 h-3 ml-1" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-stone-100 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  <p className="text-sm text-stone-600">Finding your perfect matches...</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="e.g., 'I need a calm female puppy good with toddlers' or 'Active family wants confident male'"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isProcessing}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={isProcessing || !userInput.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* No Puppies Available Message */}
        {availablePuppies.length === 0 && (
          <div className="text-center p-6 bg-amber-50 rounded-lg border border-amber-200">
            <MessageCircle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-amber-800 mb-2">
              No Puppies Currently Available
            </h3>
            <p className="text-amber-700 mb-4">
              Don't worry! We have exciting litters planned. Join our VIP notification list to be the first to know when new puppies are available.
            </p>
            <Link to={createPageUrl("UpcomingLitters")}>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                Join Future Litters List
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}