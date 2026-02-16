import React from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, FlatList, Pressable,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/context/AppContext';
import { COLORS, SIZES } from '../../src/constants/theme';
import * as Clipboard from 'expo-clipboard';
import { Alert } from 'react-native';

export default function CouponsScreen() {
    const router = useRouter();
    const { coupons } = useApp();

    const activeCoupons = coupons.filter(c => {
        const now = new Date();
        return c.isActive && new Date(c.validTo) > now;
    });

    const copyCode = async (code: string) => {
        try {
            await Clipboard.setStringAsync(code);
            Alert.alert('Copied!', `Coupon code "${code}" copied to clipboard.`);
        } catch {
            Alert.alert('Info', `Code: ${code}`);
        }
    };

    return (
        <SafeAreaView style={s.container}>
            <View style={s.header}>
                <Pressable onPress={() => router.back()} style={s.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                </Pressable>
                <Text style={s.headerTitle}>Offers & Coupons</Text>
                <View style={{ width: 40 }} />
            </View>

            {activeCoupons.length === 0 ? (
                <View style={s.center}>
                    <Ionicons name="gift-outline" size={64} color={COLORS.gray300} />
                    <Text style={s.emptyText}>No active coupons</Text>
                    <Text style={s.emptySubtext}>Check back later for exciting offers!</Text>
                </View>
            ) : (
                <FlatList
                    data={activeCoupons}
                    keyExtractor={c => c.id}
                    contentContainerStyle={{ padding: SIZES.padding }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={s.card}>
                            <View style={s.cardLeft}>
                                <View style={s.discountCircle}>
                                    <Text style={s.discountValue}>
                                        {item.discountPercent ? `${item.discountPercent}%` : `₹${item.discountFlat}`}
                                    </Text>
                                    <Text style={s.discountLabel}>OFF</Text>
                                </View>
                            </View>
                            <View style={s.dashes}>
                                {[...Array(8)].map((_, i) => (
                                    <View key={i} style={s.dash} />
                                ))}
                            </View>
                            <View style={s.cardRight}>
                                <View style={s.codeRow}>
                                    <Text style={s.code}>{item.code}</Text>
                                    <Pressable style={s.copyBtn} onPress={() => copyCode(item.code)}>
                                        <Ionicons name="copy-outline" size={14} color={COLORS.maroon} />
                                        <Text style={s.copyText}>Copy</Text>
                                    </Pressable>
                                </View>
                                <Text style={s.terms}>
                                    Min order: ₹{item.minOrderAmount}
                                    {item.maxDiscount ? ` • Max ₹${item.maxDiscount} off` : ''}
                                </Text>
                                <Text style={s.expiry}>
                                    Valid till {new Date(item.validTo).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </Text>
                                <View style={s.usageRow}>
                                    <View style={s.usageBar}>
                                        <View style={[s.usageFill, { width: `${Math.min(100, (item.usedCount / item.usageLimit) * 100)}%` }]} />
                                    </View>
                                    <Text style={s.usageText}>{item.usageLimit - item.usedCount} left</Text>
                                </View>
                            </View>
                        </View>
                    )}
                />
            )}
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
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 60 },
    emptyText: { fontSize: 18, fontWeight: '600', color: COLORS.gray500, marginTop: 16 },
    emptySubtext: { fontSize: 14, color: COLORS.gray400, marginTop: 4 },
    card: {
        flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 16,
        marginBottom: 14, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.gray100,
    },
    cardLeft: {
        backgroundColor: COLORS.maroon, width: 90, justifyContent: 'center', alignItems: 'center', padding: 12,
    },
    discountCircle: { alignItems: 'center' },
    discountValue: { fontSize: 22, fontWeight: '800', color: COLORS.white },
    discountLabel: { fontSize: 11, fontWeight: '700', color: COLORS.goldLight, letterSpacing: 1 },
    dashes: { justifyContent: 'space-evenly', paddingVertical: 8 },
    dash: { width: 1, height: 6, backgroundColor: COLORS.gray200 },
    cardRight: { flex: 1, padding: 14 },
    codeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
    code: { fontSize: 16, fontWeight: '800', color: COLORS.black, letterSpacing: 1 },
    copyBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: COLORS.maroon },
    copyText: { fontSize: 11, fontWeight: '600', color: COLORS.maroon },
    terms: { fontSize: 12, color: COLORS.gray500, marginBottom: 3 },
    expiry: { fontSize: 11, color: COLORS.gray400, marginBottom: 8 },
    usageRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    usageBar: { flex: 1, height: 4, backgroundColor: COLORS.gray100, borderRadius: 2 },
    usageFill: { height: 4, backgroundColor: COLORS.maroon, borderRadius: 2 },
    usageText: { fontSize: 11, fontWeight: '600', color: COLORS.gray500 },
});
