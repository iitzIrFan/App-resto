import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Search } from 'lucide-react';

interface AppUser {
    uid: string;
    displayName: string;
    email: string;
    photoURL?: string;
    phoneNumber?: string;
    createdAt?: string;
    lastLogin?: string;
    ordersCount?: number;
}

export default function Users() {
    const [users, setUsers] = useState<AppUser[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'users'), (snap) => {
            setUsers(snap.docs.map((d) => ({ ...d.data(), uid: d.id } as AppUser)));
        });
        return unsub;
    }, []);

    const filtered = users.filter((u) =>
        (u.displayName || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Users ({users.length})</h1>

            <div className="relative mb-6">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-maroon/20"
                />
            </div>

            <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Orders</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((user) => (
                            <tr key={user.uid} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-brand-maroon/10 flex items-center justify-center text-xs font-bold text-brand-maroon">
                                                {(user.displayName || '?')[0]}
                                            </div>
                                        )}
                                        <span className="font-medium text-sm">{user.displayName || 'Anonymous'}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{user.phoneNumber || '—'}</td>
                                <td className="px-4 py-3 text-sm text-gray-500">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                                </td>
                                <td className="px-4 py-3 text-sm font-medium">{user.ordersCount || 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
