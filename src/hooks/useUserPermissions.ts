
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface UserPermission {
  id: string;
  user_id: string;
  permission: string;
  enabled: boolean;
}

export const useUserPermissions = (userId?: string) => {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['user-permissions', userId],
    queryFn: async (): Promise<UserPermission[]> => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId && profile?.role === 'recruitment',
  });
};

export const useUpdateUserPermission = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, permission, enabled }: { userId: string; permission: string; enabled: boolean }) => {
      const { error } = await supabase
        .from('user_permissions')
        .upsert({
          user_id: userId,
          permission,
          enabled
        });
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions', variables.userId] });
    },
  });
};

export const useMyPermissions = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['my-permissions', user?.id],
    queryFn: async (): Promise<Record<string, boolean>> => {
      if (!user?.id) return {};
      
      const { data, error } = await supabase
        .from('user_permissions')
        .select('permission, enabled')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const permissions: Record<string, boolean> = {};
      data?.forEach(perm => {
        permissions[perm.permission] = perm.enabled;
      });
      
      return permissions;
    },
    enabled: !!user?.id,
  });
};
