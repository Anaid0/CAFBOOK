import express,{Request, Response} from "express";
import rolesRoutes from "../routers/RolesRoutes";
import departmentsRoutes from "../routers/DepartmentsRoutes"

class App{
    private app: express.Application;

    constructor(){
        this.app = express();
        this.middleware();
        this.routes();
    }

    private middleware():void{
        this.app.use(express.json());
    }

    private routes():void{
        this.app.use("/api", rolesRoutes);
        this.app.use("/api", departmentsRoutes);
    }
    getApp(){
        return this.app;
    }
}

export default new App().getApp();