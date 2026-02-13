import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Order, OrderStatus, DeliveryBoy } from '../types';
import { Check, X, Truck } from 'lucide-react';

const STATUS_OPTIONS: { value: OrderStatus; label: string; color: string }[] = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'preparing', label: 'Preparing', color: 'bg-purple-100 text-purple-800' },
    { value: 'ready', label: 'Ready', color: 'bg-cyan-100 text-cyan-800' },
    { value: 'picked_up', label: 'Picked Up', color: 'bg-orange-100 text-orange-800' },
    { value: 'on_the_way', label: 'On the Way', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

export default function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
    const [assignModal, setAssignModal] = useState<string | null>(null);

    useEffect(() => {
        const ordersUnsub = onSnapshot(
            query(collection(db, 'orders'), orderBy('createdAt', 'desc')),
            (snap) => setOrders(snap.docs.map((d) => ({ ...d.data(), id: d.id } as Order)))
        );
        const boysUnsub = onSnapshot(collection(db, 'deliveryBoys'), (snap) => {
            setDeliveryBoys(snap.docs.map((d) => ({ ...d.data(), id: d.id } as DeliveryBoy)));
        });
        return () => { ordersUnsub(); boysUnsub(); };
    }, []);

    const handleStatusChange = async (orderId: string, status: OrderStatus) => {
        const updates: Record<string, string | boolean> = { status };
        if (status === 'confirmed') updates.confirmedAt = new Date().toISOString();
        if (status === 'delivered') updates.deliveredAt = new Date().toISOString();
        if (status === 'cancelled') {
            updates.cancelledAt = new Date().toISOString();
            updates.cancelledBy = 'admin';
        }
        await updateDoc(doc(db, 'orders', orderId), updates);
    };

    const handleAssign = async (orderId: string, deliveryBoyId: string) => {
        await updateDoc(doc(db, 'orders', orderId), { assignedDeliveryBoyId: deliveryBoyId });
        setAssignModal(null);
    };

    const filtered = orders.filter((o) => {
        if (filter === 'active') return !['delivered', 'cancelled'].includes(o.status);
        if (filter === 'completed') return ['delivered', 'cancelled'].includes(o.status);
        return true;
    });

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Orders ({orders.length})</h1>
                <div className="flex gap-2">
                    {['all', 'active', 'completed'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as 'all' | 'active' | 'completed')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${filter === f ? 'bg-brand-maroon text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {filtered.map((order) => {
                    const statusOption = STATUS_OPTIONS.find((s) => s.value === order.status);
                    const assignedBoy = deliveryBoys.find((b) => b.id === order.assignedDeliveryBoyId);

                    return (
                        <div key={order.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="font-bold text-gray-900">Order #{order.id.slice(-6).toUpperCase()}</p>
                                    <p className="text-sm text-gray-500">{order.customerName} • {new Date(order.createdAt).toLocaleString()}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Payment: {order.paymentMethod?.toUpperCase()} ({order.paymentStatus})
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusOption?.color}`}>
                                    {statusOption?.label}
                                </span>
                            </div>

                            {/* Items */}
                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                {order.items?.map((item, i) => (
                                    <p key={i} className="text-sm text-gray-600">
                                        {item.quantity}x {item.name} — ₹{(item.offerPrice || item.price) * item.quantity}
                                    </p>
                                ))}
                                <p className="text-sm font-bold text-gray-900 mt-2 border-t pt-2">
                                    Total: ₹{order.finalAmount || order.totalAmount}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                    className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-maroon/20"
                                    title="Change order status"
                                    aria-label="Change order status"
                                >
                                    {STATUS_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>

                                <button
                                    onClick={() => setAssignModal(order.id)}
                                    className="flex items-center gap-1 px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
                                >
                                    <Truck size={14} />
                                    {assignedBoy ? assignedBoy.name : 'Assign Delivery'}
                                </button>

                                {order.status === 'pending' && (
                                    <button
                                        onClick={() => handleStatusChange(order.id, 'confirmed')}
                                        className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                                    >
                                        <Check size={14} /> Confirm
                                    </button>
                                )}

                                {!['delivered', 'cancelled'].includes(order.status) && (
                                    <button
                                        onClick={() => handleStatusChange(order.id, 'cancelled')}
                                        className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                                    >
                                        <X size={14} /> Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Assign Delivery Boy Modal */}
            {assignModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">Assign Delivery Partner</h2>
                        <div className="space-y-2">
                            {deliveryBoys.filter(b => b.isAvailable).map((boy) => (
                                <button
                                    key={boy.id}
                                    onClick={() => handleAssign(assignModal, boy.id)}
                                    className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 text-left"
                                >
                                    <div className="w-8 h-8 rounded-full bg-brand-maroon/10 flex items-center justify-center text-sm font-bold text-brand-maroon">
                                        {boy.name[0]}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{boy.name}</p>
                                        <p className="text-xs text-gray-500">{boy.vehicleType} • {boy.vehicleNumber}</p>
                                    </div>
                                    <span className="text-xs text-green-600 font-medium">Available</span>
                                </button>
                            ))}
                            {deliveryBoys.filter(b => b.isAvailable).length === 0 && (
                                <p className="text-gray-500 text-sm text-center py-4">No delivery partners available</p>
                            )}
                        </div>
                        <button onClick={() => setAssignModal(null)} className="w-full mt-4 py-2 border rounded-lg hover:bg-gray-50">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
