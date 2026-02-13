import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Save, MapPin } from 'lucide-react';

interface AppSettings {
    restaurantName: string;
    deliveryFee: number;
    minOrderAmount: number;
    maxDeliveryRadius: number;
    kitchenLat: number;
    kitchenLng: number;
    gstPercent: number;
    packagingCharge: number;
    isStoreOpen: boolean;
    razorpayKeyId: string;
    contactPhone: string;
    contactEmail: string;
    address: string;
}

const DEFAULT_SETTINGS: AppSettings = {
    restaurantName: 'Yummyfi',
    deliveryFee: 30,
    minOrderAmount: 99,
    maxDeliveryRadius: 10,
    kitchenLat: 28.6139,
    kitchenLng: 77.209,
    gstPercent: 5,
    packagingCharge: 10,
    isStoreOpen: true,
    razorpayKeyId: '',
    contactPhone: '',
    contactEmail: '',
    address: '',
};

export default function Settings() {
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            const snap = await getDoc(doc(db, 'settings', 'app'));
            if (snap.exists()) setSettings({ ...DEFAULT_SETTINGS, ...snap.data() as AppSettings });
        };
        fetch();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        await setDoc(doc(db, 'settings', 'app'), settings, { merge: true });
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const update = (key: keyof AppSettings, value: AppSettings[keyof AppSettings]) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="p-6 max-w-3xl">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-brand-maroon text-white px-6 py-2 rounded-lg hover:bg-brand-burgundy disabled:opacity-50"
                >
                    <Save size={18} /> {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Changes'}
                </button>
            </div>

            <div className="space-y-6">
                {/* General */}
                <section className="bg-white rounded-xl border p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">General</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Restaurant Name</label>
                            <input className="w-full border rounded-lg px-3 py-2 mt-1" value={settings.restaurantName} onChange={e => update('restaurantName', e.target.value)} title="Restaurant name" placeholder="Restaurant name" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Address</label>
                            <textarea className="w-full border rounded-lg px-3 py-2 mt-1" value={settings.address} onChange={e => update('address', e.target.value)} rows={2} title="Address" placeholder="Enter address" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Contact Phone</label>
                                <input className="w-full border rounded-lg px-3 py-2 mt-1" value={settings.contactPhone} onChange={e => update('contactPhone', e.target.value)} title="Contact phone" placeholder="Phone number" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Contact Email</label>
                                <input className="w-full border rounded-lg px-3 py-2 mt-1" value={settings.contactEmail} onChange={e => update('contactEmail', e.target.value)} title="Contact email" placeholder="Email address" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-700">Store Status</label>
                            <button
                                onClick={() => update('isStoreOpen', !settings.isStoreOpen)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${settings.isStoreOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                            >
                                {settings.isStoreOpen ? 'Open' : 'Closed'}
                            </button>
                        </div>
                    </div>
                </section>

                {/* Pricing */}
                <section className="bg-white rounded-xl border p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Pricing & Fees</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Delivery Fee (₹)</label>
                            <input type="number" className="w-full border rounded-lg px-3 py-2 mt-1" value={settings.deliveryFee} onChange={e => update('deliveryFee', Number(e.target.value))} title="Delivery fee" placeholder="0" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Min Order Amount (₹)</label>
                            <input type="number" className="w-full border rounded-lg px-3 py-2 mt-1" value={settings.minOrderAmount} onChange={e => update('minOrderAmount', Number(e.target.value))} title="Minimum order amount" placeholder="0" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">GST (%)</label>
                            <input type="number" className="w-full border rounded-lg px-3 py-2 mt-1" value={settings.gstPercent} onChange={e => update('gstPercent', Number(e.target.value))} title="GST percentage" placeholder="0" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Packaging Charge (₹)</label>
                            <input type="number" className="w-full border rounded-lg px-3 py-2 mt-1" value={settings.packagingCharge} onChange={e => update('packagingCharge', Number(e.target.value))} title="Packaging charge" placeholder="0" />
                        </div>
                    </div>
                </section>

                {/* Delivery */}
                <section className="bg-white rounded-xl border p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">
                        <MapPin size={18} className="inline mr-2" />
                        Delivery & Location
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Max Delivery Radius (km)</label>
                            <input type="number" className="w-full border rounded-lg px-3 py-2 mt-1" value={settings.maxDeliveryRadius} onChange={e => update('maxDeliveryRadius', Number(e.target.value))} title="Max delivery radius" placeholder="5" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Kitchen Latitude</label>
                            <input type="number" step="0.0001" className="w-full border rounded-lg px-3 py-2 mt-1" value={settings.kitchenLat} onChange={e => update('kitchenLat', Number(e.target.value))} title="Kitchen latitude" placeholder="0.0000" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Kitchen Longitude</label>
                            <input type="number" step="0.0001" className="w-full border rounded-lg px-3 py-2 mt-1" value={settings.kitchenLng} onChange={e => update('kitchenLng', Number(e.target.value))} title="Kitchen longitude" placeholder="0.0000" />
                        </div>
                    </div>
                </section>

                {/* Payment */}
                <section className="bg-white rounded-xl border p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Payment</h2>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Razorpay Key ID</label>
                        <input className="w-full border rounded-lg px-3 py-2 mt-1" value={settings.razorpayKeyId} onChange={e => update('razorpayKeyId', e.target.value)} placeholder="rzp_live_..." />
                        <p className="text-xs text-gray-400 mt-1">This key is used client-side. Keep the secret in Cloud Functions env.</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
