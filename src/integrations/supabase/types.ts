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
      deposit_settings: {
        Row: {
          amount: number
          created_at: string
          id: string
          is_active: boolean
          updated_at: string
          wagon_type: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          wagon_type: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          wagon_type?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          bank_name: string | null
          card_holder_name: string | null
          card_number: string | null
          created_at: string
          created_by: string | null
          description: string | null
          display_order: number | null
          gateway_provider: string | null
          id: string
          is_active: boolean
          merchant_id: string | null
          min_balance: number | null
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          bank_name?: string | null
          card_holder_name?: string | null
          card_number?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          gateway_provider?: string | null
          id?: string
          is_active?: boolean
          merchant_id?: string | null
          min_balance?: number | null
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          bank_name?: string | null
          card_holder_name?: string | null
          card_number?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          gateway_provider?: string | null
          id?: string
          is_active?: boolean
          merchant_id?: string | null
          min_balance?: number | null
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          balance: number | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          balance?: number | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          balance?: number | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          adults_count: number | null
          assigned_at: string | null
          assigned_employees: string[] | null
          assigned_to: string | null
          cancel_requested: boolean | null
          cancel_requested_at: string | null
          children_count: number | null
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string
          customer_notes: string | null
          departure_date: string
          departure_time: string | null
          destination: string
          foreign_national: boolean | null
          id: string
          internal_notes: string | null
          is_starred: boolean | null
          origin: string
          passenger_count: number | null
          passenger_type: string | null
          passengers: Json | null
          pending_status: string | null
          pending_status_at: string | null
          pending_status_by: string | null
          price_range_max: number | null
          price_range_min: number | null
          private_compartment: boolean | null
          refund_amount: number | null
          refund_at: string | null
          refund_by: string | null
          refund_card_number: string | null
          refund_method: string | null
          refund_status: string | null
          reservation_code: string
          selected_time_slots: string[] | null
          selected_wagon_types: string[] | null
          status: string
          ticket_file_path: string | null
          ticket_paid_at: string | null
          ticket_payment_amount: number | null
          ticket_payment_link: string | null
          ticket_payment_status: string | null
          ticket_uploaded_at: string | null
          ticket_uploaded_by: string | null
          total_price: number
          train_name: string | null
          updated_at: string
          user_id: string | null
          wagon_type: string | null
        }
        Insert: {
          adults_count?: number | null
          assigned_at?: string | null
          assigned_employees?: string[] | null
          assigned_to?: string | null
          cancel_requested?: boolean | null
          cancel_requested_at?: string | null
          children_count?: number | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          customer_notes?: string | null
          departure_date: string
          departure_time?: string | null
          destination: string
          foreign_national?: boolean | null
          id?: string
          internal_notes?: string | null
          is_starred?: boolean | null
          origin: string
          passenger_count?: number | null
          passenger_type?: string | null
          passengers?: Json | null
          pending_status?: string | null
          pending_status_at?: string | null
          pending_status_by?: string | null
          price_range_max?: number | null
          price_range_min?: number | null
          private_compartment?: boolean | null
          refund_amount?: number | null
          refund_at?: string | null
          refund_by?: string | null
          refund_card_number?: string | null
          refund_method?: string | null
          refund_status?: string | null
          reservation_code: string
          selected_time_slots?: string[] | null
          selected_wagon_types?: string[] | null
          status?: string
          ticket_file_path?: string | null
          ticket_paid_at?: string | null
          ticket_payment_amount?: number | null
          ticket_payment_link?: string | null
          ticket_payment_status?: string | null
          ticket_uploaded_at?: string | null
          ticket_uploaded_by?: string | null
          total_price: number
          train_name?: string | null
          updated_at?: string
          user_id?: string | null
          wagon_type?: string | null
        }
        Update: {
          adults_count?: number | null
          assigned_at?: string | null
          assigned_employees?: string[] | null
          assigned_to?: string | null
          cancel_requested?: boolean | null
          cancel_requested_at?: string | null
          children_count?: number | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          customer_notes?: string | null
          departure_date?: string
          departure_time?: string | null
          destination?: string
          foreign_national?: boolean | null
          id?: string
          internal_notes?: string | null
          is_starred?: boolean | null
          origin?: string
          passenger_count?: number | null
          passenger_type?: string | null
          passengers?: Json | null
          pending_status?: string | null
          pending_status_at?: string | null
          pending_status_by?: string | null
          price_range_max?: number | null
          price_range_min?: number | null
          private_compartment?: boolean | null
          refund_amount?: number | null
          refund_at?: string | null
          refund_by?: string | null
          refund_card_number?: string | null
          refund_method?: string | null
          refund_status?: string | null
          reservation_code?: string
          selected_time_slots?: string[] | null
          selected_wagon_types?: string[] | null
          status?: string
          ticket_file_path?: string | null
          ticket_paid_at?: string | null
          ticket_payment_amount?: number | null
          ticket_payment_link?: string | null
          ticket_payment_status?: string | null
          ticket_uploaded_at?: string | null
          ticket_uploaded_by?: string | null
          total_price?: number
          train_name?: string | null
          updated_at?: string
          user_id?: string | null
          wagon_type?: string | null
        }
        Relationships: []
      }
      route_fees: {
        Row: {
          created_at: string
          created_by: string | null
          destination: string
          fixed_fee: number
          id: string
          is_active: boolean
          origin: string
          percentage_fee: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          destination: string
          fixed_fee?: number
          id?: string
          is_active?: boolean
          origin: string
          percentage_fee?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          destination?: string
          fixed_fee?: number
          id?: string
          is_active?: boolean
          origin?: string
          percentage_fee?: number
          updated_at?: string
        }
        Relationships: []
      }
      saved_passengers: {
        Row: {
          birth_date: string
          created_at: string
          first_name: string
          id: string
          is_foreign: boolean | null
          last_name: string
          national_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          birth_date: string
          created_at?: string
          first_name: string
          id?: string
          is_foreign?: boolean | null
          last_name: string
          national_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          birth_date?: string
          created_at?: string
          first_name?: string
          id?: string
          is_foreign?: boolean | null
          last_name?: string
          national_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      service_fees: {
        Row: {
          amount: number
          created_at: string | null
          fee_type: string
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          amount?: number
          created_at?: string | null
          fee_type?: string
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          fee_type?: string
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      train_schedules: {
        Row: {
          arrival_time: string | null
          available_seats: number | null
          created_at: string | null
          departure_date: string
          departure_time: string | null
          destination: string
          duration: string | null
          id: string
          is_available: boolean | null
          last_synced_at: string | null
          origin: string
          raja_price: number
          train_id: string | null
          updated_at: string | null
          wagon_type: string | null
        }
        Insert: {
          arrival_time?: string | null
          available_seats?: number | null
          created_at?: string | null
          departure_date: string
          departure_time?: string | null
          destination: string
          duration?: string | null
          id?: string
          is_available?: boolean | null
          last_synced_at?: string | null
          origin: string
          raja_price?: number
          train_id?: string | null
          updated_at?: string | null
          wagon_type?: string | null
        }
        Update: {
          arrival_time?: string | null
          available_seats?: number | null
          created_at?: string | null
          departure_date?: string
          departure_time?: string | null
          destination?: string
          duration?: string | null
          id?: string
          is_available?: boolean | null
          last_synced_at?: string | null
          origin?: string
          raja_price?: number
          train_id?: string | null
          updated_at?: string | null
          wagon_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "train_schedules_train_id_fkey"
            columns: ["train_id"]
            isOneToOne: false
            referencedRelation: "trains"
            referencedColumns: ["id"]
          },
        ]
      }
      trains: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          train_number: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          train_number?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          train_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          reference_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          permissions: string[]
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          permissions?: string[]
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          permissions?: string[]
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
      decrement_balance: {
        Args: { _amount: number; _user_id: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_balance: {
        Args: { _amount: number; _user_id: string }
        Returns: number
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "employee"
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
      app_role: ["admin", "employee"],
    },
  },
} as const
