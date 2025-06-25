import React, { useState, useEffect } from 'react';
import { Referral } from '@/api/entities';
import { Application } from '@/api/entities';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Gift, Check, X, Circle, MoreHorizontal, Edit, Trash2, Save } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ReferralManager() {
  const [referrals, setReferrals] = useState([]);
  const [applications, setApplications] = useState([]);
  const [owners, setOwners] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newReferral, setNewReferral] = useState({
    referred_application_id: '',
    referring_user_id: '',
    commission_amount: 250, // Default commission
    sale_date: format(new Date(), 'yyyy-MM-dd'),
    status: 'pending_payment'
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [referralList, appList, ownerList] = await Promise.all([
        Referral.list('-sale_date'),
        // Only fetch applications with a referral code that aren't already linked
        Application.filter({ referral_code: { '$ne': null } }), 
        User.filter({ access_level: 'owner' })
      ]);
      setReferrals(referralList);
      setApplications(appList);
      setOwners(ownerList);
    } catch (error) {
      console.error("Error loading referral data:", error);
    }
  };

  const handleCreateReferral = async (e) => {
    e.preventDefault();
    try {
      await Referral.create(newReferral);
      toast({ title: "Referral created successfully!" });
      setIsAdding(false);
      setNewReferral({
        referred_application_id: '',
        referring_user_id: '',
        commission_amount: 250,
        sale_date: format(new Date(), 'yyyy-MM-dd'),
        status: 'pending_payment'
      });
      loadData();
    } catch (error) {
      toast({ title: "Error creating referral", variant: "destructive" });
      console.error(error);
    }
  };
  
  const updateStatus = async (id, status) => {
    try {
      await Referral.update(id, { status });
      toast({ title: `Referral status updated to ${status.replace('_',' ')}.` });
      loadData();
    } catch (error) {
      toast({ title: "Error updating status", variant: "destructive" });
    }
  }

  const getApplicationInfo = (appId) => applications.find(a => a.id === appId);
  const getOwnerInfo = (userId) => owners.find(o => o.id === userId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Referrals</CardTitle>
          <CardDescription>Review, approve, and track referral commissions.</CardDescription>
        </CardHeader>
        <CardContent>
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)}>Manually Add Referral</Button>
          )}
          {isAdding && (
            <form onSubmit={handleCreateReferral} className="p-4 border rounded-lg space-y-4">
              <h3 className="font-medium">Create New Referral</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label>Referred Customer (Application)</label>
                  <Select onValueChange={v => setNewReferral({...newReferral, referred_application_id: v})}>
                    <SelectTrigger><SelectValue placeholder="Select Application..."/></SelectTrigger>
                    <SelectContent>
                      {applications.map(app => (
                        <SelectItem key={app.id} value={app.id}>{app.applicant_name} ({app.email})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label>Referring Owner</label>
                  <Select onValueChange={v => setNewReferral({...newReferral, referring_user_id: v})}>
                    <SelectTrigger><SelectValue placeholder="Select Owner..."/></SelectTrigger>
                    <SelectContent>
                      {owners.map(owner => (
                        <SelectItem key={owner.id} value={owner.id}>{owner.full_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-4">
                <Button type="submit">Save Referral</Button>
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referral History ({referrals.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {referrals.map(referral => {
              const application = getApplicationInfo(referral.referred_application_id);
              const owner = getOwnerInfo(referral.referring_user_id);
              
              if (!application || !owner) return null;

              return (
                <Card key={referral.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p>
                        <span className="font-semibold">{owner.full_name}</span> referred <span className="font-semibold">{application.applicant_name}</span>
                      </p>
                      <p className="text-sm text-stone-600">
                        Sale Date: {format(new Date(referral.sale_date), 'MM/dd/yyyy')} | Commission: <span className="font-medium text-green-600">${referral.commission_amount}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                       <Badge className={
                        referral.status === 'paid' ? 'bg-green-100 text-green-800' :
                        referral.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-stone-100 text-stone-800'
                      }>
                        {referral.status.replace(/_/g, ' ')}
                      </Badge>
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal/></Button></DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => updateStatus(referral.id, 'pending_payment')}>
                                <Circle className="w-4 h-4 mr-2"/> Mark as Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(referral.id, 'paid')}>
                                <Check className="w-4 h-4 mr-2"/> Mark as Paid
                            </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => updateStatus(referral.id, 'cancelled')}>
                                <X className="w-4 h-4 mr-2"/> Cancel Referral
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                       </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}