
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';
import { UserManagementHeader } from '@/components/user-management/UserManagementHeader';
import { UserTable } from '@/components/user-management/UserTable';

interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  club_id: string | null;
  created_at: string;
  clubs?: {
    id: string;
    name: string;
  };
}

const UserManagement = () => {
  const { profile } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  if (profile?.role !== 'recruitment') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users from profiles table...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          clubs (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      console.log('Users query result:', { data, error });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      console.log('Successfully fetched users:', data?.length || 0);
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      toast.success('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const deleteUser = async (userId: string) => {
    setIsDeletingUser(true);
    try {
      // Call the edge function to delete the user with proper permissions
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { userId }
      });

      if (error) {
        console.error('Error calling delete-user function:', error);
        throw new Error(error.message || 'Failed to delete user');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      // Remove from local state
      setUsers(users.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setIsDeletingUser(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto pt-8 pb-16 max-w-6xl">
        <div className="text-center">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-8 pb-16 max-w-6xl">
      <UserManagementHeader onUserCreated={fetchUsers} />

      {users.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Users Found</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No users found in the system. This might be due to:
              </p>
              <ul className="text-left text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                <li>• Database cleanup removed user profiles</li>
                <li>• User profiles need to be recreated</li>
                <li>• Authentication trigger not working</li>
              </ul>
              <Button onClick={fetchUsers} variant="outline">
                Refresh Users
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Users ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <UserTable
              users={users}
              currentUserId={profile?.id}
              onUpdateRole={updateUserRole}
              onDeleteUser={deleteUser}
              isDeletingUser={isDeletingUser}
              selectedUserId={selectedUserId}
              onSelectUser={setSelectedUserId}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserManagement;
