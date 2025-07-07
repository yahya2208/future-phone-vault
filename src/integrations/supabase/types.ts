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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          is_admin: boolean | null
          max_transactions: number | null
          plan_type: string | null
          subscription_expires_at: string | null
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          is_admin?: boolean | null
          max_transactions?: number | null
          plan_type?: string | null
          subscription_expires_at?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          is_admin?: boolean | null
          max_transactions?: number | null
          plan_type?: string | null
          subscription_expires_at?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      security_logs: {
        Row: {
          created_at: string
          device_fingerprint: string | null
          event_details: Json | null
          event_type: string
          id: string
          ip_address: string | null
          risk_score: number | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_fingerprint?: string | null
          event_details?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          risk_score?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_fingerprint?: string | null
          event_details?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          risk_score?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          brand: string
          buyer_email: string | null
          buyer_name: string
          created_at: string
          id: string
          imei: string
          phone_model: string
          purchase_date: string
          rating: number | null
          seller_email: string | null
          seller_name: string
          seller_phone: string | null
          simple_drawing: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          brand: string
          buyer_email?: string | null
          buyer_name: string
          created_at?: string
          id?: string
          imei: string
          phone_model: string
          purchase_date: string
          rating?: number | null
          seller_email?: string | null
          seller_name: string
          seller_phone?: string | null
          simple_drawing?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          brand?: string
          buyer_email?: string | null
          buyer_name?: string
          created_at?: string
          id?: string
          imei?: string
          phone_model?: string
          purchase_date?: string
          rating?: number | null
          seller_email?: string | null
          seller_name?: string
          seller_phone?: string | null
          simple_drawing?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_activations: {
        Row: {
          activated_at: string | null
          activation_code: string | null
          activation_type: string | null
          created_at: string | null
          id: string
          is_activated: boolean
          is_admin: boolean | null
          max_trial_transactions: number | null
          trial_ends_at: string | null
          updated_at: string | null
          used_trial_transactions: number | null
          user_email: string
          user_id: string
        }
        Insert: {
          activated_at?: string | null
          activation_code?: string | null
          activation_type?: string | null
          created_at?: string | null
          id?: string
          is_activated?: boolean
          is_admin?: boolean | null
          max_trial_transactions?: number | null
          trial_ends_at?: string | null
          updated_at?: string | null
          used_trial_transactions?: number | null
          user_email: string
          user_id: string
        }
        Update: {
          activated_at?: string | null
          activation_code?: string | null
          activation_type?: string | null
          created_at?: string | null
          id?: string
          is_activated?: boolean
          is_admin?: boolean | null
          max_trial_transactions?: number | null
          trial_ends_at?: string | null
          updated_at?: string | null
          used_trial_transactions?: number | null
          user_email?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
<<<<<<< HEAD
=======
      activate_by_nickname: {
        Args: { p_nickname: string }
        Returns: Json
      }
      activate_user: {
        Args: {
          p_user_email: string
          p_activation_type: string
          p_activated_at: string
          p_trial_ends_at: string
        }
        Returns: string
      }
      generate_activation_code: {
        Args: { user_email: string }
        Returns: string
      }
      generate_activation_codes: {
        Args: {
          p_quantity: number
          p_admin_email: string
          p_duration_months?: number
          p_code_type?: string
        }
        Returns: {
          code: string
        }[]
      }
>>>>>>> d765a567f5fe8ba7f4c46a2fdc38c47a878b8c36
      generate_gift_codes: {
        Args: Record<PropertyKey, never>
        Returns: {
          gift_code: string
          code_number: number
        }[]
      }
      generate_lifetime_codes: {
        Args: Record<PropertyKey, never>
        Returns: {
          lifetime_code: string
          code_number: number
        }[]
      }
      generate_owner_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      validate_activation_code: {
        Args: { input_code: string; user_email: string }
        Returns: Json
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
