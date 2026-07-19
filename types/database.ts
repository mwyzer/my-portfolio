export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      portfolio_projects: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          description: string;
          image_url: string | null;
          live_url: string | null;
          github_url: string | null;
          technologies: string[];
          featured: boolean;
          order: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          description: string;
          image_url?: string | null;
          live_url?: string | null;
          github_url?: string | null;
          technologies?: string[];
          featured?: boolean;
          order?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          description?: string;
          image_url?: string | null;
          live_url?: string | null;
          github_url?: string | null;
          technologies?: string[];
          featured?: boolean;
          order?: number;
        };
      };
      portfolio_about: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          title: string;
          bio: string;
          avatar_url: string | null;
          resume_url: string | null;
          skills: string[];
          social_links: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          title: string;
          bio: string;
          avatar_url?: string | null;
          resume_url?: string | null;
          skills?: string[];
          social_links?: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          title?: string;
          bio?: string;
          avatar_url?: string | null;
          resume_url?: string | null;
          skills?: string[];
          social_links?: Json;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string;
          cover_image: string | null;
          published: boolean;
          author_id: string;
          tags: string[];
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          slug: string;
          content: string;
          excerpt?: string;
          cover_image?: string | null;
          published?: boolean;
          author_id: string;
          tags?: string[];
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string;
          cover_image?: string | null;
          published?: boolean;
          author_id?: string;
          tags?: string[];
        };
      };
      site_settings: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          key: string;
          value: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          key: string;
          value: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          key?: string;
          value?: Json;
        };
      };
    };
  };
}

export type PortfolioProject = Database["public"]["Tables"]["portfolio_projects"]["Row"];
export type PortfolioAbout = Database["public"]["Tables"]["portfolio_about"]["Row"];
export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
export type SiteSetting = Database["public"]["Tables"]["site_settings"]["Row"];
