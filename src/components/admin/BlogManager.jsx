import React, { useState, useEffect } from "react";
import { BlogPost } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Save, HelpCircle, Eye } from "lucide-react";
import { format } from "date-fns";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// A simple slugify function
const slugify = (text) =>
  text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -

const BlogForm = ({ post, onSave, onCancel }) => {
  const [formData, setFormData] = useState(post || {
    title: "", slug: "", content: "", excerpt: "", featured_image: "",
    category: "breeder_updates", tags: [], published: false, featured: false
  });
  const [showMarkdownHelp, setShowMarkdownHelp] = useState(false);

  useEffect(() => {
    if (post) setFormData(post);
  }, [post]);

  const handleInputChange = (field, value) => {
    let newFormData = { ...formData, [field]: value };
    if (field === 'title') {
      newFormData.slug = slugify(value);
    }
    setFormData(newFormData);
  };
  
  const handleImageUpload = async (file) => {
     try {
        const { file_url } = await UploadFile({ file });
        handleInputChange('featured_image', file_url);
      } catch (error) { console.error("Upload error", error); }
  }

  const insertSampleContent = () => {
    const sampleMarkdown = `# Welcome to Our Golden Retriever Family!

We're excited to share some wonderful news about our latest litter and some helpful tips for new puppy families.

## What Makes Our Puppies Special

Our puppies are raised with:

- **Early socialization** starting from 3 weeks old
- **Health testing** for all parent dogs
- **Premium nutrition** and veterinary care
- **Love and attention** from our family

### Health Clearances

All our parent dogs have completed:

1. OFA Hip and Elbow clearances
2. Heart clearances by board-certified cardiologist
3. Eye exams by certified ophthalmologist
4. Full Embark genetic panel (200+ tests)

> "The best way to predict your puppy's future health is to know the health of their parents." - Dr. Smith, Our Veterinarian

## Puppy Care Tips

Here are some essential tips for your new puppy:

**Feeding Schedule:**
- 8-12 weeks: 4 meals per day
- 3-6 months: 3 meals per day
- 6+ months: 2 meals per day

**Training Basics:**
- Start with basic commands: sit, stay, come
- Use positive reinforcement
- Be consistent with rules
- Socialize early and often

### Important Links

- [Puppy Training Guide](https://example.com/training)
- [Recommended Products](https://example.com/products)
- [Contact Us](https://example.com/contact)

---

*Remember: Every puppy is unique, and we're here to support you throughout your dog's entire life!*

**Questions?** Feel free to reach out to us at any time.`;

    setFormData(prev => ({ ...prev, content: sampleMarkdown }));
  };

  const submit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
     <Card className="my-6 bg-stone-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{post ? `Editing Post` : "Create New Post"}</span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={insertSampleContent}
              className="text-amber-600 border-amber-600 hover:bg-amber-50"
            >
              <Eye className="w-4 h-4 mr-2" />
              Insert Sample
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <Input placeholder="Post Title" value={formData.title} onChange={e => handleInputChange('title', e.target.value)} required />
          <Input placeholder="URL Slug" value={formData.slug} onChange={e => handleInputChange('slug', e.target.value)} required />
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Content (Markdown supported)</Label>
              <Collapsible open={showMarkdownHelp} onOpenChange={setShowMarkdownHelp}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" type="button">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Markdown Help
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4 text-sm">
                      <h4 className="font-semibold mb-2 text-blue-800">Markdown Formatting Guide:</h4>
                      <div className="grid md:grid-cols-2 gap-4 text-blue-700">
                        <div>
                          <p><strong>Headers:</strong></p>
                          <code className="block bg-white p-1 rounded mb-2">
                            # Big Header<br/>
                            ## Medium Header<br/>
                            ### Small Header
                          </code>
                          
                          <p><strong>Text Formatting:</strong></p>
                          <code className="block bg-white p-1 rounded mb-2">
                            **Bold text**<br/>
                            *Italic text*<br/>
                            `Code text`
                          </code>
                        </div>
                        
                        <div>
                          <p><strong>Lists:</strong></p>
                          <code className="block bg-white p-1 rounded mb-2">
                            - Bullet point<br/>
                            1. Numbered item<br/>
                            2. Another item
                          </code>
                          
                          <p><strong>Links & Images:</strong></p>
                          <code className="block bg-white p-1 rounded mb-2">
                            [Link text](https://url.com)<br/>
                            ![Image alt](image-url.jpg)
                          </code>
                          
                          <p><strong>Quote:</strong></p>
                          <code className="block bg-white p-1 rounded">
                            > This is a quote
                          </code>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            </div>
            <Textarea 
              placeholder="Write your blog post content here using Markdown formatting..." 
              value={formData.content} 
              onChange={e => handleInputChange('content', e.target.value)} 
              rows={12}
              className="font-mono text-sm"
            />
          </div>
          
          <Textarea placeholder="Excerpt (optional summary)" value={formData.excerpt} onChange={e => handleInputChange('excerpt', e.target.value)} rows={3} />
          <div><Label>Featured Image</Label><Input type="file" accept="image/*" onChange={e => handleImageUpload(e.target.files[0])} />
            {formData.featured_image && <img src={formData.featured_image} className="w-32 h-auto mt-2 rounded" />}
          </div>
          <Select value={formData.category} onValueChange={v => handleInputChange('category', v)}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>
                  <SelectItem value="breed_education">Breed Education</SelectItem>
                  <SelectItem value="puppy_care">Puppy Care</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="breeder_updates">Breeder Updates</SelectItem>
              </SelectContent>
          </Select>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2"><Checkbox checked={formData.published} onCheckedChange={c => handleInputChange('published', c)} id="published"/><Label htmlFor="published">Published</Label></div>
            <div className="flex items-center gap-2"><Checkbox checked={formData.featured} onCheckedChange={c => handleInputChange('featured', c)} id="featured"/><Label htmlFor="featured">Featured</Label></div>
          </div>
          <div className="flex gap-4">
            <Button type="submit"><Save className="w-4 h-4 mr-2" />Save Post</Button>
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </CardContent>
     </Card>
  )
}

