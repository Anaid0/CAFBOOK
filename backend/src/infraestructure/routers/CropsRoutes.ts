import { Router, Request } from 'express';
import { CropsAdapter } from "../adapter/CropsAdapter";
import { CropsApplication } from "../../application/CropsApplication";
import { CropsController } from "../controller/CropsController";


const router = Router();


const cropsAdapter = new CropsAdapter();
const cropsApp = new CropsApplication(cropsAdapter);
const cropsController = new CropsController(cropsApp);


router.post("/crops", (Request, Response) => cropsController.registerCrop(Request, Response));

router.get("/crops/:id", (Request, Response) => cropsController.searchCropById(Request, Response));


router.get("/crops/type/:id", (Request, Response) => cropsController.searchCropsByCropTypeId(Request, Response));


router.get("/crops", (Request, Response) => cropsController.allCrops(Request, Response));


router.put("/crops/:id", (Request, Response) => cropsController.updateCrop(Request, Response));


router.delete("/crops/:id", (Request, Response) => cropsController.downCrop(Request, Response));

export default router;
