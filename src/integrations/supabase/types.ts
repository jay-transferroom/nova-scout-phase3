export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      players: {
        Row: {
          age: number
          club: string
          contract_expiry: string | null
          contract_status: string
          created_at: string
          date_of_birth: string
          dominant_foot: string
          id: string
          image_url: string | null
          name: string
          nationality: string
          positions: string[]
          region: string
          updated_at: string
        }
        Insert: {
          age: number
          club: string
          contract_expiry?: string | null
          contract_status: string
          created_at?: string
          date_of_birth: string
          dominant_foot: string
          id?: string
          image_url?: string | null
          name: string
          nationality: string
          positions: string[]
          region: string
          updated_at?: string
        }
        Update: {
          age?: number
          club?: string
          contract_expiry?: string | null
          contract_status?: string
          created_at?: string
          date_of_birth?: string
          dominant_foot?: string
          id?: string
          image_url?: string | null
          name?: string
          nationality?: string
          positions?: string[]
          region?: string
          updated_at?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
