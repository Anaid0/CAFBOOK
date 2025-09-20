import { Router, Request, Response } from 'express';
import { AddressesAdapter } from '../adapter/AddressesAdapter';
import { AddressesApplication } from '../../application/AddressesApplication';
import { AddressesController } from '../controller/AddressesController';

const router = Router();


const addressesAdapter = new AddressesAdapter();
const addresesApp = new AddressesApplication(addressesAdapter);
const addressesController = new AddressesController(addresesApp);

router.post("/addresses", async (req: Request, res: Response) => {
    try {
        await addressesController.registerAddress(req, res);
    } catch (error) {
        console.error("Error en ciudad: " + error);
        res.status(400).json({ message: "Error en la creación de la ciudad" });
    }
});

router.get("/addresses", async (req: Request, res: Response) => {
    try {
        await addressesController.allAddresses(req, res);
    } catch (error) {
        console.error("Error en ciudades: " + error);
        res.status(400).json({ message: "Error en ciudades" });
    }
});

router.get("/address/:id", async (req: Request, res: Response) => {
    try {
        await addressesController.searchAddressById(req, res);
    } catch (error) {
        console.error("Error en ciudad: " + error);
        res.status(400).json({ message: "Error en ciudad" });
    }
});

router.get("/address/city/:id", async(Request, Response)=>{
    try {
        await  addressesController.searchAddressByCityId(Request, Response);
      } catch (error) {
          console.error("Error en ciudades:"+ error);
          Response.status(400).json({message: "Error en ciudades" });
      }
});

router.get("/address/city/name/:name", async(Request, Response)=>{
    try {
        await  addressesController.searchAddressByCityName(Request, Response);
      } catch (error) {
          console.error("Error en ciudades:"+ error);
          Response.status(400).json({message: "Error en ciudades" });
      }
});

router.get("/address/name/:name", async (req: Request, res: Response) => {
    try {
        await addressesController.searchAddressByVereda(req, res);
    } catch (error) {
        console.error("Error en nombre: " + error);
        res.status(400).json({ message: "Error en nombre" });
    }
});


router.delete("/address/:id", async (req: Request, res: Response) => {
    try {
        await addressesController.deleteAddress(req, res);
    } catch (error) {
        console.error("Error eliminando ciudad: " + error);
        res.status(400).json({ message: "Error eliminando ciudad" });
    }
});

router.put("/address/:id", async (req: Request, res: Response) => {
    try {
        await addressesController.updateAddress(req, res);
    } catch (error) {
        console.error("Error actualizando ciudad: " + error);
        res.status(400).json({ message: "Error actualizando ciudad" });
    }
});

export default router;