export default function BlogManager() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => { loadPosts(); }, []);

  const loadPosts = async () => {
    const postList = await BlogPost.list("-created_date");
    setPosts(postList);
  };

  const handleSave = async (postData) => {
    try {
      if (editingPost) {
        await BlogPost.update(editingPost.id, postData);
      } else {
        await BlogPost.create(postData);
      }
      setEditingPost(null);
      setIsAdding(false);
      await loadPosts();
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await BlogPost.delete(postId);
      await loadPosts();
    }
  };

  return (
    <Card>
       <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Blog Posts</CardTitle>
        <Button onClick={() => { setIsAdding(true); setEditingPost(null); }}><Plus className="w-4 h-4 mr-2" /> New Post</Button>
      </CardHeader>
      <CardContent>
        {isAdding && <BlogForm onSave={handleSave} onCancel={() => setIsAdding(false)} />}
        {editingPost && <BlogForm post={editingPost} onSave={handleSave} onCancel={() => setEditingPost(null)} />}
        
        <div className="space-y-2">
            {posts.map(post => (
                <Card key={post.id}>
                    <CardContent className="p-3 flex items-center justify-between">
                        <div>
                            <p className="font-semibold">{post.title}</p>
                            <p className="text-sm text-stone-600">
                                {post.published ? 'Published' : 'Draft'} • {format(new Date(post.created_date), 'MMM d, yyyy')}
                            </p>
                        </div>
                         <div className="flex items-center gap-2">
                             <Button variant="outline" size="sm" onClick={() => setEditingPost(post)}><Edit className="w-3 h-3 mr-1"/>Edit</Button>
                             <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}><Trash2 className="w-4 h-4 text-red-500"/></Button>
                         </div>
                    </CardContent>
                </Card>
            ))}
        </div>

      </CardContent>
    </Card>
  );
}