import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MoreHorizontal, UserPlus, Settings as SettingsIcon, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';
import { useClubs, useUpdateUserClub } from '@/hooks/useClubs';
import { useUserPermissions, useUpdateUserPermission } from '@/hooks/useUserPermissions';

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
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserFirstName, setNewUserFirstName] = useState('');
  const [newUserLastName, setNewUserLastName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'scout' | 'recruitment'>('scout');
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  
  const { data: clubs } = useClubs();
  const { data: userPermissions } = useUserPermissions(selectedUserId || undefined);
  const updateUserClub = useUpdateUserClub();
  const updateUserPermission = useUpdateUserPermission();

  if (profile?.role !== 'recruitment') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
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

      if (error) throw error;
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
      // Delete the user's profile record
      // This will also clean up related data due to foreign key constraints
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      // Remove from local state
      setUsers(users.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user. The user profile has been removed, but they may still be able to log in.');
    } finally {
      setIsDeletingUser(false);
    }
  };

  const handleClubChange = async (userId: string, clubId: string | null) => {
    try {
      await updateUserClub.mutateAsync({ userId, clubId });
      await fetchUsers();
      toast.success('User club updated successfully');
    } catch (error) {
      console.error('Error updating user club:', error);
      toast.error('Failed to update user club');
    }
  };

  const createUser = async () => {
    if (!newUserEmail || !newUserPassword) {
      toast.error('Email and password are required');
      return;
    }

    setIsCreatingUser(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: newUserEmail,
        password: newUserPassword,
        options: {
          data: {
            first_name: newUserFirstName,
            last_name: newUserLastName,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Update role
        await supabase
          .from('profiles')
          .update({ role: newUserRole })
          .eq('id', data.user.id);

        // Create default permissions
        const defaultPermissions = [
          'dashboard', 'reports', 'requirements', 'pitches', 
          'scouting_tasks', 'upcoming_matches', 'data_import'
        ];

        if (newUserRole === 'recruitment') {
          defaultPermissions.push('templates', 'user_management');
        }

        for (const permission of defaultPermissions) {
          await supabase
            .from('user_permissions')
            .insert({
              user_id: data.user.id,
              permission,
              enabled: true
            });
        }
      }

      toast.success('User created successfully');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserFirstName('');
      setNewUserLastName('');
      setNewUserRole('scout');
      await fetchUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Failed to create user');
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handlePermissionChange = async (permission: string, enabled: boolean) => {
    if (!selectedUserId) return;
    
    try {
      await updateUserPermission.mutateAsync({
        userId: selectedUserId,
        permission,
        enabled
      });
      toast.success('Permission updated successfully');
    } catch (error) {
      console.error('Error updating permission:', error);
      toast.error('Failed to update permission');
    }
  };

  const getInitials = (user: Profile) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user.first_name) {
      return user.first_name[0].toUpperCase();
    }
    return user.email[0].toUpperCase();
  };

  const getDisplayName = (user: Profile) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user.first_name) {
      return user.first_name;
    }
    return user.email;
  };

  const availablePermissions = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'reports', label: 'Player Reports' },
    { key: 'requirements', label: 'Requirements' },
    { key: 'pitches', label: 'Player Pitches' },
    { key: 'scouting_tasks', label: 'Scouting Tasks' },
    { key: 'upcoming_matches', label: 'Upcoming Matches' },
    { key: 'data_import', label: 'Data Import' },
    { key: 'templates', label: 'Template Admin' },
    { key: 'user_management', label: 'User Management' },
  ];

  if (loading) {
    return (
      <div className="container mx-auto pt-8 pb-16 max-w-6xl">
        <div className="text-center">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-8 pb-16 max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage users, roles, clubs, and permissions</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Create a new user account with role and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={newUserFirstName}
                    onChange={(e) => setNewUserFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={newUserLastName}
                    onChange={(e) => setNewUserLastName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={newUserRole} onValueChange={(value: 'scout' | 'recruitment') => setNewUserRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scout">Scout</SelectItem>
                    <SelectItem value="recruitment">Recruitment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={createUser} disabled={isCreatingUser}>
                {isCreatingUser ? 'Creating...' : 'Create User'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Club</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{getDisplayName(user)}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'recruitment' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={user.club_id || 'none'} 
                      onValueChange={(value) => handleClubChange(user.id, value === 'none' ? null : value)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select club" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Club</SelectItem>
                        {clubs?.map((club) => (
                          <SelectItem key={club.id} value={club.id}>
                            {club.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => updateUserRole(user.id, 'scout')}
                          disabled={user.role === 'scout'}
                        >
                          Make Scout
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateUserRole(user.id, 'recruitment')}
                          disabled={user.role === 'recruitment'}
                        >
                          Make Recruitment
                        </DropdownMenuItem>
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem 
                              onSelect={(e) => {
                                e.preventDefault();
                                setSelectedUserId(user.id);
                              }}
                            >
                              <SettingsIcon className="mr-2 h-4 w-4" />
                              Manage Permissions
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Manage Permissions</DialogTitle>
                              <DialogDescription>
                                Configure which features {getDisplayName(user)} can access.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              {availablePermissions.map((perm) => {
                                const userPerm = userPermissions?.find(up => up.permission === perm.key);
                                const isEnabled = userPerm?.enabled !== false;
                                
                                return (
                                  <div key={perm.key} className="flex items-center justify-between">
                                    <Label htmlFor={perm.key}>{perm.label}</Label>
                                    <Switch
                                      id={perm.key}
                                      checked={isEnabled}
                                      onCheckedChange={(checked) => handlePermissionChange(perm.key, checked)}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem 
                              onSelect={(e) => e.preventDefault()}
                              className="text-destructive focus:text-destructive"
                              disabled={user.id === profile?.id}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {getDisplayName(user)}? This will remove their profile and access to the system, but they may still be able to create a new account with the same email.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteUser(user.id)}
                                disabled={isDeletingUser}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {isDeletingUser ? 'Deleting...' : 'Delete User'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
