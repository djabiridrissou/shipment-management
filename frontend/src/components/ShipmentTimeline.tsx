import React, { useState } from 'react';
import { Check, MapPin, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

const ShipmentTimeline = ({ shipment }: any) => {
    const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});

    if (!shipment?.events?.length) {
        return <div className="p-4">No shipment data available</div>;
    }


    const formatDateWithSuperscript = (date: Date) => {
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' });

        let suffix = 'th';
        if (day === 1 || day === 21 || day === 31) suffix = 'st';
        else if (day === 2 || day === 22) suffix = 'nd';
        else if (day === 3 || day === 23) suffix = 'rd';

        return (
            <div className="text-right">
                <div className="font-medium text-xs md:text-sm whitespace-nowrap">
                    {month} {day}
                    <sup className="text-xs">{suffix}</sup>
                </div>
            </div>
        );
    };

    const formatTime = (date: Date) => {
        return date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }).toLowerCase();
    };

    const sortedEvents = [...shipment.events].sort((a, b) => {
        return new Date(b.eventDateTime).getTime() - new Date(a.eventDateTime).getTime();
    });

    const groupedEvents = sortedEvents.reduce((acc, event) => {
        const date = new Date(event.eventDateTime).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(event);
        return acc;
    }, {});

    const toggleComment = (eventId: string) => {
        setExpandedComments((prev) => ({
            ...prev,
            [eventId]: !prev[eventId]
        }));
    };

    const getEventIcon = (status: string) => {
        if (status === 'DELIVERED') {
            return (
                <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center border-2 -ml-2 border-blue-500 rounded-full">
                    <Check className="w-4 h-4 md:w-6 md:h-6 text-blue-500" />
                </div>
            );
        }
        if (status?.includes('ARRIVED')) {
            return (
                <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center border-2 -ml-2 border-blue-500 rounded-full">
                    <MapPin className="w-4 h-4 md:w-6 md:h-6 text-blue-500" />
                </div>
            );
        }
        if (status?.includes('DELAYED')) {
            return <div className="w-2 h-2 md:w-3 md:h-3 -ml-1 rounded-full bg-yellow-500" />;
        }
        if (status?.includes('EXCEPTION')) {
            return <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500" />;
        }
        return <div className="w-2 h-2 md:w-3 md:h-3 -ml-1 rounded-full bg-blue-500" />;
    };

    const sortedGroupedEvents = Object.entries(groupedEvents).sort((a, b) => {
        return new Date(b[0]).getTime() - new Date(a[0]).getTime();
    });

    return (
        <div className="max-w-2xl mx-auto p-2 md:p-4">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Shipment History</h2>

            <div className="relative">
                {sortedGroupedEvents.map(([date, events]: any, groupIndex) => (
                    <div key={date} className="mb-6 md:mb-8">
                        {events.map((event: any, eventIndex: any) => {
                            const eventDate = new Date(event.eventDateTime);
                            const isDelayed = event.shipmentIsDelayed;
                            const isLast = groupIndex === sortedGroupedEvents.length - 1 &&
                                eventIndex === events.length - 1;
                            const showDate = eventIndex === 0;

                            return (
                                <div key={event._id} className="relative flex">
                                    {/* Fixed width column for date/time */}
                                    <div className="w-20 md:w-32 pt-1 pr-2 md:pr-4 flex flex-col text-right">
                                        {showDate && formatDateWithSuperscript(eventDate)}
                                        <div className="text-xs md:text-sm text-gray-500 whitespace-nowrap">
                                            {formatTime(eventDate)}
                                        </div>
                                    </div>

                                    <div className="flex-1 pl-6 md:pl-8 pb-6 md:pb-8">
                                        {!isLast && (
                                            <div className="absolute left-24 md:left-32 top-6 w-0.5 h-full bg-gray-200" />
                                        )}

                                        <div className="flex items-start">
                                            <div className="absolute left-24 md:left-32 top-1">
                                                {getEventIcon(event.eventPosition?.status)}
                                            </div>

                                            {/* <div className={`flex-1 ml-6 md:ml-8 ${isDelayed ? 'text-yellow-600' : ''}`}> */}
                                            <div className={`flex-1 ml-6 md:ml-8`}>
                                                <div className="flex flex-col space-y-1 md:space-y-2">
                                                    <h3 className="font-semibold text-sm md:text-base break-words">
                                                        {event.eventPosition?.status || 'Status Unknown'}
                                                    </h3>

                                                    {event.eventPosition?.description && (
                                                        <p className="text-xs md:text-sm text-gray-600 break-words">
                                                            {event.eventPosition.description}
                                                        </p>
                                                    )}

                                                    {event.eventPosition?.comments && (
                                                        <div className="mt-1 md:mt-2">
                                                            <div className={`relative`}>
                                                                <div
                                                                    className={`text-xs md:text-sm text-gray-600 break-words ${!expandedComments[event._id] ? 'line-clamp-3' : ''
                                                                        }`}>
                                                                    {event.eventPosition.comments}
                                                                </div>
                                                                {event.eventPosition.comments.length > 150 && !expandedComments[event._id] && (
                                                                    <button
                                                                        onClick={() => toggleComment(event._id)}
                                                                        className="text-blue-500 text-xs md:text-sm underline inline-flex items-center"
                                                                    >
                                                                        view more <ChevronDown className="w-3 h-3 ml-1" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                            {expandedComments[event._id] && (
                                                                <div>
                                                                    <button
                                                                        onClick={() => toggleComment(event._id)}
                                                                        className="text-blue-500 text-xs md:text-sm underline mt-1 inline-flex items-center"
                                                                    >
                                                                        view less <ChevronUp className="w-3 h-3 ml-1" />
                                                                    </button>
                                                                </div>
                                                            )}

                                                            <div className="text-xs md:text-sm text-gray-600">
                                                                {event.eventPosition?.city}, {event.eventPosition?.country}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShipmentTimeline;