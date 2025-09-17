export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: '13.0.5'
    }
    graphql_public: {
        Tables: {
            [_ in never]: never
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            graphql: {
                Args: {
                    extensions?: Json
                    operationName?: string
                    query?: string
                    variables?: Json
                }
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
    public: {
        Tables: {
            _prisma_migrations: {
                Row: {
                    applied_steps_count: number
                    checksum: string
                    finished_at: string | null
                    id: string
                    logs: string | null
                    migration_name: string
                    rolled_back_at: string | null
                    started_at: string
                }
                Insert: {
                    applied_steps_count?: number
                    checksum: string
                    finished_at?: string | null
                    id: string
                    logs?: string | null
                    migration_name: string
                    rolled_back_at?: string | null
                    started_at?: string
                }
                Update: {
                    applied_steps_count?: number
                    checksum?: string
                    finished_at?: string | null
                    id?: string
                    logs?: string | null
                    migration_name?: string
                    rolled_back_at?: string | null
                    started_at?: string
                }
                Relationships: []
            }
            Comment: {
                Row: {
                    authorId: string
                    content: string
                    createdAt: string
                    id: string
                    isActive: boolean
                    postId: string
                }
                Insert: {
                    authorId: string
                    content: string
                    createdAt?: string
                    id: string
                    isActive?: boolean
                    postId: string
                }
                Update: {
                    authorId?: string
                    content?: string
                    createdAt?: string
                    id?: string
                    isActive?: boolean
                    postId?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'Comment_authorId_fkey'
                        columns: ['authorId']
                        isOneToOne: false
                        referencedRelation: 'User'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'Comment_postId_fkey'
                        columns: ['postId']
                        isOneToOne: false
                        referencedRelation: 'Post'
                        referencedColumns: ['id']
                    },
                ]
            }
            Follow: {
                Row: {
                    createdAt: string
                    followerId: string
                    followingId: string
                    id: string
                }
                Insert: {
                    createdAt?: string
                    followerId: string
                    followingId: string
                    id: string
                }
                Update: {
                    createdAt?: string
                    followerId?: string
                    followingId?: string
                    id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'Follow_followerId_fkey'
                        columns: ['followerId']
                        isOneToOne: false
                        referencedRelation: 'User'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'Follow_followingId_fkey'
                        columns: ['followingId']
                        isOneToOne: false
                        referencedRelation: 'User'
                        referencedColumns: ['id']
                    },
                ]
            }
            Like: {
                Row: {
                    createdAt: string
                    id: string
                    postId: string
                    userId: string
                }
                Insert: {
                    createdAt?: string
                    id: string
                    postId: string
                    userId: string
                }
                Update: {
                    createdAt?: string
                    id?: string
                    postId?: string
                    userId?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'Like_postId_fkey'
                        columns: ['postId']
                        isOneToOne: false
                        referencedRelation: 'Post'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'Like_userId_fkey'
                        columns: ['userId']
                        isOneToOne: false
                        referencedRelation: 'User'
                        referencedColumns: ['id']
                    },
                ]
            }
            Notification: {
                Row: {
                    createdAt: string
                    id: string
                    isRead: boolean
                    message: string
                    notificationType: Database['public']['Enums']['NotificationType']
                    postId: string | null
                    recipientId: string
                    senderId: string
                }
                Insert: {
                    createdAt?: string
                    id: string
                    isRead?: boolean
                    message: string
                    notificationType: Database['public']['Enums']['NotificationType']
                    postId?: string | null
                    recipientId: string
                    senderId: string
                }
                Update: {
                    createdAt?: string
                    id?: string
                    isRead?: boolean
                    message?: string
                    notificationType?: Database['public']['Enums']['NotificationType']
                    postId?: string | null
                    recipientId?: string
                    senderId?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'Notification_postId_fkey'
                        columns: ['postId']
                        isOneToOne: false
                        referencedRelation: 'Post'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'Notification_recipientId_fkey'
                        columns: ['recipientId']
                        isOneToOne: false
                        referencedRelation: 'User'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'Notification_senderId_fkey'
                        columns: ['senderId']
                        isOneToOne: false
                        referencedRelation: 'User'
                        referencedColumns: ['id']
                    },
                ]
            }
            Post: {
                Row: {
                    authorId: string
                    category: Database['public']['Enums']['PostCategory']
                    commentCount: number
                    content: string
                    createdAt: string
                    id: string
                    imageUrl: string | null
                    isActive: boolean
                    likeCount: number
                    updatedAt: string
                }
                Insert: {
                    authorId: string
                    category?: Database['public']['Enums']['PostCategory']
                    commentCount?: number
                    content: string
                    createdAt?: string
                    id: string
                    imageUrl?: string | null
                    isActive?: boolean
                    likeCount?: number
                    updatedAt: string
                }
                Update: {
                    authorId?: string
                    category?: Database['public']['Enums']['PostCategory']
                    commentCount?: number
                    content?: string
                    createdAt?: string
                    id?: string
                    imageUrl?: string | null
                    isActive?: boolean
                    likeCount?: number
                    updatedAt?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'Post_authorId_fkey'
                        columns: ['authorId']
                        isOneToOne: false
                        referencedRelation: 'User'
                        referencedColumns: ['id']
                    },
                ]
            }
            User: {
                Row: {
                    avatarUrl: string | null
                    bio: string | null
                    createdAt: string
                    email: string
                    firstName: string
                    id: string
                    lastName: string
                    location: string | null
                    password: string
                    role: Database['public']['Enums']['Role']
                    updatedAt: string
                    username: string
                    website: string | null
                }
                Insert: {
                    avatarUrl?: string | null
                    bio?: string | null
                    createdAt?: string
                    email: string
                    firstName: string
                    id: string
                    lastName: string
                    location?: string | null
                    password: string
                    role?: Database['public']['Enums']['Role']
                    updatedAt: string
                    username: string
                    website?: string | null
                }
                Update: {
                    avatarUrl?: string | null
                    bio?: string | null
                    createdAt?: string
                    email?: string
                    firstName?: string
                    id?: string
                    lastName?: string
                    location?: string | null
                    password?: string
                    role?: Database['public']['Enums']['Role']
                    updatedAt?: string
                    username?: string
                    website?: string | null
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
            NotificationType: 'FOLLOW' | 'LIKE' | 'COMMENT'
            PostCategory: 'GENERAL' | 'ANNOUNCEMENT' | 'QUESTION'
            Role: 'USER' | 'ADMIN'
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
        | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
        ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
              DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
        : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
          DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
          Row: infer R
      }
        ? R
        : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
            DefaultSchema['Views'])
      ? (DefaultSchema['Tables'] &
            DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R
        }
          ? R
          : never
      : never

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema['Tables']
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
        : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Insert: infer I
      }
        ? I
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
      ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
            Insert: infer I
        }
          ? I
          : never
      : never

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema['Tables']
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
        : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Update: infer U
      }
        ? U
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
      ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
            Update: infer U
        }
          ? U
          : never
      : never

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
        | keyof DefaultSchema['Enums']
        | { schema: keyof DatabaseWithoutInternals },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
        : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
      ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
      : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
        | keyof DefaultSchema['CompositeTypes']
        | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
        ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
        : never = never,
> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
      ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
      : never

export const Constants = {
    graphql_public: {
        Enums: {},
    },
    public: {
        Enums: {
            NotificationType: ['FOLLOW', 'LIKE', 'COMMENT'],
            PostCategory: ['GENERAL', 'ANNOUNCEMENT', 'QUESTION'],
            Role: ['USER', 'ADMIN'],
        },
    },
} as const
