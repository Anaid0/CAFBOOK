
import app from './infraestructure/web/app';
import { ServerBoostrap } from './infraestructure/boostrap/servers-boostrap';
import { connectDB } from './infraestructure/config/con_data_bases';
const server = new ServerBoostrap(app);

(
    async () =>{
        try{
            await connectDB();
            const instances = [server.init()];
            await Promise.all(instances);
         } catch (error) {
             console.error("Error starting server:", error);
         }
    }
)();