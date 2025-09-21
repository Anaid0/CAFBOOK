import app from './infraestructure/web/app';
import { ServerBoostrap } from './infraestructure/boostrap/server-boostrap';
import { connectDB } from './infraestructure/config/con_data_bases';
import { initPostsPurgeJob } from './infraestructure/cron/PostsPurgue';
const server = new ServerBoostrap(app);
(
    async () =>{
        try{
            await connectDB();
            const instances = [server.init()];
            initPostsPurgeJob();
            await Promise.all(instances);
         } catch (error) {
             console.error("Error starting server:", error);
         }
    }
)();
