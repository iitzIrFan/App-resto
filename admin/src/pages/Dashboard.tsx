import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Order, DashboardStats } from '../types';
import {
    ShoppingCart, DollarSign, Package, Clock, TrendingUp,
} from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalOrders: 0,
        totalRevenue: 0,
        activeOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        pendingOrders: 0,
    });

    useEffect(() => {
        // Orders listener
        const ordersUnsub = onSnapshot(collection(db, 'orders'), (snap) => {
            const orders = snap.docs.map((d) => d.data() as Order);
            const active = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status));
            const pending = orders.filter((o) => o.status === 'pending');
            const revenue = orders
                .filter((o) => o.status === 'delivered')
                .reduce((sum, o) => sum + (o.finalAmount || o.totalAmount), 0);

            setStats((prev) => ({
                ...prev,
                totalOrders: orders.length,
                activeOrders: active.length,
                pendingOrders: pending.length,
                totalRevenue: revenue,
            }));
        });

        const productsUnsub = onSnapshot(collection(db, 'products'), (snap) => {
            setStats((prev) => ({ ...prev, totalProducts: snap.size }));
        });

        return () => { ordersUnsub(); productsUnsub(); };
    }, []);

    const statCards = [
        { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-blue-500' },
        { label: 'Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-500' },
        { label: 'Active Orders', value: stats.activeOrders, icon: Clock, color: 'bg-orange-500' },
        { label: 'Products', value: stats.totalProducts, icon: Package, color: 'bg-purple-500' },
        { label: 'Pending', value: stats.pendingOrders, icon: TrendingUp, color: 'bg-red-500' },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {statCards.map((card) => (
                    <div key={card.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`${card.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                                <card.icon size={20} className="text-white" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                        <p className="text-sm text-gray-500 mt-1">{card.label}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <p className="text-gray-500 text-sm">Order and activity feed will populate with real data from Firestore in real time.</p>
            </div>
        </div>
    );
}
