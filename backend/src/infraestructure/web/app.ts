import express,{Request, Response} from "express";
import rolesRoutes from "../routers/RolesRoutes";
import departmentsRoutes from "../routers/DepartmentsRoutes";
import document_typesRouter from "../routers/Document_typesRouter";
import crop_typesRouter from "../routers/Crop_typesRouter"

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
        this.app.use("/api", document_typesRouter);
        this.app.use("/api", crop_typesRouter);
    }
    getApp(){
        return this.app;
    }
}

export default new App().getApp();