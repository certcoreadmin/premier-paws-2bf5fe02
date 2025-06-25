
import React, { useState, useEffect } from "react";
import { Application } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gift } from "lucide-react"; // Added import for Gift icon

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  interview_scheduled: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
};

const ApplicationDetails = ({ app }) => (
    <DialogContent className="max-w-3xl">
        <DialogHeader><DialogTitle>Application from {app.applicant_name}</DialogTitle></DialogHeader>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto p-4">
            {Object.entries(app).map(([key, value]) => {
                if (typeof value === 'object' && value !== null) return null; // Skip objects like references for now
                const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                return (
                    <div key={key}>
                        <p className="font-semibold text-stone-700">{formattedKey}</p>
                        <p className="text-stone-600">{value?.toString() || 'N/A'}</p>
                    </div>
                )
            })}
        </div>
    </DialogContent>
)

export default function ApplicationManager() {
  const [applications, setApplications] = useState([]);

  useEffect(() => { loadApplications(); }, []);

  const loadApplications = async () => {
    const appList = await Application.list("-created_date");
    setApplications(appList);
  };
  
  const updateStatus = async (appId, status) => {
      await Application.update(appId, { status });
      await loadApplications();
  }

  return (
    <Card>
      <CardHeader><CardTitle>Adoption Applications</CardTitle></CardHeader>
      <CardContent>
         <div className="space-y-2">
            {applications.map(app => (
                <Card key={app.id}>
                    <CardContent className="p-3 flex items-center justify-between">
                       <div>
                            <div className="flex items-center gap-2"> {/* Added div for name and badge */}
                                <p className="font-semibold">{app.applicant_name}</p>
                                {app.referral_code && ( // Conditionally render referral badge
                                    <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300">
                                        <Gift className="w-3 h-3 mr-1.5" />
                                        Referred
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-stone-600">
                                Submitted: {format(new Date(app.created_date), 'MMM d, yyyy')}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className={statusColors[app.status]}>{app.status}</Badge>
                             <Dialog>
                                <DialogTrigger asChild><Button variant="outline" size="sm">View</Button></DialogTrigger>
                                <ApplicationDetails app={app} />
                            </Dialog>
                            <Select onValueChange={(status) => updateStatus(app.id, status)}>
                                <SelectTrigger className="w-[180px] h-9"><SelectValue placeholder="Update Status"/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="approved">Approve</SelectItem>
                                    <SelectItem value="interview_scheduled">Schedule Interview</SelectItem>
                                    <SelectItem value="rejected">Reject</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
