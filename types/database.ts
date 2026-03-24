export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          created_at?: string
        }
        Relationships: []
      }
      ideas: {
        Row: {
          id: string
          user_id: string
          title: string
          raw_text: string
          pillar: string
          tone: string
          tags: string[]
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          raw_text: string
          pillar?: string
          tone?: string
          tags?: string[]
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          raw_text?: string
          pillar?: string
          tone?: string
          tags?: string[]
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      drafts: {
        Row: {
          id: string
          user_id: string
          idea_id: string | null
          title: string
          content: string
          hook: string | null
          cta: string | null
          tone: string | null
          pillar: string | null
          status: string
          authenticity_score: number | null
          clarity_score: number | null
          engagement_potential: number | null
          risk_level: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          idea_id?: string | null
          title: string
          content: string
          hook?: string | null
          cta?: string | null
          tone?: string | null
          pillar?: string | null
          status?: string
          authenticity_score?: number | null
          clarity_score?: number | null
          engagement_potential?: number | null
          risk_level?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          idea_id?: string | null
          title?: string
          content?: string
          hook?: string | null
          cta?: string | null
          tone?: string | null
          pillar?: string | null
          status?: string
          authenticity_score?: number | null
          clarity_score?: number | null
          engagement_potential?: number | null
          risk_level?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      draft_versions: {
        Row: {
          id: string
          draft_id: string
          version_label: string
          content: string
          hook: string | null
          cta: string | null
          transformation_type: string
          created_at: string
        }
        Insert: {
          id?: string
          draft_id: string
          version_label: string
          content: string
          hook?: string | null
          cta?: string | null
          transformation_type?: string
          created_at?: string
        }
        Update: {
          id?: string
          draft_id?: string
          version_label?: string
          content?: string
          hook?: string | null
          cta?: string | null
          transformation_type?: string
          created_at?: string
        }
        Relationships: []
      }
      scheduled_posts: {
        Row: {
          id: string
          user_id: string
          draft_id: string
          scheduled_for: string | null
          calendar_status: string
          linkedin_url: string | null
          posted: boolean
          skipped: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          draft_id: string
          scheduled_for?: string | null
          calendar_status?: string
          linkedin_url?: string | null
          posted?: boolean
          skipped?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          draft_id?: string
          scheduled_for?: string | null
          calendar_status?: string
          linkedin_url?: string | null
          posted?: boolean
          skipped?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      published_posts: {
        Row: {
          id: string
          user_id: string
          draft_id: string | null
          title: string
          post_text: string
          pillar: string | null
          tone: string | null
          hook_type: string | null
          cta_type: string | null
          linkedin_url: string | null
          posted_at: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          draft_id?: string | null
          title: string
          post_text: string
          pillar?: string | null
          tone?: string | null
          hook_type?: string | null
          cta_type?: string | null
          linkedin_url?: string | null
          posted_at?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          draft_id?: string | null
          title?: string
          post_text?: string
          pillar?: string | null
          tone?: string | null
          hook_type?: string | null
          cta_type?: string | null
          linkedin_url?: string | null
          posted_at?: string
          notes?: string | null
          created_at?: string
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          id: string
          published_post_id: string
          commenter_name: string
          commenter_profile_url: string | null
          comment_text: string
          is_high_value: boolean
          is_lead: boolean
          reply_status: string
          reply_text: string | null
          created_at: string
        }
        Insert: {
          id?: string
          published_post_id: string
          commenter_name: string
          commenter_profile_url?: string | null
          comment_text: string
          is_high_value?: boolean
          is_lead?: boolean
          reply_status?: string
          reply_text?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          published_post_id?: string
          commenter_name?: string
          commenter_profile_url?: string | null
          comment_text?: string
          is_high_value?: boolean
          is_lead?: boolean
          reply_status?: string
          reply_text?: string | null
          created_at?: string
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          id: string
          published_post_id: string
          impressions: number
          likes: number
          comments: number
          reposts: number
          entered_at: string
        }
        Insert: {
          id?: string
          published_post_id: string
          impressions: number
          likes: number
          comments: number
          reposts: number
          entered_at?: string
        }
        Update: {
          id?: string
          published_post_id?: string
          impressions?: number
          likes?: number
          comments?: number
          reposts?: number
          entered_at?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          id: string
          user_id: string
          name: string
          company: string | null
          type: string
          opportunity_type: string | null
          stage: string
          notes: string | null
          last_contact: string | null
          next_follow_up: string | null
          is_warm: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          company?: string | null
          type?: string
          opportunity_type?: string | null
          stage?: string
          notes?: string | null
          last_contact?: string | null
          next_follow_up?: string | null
          is_warm?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          company?: string | null
          type?: string
          opportunity_type?: string | null
          stage?: string
          notes?: string | null
          last_contact?: string | null
          next_follow_up?: string | null
          is_warm?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          description: string | null
          completed: boolean
          completed_at: string | null
          due_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          description?: string | null
          completed?: boolean
          completed_at?: string | null
          due_date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          description?: string | null
          completed?: boolean
          completed_at?: string | null
          due_date?: string
          created_at?: string
        }
        Relationships: []
      }
      daily_logs: {
        Row: {
          id: string
          user_id: string
          date: string
          shipped: boolean
          what_moved_needle: string | null
          what_didnt: string | null
          warnings: string[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          shipped?: boolean
          what_moved_needle?: string | null
          what_didnt?: string | null
          warnings?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          shipped?: boolean
          what_moved_needle?: string | null
          what_didnt?: string | null
          warnings?: string[]
          created_at?: string
        }
        Relationships: []
      }
      voice_profiles: {
        Row: {
          id: string
          user_id: string
          profile_name: string
          description: string
          liked_phrases: string[]
          banned_phrases: string[]
          preferred_cta_style: string
          intensity_level: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          profile_name: string
          description: string
          liked_phrases?: string[]
          banned_phrases?: string[]
          preferred_cta_style?: string
          intensity_level?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          profile_name?: string
          description?: string
          liked_phrases?: string[]
          banned_phrases?: string[]
          preferred_cta_style?: string
          intensity_level?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      prompt_templates: {
        Row: {
          id: string
          name: string
          category: string
          prompt_text: string
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          prompt_text: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          prompt_text?: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string
          entity_type: string
          entity_id: string
          action: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          entity_type: string
          entity_id: string
          action: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          entity_type?: string
          entity_id?: string
          action?: string
          metadata?: Json
          created_at?: string
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

// Enum types
export type ContentPillar =
  | 'product_build'
  | 'founder_journey'
  | 'industry_insights'
  | 'team_building'
  | 'sales_marketing'
  | 'operations'
  | 'personal_growth'

export type EmotionalTone =
  | 'direct'
  | 'observational'
  | 'blunt'
  | 'curious'
  | 'reflective'

export type IdeaStatus = 'new' | 'in_progress' | 'drafted' | 'archived'

export type DraftStatus = 'rough_draft' | 'needs_review' | 'approved' | 'scheduled' | 'published'

export type CalendarStatus = 'planned' | 'scheduled' | 'posted' | 'skipped'

export type ReplyStatus = 'pending' | 'replied' | 'no_reply_needed'

export type PromptCategory =
  | 'draft_generation'
  | 'rewrite_voice'
  | 'rewrite_safer'
  | 'rewrite_stronger'
  | 'rewrite_human'
  | 'comment_suggestions'
  | 'engagement_analysis'
  | 'insights'
  | 'follow_up_message'

export type TaskType = 'content' | 'build' | 'revenue'

export type ContactType = 'prospect' | 'customer' | 'partner' | 'investor'

export type OpportunityType = 'enterprise' | 'startup' | 'consulting' | 'partnership'

export type ContactStage = 'discovery' | 'qualified' | 'proposal' | 'negotiation' | 'closed'

// Convenience types
export type Idea = Database['public']['Tables']['ideas']['Row']
export type Draft = Database['public']['Tables']['drafts']['Row']
export type DraftVersion = Database['public']['Tables']['draft_versions']['Row']
export type ScheduledPost = Database['public']['Tables']['scheduled_posts']['Row']
export type PublishedPost = Database['public']['Tables']['published_posts']['Row']
export type PostComment = Database['public']['Tables']['post_comments']['Row']
export type PerformanceMetric = Database['public']['Tables']['performance_metrics']['Row']
export type Contact = Database['public']['Tables']['contacts']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type DailyLog = Database['public']['Tables']['daily_logs']['Row']
export type VoiceProfile = Database['public']['Tables']['voice_profiles']['Row']
export type PromptTemplate = Database['public']['Tables']['prompt_templates']['Row']
export type ActivityLog = Database['public']['Tables']['activity_logs']['Row']