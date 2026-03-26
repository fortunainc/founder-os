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
      published_posts: {
        Row: {
          id: string
          user_id: string
          post_text: string
          post_type: 'post' | 'thread' | 'story' | 'comment'
          topic: string | null
          pillar: string | null
          posted_at: string
          platform: 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'other'
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_text: string
          post_type?: 'post' | 'thread' | 'story' | 'comment'
          topic?: string | null
          pillar?: string | null
          posted_at?: string
          platform?: 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'other'
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_text?: string
          post_type?: 'post' | 'thread' | 'story' | 'comment'
          topic?: string | null
          pillar?: string | null
          posted_at?: string
          platform?: 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'other'
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          target_date: string | null
          status: 'not_started' | 'in_progress' | 'completed' | 'on_hold'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          target_date?: string | null
          status?: 'not_started' | 'in_progress' | 'completed' | 'on_hold'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          target_date?: string | null
          status?: 'not_started' | 'in_progress' | 'completed' | 'on_hold'
          created_at?: string
          updated_at?: string
        }
      }
      content_pillars: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          color: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          color?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          color?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string | null
          company: string | null
          role: string | null
          status: 'lead' | 'contact' | 'customer' | 'archived'
          notes: string | null
          tags: string[] | null
          linkedin_url: string | null
          last_contacted: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email?: string | null
          company?: string | null
          role?: string | null
          status?: 'lead' | 'contact' | 'customer' | 'archived'
          notes?: string | null
          tags?: string[] | null
          linkedin_url?: string | null
          last_contacted?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string | null
          company?: string | null
          role?: string | null
          status?: 'lead' | 'contact' | 'customer' | 'archived'
          notes?: string | null
          tags?: string[] | null
          linkedin_url?: string | null
          last_contacted?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ai_usage_logs: {
        Row: {
          id: string
          user_id: string
          feature: 'content_generation' | 'content_improvement' | 'comment_replies' | 'priority_generation' | 'lead_scoring' | 'insights_analysis'
          prompt_tokens: number
          completion_tokens: number
          total_tokens: number
          cost: number
          model: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          feature: 'content_generation' | 'content_improvement' | 'comment_replies' | 'priority_generation' | 'lead_scoring' | 'insights_analysis'
          prompt_tokens: number
          completion_tokens: number
          total_tokens: number
          cost: number
          model: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          feature?: 'content_generation' | 'content_improvement' | 'comment_replies' | 'priority_generation' | 'lead_scoring' | 'insights_analysis'
          prompt_tokens?: number
          completion_tokens?: number
          total_tokens?: number
          cost?: number
          model?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          preferred_post_length: 'short' | 'medium' | 'long' | null
          posting_frequency: string | null
          timezone: string | null
          linkedin_url: string | null
          twitter_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          preferred_post_length?: 'short' | 'medium' | 'long' | null
          posting_frequency?: string | null
          timezone?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          preferred_post_length?: 'short' | 'medium' | 'long' | null
          posting_frequency?: string | null
          timezone?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}