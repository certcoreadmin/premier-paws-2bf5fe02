import React, { useState, useEffect } from "react";
import { Contract } from "@/api/entities";
import { SignedContract } from "@/api/entities";
import { User } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Save, FileText, Users, Upload, Eye, Send } from "lucide-react";
import { format } from "date-fns";

export default function ContractManager() {
  const [contracts, setContracts] = useState([]);
  const [signedContracts, setSignedContracts] = useState([]);
  const [owners, setOwners] = useState([]);
  const [isAddingContract, setIsAddingContract] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    file_url: "",
    status: "draft",
    version: "",
    notes: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [contractList, signedList, ownerList] = await Promise.all([
        Contract.list("-created_date"),
        SignedContract.list("-created_date"),
        User.filter({ access_level: "owner" })
      ]);
      setContracts(contractList);
      setSignedContracts(signedList);
      setOwners(ownerList);
    } catch (error) {
      console.error("Error loading contract data:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, file_url }));
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading contract file");
    }
    setIsUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingContract) {
        await Contract.update(editingContract.id, formData);
      } else {
        await Contract.create(formData);
      }
      await loadData();
      resetForm();
      alert(editingContract ? "Contract updated successfully!" : "Contract created successfully!");
    } catch (error) {
      console.error("Error saving contract:", error);
      alert("Error saving contract");
    }
  };

  const handleEdit = (contract) => {
    setEditingContract(contract);
    setFormData(contract);
    setIsAddingContract(true);
  };

  const handleDelete = async (contractId) => {
    if (!confirm("Are you sure you want to delete this contract?")) return;
    
    try {
      await Contract.delete(contractId);
      await loadData();
    } catch (error) {
      console.error("Error deleting contract:", error);
      alert("Error deleting contract");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      file_url: "",
      status: "draft",
      version: "",
      notes: ""
    });
    setEditingContract(null);
    setIsAddingContract(false);
  };

  const assignContractToOwner = async (contractId, userId) => {
    try {
      await SignedContract.create({
        contract_id: contractId,
        user_id: userId,
        status: "pending"
      });
      await loadData();
      alert("Contract assigned to owner successfully!");
    } catch (error) {
      console.error("Error assigning contract:", error);
      alert("Error assigning contract");
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      active: "bg-green-100 text-green-800",
      archived: "bg-stone-100 text-stone-800",
      pending: "bg-yellow-100 text-yellow-800",
      signed: "bg-blue-100 text-blue-800",
      refused: "bg-red-100 text-red-800"
    };
    return <Badge className={colors[status]}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="contracts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contracts">
            <FileText className="w-4 h-4 mr-2" />
            Contract Templates ({contracts.length})
          </TabsTrigger>
          <TabsTrigger value="signed">
            <Users className="w-4 h-4 mr-2" />
            Signed Contracts ({signedContracts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contracts" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Contract Templates</h3>
            <Button onClick={() => setIsAddingContract(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Contract Template
            </Button>
          </div>

          {isAddingContract && (
            <Card>
              <CardHeader>
                <CardTitle>{editingContract ? "Edit Contract" : "Add New Contract Template"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Contract Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        placeholder="e.g., Puppy Adoption Contract"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="version">Version</Label>
                      <Input
                        id="version"
                        value={formData.version}
                        onChange={(e) => handleInputChange("version", e.target.value)}
                        placeholder="e.g., v1.0, 2024-06"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="file_upload">Contract File (PDF) *</Label>
                    <Input
                      id="file_upload"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
                      disabled={isUploading}
                    />
                    {isUploading && <p className="text-sm text-stone-500">Uploading...</p>}
                    {formData.file_url && (
                      <div className="mt-2">
                        <a href={formData.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View uploaded contract
                        </a>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Internal notes about this contract..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={isUploading}>
                      <Save className="w-4 h-4 mr-2" />
                      {editingContract ? "Update Contract" : "Create Contract"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {contracts.map((contract) => (
              <Card key={contract.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-stone-800">{contract.title}</h4>
                        {getStatusBadge(contract.status)}
                        {contract.version && (
                          <Badge variant="outline">{contract.version}</Badge>
                        )}
                      </div>
                      {contract.notes && (
                        <p className="text-stone-600 text-sm mb-2">{contract.notes}</p>
                      )}
                      <p className="text-stone-500 text-xs">
                        Created: {format(new Date(contract.created_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={contract.file_url} target="_blank" rel="noopener noreferrer">
                          <Eye className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(contract)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(contract.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                      <Select onValueChange={(userId) => assignContractToOwner(contract.id, userId)}>
                        <SelectTrigger className="w-[150px] h-8">
                          <SelectValue placeholder="Assign to..." />
                        </SelectTrigger>
                        <SelectContent>
                          {owners.map((owner) => (
                            <SelectItem key={owner.id} value={owner.id}>
                              {owner.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="signed" className="space-y-6">
          <h3 className="text-lg font-semibold">Contract Assignments & Signatures</h3>
          
          <div className="space-y-4">
            {signedContracts.map((signedContract) => {
              const contract = contracts.find(c => c.id === signedContract.contract_id);
              const owner = owners.find(o => o.id === signedContract.user_id);
              
              return (
                <Card key={signedContract.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-stone-800">
                            {contract?.title || "Unknown Contract"}
                          </h4>
                          {getStatusBadge(signedContract.status)}
                        </div>
                        <p className="text-stone-600 text-sm mb-1">
                          Owner: {owner?.full_name || "Unknown Owner"} ({owner?.email})
                        </p>
                        <p className="text-stone-500 text-xs">
                          Assigned: {format(new Date(signedContract.created_date), 'MMM d, yyyy')}
                        </p>
                        {signedContract.signed_date && (
                          <p className="text-stone-500 text-xs">
                            Signed: {format(new Date(signedContract.signed_date), 'MMM d, yyyy')}
                          </p>
                        )}
                        {signedContract.refusal_reason && (
                          <p className="text-red-600 text-sm mt-1">
                            Refusal reason: {signedContract.refusal_reason}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {contract?.file_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={contract.file_url} target="_blank" rel="noopener noreferrer">
                              <Eye className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}