import { Post_categories } from '../domain/models/Post_categories';
import { Post_categoriesPort } from '../domain/ports/Post_categoriesPort';

export class Post_categoriesApplication {
    private port: Post_categoriesPort;

    constructor(port: Post_categoriesPort) {
        this.port = port;
    }

    async createPost_category(post_category:Omit<Post_categories, "post_category_id">):Promise<number>{
        const existingPost_category = await this.port.getPost_categoryByDescription(post_category.description)
        if(!existingPost_category){
            return await this.port.createPost_category(post_category);
        }
        throw new Error("La categoria del post ya existe");
    }

    async updatePost_category(post_category_id:number, post_category:Partial<Post_categories>):Promise<boolean>{
        const existingPost_category= await this.port.getPost_categoryById(post_category_id);
        if(!existingPost_category){
            throw new Error("La categoría del post no existe")
        }

        if(post_category.description){
            const descriptionTaken = await this.port.getPost_categoryByDescription(post_category.description);
            if(descriptionTaken && descriptionTaken.post_category_id !== post_category_id){
                throw new Error("Error en actualizar la descripcion NO SE PUEDE!")
            }
        }
        return await this.port.updatePost_category(post_category_id,post_category);
    }

    async deletePost_category(post_category_id:number): Promise<boolean>{
        const existingPost_category = await this.port.getPost_categoryById(post_category_id);
        if(!existingPost_category){
            throw new Error("No se encontró la categoria del post");
        }
        return await this.port.deletePost_category(post_category_id);

    }

    async getPost_categoryById(post_category_id:number): Promise<Post_categories | null>{
        return await this.port.getPost_categoryById(post_category_id);

    }

    async getPost_categoryByDescription(description:string): Promise<Post_categories | null>{
        return await this.port.getPost_categoryByDescription(description);
    }

    async getAllPost_categories(): Promise <Post_categories[]>{
        return await this.port.getAllPost_categories();
    }
    
}