import React from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/theme';

const SERVICES = [
    { icon: 'bicycle-outline', title: 'Food Delivery', desc: 'Get your favorite meals delivered to your doorstep.' },
    { icon: 'bag-check-outline', title: 'Parcel Pickup', desc: 'Order and pick up your food from the restaurant.' },
    { icon: 'phone-portrait-outline', title: 'Online Ordering', desc: 'Browse menus, customize orders, and pay online.' },
    { icon: 'restaurant-outline', title: 'Dine-In', desc: 'Reserve a table and enjoy dining at the restaurant.' },
];

export default function AboutScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={s.container}>
            <View style={s.header}>
                <Pressable onPress={() => router.back()} style={s.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                </Pressable>
                <Text style={s.headerTitle}>About YummyFi</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                {/* Logo/Brand */}
                <View style={s.brandCard}>
                    <View style={s.logoCircle}>
                        <Text style={s.logoText}>Y</Text>
                    </View>
                    <Text style={s.brandName}>YummyFi</Text>
                    <Text style={s.tagline}>Delicious food, delivered with love</Text>
                    <View style={s.foundedBadge}>
                        <Ionicons name="calendar-outline" size={14} color={COLORS.gold} />
                        <Text style={s.foundedText}>Founded July 2025</Text>
                    </View>
                </View>

                {/* Description */}
                <View style={s.descCard}>
                    <Text style={s.descTitle}>Who We Are</Text>
                    <Text style={s.descText}>
                        YummyFi is a modern food platform built to connect food lovers with the best
                        restaurants and home kitchens. We offer seamless food delivery, dine-in experiences,
                        parcel pickup, and online ordering — all in one app.
                    </Text>
                    <Text style={s.descText}>
                        Our mission is to make delicious, quality food accessible to everyone while
                        supporting local restaurants and delivery partners.
                    </Text>
                </View>

                {/* Services */}
                <Text style={s.sectionTitle}>Our Services</Text>
                <View style={s.servicesGrid}>
                    {SERVICES.map((svc, i) => (
                        <View key={i} style={s.serviceCard}>
                            <View style={s.serviceIcon}>
                                <Ionicons name={svc.icon as any} size={24} color={COLORS.maroon} />
                            </View>
                            <Text style={s.serviceTitle}>{svc.title}</Text>
                            <Text style={s.serviceDesc}>{svc.desc}</Text>
                        </View>
                    ))}
                </View>

                {/* Policies */}
                <View style={s.policyCard}>
                    <Text style={s.policyTitle}>Policies</Text>
                    <Text style={s.policyText}>
                        • Orders once confirmed cannot be cancelled after preparation begins.{'\n'}
                        • Refunds for cancelled orders are processed within 3–5 business days.{'\n'}
                        • We ensure hygienic food preparation and safe delivery standards.{'\n'}
                        • User data is stored securely and never shared with third parties.{'\n'}
                        • For any disputes, please contact our support team.
                    </Text>
                </View>

                <Text style={s.version}>YummyFi v1.0.0</Text>
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
    brandCard: {
        backgroundColor: COLORS.maroon, borderRadius: 20, padding: 28, alignItems: 'center', marginBottom: 16,
    },
    logoCircle: {
        width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.white,
        justifyContent: 'center', alignItems: 'center', marginBottom: 12,
    },
    logoText: { fontSize: 34, fontWeight: '800', color: COLORS.maroon },
    brandName: { fontSize: 28, fontWeight: '800', color: COLORS.white, letterSpacing: 1 },
    tagline: { fontSize: 14, color: COLORS.goldLight, marginTop: 4 },
    foundedBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 14, paddingVertical: 6,
        borderRadius: 20, marginTop: 14,
    },
    foundedText: { fontSize: 13, fontWeight: '600', color: COLORS.goldLight },
    descCard: {
        backgroundColor: COLORS.white, borderRadius: 16, padding: 18, marginBottom: 16,
        borderWidth: 1, borderColor: COLORS.gray100,
    },
    descTitle: { fontSize: 17, fontWeight: '700', color: COLORS.black, marginBottom: 8 },
    descText: { fontSize: 14, color: COLORS.gray600, lineHeight: 21, marginBottom: 6 },
    sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.gray500, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
    servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
    serviceCard: {
        width: '48%', backgroundColor: COLORS.white, borderRadius: 14, padding: 16,
        borderWidth: 1, borderColor: COLORS.gray100,
    },
    serviceIcon: {
        width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.maroon + '10',
        justifyContent: 'center', alignItems: 'center', marginBottom: 8,
    },
    serviceTitle: { fontSize: 14, fontWeight: '700', color: COLORS.black, marginBottom: 4 },
    serviceDesc: { fontSize: 12, color: COLORS.gray500, lineHeight: 17 },
    policyCard: {
        backgroundColor: COLORS.white, borderRadius: 16, padding: 18,
        borderWidth: 1, borderColor: COLORS.gray100, marginBottom: 16,
    },
    policyTitle: { fontSize: 17, fontWeight: '700', color: COLORS.black, marginBottom: 10 },
    policyText: { fontSize: 13, color: COLORS.gray500, lineHeight: 21 },
    version: { textAlign: 'center', fontSize: 12, color: COLORS.gray400, marginTop: 8 },
});
