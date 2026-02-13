import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { io, Socket } from 'socket.io-client';
import { db } from '../firebase';
import { Order, TrackingData } from '../types';
import 'leaflet/dist/leaflet.css';

const SOCKET_URL = import.meta.env.VITE_SOCKET_SERVER_URL || 'http://localhost:3001';
const KITCHEN_LAT = 28.6139;
const KITCHEN_LNG = 77.209;

// Custom icons
const kitchenIcon = L.divIcon({ html: '<div style="font-size:24px">🏪</div>', className: 'custom-marker', iconSize: [30, 30] });
const userIcon = L.divIcon({ html: '<div style="font-size:24px">📍</div>', className: 'custom-marker', iconSize: [30, 30] });
const bikeIcon = L.divIcon({ html: '<div style="font-size:28px">🏍️</div>', className: 'custom-marker', iconSize: [35, 35] });

export default function LiveTracking() {
    const [activeOrders, setActiveOrders] = useState<Order[]>([]);
    const [trackingData, setTrackingData] = useState<Map<string, TrackingData>>(new Map());
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        // Active orders
        const unsub = onSnapshot(
            query(collection(db, 'orders'), where('status', 'in', ['confirmed', 'preparing', 'picked_up', 'on_the_way'])),
            (snap) => {
                setActiveOrders(snap.docs.map((d) => ({ ...d.data(), id: d.id } as Order)));
            }
        );

        // Socket connection
        const sock = io(SOCKET_URL, { transports: ['websocket'] });
        setSocket(sock);

        sock.on('location-update', (data: TrackingData) => {
            setTrackingData((prev) => new Map(prev).set(data.orderId, data));
        });

        // Tracking collection
        const trackUnsub = onSnapshot(
            collection(db, 'tracking'),
            (snap) => {
                const newMap = new Map<string, TrackingData>();
                snap.docs.forEach((d) => {
                    const data = d.data() as TrackingData;
                    newMap.set(d.id, data);
                });
                setTrackingData(newMap);
            }
        );

        return () => {
            unsub();
            trackUnsub();
            sock.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket) {
            // Join all active order rooms
            activeOrders.forEach((order) => {
                socket.emit('join-tracking', { orderId: order.id, role: 'admin' });
            });
        }
    }, [activeOrders, socket]);

    // Get tracking for selected order if needed
    const _selectedTracking = selectedOrder ? trackingData.get(selectedOrder) : null;
    void _selectedTracking; // Reserved for future use

    return (
        <div className="p-6 h-[calc(100vh-0px)]">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Live Tracking</h1>

            <div className="flex gap-4 h-[calc(100%-60px)]">
                {/* Orders List */}
                <div className="w-80 bg-white rounded-xl border overflow-y-auto shadow-sm">
                    <div className="p-4 border-b">
                        <h2 className="font-semibold text-gray-900">Active Deliveries ({activeOrders.length})</h2>
                    </div>
                    {activeOrders.map((order) => {
                        const tracking = trackingData.get(order.id);
                        return (
                            <button
                                key={order.id}
                                onClick={() => setSelectedOrder(order.id)}
                                className={`w-full text-left p-4 border-b hover:bg-gray-50 ${selectedOrder === order.id ? 'bg-brand-maroon/5 border-l-4 border-l-brand-maroon' : ''
                                    }`}
                            >
                                <p className="font-semibold text-sm">#{order.id.slice(-6).toUpperCase()}</p>
                                <p className="text-xs text-gray-500">{order.customerName}</p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 capitalize">
                                        {order.status.replace('_', ' ')}
                                    </span>
                                    {tracking && (
                                        <span className="text-xs text-gray-500">{tracking.etaMinutes} min</span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                    {activeOrders.length === 0 && (
                        <div className="p-8 text-center text-gray-400 text-sm">No active deliveries</div>
                    )}
                </div>

                {/* Map */}
                <div className="flex-1 rounded-xl overflow-hidden border shadow-sm">
                    <MapContainer
                        center={[KITCHEN_LAT, KITCHEN_LNG]}
                        zoom={13}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* Kitchen Marker */}
                        <Marker position={[KITCHEN_LAT, KITCHEN_LNG]} icon={kitchenIcon}>
                            <Popup>Cloud Kitchen</Popup>
                        </Marker>

                        {/* Active Delivery Markers */}
                        {Array.from(trackingData.entries()).map(([orderId, data]) => (
                            <React.Fragment key={orderId}>
                                {data.deliveryBoyLatLng && (
                                    <Marker position={[data.deliveryBoyLatLng.lat, data.deliveryBoyLatLng.lng]} icon={bikeIcon}>
                                        <Popup>Delivery Partner - Order #{orderId.slice(-6).toUpperCase()}</Popup>
                                    </Marker>
                                )}
                                {data.userLatLng && (
                                    <Marker position={[data.userLatLng.lat, data.userLatLng.lng]} icon={userIcon}>
                                        <Popup>Customer</Popup>
                                    </Marker>
                                )}
                                {data.routePolyline && (
                                    <Polyline
                                        positions={data.routePolyline}
                                        pathOptions={{ color: '#7A0C0C', weight: 4, opacity: 0.8, dashArray: '10, 10' }}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}
