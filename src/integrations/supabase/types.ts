export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      fixtures: {
        Row: {
          away_score: number | null
          away_team: string
          competition: string
          created_at: string
          external_api_id: string | null
          fixture_date: string
          home_score: number | null
          home_team: string
          id: string
          status: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          away_score?: number | null
          away_team: string
          competition: string
          created_at?: string
          external_api_id?: string | null
          fixture_date: string
          home_score?: number | null
          home_team: string
          id?: string
          status?: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          away_score?: number | null
          away_team?: string
          competition?: string
          created_at?: string
          external_api_id?: string | null
          fixture_date?: string
          home_score?: number | null
          home_team?: string
          id?: string
          status?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: []
      }
      kv_store_0b058238: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      player_fixtures: {
        Row: {
          assists: number | null
          created_at: string
          fixture_id: string | null
          goals: number | null
          id: string
          minutes_played: number | null
          notes: string | null
          player_id: string | null
          position_played: string | null
          rating: number | null
        }
        Insert: {
          assists?: number | null
          created_at?: string
          fixture_id?: string | null
          goals?: number | null
          id?: string
          minutes_played?: number | null
          notes?: string | null
          player_id?: string | null
          position_played?: string | null
          rating?: number | null
        }
        Update: {
          assists?: number | null
          created_at?: string
          fixture_id?: string | null
          goals?: number | null
          id?: string
          minutes_played?: number | null
          notes?: string | null
          player_id?: string | null
          position_played?: string | null
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_fixtures_fixture_id_fkey"
            columns: ["fixture_id"]
            isOneToOne: false
            referencedRelation: "fixtures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_fixtures_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_notes: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          player_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          player_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          player_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      player_recent_form: {
        Row: {
          assists: number
          created_at: string
          goals: number
          id: string
          matches: number
          player_id: string | null
          rating: number
          updated_at: string
        }
        Insert: {
          assists?: number
          created_at?: string
          goals?: number
          id?: string
          matches?: number
          player_id?: string | null
          rating?: number
          updated_at?: string
        }
        Update: {
          assists?: number
          created_at?: string
          goals?: number
          id?: string
          matches?: number
          player_id?: string | null
          rating?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_recent_form_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_tracking: {
        Row: {
          created_at: string
          id: string
          player_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          player_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          player_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      players: {
        Row: {
          age: number
          club: string
          contract_expiry: string | null
          contract_status: string
          created_at: string
          date_of_birth: string
          dominant_foot: string
          future_rating: number | null
          id: string
          image_url: string | null
          name: string
          nationality: string
          positions: string[]
          region: string
          transferroom_rating: number | null
          updated_at: string
          xtv_score: number | null
        }
        Insert: {
          age: number
          club: string
          contract_expiry?: string | null
          contract_status: string
          created_at?: string
          date_of_birth: string
          dominant_foot: string
          future_rating?: number | null
          id?: string
          image_url?: string | null
          name: string
          nationality: string
          positions: string[]
          region: string
          transferroom_rating?: number | null
          updated_at?: string
          xtv_score?: number | null
        }
        Update: {
          age?: number
          club?: string
          contract_expiry?: string | null
          contract_status?: string
          created_at?: string
          date_of_birth?: string
          dominant_foot?: string
          future_rating?: number | null
          id?: string
          image_url?: string | null
          name?: string
          nationality?: string
          positions?: string[]
          region?: string
          transferroom_rating?: number | null
          updated_at?: string
          xtv_score?: number | null
        }
        Relationships: []
      }
      players_new: {
        Row: {
          age: number | null
          basevalue: number | null
          birthdate: string | null
          contractexpiration: string | null
          currentteam: string | null
          firstnationality: string | null
          firstposition: string | null
          id: number
          imageurl: string | null
          name: string
          parentteam: string | null
          potential: number | null
          rating: number | null
          secondnationality: string | null
          secondposition: string | null
          xtv: number | null
        }
        Insert: {
          age?: number | null
          basevalue?: number | null
          birthdate?: string | null
          contractexpiration?: string | null
          currentteam?: string | null
          firstnationality?: string | null
          firstposition?: string | null
          id?: never
          imageurl?: string | null
          name: string
          parentteam?: string | null
          potential?: number | null
          rating?: number | null
          secondnationality?: string | null
          secondposition?: string | null
          xtv?: number | null
        }
        Update: {
          age?: number | null
          basevalue?: number | null
          birthdate?: string | null
          contractexpiration?: string | null
          currentteam?: string | null
          firstnationality?: string | null
          firstposition?: string | null
          id?: never
          imageurl?: string | null
          name?: string
          parentteam?: string | null
          potential?: number | null
          rating?: number | null
          secondnationality?: string | null
          secondposition?: string | null
          xtv?: number | null
        }
        Relationships: []
      }
      private_players: {
        Row: {
          age: number | null
          club: string | null
          created_at: string
          created_by_user_id: string
          date_of_birth: string | null
          dominant_foot: string | null
          id: string
          name: string
          nationality: string | null
          notes: string | null
          positions: string[] | null
          region: string | null
          source_context: string | null
          updated_at: string
          visibility: string
        }
        Insert: {
          age?: number | null
          club?: string | null
          created_at?: string
          created_by_user_id: string
          date_of_birth?: string | null
          dominant_foot?: string | null
          id?: string
          name: string
          nationality?: string | null
          notes?: string | null
          positions?: string[] | null
          region?: string | null
          source_context?: string | null
          updated_at?: string
          visibility?: string
        }
        Update: {
          age?: number | null
          club?: string | null
          created_at?: string
          created_by_user_id?: string
          date_of_birth?: string | null
          dominant_foot?: string | null
          id?: string
          name?: string
          nationality?: string | null
          notes?: string | null
          positions?: string[] | null
          region?: string | null
          source_context?: string | null
          updated_at?: string
          visibility?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          club_id: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          role: string
          updated_at: string
        }
        Insert: {
          club_id?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          club_id?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      report_templates: {
        Row: {
          created_at: string
          default_rating_system: Json | null
          default_template: boolean | null
          description: string | null
          id: string
          name: string
          sections: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_rating_system?: Json | null
          default_template?: boolean | null
          description?: string | null
          id?: string
          name: string
          sections?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_rating_system?: Json | null
          default_template?: boolean | null
          description?: string | null
          id?: string
          name?: string
          sections?: Json
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          flagged_for_review: boolean | null
          id: string
          match_context: Json | null
          player_id: string
          scout_id: string
          sections: Json
          status: string
          tags: string[] | null
          template_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          flagged_for_review?: boolean | null
          id?: string
          match_context?: Json | null
          player_id: string
          scout_id: string
          sections?: Json
          status?: string
          tags?: string[] | null
          template_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          flagged_for_review?: boolean | null
          id?: string
          match_context?: Json | null
          player_id?: string
          scout_id?: string
          sections?: Json
          status?: string
          tags?: string[] | null
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_scout_id_fkey"
            columns: ["scout_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scouting_assignments: {
        Row: {
          assigned_by_manager_id: string
          assigned_to_scout_id: string
          assignment_notes: string | null
          created_at: string
          deadline: string | null
          id: string
          player_id: string
          priority: string
          report_type: string
          reviewed_at: string | null
          reviewed_by_manager_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          assigned_by_manager_id: string
          assigned_to_scout_id: string
          assignment_notes?: string | null
          created_at?: string
          deadline?: string | null
          id?: string
          player_id: string
          priority?: string
          report_type?: string
          reviewed_at?: string | null
          reviewed_by_manager_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_by_manager_id?: string
          assigned_to_scout_id?: string
          assignment_notes?: string | null
          created_at?: string
          deadline?: string | null
          id?: string
          player_id?: string
          priority?: string
          report_type?: string
          reviewed_at?: string | null
          reviewed_by_manager_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scouting_assignments_assigned_by_manager_id_fkey"
            columns: ["assigned_by_manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scouting_assignments_assigned_to_scout_id_fkey"
            columns: ["assigned_to_scout_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scouting_assignments_reviewed_by_manager_id_fkey"
            columns: ["reviewed_by_manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shortlist_players: {
        Row: {
          added_at: string
          id: string
          player_id: string
          shortlist_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          player_id: string
          shortlist_id: string
        }
        Update: {
          added_at?: string
          id?: string
          player_id?: string
          shortlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shortlist_players_shortlist_id_fkey"
            columns: ["shortlist_id"]
            isOneToOne: false
            referencedRelation: "shortlists"
            referencedColumns: ["id"]
          },
        ]
      }
      shortlists: {
        Row: {
          color: string
          created_at: string
          description: string | null
          id: string
          is_scouting_assignment_list: boolean | null
          name: string
          requirement_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          is_scouting_assignment_list?: boolean | null
          name: string
          requirement_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          is_scouting_assignment_list?: boolean | null
          name?: string
          requirement_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          country: string
          created_at: string
          external_api_id: string
          founded: number | null
          id: string
          league: string
          logo_url: string | null
          name: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          country: string
          created_at?: string
          external_api_id: string
          founded?: number | null
          id?: string
          league: string
          logo_url?: string | null
          name: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          country?: string
          created_at?: string
          external_api_id?: string
          founded?: number | null
          id?: string
          league?: string
          logo_url?: string | null
          name?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          permission: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          permission: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          permission?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
