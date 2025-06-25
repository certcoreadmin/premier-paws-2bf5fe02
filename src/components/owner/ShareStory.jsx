
import React, { useState } from 'react';
import { Testimonial } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send, CheckCircle, Upload } from 'lucide-react';

export default function ShareStory({ puppy, user }) {
  const [story, setStory] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setPhotoUrl(file_url);
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Error uploading photo.");
      setFileName(''); // Clear file name on error
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!story) {
      alert("Please write your story before submitting.");
      return;
    }
    setIsSubmitting(true);
    try {
      await Testimonial.create({
        owner_name: user.full_name,
        dog_name: puppy.name,
        story: story,
        photo_url: photoUrl,
        user_id: user.id
      });
      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      alert("There was an error submitting your story. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="text-center">
        <CardContent className="p-10">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-stone-800">Thank You!</h2>
          <p className="text-stone-600 mt-2">
            Your story has been submitted for review. We love hearing from our Golden Paws families!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-teal-600" />
          Share Your Story
        </CardTitle>
        <p className="text-stone-600">
          We'd love to hear about your journey with {puppy.name}! Your story might be featured on our testimonials page.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="story" className="font-medium text-stone-700">Your Story & Experience</label>
            <Textarea
              id="story"
              rows={8}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder={`Tell us all about ${puppy.name} and your experience with Golden Paws Doodles...`}
              required
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="photo-upload" className="font-medium text-stone-700">Add a Photo (optional)</label>
            <div className="mt-1 flex items-center gap-4">
                <Button asChild variant="outline">
                    <label htmlFor="photo-upload" className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        {isUploading ? "Uploading..." : "Choose File"}
                    </label>
                </Button>
                <Input 
                    id="photo-upload" 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="hidden"
                />
                {fileName && <span className="text-sm text-stone-600">{fileName}</span>}
            </div>
            {photoUrl && <img src={photoUrl} alt="Preview" className="w-24 h-24 object-cover rounded-lg mt-4 shadow-md" />}
          </div>
          <div className="pt-2">
            <Button type="submit" disabled={isSubmitting || isUploading} size="lg">
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Submit My Story"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
