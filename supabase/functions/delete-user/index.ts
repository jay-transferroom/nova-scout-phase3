
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create supabase client with service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    console.log(`Starting deletion process for user: ${userId}`)

    // Delete related records first to avoid foreign key constraint violations
    
    // 1. Delete scouting assignments where user is assigned as scout
    const { error: scoutAssignmentError } = await supabaseAdmin
      .from('scouting_assignments')
      .delete()
      .eq('assigned_to_scout_id', userId)

    if (scoutAssignmentError) {
      console.error('Error deleting scout assignments:', scoutAssignmentError)
    } else {
      console.log('Successfully deleted scout assignments')
    }

    // 2. Delete scouting assignments where user is the manager who assigned
    const { error: managerAssignmentError } = await supabaseAdmin
      .from('scouting_assignments')
      .delete()
      .eq('assigned_by_manager_id', userId)

    if (managerAssignmentError) {
      console.error('Error deleting manager assignments:', managerAssignmentError)
    } else {
      console.log('Successfully deleted manager assignments')
    }

    // 3. Delete user permissions
    const { error: permissionsError } = await supabaseAdmin
      .from('user_permissions')
      .delete()
      .eq('user_id', userId)

    if (permissionsError) {
      console.error('Error deleting user permissions:', permissionsError)
    } else {
      console.log('Successfully deleted user permissions')
    }

    // 4. Delete player tracking records
    const { error: trackingError } = await supabaseAdmin
      .from('player_tracking')
      .delete()
      .eq('user_id', userId)

    if (trackingError) {
      console.error('Error deleting player tracking:', trackingError)
    } else {
      console.log('Successfully deleted player tracking records')
    }

    // 5. Delete notifications
    const { error: notificationsError } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('user_id', userId)

    if (notificationsError) {
      console.error('Error deleting notifications:', notificationsError)
    } else {
      console.log('Successfully deleted notifications')
    }

    // 6. Delete player notes authored by user
    const { error: notesError } = await supabaseAdmin
      .from('player_notes')
      .delete()
      .eq('author_id', userId)

    if (notesError) {
      console.error('Error deleting player notes:', notesError)
    } else {
      console.log('Successfully deleted player notes')
    }

    // 7. Delete reports created by user
    const { error: reportsError } = await supabaseAdmin
      .from('reports')
      .delete()
      .eq('scout_id', userId)

    if (reportsError) {
      console.error('Error deleting reports:', reportsError)
    } else {
      console.log('Successfully deleted reports')
    }

    // Now delete from profiles table
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) {
      console.error('Error deleting profile:', profileError)
      return new Response(
        JSON.stringify({ error: 'Failed to delete user profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Successfully deleted profile')

    // Finally delete from auth.users
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (authError) {
      console.error('Error deleting auth user:', authError)
      return new Response(
        JSON.stringify({ error: 'Failed to delete auth user' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Successfully deleted auth user')

    return new Response(
      JSON.stringify({ success: true, message: 'User deleted successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in delete-user function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
