
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { CreateUserDialog } from './CreateUserDialog';

interface UserManagementHeaderProps {
  onUserCreated: () => void;
}

export const UserManagementHeader = ({ onUserCreated }: UserManagementHeaderProps) => {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">Manage users, roles, and permissions</p>
      </div>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Create User
          </Button>
        </DialogTrigger>
        <CreateUserDialog onUserCreated={onUserCreated} />
      </Dialog>
    </div>
  );
};
