
import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Referral } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast";
import { Share2, Copy, Twitter, Facebook, Mail, Gift, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { createPageUrl } from '@/utils';
import { Badge } from '@/components/ui/badge';

const generateCode = (name) => {
  const namePart = name.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/gi, '');
  const randomPart = Math.random().toString(36).substring(2, 7);
  return `${namePart}-${randomPart}`;
};

export default function ReferralProgram({ user, onUserUpdate }) {
  const [referrals, setReferrals] = useState([]);
  const [referralLink, setReferralLink] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      if (!user.referral_code) {
        handleGenerateCode();
      } else {
        setReferralLink(`${window.location.origin}${createPageUrl('Puppies')}?ref=${user.referral_code}`);
        loadReferrals();
      }
    }
  }, [user]);

  const handleGenerateCode = async () => {
    const newCode = generateCode(user.full_name);
    try {
      await User.updateMyUserData({ referral_code: newCode });
      onUserUpdate(); // Notify parent component to refetch user
    } catch (error) {
      console.error("Error generating referral code:", error);
    }
  };

  const loadReferrals = async () => {
    try {
      const referralList = await Referral.filter({ referring_user_id: user.id }, '-sale_date');
      setReferrals(referralList);
    } catch (error) {
      console.error("Error loading referrals:", error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied to clipboard!",
      description: "Your referral link is ready to be shared.",
    });
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`We had the best experience getting our puppy from Golden Paws Doodles! If you're looking for the perfect Goldendoodle, check them out!`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${referralLink}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank');
  };
  
  const shareByEmail = () => {
    const subject = encodeURIComponent("You have to check out Golden Paws Doodles!");
    const body = encodeURIComponent(`I know you're looking for the perfect puppy, and I can't recommend Golden Paws Doodles enough. We had an amazing experience with them!\n\nHere's my personal referral link to learn more: ${referralLink}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const totalEarnings = referrals
    .filter(r => r.status === 'paid')
    .reduce((sum, r) => sum + (r.commission_amount || 0), 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-amber-600" />
            Share the Love: Your Referral Link
          </CardTitle>
          <CardDescription>
            Share your unique link with friends and family. When they adopt a puppy through your link, you'll receive a referral bonus as our thank you!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={referralLink} readOnly className="text-stone-600 bg-stone-100" />
            <Button onClick={copyToClipboard} variant="outline" size="icon">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={shareOnTwitter} variant="outline" className="flex-1 gap-2">
              <Twitter className="w-4 h-4 text-[#1DA1F2]" /> Share on X
            </Button>
            <Button onClick={shareOnFacebook} variant="outline" className="flex-1 gap-2">
              <Facebook className="w-4 h-4 text-[#1877F2]" /> Share on Facebook
            </Button>
            <Button onClick={shareByEmail} variant="outline" className="flex-1 gap-2">
              <Mail className="w-4 h-4" /> Share via Email
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Referral History</CardTitle>
          <CardDescription>
            You've earned a total of <span className="font-bold text-green-600">${totalEarnings.toFixed(2)}</span> from your referrals!
          </CardDescription>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <p className="text-stone-600 text-center py-8">You have no referral history yet. Start sharing your link!</p>
          ) : (
            <div className="space-y-3">
              {referrals.map(referral => (
                <div key={referral.id} className="flex justify-between items-center p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">Referral from {format(new Date(referral.sale_date), 'MMMM d, yyyy')}</p>
                    <p className="text-sm text-stone-600">Commission: <span className="font-semibold">${(referral.commission_amount || 0).toFixed(2)}</span></p>
                  </div>
                  <Badge className={
                    referral.status === 'paid' ? 'bg-green-100 text-green-800' :
                    referral.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-stone-100 text-stone-800'
                  }>
                    {referral.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
