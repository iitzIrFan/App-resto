import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { DeliveryBoy } from '../types';
import { Plus, Trash2 } from 'lucide-react';

export default function DeliveryBoys() {
    const [boys, setBoys] = useState<DeliveryBoy[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '', email: '', vehicleType: 'bike', vehicleNumber: '' });

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'deliveryBoys'), (snap) => {
            setBoys(snap.docs.map((d) => ({ ...d.data(), id: d.id } as DeliveryBoy)));
        });
        return unsub;
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addDoc(collection(db, 'deliveryBoys'), {
            ...form,
            isAvailable: true,
            isOnline: false,
            rating: 5.0,
            totalDeliveries: 0,
        });
        setForm({ name: '', phone: '', email: '', vehicleType: 'bike', vehicleNumber: '' });
        setShowForm(false);
    };

    const toggleAvailability = async (boy: DeliveryBoy) => {
        await updateDoc(doc(db, 'deliveryBoys', boy.id), { isAvailable: !boy.isAvailable });
    };

    const handleDelete = async (id: string) => {
        if (confirm('Remove this delivery partner?')) {
            await deleteDoc(doc(db, 'deliveryBoys', id));
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Delivery Partners ({boys.length})</h1>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-brand-maroon text-white px-4 py-2 rounded-lg hover:bg-brand-burgundy">
                    <Plus size={18} /> Add Partner
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">Add Delivery Partner</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input className="w-full border rounded-lg px-3 py-2" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                            <input className="w-full border rounded-lg px-3 py-2" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                            <input className="w-full border rounded-lg px-3 py-2" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                            <select className="w-full border rounded-lg px-3 py-2" value={form.vehicleType} onChange={e => setForm({ ...form, vehicleType: e.target.value })} title="Select vehicle type" aria-label="Select vehicle type">
                                <option value="bike">Bike</option>
                                <option value="scooter">Scooter</option>
                                <option value="bicycle">Bicycle</option>
                            </select>
                            <input className="w-full border rounded-lg px-3 py-2" placeholder="Vehicle Number" value={form.vehicleNumber} onChange={e => setForm({ ...form, vehicleNumber: e.target.value })} required />
                            <div className="flex gap-3">
                                <button type="submit" className="flex-1 bg-brand-maroon text-white py-2 rounded-lg">Add</button>
                                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border py-2 rounded-lg">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {boys.map((boy) => (
                    <div key={boy.id} className="bg-white rounded-xl border p-5 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-maroon/10 flex items-center justify-center font-bold text-brand-maroon">
                                    {boy.name[0]}
                                </div>
                                <div>
                                    <p className="font-semibold">{boy.name}</p>
                                    <p className="text-xs text-gray-500">{boy.phone}</p>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(boy.id)} className="text-gray-400 hover:text-red-500" title="Delete delivery boy" aria-label="Delete delivery boy">
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <span className="capitalize">{boy.vehicleType}</span> • <span>{boy.vehicleNumber}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm mb-3">
                            <span>⭐ {boy.rating}</span> • <span>{boy.totalDeliveries} deliveries</span>
                        </div>
                        <button
                            onClick={() => toggleAvailability(boy)}
                            className={`w-full py-2 rounded-lg text-sm font-medium ${boy.isAvailable
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                                }`}
                        >
                            {boy.isAvailable ? '✓ Available' : '✗ Unavailable'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
