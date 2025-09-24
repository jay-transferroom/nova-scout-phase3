
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ClubBadge } from '@/components/ui/club-badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';

const Profile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
      await refreshProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshProfile = async () => {
    setRefreshing(true);
    try {
      await refreshProfile();
      toast.success('Profile refreshed successfully');
    } catch (error) {
      console.error('Error refreshing profile:', error);
      toast.error('Failed to refresh profile');
    } finally {
      setRefreshing(false);
    }
  };

  const handleFixRole = async () => {
    if (user?.email !== 'hello@jayhughes.co.uk') return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'recruitment' })
        .eq('email', 'hello@jayhughes.co.uk');

      if (error) throw error;

      toast.success('Role updated to recruitment');
      await refreshProfile();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto pt-8 pb-16 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <div className="flex gap-2">
          {user?.email === 'hello@jayhughes.co.uk' && profile?.role === 'scout' && (
            <Button
              variant="outline"
              onClick={handleFixRole}
              disabled={loading}
              className="flex items-center gap-2 bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
            >
              Fix Role to Recruitment
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleRefreshProfile}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Profile
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details - All Chelsea F.C. staff
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-lg bg-blue-600 text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">
                  {firstName && lastName ? `${firstName} ${lastName}` : user?.email}
                </h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {profile?.role === 'recruitment' ? 'Scout Manager' : 'Scout'}
                  {user?.email === 'hello@jayhughes.co.uk' && profile?.role === 'scout' && (
                    <span className="ml-2 text-orange-600 font-medium">(Role needs fixing)</span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  Email: {profile?.email || user?.email}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-medium text-blue-600">Chelsea F.C.</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profile?.email || user?.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={profile?.role === 'recruitment' ? 'Scout Manager' : 'Scout'}
                  disabled
                  className="bg-muted capitalize"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="club">Club</Label>
                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <ClubBadge clubName="Chelsea F.C." size="md" />
                  <div>
                    <p className="text-sm text-blue-600">Premier League • England</p>
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
