export interface Posts{
    post_id: number;
    tittle: string;
    description: string;
    post_category_id: number;
    post_category_description: string;
    user_id: number;
    user_email: string;
    created_at: Date;
}