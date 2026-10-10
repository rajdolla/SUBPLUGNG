/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'customer' | 'vendor' | 'reseller' | 'support_agent' | 'admin' | 'super_admin';
export type KycStatus = 'not_started' | 'pending' | 'verified' | 'rejected' | 'needs_more_info';
export type TransactionStatus = 'pending' | 'processing' | 'successful' | 'failed' | 'reversed';
export type ServiceCategory =
  | 'airtime'
  | 'data'
  | 'electricity'
  | 'cable'
  | 'bulk_sms'
  | 'airtime_cash'
  | 'data_pins'
  | 'exam_pins'
  | 'recharge_card'
  | 'wallet_funding';

export type VoucherStatus = 'unused' | 'redeemed' | 'expired' | 'cancelled';
export type TicketStatus = 'submitted' | 'assessing' | 'requerying' | 'escalated' | 'resolved' | 'closed';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          phone: string | null;
          role: UserRole;
          kyc_status: KycStatus;
          kyc_level: number;
          bvn_hash: string | null;
          nin_hash: string | null;
          transaction_pin_hash: string | null;
          transaction_pin_set: boolean;
          pin_failed_attempts: number;
          pin_locked_until: string | null;
          referral_code: string | null;
          referred_by: string | null;
          is_active: boolean;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & { id: string };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
      };
      main_wallets: {
        Row: {
          user_id: string;
          balance: number;
          daily_limit: number;
          spent_today: number;
          last_activity_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['main_wallets']['Row']> & { user_id: string };
        Update: Partial<Database['public']['Tables']['main_wallets']['Row']>;
      };
      main_wallet_ledger: {
        Row: {
          id: string;
          user_id: string;
          reference: string;
          idempotency_key: string | null;
          entry_type: 'credit' | 'debit';
          source: string;
          amount: number;
          balance_before: number;
          balance_after: number;
          description: string;
          metadata: Json;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['main_wallet_ledger']['Row'], 'id' | 'created_at'>;
        Update: never;
      };
      bonus_wallets: {
        Row: {
          user_id: string;
          balance: number;
          total_earned: number;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['bonus_wallets']['Row']> & { user_id: string };
        Update: Partial<Database['public']['Tables']['bonus_wallets']['Row']>;
      };
      bonus_wallet_ledger: {
        Row: {
          id: string;
          user_id: string;
          reference: string;
          entry_type: 'credit' | 'debit';
          source: string;
          amount: number;
          balance_before: number;
          balance_after: number;
          description: string;
          metadata: Json;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bonus_wallet_ledger']['Row'], 'id' | 'created_at'>;
        Update: never;
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          reference: string;
          idempotency_key: string | null;
          service_category: ServiceCategory;
          provider_name: string;
          provider_reference: string | null;
          amount: number;
          fee: number;
          cashback_awarded: number;
          recipient: string;
          status: TransactionStatus;
          provider_response: Json;
          customer_note: string | null;
          metadata: Json;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['transactions']['Row']>;
      };
      vouchers: {
        Row: {
          id: string;
          code?: string;
          code_prefix: string;
          code_hash: string;
          value: number;
          status: VoucherStatus;
          expiry_date: string;
          batch_id: string;
          source: string;
          destination_wallet: 'main';
          redeemer_user_id: string | null;
          redeemed_at: string | null;
          redemption_reference: string | null;
          metadata: Json;
          created_by: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['vouchers']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['vouchers']['Row']>;
      };
      admin_permissions: {
        Row: {
          id: string;
          user_id: string;
          permission: 'voucher.create' | 'voucher.cancel' | 'kyc.verify' | 'cms.publish' | 'funds.adjust' | 'roles.manage';
          granted_by: string | null;
          granted_at: string;
        };
        Insert: Omit<Database['public']['Tables']['admin_permissions']['Row'], 'id' | 'granted_at'>;
        Update: never;
      };
      partners: {
        Row: {
          id: string;
          name: string;
          logo_url: string;
          alt_text: string;
          website_url: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['partners']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['partners']['Row']>;
      };
      cms_content: {
        Row: {
          id: string;
          draft_content: Json;
          published_content: Json;
          has_unpublished_changes: boolean;
          published_at: string | null;
          published_by: string | null;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['cms_content']['Row']> & { id: string };
        Update: Partial<Database['public']['Tables']['cms_content']['Row']>;
      };
      resolution_tickets: {
        Row: {
          id: string;
          ticket_number: string;
          user_id: string;
          transaction_id: string | null;
          transaction_reference: string;
          service_category: ServiceCategory;
          transaction_amount: number;
          recipient_details: string;
          issue_type: string;
          customer_note: string;
          status: TicketStatus;
          resolution_outcome: string | null;
          admin_notes: string | null;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['resolution_tickets']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['resolution_tickets']['Row']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string;
          type: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Row']>;
      };
      admin_audit_logs: {
        Row: {
          id: string;
          admin_user_id: string;
          action: string;
          target_resource: string;
          resource_id: string | null;
          changes: Json;
          ip_address: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['admin_audit_logs']['Row'], 'id' | 'created_at'>;
        Update: never;
      };
      points_accounts: {
        Row: {
          user_id: string;
          available_points: number;
          lifetime_earned: number;
          lifetime_redeemed: number;
          last_activity_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['points_accounts']['Row']> & { user_id: string };
        Update: Partial<Database['public']['Tables']['points_accounts']['Row']>;
      };
      points_ledger: {
        Row: {
          id: string;
          user_id: string;
          reference: string;
          entry_type: 'credit' | 'debit';
          source: string;
          points: number;
          balance_before: number;
          balance_after: number;
          description: string;
          metadata: Json;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['points_ledger']['Row'], 'id' | 'created_at'>;
        Update: never;
      };
      points_tasks: {
        Row: {
          id: string;
          title: string;
          description: string;
          points_reward: number;
          task_type: string;
          min_transaction_amount: number | null;
          max_claims_per_user: number;
          category: string;
          is_active: boolean;
          metadata: Json;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['points_tasks']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['points_tasks']['Row']>;
      };
      points_redemption_catalogue: {
        Row: {
          id: string;
          title: string;
          reward_type: 'wallet_cash' | 'airtime' | 'data';
          points_required: number;
          cash_credit_amount: number | null;
          airtime_amount: number | null;
          network: string | null;
          data_plan_name: string | null;
          per_user_monthly_limit: number;
          terms: string;
          is_active: boolean;
          metadata: Json;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['points_redemption_catalogue']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['points_redemption_catalogue']['Row']>;
      };
      points_redemptions: {
        Row: {
          id: string;
          user_id: string;
          catalogue_item_id: string | null;
          reward_type: 'wallet_cash' | 'airtime' | 'data';
          points_deducted: number;
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'reversed';
          reference: string;
          idempotency_key: string | null;
          reward_reference: string | null;
          recipient_phone: string | null;
          provider_reference: string | null;
          provider_response: Json;
          failure_reason: string | null;
          metadata: Json;
          created_at: string;
          completed_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['points_redemptions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['points_redemptions']['Row']>;
      };
    };
    Functions: {
      redeem_voucher_atomic: {
        Args: {
          p_code: string;
          p_user_id?: string;
        };
        Returns: Json;
      };
      generate_vouchers_batch_atomic: {
        Args: {
          p_count: number;
          p_value: number;
          p_expiry_days: number;
          p_prefix?: string;
        };
        Returns: Json;
      };
      redeem_points_atomic: {
        Args: {
          p_catalogue_id: string;
          p_idempotency_key: string;
          p_recipient_phone?: string;
          p_user_id?: string;
        };
        Returns: Json;
      };
      confirm_points_fulfilment: {
        Args: {
          p_redemption_reference: string;
          p_provider_reference: string;
          p_provider_response?: Json;
        };
        Returns: Json;
      };
      fail_and_refund_points_redemption: {
        Args: {
          p_redemption_reference: string;
          p_failure_reason: string;
          p_provider_response?: Json;
        };
        Returns: Json;
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      has_admin_permission: {
        Args: {
          p_user_id: string;
          p_permission: string;
        };
        Returns: boolean;
      };
      grant_admin_permission: {
        Args: {
          p_target_user_id: string;
          p_permission: string;
        };
        Returns: Json;
      };
      revoke_admin_permission: {
        Args: {
          p_target_user_id: string;
          p_permission: string;
        };
        Returns: Json;
      };
      lookup_referral_sponsor: {
        Args: {
          p_referral_code: string;
        };
        Returns: Json;
      };
      initialize_transaction_pin: {
        Args: {
          p_new_pin: string;
        };
        Returns: Json;
      };
      change_transaction_pin: {
        Args: {
          p_current_pin: string;
          p_new_pin: string;
        };
        Returns: Json;
      };
      reset_transaction_pin_admin: {
        Args: {
          p_target_user_id: string;
          p_reason?: string;
        };
        Returns: Json;
      };
      set_transaction_pin_atomic: {
        Args: {
          p_new_pin: string;
          p_current_pin?: string;
        };
        Returns: Json;
      };
    };
  };
}
