import http from 'http';
import express from 'express';
import envs from "../config/enviroments-vars";
export class ServerBoostrap{
    //atributos - propiedades - caracteristicas 
    private app!: express.Application;
    //contructor
    constructor(app: express.Application){
       this.app = app;  
    }
    
    init():Promise<boolean>{
        return new Promise((resolve, reject)=>{
            const server = http.createServer(this.app);
            const PORT = envs.PORT || 4200;
    
            server.listen(PORT)
            .on("listening",()=>{
                console.log(`Server is running on port ${PORT}`);
                resolve(true);
            })
            .on("error",(err)=>{
                console.error(`Error starting server on port ${err}`);
                reject(false);
            })
        });
        
    }

}