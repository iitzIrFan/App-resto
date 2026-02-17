import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, FlatList, Pressable,
    TextInput, Alert, Modal, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../src/config/firebase';
import { COLORS } from '../../src/constants/theme';

interface PaymentMethod {
    id: string;
    type: 'cod' | 'upi';
    upiId?: string;
    lastUsed?: string;
}

export default function PaymentMethodsScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [methods, setMethods] = useState<PaymentMethod[]>([
        { id: 'cod', type: 'cod' },
    ]);
    const [showModal, setShowModal] = useState(false);
    const [upiId, setUpiId] = useState('');
    const [editId, setEditId] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;
        loadMethods();
    }, [user]);

    const loadMethods = async () => {
        if (!user) return;
        try {
            const snap = await getDocs(collection(db, 'users', user.uid, 'paymentMethods'));
            const loaded: PaymentMethod[] = [{ id: 'cod', type: 'cod' }];
            snap.forEach(d => {
                const data = d.data() as PaymentMethod;
                if (data.type === 'upi') {
                    loaded.push({ ...data, id: d.id });
                }
            });
            setMethods(loaded);
        } catch {
            // keep defaults
        }
    };

    const handleSaveUPI = async () => {
        if (!upiId.trim() || !upiId.includes('@')) {
            Alert.alert('Invalid UPI', 'Please enter a valid UPI ID (e.g., name@upi)');
            return;
        }
        if (!user) return;

        const docId = editId || `upi_${Date.now()}`;
        const method: PaymentMethod = {
            id: docId,
            type: 'upi',
            upiId: upiId.trim(),
            lastUsed: new Date().toISOString(),
        };

        try {
            await setDoc(doc(db, 'users', user.uid, 'paymentMethods', docId), method);
            await loadMethods();
        } catch (e) {
            Alert.alert('Error', 'Could not save payment method.');
        }

        setShowModal(false);
        setUpiId('');
        setEditId(null);
    };

    return (
        <SafeAreaView style={s.container}>
            <View style={s.header}>
                <Pressable onPress={() => router.back()} style={s.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                </Pressable>
                <Text style={s.headerTitle}>Payment Methods</Text>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                data={methods}
                keyExtractor={m => m.id}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <Text style={s.sectionLabel}>Saved Payment Methods</Text>
                }
                renderItem={({ item }) => (
                    <View style={s.card}>
                        <View style={[s.iconWrap, { backgroundColor: item.type === 'cod' ? COLORS.green + '15' : COLORS.blue + '15' }]}>
                            <Ionicons
                                name={item.type === 'cod' ? 'cash-outline' : 'wallet-outline'}
                                size={24}
                                color={item.type === 'cod' ? COLORS.green : COLORS.blue}
                            />
                        </View>
                        <View style={s.cardInfo}>
                            <Text style={s.cardTitle}>{item.type === 'cod' ? 'Cash on Delivery' : 'UPI Payment'}</Text>
                            {item.upiId && <Text style={s.cardSub}>{item.upiId}</Text>}
                            {item.lastUsed && (
                                <Text style={s.cardMeta}>Last used: {new Date(item.lastUsed).toLocaleDateString('en-IN')}</Text>
                            )}
                        </View>
                        {item.type === 'cod' ? (
                            <View style={s.defaultTag}>
                                <Text style={s.defaultTagText}>Always Available</Text>
                            </View>
                        ) : (
                            <Pressable onPress={() => {
                                setEditId(item.id);
                                setUpiId(item.upiId || '');
                                setShowModal(true);
                            }}>
                                <Ionicons name="create-outline" size={20} color={COLORS.gray400} />
                            </Pressable>
                        )}
                    </View>
                )}
                ListFooterComponent={
                    <Pressable style={s.addBtn} onPress={() => { setUpiId(''); setEditId(null); setShowModal(true); }}>
                        <Ionicons name="add-circle" size={22} color={COLORS.white} />
                        <Text style={s.addBtnText}>Add UPI ID</Text>
                    </Pressable>
                }
            />

            {/* UPI Modal */}
            <Modal visible={showModal} transparent animationType="slide">
                <View style={s.modalOverlay}>
                    <View style={s.modalContent}>
                        <View style={s.modalHeader}>
                            <Text style={s.modalTitle}>{editId ? 'Edit' : 'Add'} UPI ID</Text>
                            <Pressable onPress={() => setShowModal(false)}>
                                <Ionicons name="close" size={24} color={COLORS.gray600} />
                            </Pressable>
                        </View>

                        <View style={s.upiInputWrap}>
                            <Ionicons name="wallet-outline" size={22} color={COLORS.blue} />
                            <TextInput
                                style={s.upiInput}
                                placeholder="yourname@paytm"
                                placeholderTextColor={COLORS.gray400}
                                value={upiId}
                                onChangeText={setUpiId}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <Text style={s.hint}>
                            Enter your UPI ID linked with any UPI app like Google Pay, PhonePe, Paytm etc.
                        </Text>

                        <Pressable style={s.saveBtn} onPress={handleSaveUPI}>
                            <Text style={s.saveBtnText}>Save UPI ID</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.cream },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: COLORS.maroon, paddingHorizontal: 16, paddingVertical: 14, paddingTop: 8,
    },
    backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.white },
    sectionLabel: { fontSize: 13, fontWeight: '600', color: COLORS.gray500, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
    card: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
        borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: COLORS.gray100,
    },
    iconWrap: {
        width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 14,
    },
    cardInfo: { flex: 1 },
    cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.black },
    cardSub: { fontSize: 13, color: COLORS.gray600, marginTop: 2 },
    cardMeta: { fontSize: 11, color: COLORS.gray400, marginTop: 2 },
    defaultTag: { backgroundColor: COLORS.green + '15', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    defaultTagText: { fontSize: 10, fontWeight: '700', color: COLORS.green },
    addBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        backgroundColor: COLORS.maroon, borderRadius: 14, paddingVertical: 15, marginTop: 10,
    },
    addBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
    modalOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'flex-end' },
    modalContent: {
        backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: '700', color: COLORS.black },
    upiInputWrap: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.gray50,
        borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, borderWidth: 1, borderColor: COLORS.gray200,
    },
    upiInput: { flex: 1, marginLeft: 10, fontSize: 16, color: COLORS.black },
    hint: { fontSize: 12, color: COLORS.gray400, marginTop: 10, lineHeight: 17 },
    saveBtn: {
        backgroundColor: COLORS.maroon, borderRadius: 14, paddingVertical: 16,
        alignItems: 'center', marginTop: 24,
    },
    saveBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.white },
});
