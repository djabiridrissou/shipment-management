import express from "express";
import uploadMiddleware from "../middlewares/upload.middleware";
import shipmentController from "../controllers/shipment.controller";

const shipmentRoutes = express.Router();

shipmentRoutes.post("/upload", uploadMiddleware.array("files"), shipmentController.upload);
shipmentRoutes.get("/all", shipmentController.fetchAll);
shipmentRoutes.get("/one", shipmentController.fetch);
shipmentRoutes.delete("/delete", shipmentController.deleteShipment);

export default shipmentRoutes;