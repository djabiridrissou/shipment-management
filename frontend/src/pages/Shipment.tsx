import React from 'react';
import { useFetchOneQuery } from '../redux/features/api/apiSlice';
import ShipmentTimeline from '../components/ShipmentTimeline';

const Shipment = () => {
    const shipmentId = localStorage.getItem("shipmentId");
    const { data, isLoading } = useFetchOneQuery(shipmentId);
    const shipment = data?.data;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <ShipmentTimeline shipment={shipment} />
        </div>
    );
};

export default Shipment;