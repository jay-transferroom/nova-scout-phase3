
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreateUserDialogProps {
  onUserCreated: () => void;
}

export const CreateUserDialog = ({ onUserCreated }: CreateUserDialogProps) => {
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserFirstName, setNewUserFirstName] = useState('');
  const [newUserLastName, setNewUserLastName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'scout' | 'recruitment'>('scout');
  const [isCreatingUser, setIsCreatingUser] = useState(false);

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
      onUserCreated();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Failed to create user');
    } finally {
      setIsCreatingUser(false);
    }
  };

  return (
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
  );
};
