
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUserPermissions, useUpdateUserPermission } from '@/hooks/useUserPermissions';
import { toast } from 'sonner';

interface UserPermissionsDialogProps {
  userId: string | null;
  userName: string;
}

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

export const UserPermissionsDialog = ({ userId, userName }: UserPermissionsDialogProps) => {
  const { data: userPermissions } = useUserPermissions(userId || undefined);
  const updateUserPermission = useUpdateUserPermission();

  const handlePermissionChange = async (permission: string, enabled: boolean) => {
    if (!userId) return;
    
    try {
      await updateUserPermission.mutateAsync({
        userId,
        permission,
        enabled
      });
      toast.success('Permission updated successfully');
    } catch (error) {
      console.error('Error updating permission:', error);
      toast.error('Failed to update permission');
    }
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Manage Permissions</DialogTitle>
        <DialogDescription>
          Configure which features {userName} can access.
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
  );
};
