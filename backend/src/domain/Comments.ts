export interface Comments{
    comment_id: number;
    post_id: number;
    user_id: number;
    user_name: string;
    content: string;
    created_at: Date;
}