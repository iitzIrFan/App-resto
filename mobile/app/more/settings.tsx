import React, { useState } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable,
    TextInput, Switch, Alert, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { COLORS } from '../../src/constants/theme';

export default function SettingsScreen() {
    const router = useRouter();
    const { user, appUser, updateUserProfile } = useAuth();

    const [displayName, setDisplayName] = useState(appUser?.displayName || '');
    const [phone, setPhone] = useState(appUser?.phone || '');
    const [notifications, setNotifications] = useState(true);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!displayName.trim()) {
            Alert.alert('Error', 'Display name cannot be empty.');
            return;
        }
        setSaving(true);
        try {
            await updateUserProfile({
                displayName: displayName.trim(),
                phone: phone.trim(),
            });
            Alert.alert('Saved', 'Your settings have been updated.');
        } catch (e) {
            Alert.alert('Error', 'Could not save. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={s.container}>
            <View style={s.header}>
                <Pressable onPress={() => router.back()} style={s.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                </Pressable>
                <Text style={s.headerTitle}>Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
                {/* Profile Settings */}
                <Text style={s.sectionTitle}>Profile</Text>
                <View style={s.card}>
                    <View style={s.field}>
                        <Text style={s.label}>Display Name</Text>
                        <TextInput
                            style={s.input}
                            value={displayName}
                            onChangeText={setDisplayName}
                            placeholder="Your name"
                            placeholderTextColor={COLORS.gray400}
                        />
                    </View>
                    <View style={s.divider} />
                    <View style={s.field}>
                        <Text style={s.label}>Phone Number</Text>
                        <TextInput
                            style={s.input}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="+91 XXXXX XXXXX"
                            placeholderTextColor={COLORS.gray400}
                            keyboardType="phone-pad"
                        />
                    </View>
                    <View style={s.divider} />
                    <View style={s.field}>
                        <Text style={s.label}>Email</Text>
                        <View style={s.readonlyRow}>
                            <Text style={s.readonlyText}>{user?.email || 'Not available'}</Text>
                            <View style={s.readonlyBadge}>
                                <Ionicons name="lock-closed" size={12} color={COLORS.gray400} />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Address */}
                <Text style={[s.sectionTitle, { marginTop: 20 }]}>Default Address</Text>
                <Pressable style={s.card} onPress={() => router.push('/more/addresses')}>
                    <View style={s.addressRow}>
                        <View style={s.addressIcon}>
                            <Ionicons name="location" size={20} color={COLORS.maroon} />
                        </View>
                        <Text style={s.addressText} numberOfLines={2}>
                            {appUser?.addresses?.[0]?.fullAddress || 'No default address set. Tap to add.'}
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.gray300} />
                    </View>
                </Pressable>

                {/* Notifications */}
                <Text style={[s.sectionTitle, { marginTop: 20 }]}>Preferences</Text>
                <View style={s.card}>
                    <View style={s.switchRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={s.switchLabel}>Push Notifications</Text>
                            <Text style={s.switchSub}>Get updates on orders and offers</Text>
                        </View>
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            trackColor={{ false: COLORS.gray200, true: COLORS.maroon + '50' }}
                            thumbColor={notifications ? COLORS.maroon : COLORS.gray400}
                        />
                    </View>
                </View>

                {/* Save */}
                <Pressable style={[s.saveBtn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
                    <Text style={s.saveBtnText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
                </Pressable>
            </ScrollView>
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
    sectionTitle: { fontSize: 13, fontWeight: '700', color: COLORS.gray500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
    card: { backgroundColor: COLORS.white, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: COLORS.gray100 },
    field: { marginBottom: 2 },
    label: { fontSize: 12, fontWeight: '600', color: COLORS.gray500, marginBottom: 6 },
    input: {
        fontSize: 15, color: COLORS.black, backgroundColor: COLORS.gray50,
        borderRadius: 10, paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 12 : 10,
        borderWidth: 1, borderColor: COLORS.gray200,
    },
    divider: { height: 1, backgroundColor: COLORS.gray100, marginVertical: 14 },
    readonlyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.gray50, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12 },
    readonlyText: { fontSize: 15, color: COLORS.gray500 },
    readonlyBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.gray100, justifyContent: 'center', alignItems: 'center' },
    addressRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    addressIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.maroon + '10', justifyContent: 'center', alignItems: 'center' },
    addressText: { flex: 1, fontSize: 14, color: COLORS.gray600, lineHeight: 20 },
    switchRow: { flexDirection: 'row', alignItems: 'center' },
    switchLabel: { fontSize: 15, fontWeight: '600', color: COLORS.black },
    switchSub: { fontSize: 12, color: COLORS.gray400, marginTop: 2 },
    saveBtn: {
        backgroundColor: COLORS.maroon, borderRadius: 14, paddingVertical: 16,
        alignItems: 'center', marginTop: 24,
    },
    saveBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.white },
});
