import express,{Request, Response} from "express";
import rolesRoutes from "../routers/RolesRoutes";
import departmentsRoutes from "../routers/DepartmentsRoutes";
import document_typesRoutes from "../routers/Document_typesRouter";
import post_categoriesRoutes from "../routers/Post_categoriesRoutes";
import number_typesRoutes from "../routers/Number_typesRoutes";
import media_typesRoutes from "../routers/Media_typesRoutes";
import citiesRoutes from "../routers/CitiesRoutes";

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
        this.app.use("/api", document_typesRoutes);
        this.app.use("/api", number_typesRoutes);
        this.app.use("/api", post_categoriesRoutes);
        this.app.use("/api", media_typesRoutes);
        this.app.use("/api", citiesRoutes);
    }
    getApp(){
        return this.app;
    }
}

export default new App().getApp();