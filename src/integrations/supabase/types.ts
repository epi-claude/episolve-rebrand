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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          performed_by_email: string
          performed_by_user_id: string
          target_email: string
          target_user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          performed_by_email: string
          performed_by_user_id: string
          target_email: string
          target_user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          performed_by_email?: string
          performed_by_user_id?: string
          target_email?: string
          target_user_id?: string
        }
        Relationships: []
      }
      consultation_bookings: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          preferred_date: string | null
          status: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          preferred_date?: string | null
          status?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          preferred_date?: string | null
          status?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          service_interest: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          service_interest?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          service_interest?: string | null
        }
        Relationships: []
      }
      credit_card_authorizations: {
        Row: {
          authorization_date: string
          authorization_purpose: string | null
          authorized_amount: string | null
          billing_address: string
          billing_city: string
          billing_country: string
          billing_state: string
          billing_zip: string
          card_last_four: string
          card_type: string
          cardholder_name: string
          company_name: string | null
          created_at: string
          expiration_month: string
          expiration_year: string
          id: string
          print_name: string
          signature_data: string | null
          status: string
        }
        Insert: {
          authorization_date: string
          authorization_purpose?: string | null
          authorized_amount?: string | null
          billing_address: string
          billing_city: string
          billing_country?: string
          billing_state: string
          billing_zip: string
          card_last_four: string
          card_type: string
          cardholder_name: string
          company_name?: string | null
          created_at?: string
          expiration_month: string
          expiration_year: string
          id?: string
          print_name: string
          signature_data?: string | null
          status?: string
        }
        Update: {
          authorization_date?: string
          authorization_purpose?: string | null
          authorized_amount?: string | null
          billing_address?: string
          billing_city?: string
          billing_country?: string
          billing_state?: string
          billing_zip?: string
          card_last_four?: string
          card_type?: string
          cardholder_name?: string
          company_name?: string | null
          created_at?: string
          expiration_month?: string
          expiration_year?: string
          id?: string
          print_name?: string
          signature_data?: string | null
          status?: string
        }
        Relationships: []
      }
      flight_authorizations: {
        Row: {
          approved_by: string | null
          authorization_date: string
          budget_per_person: string | null
          cabin_class: string
          company_name: string | null
          created_at: string
          department: string | null
          departure_airport: string
          departure_date: string
          destination_airport: string
          first_name: string
          flexible_dates: boolean | null
          id: string
          last_name: string
          num_travelers: string
          preferred_airline: string | null
          print_name: string
          return_date: string | null
          signature_data: string | null
          special_requests: string | null
          specific_flight_numbers: string | null
          status: string
          travel_policy_link: string | null
          trip_purpose: string | null
        }
        Insert: {
          approved_by?: string | null
          authorization_date: string
          budget_per_person?: string | null
          cabin_class: string
          company_name?: string | null
          created_at?: string
          department?: string | null
          departure_airport: string
          departure_date: string
          destination_airport: string
          first_name: string
          flexible_dates?: boolean | null
          id?: string
          last_name: string
          num_travelers: string
          preferred_airline?: string | null
          print_name: string
          return_date?: string | null
          signature_data?: string | null
          special_requests?: string | null
          specific_flight_numbers?: string | null
          status?: string
          travel_policy_link?: string | null
          trip_purpose?: string | null
        }
        Update: {
          approved_by?: string | null
          authorization_date?: string
          budget_per_person?: string | null
          cabin_class?: string
          company_name?: string | null
          created_at?: string
          department?: string | null
          departure_airport?: string
          departure_date?: string
          destination_airport?: string
          first_name?: string
          flexible_dates?: boolean | null
          id?: string
          last_name?: string
          num_travelers?: string
          preferred_airline?: string | null
          print_name?: string
          return_date?: string | null
          signature_data?: string | null
          special_requests?: string | null
          specific_flight_numbers?: string | null
          status?: string
          travel_policy_link?: string | null
          trip_purpose?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          confirmed: boolean
          email: string
          id: string
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          confirmed?: boolean
          email: string
          id?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          confirmed?: boolean
          email?: string
          id?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      travel_profiles: {
        Row: {
          created_at: string
          date_of_birth: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          first_name: string
          frequent_flyer_programs: string | null
          gender: string | null
          global_entry: string | null
          id: string
          known_traveler_number: string | null
          last_name: string
          meal_preference: string | null
          medical_conditions: string | null
          passport_country: string | null
          passport_expiry: string | null
          passport_number: string | null
          phone: string | null
          redress_number: string | null
          seat_preference: string | null
          special_assistance: string | null
          status: string
          tsa_precheck: string | null
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          first_name: string
          frequent_flyer_programs?: string | null
          gender?: string | null
          global_entry?: string | null
          id?: string
          known_traveler_number?: string | null
          last_name: string
          meal_preference?: string | null
          medical_conditions?: string | null
          passport_country?: string | null
          passport_expiry?: string | null
          passport_number?: string | null
          phone?: string | null
          redress_number?: string | null
          seat_preference?: string | null
          special_assistance?: string | null
          status?: string
          tsa_precheck?: string | null
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          first_name?: string
          frequent_flyer_programs?: string | null
          gender?: string | null
          global_entry?: string | null
          id?: string
          known_traveler_number?: string | null
          last_name?: string
          meal_preference?: string | null
          medical_conditions?: string | null
          passport_country?: string | null
          passport_expiry?: string | null
          passport_number?: string | null
          phone?: string | null
          redress_number?: string | null
          seat_preference?: string | null
          special_assistance?: string | null
          status?: string
          tsa_precheck?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_admin_user: { Args: { target_email: string }; Returns: Json }
      get_admin_audit_logs: {
        Args: { limit_count?: number }
        Returns: {
          action: string
          created_at: string
          details: Json
          id: string
          performed_by_email: string
          performed_by_user_id: string
          target_email: string
          target_user_id: string
        }[]
      }
      get_admin_users: {
        Args: never
        Returns: {
          created_at: string
          email: string
          full_name: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }[]
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      remove_admin_user: { Args: { target_user_id: string }; Returns: Json }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
