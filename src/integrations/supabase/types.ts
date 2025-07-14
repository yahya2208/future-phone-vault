export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activated_devices: {
        Row: {
          activated_at: string | null
          device_id: string
          device_name: string | null
          id: string
          ip_address: string | null
          is_active: boolean | null
          last_seen: string | null
          license_key_id: string | null
        }
        Insert: {
          activated_at?: string | null
          device_id: string
          device_name?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_seen?: string | null
          license_key_id?: string | null
        }
        Update: {
          activated_at?: string | null
          device_id?: string
          device_name?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_seen?: string | null
          license_key_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activated_devices_license_key_id_fkey"
            columns: ["license_key_id"]
            isOneToOne: false
            referencedRelation: "license_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      activation_codes: {
        Row: {
          activated_at: string | null
          code_hash: string
          code_type: string | null
          created_at: string
          created_by_admin: boolean | null
          expires_at: string
          id: string
          is_admin_code: boolean | null
          is_used: boolean | null
          notes: string | null
          subscription_duration_months: number | null
          used: boolean | null
          used_at: string | null
          used_by: string | null
          user_email: string
        }
        Insert: {
          activated_at?: string | null
          code_hash: string
          code_type?: string | null
          created_at?: string
          created_by_admin?: boolean | null
          expires_at?: string
          id?: string
          is_admin_code?: boolean | null
          is_used?: boolean | null
          notes?: string | null
          subscription_duration_months?: number | null
          used?: boolean | null
          used_at?: string | null
          used_by?: string | null
          user_email: string
        }
        Update: {
          activated_at?: string | null
          code_hash?: string
          code_type?: string | null
          created_at?: string
          created_by_admin?: boolean | null
          expires_at?: string
          id?: string
          is_admin_code?: boolean | null
          is_used?: boolean | null
          notes?: string | null
          subscription_duration_months?: number | null
          used?: boolean | null
          used_at?: string | null
          used_by?: string | null
          user_email?: string
        }
        Relationships: []
      }
      license_keys: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          license_key: string
          max_devices: number | null
          notes: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          license_key: string
          max_devices?: number | null
          notes?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          license_key?: string
          max_devices?: number | null
          notes?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_admin: boolean | null
          max_transactions: number | null
          plan_type: string | null
          profile_picture: string | null
          referral_code: string | null
          referral_count: number | null
          referral_rewards: number | null
          subscription_expires_at: string | null
          updated_at: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          max_transactions?: number | null
          plan_type?: string | null
          profile_picture?: string | null
          referral_code?: string | null
          referral_count?: number | null
          referral_rewards?: number | null
          subscription_expires_at?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          max_transactions?: number | null
          plan_type?: string | null
          profile_picture?: string | null
          referral_code?: string | null
          referral_count?: number | null
          referral_rewards?: number | null
          subscription_expires_at?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      referral_commissions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          metadata: Json | null
          paid_at: string | null
          referral_id: string
          referred_user_id: string
          status: Database["public"]["Enums"]["commission_status"] | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          metadata?: Json | null
          paid_at?: string | null
          referral_id: string
          referred_user_id: string
          status?: Database["public"]["Enums"]["commission_status"] | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          metadata?: Json | null
          paid_at?: string | null
          referral_id?: string
          referred_user_id?: string
          status?: Database["public"]["Enums"]["commission_status"] | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_commissions_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string | null
          current_uses: number | null
          expires_at: string | null
          id: string
          max_uses: number | null
          metadata: Json | null
          referral_code: string
          referred_user_id: string | null
          referrer_id: string
          status: Database["public"]["Enums"]["referral_status"] | null
        }
        Insert: {
          created_at?: string | null
          current_uses?: number | null
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          metadata?: Json | null
          referral_code: string
          referred_user_id?: string | null
          referrer_id: string
          status?: Database["public"]["Enums"]["referral_status"] | null
        }
        Update: {
          created_at?: string | null
          current_uses?: number | null
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          metadata?: Json | null
          referral_code?: string
          referred_user_id?: string | null
          referrer_id?: string
          status?: Database["public"]["Enums"]["referral_status"] | null
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
        Relationships: [
          {
            foreignKeyName: "fk_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      check_admin_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      create_referral_code: {
        Args: {
          p_referrer_id: string
          p_expires_at?: string
          p_max_uses?: number
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
      generate_gift_codes: {
        Args: Record<PropertyKey, never>
        Returns: {
          gift_code: string
          code_number: number
        }[]
      }
      generate_license_key: {
        Args: { length: number }
        Returns: string
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
      is_admin: {
        Args: Record<PropertyKey, never> | { user_id: string }
        Returns: boolean
      }
      is_admin_safe: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      process_referral: {
        Args: { p_referral_code: string; p_referred_user_id: string }
        Returns: string
      }
      set_user_admin: {
        Args: { user_id: string; is_admin: boolean }
        Returns: undefined
      }
      table_exists: {
        Args: { table_name: string }
        Returns: boolean
      }
      validate_activation_code: {
        Args: { input_code: string; user_email: string }
        Returns: Json
      }
    }
    Enums: {
      commission_status: "pending" | "paid" | "failed"
      referral_status: "pending" | "completed" | "expired"
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
    Enums: {
      commission_status: ["pending", "paid", "failed"],
      referral_status: ["pending", "completed", "expired"],
    },
  },
} as const
