
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { MoreHorizontal, SettingsIcon, Trash2 } from 'lucide-react';
import { UserPermissionsDialog } from './UserPermissionsDialog';

interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  club_id: string | null;
  created_at: string;
}

interface UserTableProps {
  users: Profile[];
  currentUserId?: string;
  onUpdateRole: (userId: string, role: string) => void;
  onDeleteUser: (userId: string) => void;
  isDeletingUser: boolean;
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
}

export const UserTable = ({ 
  users, 
  currentUserId, 
  onUpdateRole, 
  onDeleteUser, 
  isDeletingUser,
  selectedUserId,
  onSelectUser
}: UserTableProps) => {
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
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
              <Badge variant={
                user.role === 'recruitment' ? 'default' : 
                user.role === 'director' ? 'destructive' : 
                'secondary'
              }>
                {user.role}
              </Badge>
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
                    onClick={() => onUpdateRole(user.id, 'scout')}
                    disabled={user.role === 'scout'}
                  >
                    Make Scout
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onUpdateRole(user.id, 'recruitment')}
                    disabled={user.role === 'recruitment'}
                  >
                    Make Recruitment
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onUpdateRole(user.id, 'director')}
                    disabled={user.role === 'director'}
                  >
                    Make Director
                  </DropdownMenuItem>
                  <Dialog>
                    <DialogTrigger asChild>
                      <DropdownMenuItem 
                        onSelect={(e) => {
                          e.preventDefault();
                          onSelectUser(user.id);
                        }}
                      >
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        Manage Permissions
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <UserPermissionsDialog 
                      userId={selectedUserId}
                      userName={getDisplayName(user)}
                    />
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem 
                        onSelect={(e) => e.preventDefault()}
                        className="text-destructive focus:text-destructive"
                        disabled={user.id === currentUserId}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete User
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {getDisplayName(user)}? This will permanently remove their account and all associated data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDeleteUser(user.id)}
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
  );
};
