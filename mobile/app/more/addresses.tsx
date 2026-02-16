import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, FlatList, Pressable,
    TextInput, Alert, Modal, ActivityIndicator, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { COLORS, SIZES } from '../../src/constants/theme';
import * as Location from 'expo-location';

type AddressType = 'Home' | 'Work' | 'Other';

interface SavedAddress {
    id: string;
    type: AddressType;
    fullAddress: string;
    landmark: string;
    lat: number;
    lng: number;
    isDefault: boolean;
}

export default function AddressesScreen() {
    const router = useRouter();
    const { appUser, updateUserProfile } = useAuth();
    const [addresses, setAddresses] = useState<SavedAddress[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [locLoading, setLocLoading] = useState(false);

    // Form state
    const [addrType, setAddrType] = useState<AddressType>('Home');
    const [fullAddress, setFullAddress] = useState('');
    const [landmark, setLandmark] = useState('');
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);

    useEffect(() => {
        if (appUser?.addresses) {
            const mapped: SavedAddress[] = appUser.addresses.map((a: any, i: number) => ({
                id: `addr_${i}`,
                type: a.label || 'Other',
                fullAddress: a.fullAddress || '',
                landmark: a.landmark || '',
                lat: a.lat || 0,
                lng: a.lng || 0,
                isDefault: i === 0,
            }));
            setAddresses(mapped);
        }
    }, [appUser]);

    const resetForm = () => {
        setAddrType('Home');
        setFullAddress('');
        setLandmark('');
        setLat(0);
        setLng(0);
        setEditIndex(null);
    };

    const handleUseCurrentLocation = async () => {
        setLocLoading(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location access is needed to fetch your address.');
                setLocLoading(false);
                return;
            }
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            setLat(loc.coords.latitude);
            setLng(loc.coords.longitude);

            // Reverse geocode
            const results = await Location.reverseGeocodeAsync({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            });
            if (results && results.length > 0) {
                const r = results[0];
                const parts = [r.name, r.street, r.district, r.city, r.region, r.postalCode].filter(Boolean);
                setFullAddress(parts.join(', '));
            }
        } catch (e: any) {
            Alert.alert('Error', 'Could not fetch location. Please enter manually.');
        } finally {
            setLocLoading(false);
        }
    };

    const handleSave = async () => {
        if (!fullAddress.trim()) {
            Alert.alert('Error', 'Please enter an address.');
            return;
        }
        const newAddr: SavedAddress = {
            id: editIndex !== null ? addresses[editIndex].id : `addr_${Date.now()}`,
            type: addrType,
            fullAddress: fullAddress.trim(),
            landmark: landmark.trim(),
            lat, lng,
            isDefault: addresses.length === 0,
        };

        let updated: SavedAddress[];
        if (editIndex !== null) {
            updated = [...addresses];
            updated[editIndex] = newAddr;
        } else {
            updated = [...addresses, newAddr];
        }
        setAddresses(updated);

        // Save to Firestore
        const firestoreAddresses = updated.map(a => ({
            label: a.type,
            fullAddress: a.fullAddress,
            landmark: a.landmark,
            lat: a.lat,
            lng: a.lng,
        }));
        try {
            await updateUserProfile({ addresses: firestoreAddresses });
        } catch { /* handled silently */ }

        setShowModal(false);
        resetForm();
    };

    const handleDelete = (index: number) => {
        Alert.alert('Delete Address', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: async () => {
                    const updated = addresses.filter((_, i) => i !== index);
                    setAddresses(updated);
                    const firestoreAddresses = updated.map(a => ({
                        label: a.type, fullAddress: a.fullAddress, landmark: a.landmark,
                        lat: a.lat, lng: a.lng,
                    }));
                    try { await updateUserProfile({ addresses: firestoreAddresses }); } catch { }
                }
            },
        ]);
    };

    const handleSetDefault = async (index: number) => {
        const updated = addresses.map((a, i) => ({ ...a, isDefault: i === index }));
        // Move to front
        const item = updated.splice(index, 1)[0];
        updated.unshift(item);
        setAddresses(updated);
        const firestoreAddresses = updated.map(a => ({
            label: a.type, fullAddress: a.fullAddress, landmark: a.landmark,
            lat: a.lat, lng: a.lng,
        }));
        try { await updateUserProfile({ addresses: firestoreAddresses }); } catch { }
    };

    const openEdit = (index: number) => {
        const a = addresses[index];
        setEditIndex(index);
        setAddrType(a.type);
        setFullAddress(a.fullAddress);
        setLandmark(a.landmark);
        setLat(a.lat);
        setLng(a.lng);
        setShowModal(true);
    };

    const typeIcons: Record<AddressType, string> = { Home: 'home', Work: 'briefcase', Other: 'pin' };

    return (
        <SafeAreaView style={s.container}>
            {/* Header */}
            <View style={s.header}>
                <Pressable onPress={() => router.back()} style={s.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                </Pressable>
                <Text style={s.headerTitle}>Addresses</Text>
                <View style={{ width: 40 }} />
            </View>

            {addresses.length === 0 ? (
                <View style={s.center}>
                    <Ionicons name="location-outline" size={64} color={COLORS.gray300} />
                    <Text style={s.emptyText}>No saved addresses</Text>
                    <Text style={s.emptySubtext}>Add an address for quick checkout</Text>
                </View>
            ) : (
                <FlatList
                    data={addresses}
                    keyExtractor={a => a.id}
                    contentContainerStyle={{ padding: SIZES.padding }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <View style={[s.card, item.isDefault && s.cardDefault]}>
                            <View style={s.cardIcon}>
                                <Ionicons name={typeIcons[item.type] as any} size={22} color={COLORS.maroon} />
                            </View>
                            <View style={s.cardInfo}>
                                <View style={s.cardTopRow}>
                                    <Text style={s.cardType}>{item.type}</Text>
                                    {item.isDefault && (
                                        <View style={s.defaultBadge}>
                                            <Text style={s.defaultText}>Default</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={s.cardAddr} numberOfLines={2}>{item.fullAddress}</Text>
                                {item.landmark ? <Text style={s.cardLandmark}>Near: {item.landmark}</Text> : null}
                                <View style={s.cardActions}>
                                    <Pressable style={s.actionBtn} onPress={() => openEdit(index)}>
                                        <Ionicons name="create-outline" size={16} color={COLORS.blue} />
                                        <Text style={[s.actionText, { color: COLORS.blue }]}>Edit</Text>
                                    </Pressable>
                                    <Pressable style={s.actionBtn} onPress={() => handleDelete(index)}>
                                        <Ionicons name="trash-outline" size={16} color={COLORS.red} />
                                        <Text style={[s.actionText, { color: COLORS.red }]}>Delete</Text>
                                    </Pressable>
                                    {!item.isDefault && (
                                        <Pressable style={s.actionBtn} onPress={() => handleSetDefault(index)}>
                                            <Ionicons name="star-outline" size={16} color={COLORS.gold} />
                                            <Text style={[s.actionText, { color: COLORS.gold }]}>Set Default</Text>
                                        </Pressable>
                                    )}
                                </View>
                            </View>
                        </View>
                    )}
                />
            )}

            {/* Add Button */}
            <Pressable style={s.addBtn} onPress={() => { resetForm(); setShowModal(true); }}>
                <Ionicons name="add-circle" size={22} color={COLORS.white} />
                <Text style={s.addBtnText}>Add New Address</Text>
            </Pressable>

            {/* Modal */}
            <Modal visible={showModal} animationType="slide" transparent>
                <View style={s.modalOverlay}>
                    <View style={s.modalContent}>
                        <View style={s.modalHeader}>
                            <Text style={s.modalTitle}>{editIndex !== null ? 'Edit' : 'Add'} Address</Text>
                            <Pressable onPress={() => { setShowModal(false); resetForm(); }}>
                                <Ionicons name="close" size={24} color={COLORS.gray600} />
                            </Pressable>
                        </View>

                        {/* Type selector */}
                        <Text style={s.label}>Address Type</Text>
                        <View style={s.typeRow}>
                            {(['Home', 'Work', 'Other'] as AddressType[]).map(t => (
                                <Pressable key={t} style={[s.typeChip, addrType === t && s.typeChipActive]} onPress={() => setAddrType(t)}>
                                    <Ionicons name={typeIcons[t] as any} size={16} color={addrType === t ? COLORS.white : COLORS.gray600} />
                                    <Text style={[s.typeChipText, addrType === t && s.typeChipTextActive]}>{t}</Text>
                                </Pressable>
                            ))}
                        </View>

                        {/* GPS Button */}
                        <Pressable style={s.gpsBtn} onPress={handleUseCurrentLocation} disabled={locLoading}>
                            {locLoading ? (
                                <ActivityIndicator size="small" color={COLORS.maroon} />
                            ) : (
                                <Ionicons name="navigate" size={18} color={COLORS.maroon} />
                            )}
                            <Text style={s.gpsBtnText}>Use Current Location</Text>
                        </Pressable>

                        <Text style={s.label}>Full Address</Text>
                        <TextInput
                            style={s.input}
                            placeholder="Enter complete address"
                            placeholderTextColor={COLORS.gray400}
                            value={fullAddress}
                            onChangeText={setFullAddress}
                            multiline
                        />

                        <Text style={s.label}>Landmark (Optional)</Text>
                        <TextInput
                            style={s.input}
                            placeholder="Nearby landmark"
                            placeholderTextColor={COLORS.gray400}
                            value={landmark}
                            onChangeText={setLandmark}
                        />

                        <Pressable style={s.saveBtn} onPress={handleSave}>
                            <Text style={s.saveBtnText}>Save Address</Text>
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
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 80 },
    emptyText: { fontSize: 18, fontWeight: '600', color: COLORS.gray500, marginTop: 16 },
    emptySubtext: { fontSize: 14, color: COLORS.gray400, marginTop: 4 },
    card: {
        flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 14, padding: 14,
        marginBottom: 12, borderWidth: 1, borderColor: COLORS.gray100,
    },
    cardDefault: { borderColor: COLORS.gold, borderWidth: 1.5 },
    cardIcon: {
        width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.maroon + '12',
        justifyContent: 'center', alignItems: 'center', marginRight: 12,
    },
    cardInfo: { flex: 1 },
    cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    cardType: { fontSize: 15, fontWeight: '700', color: COLORS.black },
    defaultBadge: { backgroundColor: COLORS.gold + '20', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
    defaultText: { fontSize: 11, fontWeight: '700', color: COLORS.gold },
    cardAddr: { fontSize: 13, color: COLORS.gray600, lineHeight: 18, marginBottom: 2 },
    cardLandmark: { fontSize: 12, color: COLORS.gray400, marginBottom: 6 },
    cardActions: { flexDirection: 'row', gap: 14, marginTop: 4 },
    actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    actionText: { fontSize: 12, fontWeight: '600' },
    addBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        backgroundColor: COLORS.maroon, borderRadius: 14, margin: 16, paddingVertical: 15,
    },
    addBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
    modalOverlay: {
        flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 20, maxHeight: '85%',
    },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    modalTitle: { fontSize: 20, fontWeight: '700', color: COLORS.black },
    label: { fontSize: 13, fontWeight: '600', color: COLORS.gray500, marginTop: 12, marginBottom: 6 },
    typeRow: { flexDirection: 'row', gap: 10 },
    typeChip: {
        flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16,
        paddingVertical: 9, borderRadius: 10, borderWidth: 1, borderColor: COLORS.gray200,
    },
    typeChipActive: { backgroundColor: COLORS.maroon, borderColor: COLORS.maroon },
    typeChipText: { fontSize: 14, fontWeight: '600', color: COLORS.gray600 },
    typeChipTextActive: { color: COLORS.white },
    gpsBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        marginTop: 14, paddingVertical: 12, borderRadius: 10, borderWidth: 1.5,
        borderColor: COLORS.maroon, borderStyle: 'dashed',
    },
    gpsBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.maroon },
    input: {
        backgroundColor: COLORS.gray50, borderRadius: 10, padding: 14, fontSize: 15,
        color: COLORS.black, borderWidth: 1, borderColor: COLORS.gray200, minHeight: 44,
    },
    saveBtn: {
        backgroundColor: COLORS.maroon, borderRadius: 14, paddingVertical: 16,
        alignItems: 'center', marginTop: 20,
    },
    saveBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.white },
});
