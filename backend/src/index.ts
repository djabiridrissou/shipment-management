import express, { Request, Response } from "express";
import cors from "cors";
import dbConfig from "./config/db.config";
import shipmentRoutes from "./routes/shipment.routes";

const app = express();
const PORT = process.env.PORT || 1220;

app.use(cors());

dbConfig();

app.get("/", (req: Request, res: Response) => {
  res.send("Server started.....");
});

app.use("/api", shipmentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});