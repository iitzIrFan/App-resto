import React, { useState } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable,
    TextInput, Alert, Image, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { COLORS } from '../../src/constants/theme';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, appUser, updateUserProfile } = useAuth();

    const [name, setName] = useState(appUser?.displayName || '');
    const [phone, setPhone] = useState(appUser?.phone || '');
    const [saving, setSaving] = useState(false);

    const initials = (appUser?.displayName || user?.displayName || 'U')
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const photoURL = appUser?.photoURL || user?.photoURL;

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Name cannot be empty.');
            return;
        }
        setSaving(true);
        try {
            await updateUserProfile({
                displayName: name.trim(),
                phone: phone.trim(),
            });
            Alert.alert('Success', 'Profile updated successfully!');
        } catch {
            Alert.alert('Error', 'Could not update profile.');
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
                <Text style={s.headerTitle}>Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                {/* Avatar section */}
                <View style={s.avatarSection}>
                    {photoURL ? (
                        <Image source={{ uri: photoURL }} style={s.avatar} />
                    ) : (
                        <View style={[s.avatar, s.avatarFallback]}>
                            <Text style={s.avatarInitials}>{initials}</Text>
                        </View>
                    )}
                    <Text style={s.avatarName}>{appUser?.displayName || 'User'}</Text>
                    <Text style={s.avatarEmail}>{user?.email}</Text>
                </View>

                {/* Edit Fields */}
                <View style={s.card}>
                    <View style={s.field}>
                        <Text style={s.label}>
                            <Ionicons name="person-outline" size={14} color={COLORS.gray500} />  Display Name
                        </Text>
                        <TextInput
                            style={s.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Your name"
                            placeholderTextColor={COLORS.gray400}
                        />
                    </View>

                    <View style={s.divider} />

                    <View style={s.field}>
                        <Text style={s.label}>
                            <Ionicons name="call-outline" size={14} color={COLORS.gray500} />  Phone Number
                        </Text>
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
                        <Text style={s.label}>
                            <Ionicons name="mail-outline" size={14} color={COLORS.gray500} />  Email
                        </Text>
                        <View style={s.readOnly}>
                            <Text style={s.readOnlyText}>{user?.email || '—'}</Text>
                            <Ionicons name="lock-closed" size={14} color={COLORS.gray400} />
                        </View>
                    </View>

                    <View style={s.divider} />

                    <View style={s.field}>
                        <Text style={s.label}>
                            <Ionicons name="location-outline" size={14} color={COLORS.gray500} />  Default Address
                        </Text>
                        <Pressable style={s.readOnly} onPress={() => router.push('/more/addresses')}>
                            <Text style={s.readOnlyText} numberOfLines={1}>
                                {appUser?.addresses?.[0]?.fullAddress || 'Not set'}
                            </Text>
                            <Ionicons name="chevron-forward" size={16} color={COLORS.gray400} />
                        </Pressable>
                    </View>
                </View>

                <Pressable style={[s.saveBtn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
                    <Text style={s.saveBtnText}>{saving ? 'Saving...' : 'Save Profile'}</Text>
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
    avatarSection: { alignItems: 'center', marginBottom: 24, marginTop: 8 },
    avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: COLORS.gold },
    avatarFallback: { backgroundColor: COLORS.maroon, justifyContent: 'center', alignItems: 'center' },
    avatarInitials: { fontSize: 32, fontWeight: '800', color: COLORS.white },
    avatarName: { fontSize: 22, fontWeight: '700', color: COLORS.black, marginTop: 10 },
    avatarEmail: { fontSize: 14, color: COLORS.gray500, marginTop: 2 },
    card: {
        backgroundColor: COLORS.white, borderRadius: 16, padding: 18,
        borderWidth: 1, borderColor: COLORS.gray100,
    },
    field: { marginBottom: 2 },
    label: { fontSize: 12, fontWeight: '600', color: COLORS.gray500, marginBottom: 6 },
    input: {
        fontSize: 15, color: COLORS.black, backgroundColor: COLORS.gray50,
        borderRadius: 10, paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 12 : 10,
        borderWidth: 1, borderColor: COLORS.gray200,
    },
    divider: { height: 1, backgroundColor: COLORS.gray100, marginVertical: 14 },
    readOnly: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: COLORS.gray50, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
    },
    readOnlyText: { fontSize: 14, color: COLORS.gray500, flex: 1 },
    saveBtn: {
        backgroundColor: COLORS.maroon, borderRadius: 14, paddingVertical: 16,
        alignItems: 'center', marginTop: 24,
    },
    saveBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.white },
});
