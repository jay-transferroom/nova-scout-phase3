
import { supabase } from '@/integrations/supabase/client';

export const ensureDefaultPermissions = async (userId: string): Promise<void> => {
  try {
    // Check if user already has permissions
    const { data: existingPermissions } = await supabase
      .from('user_permissions')
      .select('permission')
      .eq('user_id', userId);

    const defaultPermissions = [
      'dashboard', 'reports', 'requirements', 'pitches', 
      'scouting_tasks', 'upcoming_matches', 'data_import',
      'templates', 'user_management'
    ];

    const existingPermissionNames = existingPermissions?.map(p => p.permission) || [];
    const missingPermissions = defaultPermissions.filter(p => !existingPermissionNames.includes(p));

    if (missingPermissions.length > 0) {
      console.log('Creating missing permissions for recruitment user:', missingPermissions);
      
      const permissionsToInsert = missingPermissions.map(permission => ({
        user_id: userId,
        permission,
        enabled: true
      }));

      const { error } = await supabase
        .from('user_permissions')
        .insert(permissionsToInsert);

      if (error) {
        console.error('Error creating default permissions:', error);
      } else {
        console.log('Default permissions created successfully');
      }
    }
  } catch (error) {
    console.error('Error ensuring default permissions:', error);
  }
};
