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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      calibration_history: {
        Row: {
          calibrated_by: string | null
          calibration_date: string
          created_at: string
          gage_id: string
          id: string
          next_due_date: string
          notes: string | null
        }
        Insert: {
          calibrated_by?: string | null
          calibration_date: string
          created_at?: string
          gage_id: string
          id?: string
          next_due_date: string
          notes?: string | null
        }
        Update: {
          calibrated_by?: string | null
          calibration_date?: string
          created_at?: string
          gage_id?: string
          id?: string
          next_due_date?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calibration_history_gage_id_fkey"
            columns: ["gage_id"]
            isOneToOne: false
            referencedRelation: "gauges"
            referencedColumns: ["gage_id"]
          },
        ]
      }
      gauges: {
        Row: {
          adjusted_interval_days: number | null
          baseline_usage_rate: number | null
          calib_freq: number
          calib_freq_uom: string
          calibrator: string | null
          created_at: string
          current_location: string | null
          current_usage_rate: number | null
          description: string | null
          gage_id: string
          id: string
          last_cal_date: string
          last_calibrated_by: string | null
          next_due_date: string
          status: number | null
          storage_location: string | null
          type: string | null
          unit_of_meas: string | null
          updated_at: string
        }
        Insert: {
          adjusted_interval_days?: number | null
          baseline_usage_rate?: number | null
          calib_freq: number
          calib_freq_uom: string
          calibrator?: string | null
          created_at?: string
          current_location?: string | null
          current_usage_rate?: number | null
          description?: string | null
          gage_id: string
          id?: string
          last_cal_date: string
          last_calibrated_by?: string | null
          next_due_date: string
          status?: number | null
          storage_location?: string | null
          type?: string | null
          unit_of_meas?: string | null
          updated_at?: string
        }
        Update: {
          adjusted_interval_days?: number | null
          baseline_usage_rate?: number | null
          calib_freq?: number
          calib_freq_uom?: string
          calibrator?: string | null
          created_at?: string
          current_location?: string | null
          current_usage_rate?: number | null
          description?: string | null
          gage_id?: string
          id?: string
          last_cal_date?: string
          last_calibrated_by?: string | null
          next_due_date?: string
          status?: number | null
          storage_location?: string | null
          type?: string | null
          unit_of_meas?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      notification_log: {
        Row: {
          channel: string
          gage_id: string
          id: string
          message: string
          notification_type: string
          recipient: string
          sent_at: string
          status: string
        }
        Insert: {
          channel: string
          gage_id: string
          id?: string
          message: string
          notification_type: string
          recipient: string
          sent_at?: string
          status: string
        }
        Update: {
          channel?: string
          gage_id?: string
          id?: string
          message?: string
          notification_type?: string
          recipient?: string
          sent_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_log_gage_id_fkey"
            columns: ["gage_id"]
            isOneToOne: false
            referencedRelation: "gauges"
            referencedColumns: ["gage_id"]
          },
        ]
      }
      usage_logs: {
        Row: {
          created_at: string
          gage_id: string
          id: string
          recorded_at: string
          usage_count: number
        }
        Insert: {
          created_at?: string
          gage_id: string
          id?: string
          recorded_at?: string
          usage_count: number
        }
        Update: {
          created_at?: string
          gage_id?: string
          id?: string
          recorded_at?: string
          usage_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "usage_logs_gage_id_fkey"
            columns: ["gage_id"]
            isOneToOne: false
            referencedRelation: "gauges"
            referencedColumns: ["gage_id"]
          },
        ]
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
