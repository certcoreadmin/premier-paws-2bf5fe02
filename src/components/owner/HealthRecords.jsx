
import React, { useState, useEffect } from 'react';
import { HealthRecord, UploadFile } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Shield, Save, X, Download } from 'lucide-react';
import { format } from 'date-fns';

export default function HealthRecords({ puppyId }) {
  const [records, setRecords] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newRecord, setNewRecord] = useState({
    title: '',
    description: '',
    date: '',
    record_type: 'vet_visit',
    file_url: '',
    vet_name: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadRecords();
  }, [puppyId]);

  const loadRecords = async () => {
    if (!puppyId) return;
    try {
      const puppyRecords = await HealthRecord.filter({ dog_id: puppyId }, '-date');
      setRecords(puppyRecords);
    } catch (error) {
      console.error('Error loading health records:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setNewRecord(prev => ({ ...prev, [field]: value }));
  };
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      handleInputChange('file_url', file_url);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("There was an error uploading your file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await HealthRecord.create({ ...newRecord, dog_id: puppyId });
      resetForm();
      await loadRecords();
    } catch (error) {
      console.error('Error saving record:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this health record?')) return;
    try {
      await HealthRecord.delete(id);
      await loadRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setNewRecord({ title: '', description: '', date: '', record_type: 'vet_visit', file_url: '', vet_name: '' });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-600" />
          Health Records
        </CardTitle>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Record
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isAdding && (
          <Card className="my-4 bg-stone-50">
            <CardContent className="p-6 space-y-4">
              <Input 
                placeholder="Record Title (e.g., Annual Checkup)" 
                value={newRecord.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
              <div className="grid md:grid-cols-2 gap-4">
                <Input 
                  type="date"
                  value={newRecord.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
                <Select value={newRecord.record_type} onValueChange={(value) => handleInputChange('record_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Record Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vet_visit">Vet Visit</SelectItem>
                    <SelectItem value="vaccination">Vaccination</SelectItem>
                    <SelectItem value="health_certificate">Health Certificate</SelectItem>
                    <SelectItem value="insurance">Insurance Document</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input 
                placeholder="Veterinarian's Name (optional)"
                value={newRecord.vet_name}
                onChange={(e) => handleInputChange('vet_name', e.target.value)}
              />
              <Textarea 
                placeholder="Description or Notes" 
                value={newRecord.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
              <div>
                <label className="text-sm font-medium">Upload Document</label>
                <Input type="file" onChange={handleFileChange} disabled={isUploading} />
                {isUploading && <p className="text-sm text-stone-500">Uploading...</p>}
                {newRecord.file_url && <p className="text-sm text-green-600">File uploaded successfully!</p>}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isUploading}><Save className="w-4 h-4 mr-2" /> Save</Button>
                <Button variant="outline" onClick={resetForm}><X className="w-4 h-4 mr-2" /> Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="space-y-4">
          {records.length === 0 && !isAdding && (
            <p className="text-stone-500 text-center py-4">No health records uploaded yet.</p>
          )}
          {records.map((record) => (
            <Card key={record.id}>
              <CardContent className="p-4 flex justify-between items-start">
                <div>
                  <p className="font-semibold text-stone-800">{record.title}</p>
                  <p className="text-sm text-stone-600">{record.description}</p>
                  <p className="text-xs text-stone-500 mt-2">
                    {format(new Date(record.date), 'MMMM d, yyyy')}
                    {record.vet_name && ` • Dr. ${record.vet_name}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  {record.file_url && (
                    <Button variant="ghost" size="icon" asChild>
                      <a href={record.file_url} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 text-blue-600" />
                      </a>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(record.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
