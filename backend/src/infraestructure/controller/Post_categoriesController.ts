import { Post_categoriesApplication } from "../../application/Post_categoriesApplication";
import { Post_categories } from "../../domain/entities/Post_categories";
import {Request, Response} from "express";
import { Validators } from "../config/validations";

export class Post_categoriesController{
    private app: Post_categoriesApplication;
    constructor(app: Post_categoriesApplication){
        this.app = app;
    }

    async registerPost_category(request: Request, response: Response): Promise <Response>{
        const { description } = request.body;
        try{

            if(!Validators.description(description))
                return response.status(400).json({message: "Descripción inválida"});
        
            const post_category: Omit<Post_categories, "post_category_id"> = {description};
            const post_categoryId = await this.app.createPost_category(post_category);

            return response.status(201).json({message:"Post_category creado exitosamente:", post_categoryId});
        }catch(error){

            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async searchPost_categoryById (request: Request, response: Response): Promise<Response>{
        try{
            const post_categoryId = parseInt(request.params.id);
            if(isNaN(post_categoryId)) return response.status(400).json({message:"Error en parámetro"});
            const post_category = await this.app.getPost_categoryById (post_categoryId);
            if(!post_category) return response.status(404).json({message:"Post_category no encontrado"});

            return response.status(200).json(post_category);
        
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async searchPost_categoryByDescription (request: Request, response: Response): Promise<Response>{
        try{
            const {description}= (request.params);
            if(!Validators.description(description))
                return response.status(400).json({ error: "Descripción no válida" });
 
            const post_category = await this.app.getPost_categoryByDescription(description);
            if(!post_category) return response.status(404).json({message:"post_category no encontrado"});

            return response.status(200).json(post_category);
        
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async allPost_categories (request: Request, response: Response): Promise<Response>{
        try{
            const post_category = await this.app.getAllPost_categories();
            return response.status(200).json(post_category)
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }

    async downPost_category(request: Request, response: Response): Promise<Response>{
        try{
            const post_categoryId = parseInt(request.params.id);
            if(isNaN(post_categoryId)) return response.status(400).json({message:"Error en parámetro"});
            const post_category = await this.app.deletePost_category(post_categoryId);
            if(!post_category) return response.status(404).json({message:"Post_category no encontrado"});

            return response.status(200).json(post_category);
        
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }
    
    async updatePost_category(request: Request, response: Response): Promise<Response>{
        try{
            const post_categoryId = parseInt(request.params.id);
            if(isNaN(post_categoryId)) return response.status(400).json({message:"Error en parámetro"});
            
            let { description } = request.body;

             
            if (description && !Validators.description(description)) 
                return response.status(400).json({message:"La descripción solo debe contener letras",
            });
 
      
      const updated = await this.app.updatePost_category(post_categoryId,{description});
      if(!updated) return response.status(404).json({message: "Post categories no encontrado o sin cambios"});

      return response.status(200).json({message:"Categoria post actualizado exitosamente"})
 
        }catch(error){
            if(error instanceof Error){
                return response.status(500).json({message:"Error en el servidor"});
            }
        }
        return response.status(400).json({message:"Error en la petición"});
    }
}