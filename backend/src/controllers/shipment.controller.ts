import fs from "fs/promises";
import ShipmentModel from "../models/Shipment.model";

const upload = async (req: any, res: any) => {
    try {
        //console.log("fiels", req.files);
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                error: "No files uploaded. Please upload one or more .json files.",
            });
        }

        const results: any = {
            inserted: 0,
            invalidFiles: [],
            errors: [],
        };

        for (const file of req.files) {
            const filePath = file.path;
            let data;

            try {
                const fileContent = await fs.readFile(filePath, "utf-8");
                data = JSON.parse(fileContent);
            } catch (error: any) {
                results.invalidFiles.push({
                    fileName: file.originalname,
                    error: "Invalid JSON file format.",
                });
                await fs.unlink(filePath).catch((err) =>
                    console.error(`Error deleting file ${file.originalname}:`, err)
                );
                continue;
            }

            if (!Array.isArray(data)) {
                results.invalidFiles.push({
                    fileName: file.originalname,
                    error: "Invalid file content: expected an array of shipment events.",
                });
                await fs.unlink(filePath).catch((err) =>
                    console.error(`Error deleting file ${file.originalname}:`, err)
                );
                continue;
            }

            const validEntries: any = [];
            const invalidEntries: any = [];

            data.forEach((entry, index) => {
                if (
                    !entry.eventDateTime ||
                    !entry.eventPosition ||
                    !entry.eventPosition.status ||
                    !entry.eventPosition.city ||
                    !entry.eventPosition.country
                ) {
                    invalidEntries.push({
                        index,
                        error: "Missing required fields",
                        entry,
                    });
                } else {
                    validEntries.push({
                        eventDateTime: new Date(entry.eventDateTime),
                        shipmentIsDelayed: entry.shipment?.satus?.shipmentIsDelayed || 0,
                        eventPosition: {
                            status: entry.eventPosition.status,
                            comments: entry.eventPosition.comments || "",
                            city: entry.eventPosition.city,
                            country: entry.eventPosition.country,
                        },
                    });
                }
            });

            if (validEntries.length === 0) {
                results.invalidFiles.push({
                    fileName: file.originalname,
                    error: "No valid shipment events to process.",
                    invalidEntries,
                });
                await fs.unlink(filePath).catch((err) =>
                    console.error(`Error deleting file ${file.originalname}:`, err)
                );
                continue;
            }

            try {
                const shipment = new ShipmentModel({
                    events: validEntries,
                });
                await shipment.save();
                results.inserted++;
            } catch (dbError: any) {
                results.errors.push({
                    fileName: file.originalname,
                    error: `Database error: ${dbError.message}`,
                });
            }

            await fs.unlink(filePath).catch((err) =>
                console.error(`Error deleting file ${file.originalname}:`, err)
            );
        }

        return res.status(200).json({
            success: true,
            message: results.inserted > 1 ? "Files uploaded successfully." : "File uploaded successfully.",
            inserted: results.inserted,
            invalidFiles: results.invalidFiles,
            errors: results.errors,
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({
            success: false,
            error: "An unexpected error occurred while processing the files.",
        });
    }
};

const fetchAll = async (req: any, res: any) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        if (page < 1 || limit < 1) {
            return res.status(400).json({
                success: false,
                error: "Invalid page or limit value. Must be greater than 0.",
            });
        }

        const skip = (page - 1) * limit;

        const [documents, totalCount] = await Promise.all([
            ShipmentModel.find().skip(skip).limit(limit),
            ShipmentModel.countDocuments(),
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return res.status(200).json({
            success: true,
            data: documents,
            pagination: {
                page,
                limit,
                totalPages,
                totalCount,
            },
        });
    } catch (error) {
        console.error("Error fetching shipments:", error);
        return res.status(500).json({
            success: false,
            error: "An error occurred while fetching the shipments.",
        });
    }
};

const fetch = async (req: any, res: any) => {
    try {
        const shipmentId = req.query.id;

        if (!shipmentId) {
            return res.status(400).json({
                success: false,
                error: "Shipment ID is required.",
            });
        }

        const shipment = await ShipmentModel.findById(shipmentId);

        if (!shipment) {
            return res.status(404).json({
                success: false,
                error: "Shipment not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: shipment,
        });
    } catch (error) {
        console.error("Error fetching shipment:", error);
        return res.status(500).json({
            success: false,
            error: "An error occurred while fetching the shipment.",
        });
    }
};

const deleteShipment = async (req: any, res: any) => {
    try {
        const shipmentId = req.query.id;

        if (!shipmentId) {
            return res.status(400).json({
                success: false,
                error: "Shipment ID is required.",
            });
        }

        const shipment = await ShipmentModel.findByIdAndDelete(shipmentId);

        if (!shipment) {
            return res.status(404).json({
                success: false,
                error: "Shipment not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Shipment deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting shipment:", error);
        return res.status(500).json({
            success: false,
            error: "An error occurred while deleting the shipment.",
        });
    }
};

export default { upload, fetchAll, fetch, deleteShipment };