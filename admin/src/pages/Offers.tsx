import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Offer } from '../types';
import { Plus, Trash2, Edit, ToggleLeft, ToggleRight } from 'lucide-react';

export default function Offers() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editOffer, setEditOffer] = useState<Offer | null>(null);
    const [form, setForm] = useState({
        title: '', description: '', discountPercent: '', imageUrl: '',
        validFrom: '', validTo: '', minOrderAmount: '',
    });

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'offers'), (snap) => {
            setOffers(snap.docs.map((d) => ({ ...d.data(), id: d.id } as Offer)));
        });
        return unsub;
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            title: form.title,
            description: form.description,
            discountPercent: Number(form.discountPercent),
            imageUrl: form.imageUrl,
            validFrom: form.validFrom,
            validTo: form.validTo,
            minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : 0,
            isActive: true,
        };
        if (editOffer) {
            await updateDoc(doc(db, 'offers', editOffer.id), data);
        } else {
            await addDoc(collection(db, 'offers'), data);
        }
        resetForm();
    };

    const resetForm = () => {
        setForm({ title: '', description: '', discountPercent: '', imageUrl: '', validFrom: '', validTo: '', minOrderAmount: '' });
        setEditOffer(null);
        setShowForm(false);
    };

    const handleEdit = (o: Offer) => {
        setForm({
            title: o.title,
            description: o.description,
            discountPercent: String(o.discountPercent),
            imageUrl: o.imageUrl || '',
            validFrom: o.validFrom || '',
            validTo: o.validTo || '',
            minOrderAmount: o.minOrderAmount ? String(o.minOrderAmount) : '',
        });
        setEditOffer(o);
        setShowForm(true);
    };

    const toggleActive = async (offer: Offer) => {
        await updateDoc(doc(db, 'offers', offer.id), { isActive: !offer.isActive });
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this offer?')) await deleteDoc(doc(db, 'offers', id));
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Offers ({offers.length})</h1>
                <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-brand-maroon text-white px-4 py-2 rounded-lg hover:bg-brand-burgundy">
                    <Plus size={18} /> Add Offer
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6">
                        <h2 className="text-xl font-bold mb-4">{editOffer ? 'Edit Offer' : 'Create Offer'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input className="w-full border rounded-lg px-3 py-2" placeholder="Offer Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                            <textarea className="w-full border rounded-lg px-3 py-2" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} required />
                            <div className="grid grid-cols-2 gap-3">
                                <input className="border rounded-lg px-3 py-2" placeholder="Discount %" type="number" value={form.discountPercent} onChange={e => setForm({ ...form, discountPercent: e.target.value })} required />
                                <input className="border rounded-lg px-3 py-2" placeholder="Min Order ₹" type="number" value={form.minOrderAmount} onChange={e => setForm({ ...form, minOrderAmount: e.target.value })} />
                            </div>
                            <input className="w-full border rounded-lg px-3 py-2" placeholder="Image URL" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-500">Valid From</label>
                                    <input type="date" className="w-full border rounded-lg px-3 py-2" value={form.validFrom} onChange={e => setForm({ ...form, validFrom: e.target.value })} title="Valid from date" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Valid Until</label>
                                    <input type="date" className="w-full border rounded-lg px-3 py-2" value={form.validTo} onChange={e => setForm({ ...form, validTo: e.target.value })} title="Valid until date" />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" className="flex-1 bg-brand-maroon text-white py-2 rounded-lg">{editOffer ? 'Update' : 'Create'}</button>
                                <button type="button" onClick={resetForm} className="flex-1 border py-2 rounded-lg">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {offers.map((offer) => (
                    <div key={offer.id} className={`bg-white rounded-xl border p-5 shadow-sm ${!offer.isActive ? 'opacity-60' : ''}`}>
                        {offer.imageUrl && (
                            <img src={offer.imageUrl} alt={offer.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                        )}
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-bold text-gray-900">{offer.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{offer.description}</p>
                            </div>
                            <span className="text-xl font-bold text-brand-maroon">{offer.discountPercent}%</span>
                        </div>
                        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                            {offer.validFrom && <span>From: {offer.validFrom}</span>}
                            {offer.validTo && <span>Until: {offer.validTo}</span>}
                        </div>
                        {(offer.minOrderAmount ?? 0) > 0 && (
                            <p className="text-xs text-gray-500 mt-1">Min order: ₹{offer.minOrderAmount}</p>
                        )}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t">
                            <button onClick={() => toggleActive(offer)} className="flex items-center gap-1 text-sm">
                                {offer.isActive ? <ToggleRight size={20} className="text-green-500" /> : <ToggleLeft size={20} className="text-gray-400" />}
                                {offer.isActive ? 'Active' : 'Inactive'}
                            </button>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(offer)} className="text-gray-400 hover:text-blue-500" title="Edit offer" aria-label="Edit offer"><Edit size={16} /></button>
                                <button onClick={() => handleDelete(offer.id)} className="text-gray-400 hover:text-red-500" title="Delete offer" aria-label="Delete offer"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
