import React, { useState } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable,
    Linking, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../src/constants/theme';

const FAQ_ITEMS = [
    {
        id: '1', icon: 'bag-handle-outline', title: 'Order not placed',
        solutions: [
            'Check your internet connection and try again.',
            'Ensure you have a valid delivery address selected.',
            'Try clearing the cart and adding items again.',
            'If payment was deducted but order not placed, it will be refunded within 3-5 business days.',
        ]
    },
    {
        id: '2', icon: 'card-outline', title: 'Payment failed',
        solutions: [
            'Ensure sufficient balance in your account.',
            'Check if your UPI app is updated to the latest version.',
            'Try a different payment method (Cash on Delivery).',
            'If amount was deducted, it will auto-refund within 3-5 days.',
        ]
    },
    {
        id: '3', icon: 'refresh-circle-outline', title: 'Refund issue',
        solutions: [
            'Refunds are processed within 3-5 business days.',
            'Check your bank statement or UPI app for the refund.',
            'If not received after 5 days, contact our support team.',
        ]
    },
    {
        id: '4', icon: 'location-outline', title: 'Address issue',
        solutions: [
            'Go to More → Addresses to update your delivery address.',
            'Ensure GPS/Location is enabled for accurate address detection.',
            'Add a landmark for the delivery person to find you easily.',
        ]
    },
    {
        id: '5', icon: 'person-outline', title: 'Account / Login issue',
        solutions: [
            'Try signing out and signing back in.',
            'If using Google Sign-In, ensure you are using the correct Google account.',
            'Clear app data and try again.',
            'Contact support if the issue persists.',
        ]
    },
];

const SUPPORT_PHONE = '+917620270011';
const SUPPORT_EMAIL = 'support@yummyfi.in';
const WHATSAPP_NUMBER = '917620270011';

export default function SupportScreen() {
    const router = useRouter();
    const [expanded, setExpanded] = useState<string | null>(null);

    const openPhone = () => Linking.openURL(`tel:${SUPPORT_PHONE}`);
    const openEmail = () => Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
    const openWhatsApp = () => {
        const msg = encodeURIComponent('Hi YummyFi! I need help with my order.');
        Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`);
    };

    return (
        <SafeAreaView style={s.container}>
            <View style={s.header}>
                <Pressable onPress={() => router.back()} style={s.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                </Pressable>
                <Text style={s.headerTitle}>Help & Support</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
                {/* Contact Cards */}
                <Text style={s.sectionTitle}>Contact Us</Text>
                <View style={s.contactRow}>
                    <Pressable style={s.contactCard} onPress={openPhone}>
                        <View style={[s.contactIcon, { backgroundColor: COLORS.blue + '15' }]}>
                            <Ionicons name="call" size={22} color={COLORS.blue} />
                        </View>
                        <Text style={s.contactLabel}>Call Us</Text>
                    </Pressable>
                    <Pressable style={s.contactCard} onPress={openEmail}>
                        <View style={[s.contactIcon, { backgroundColor: COLORS.orange + '15' }]}>
                            <Ionicons name="mail" size={22} color={COLORS.orange} />
                        </View>
                        <Text style={s.contactLabel}>Email</Text>
                    </Pressable>
                    <Pressable style={s.contactCard} onPress={openWhatsApp}>
                        <View style={[s.contactIcon, { backgroundColor: COLORS.whatsapp + '15' }]}>
                            <Ionicons name="logo-whatsapp" size={22} color={COLORS.whatsapp} />
                        </View>
                        <Text style={s.contactLabel}>WhatsApp</Text>
                    </Pressable>
                </View>

                {/* FAQ */}
                <Text style={[s.sectionTitle, { marginTop: 24 }]}>Common Issues</Text>
                {FAQ_ITEMS.map(faq => (
                    <View key={faq.id} style={s.faqCard}>
                        <Pressable style={s.faqHeader} onPress={() => setExpanded(expanded === faq.id ? null : faq.id)}>
                            <View style={s.faqLeft}>
                                <View style={s.faqIconWrap}>
                                    <Ionicons name={faq.icon as any} size={20} color={COLORS.maroon} />
                                </View>
                                <Text style={s.faqTitle}>{faq.title}</Text>
                            </View>
                            <Ionicons
                                name={expanded === faq.id ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                color={COLORS.gray400}
                            />
                        </Pressable>
                        {expanded === faq.id && (
                            <View style={s.faqBody}>
                                {faq.solutions.map((sol, i) => (
                                    <View key={i} style={s.solRow}>
                                        <View style={s.solDot} />
                                        <Text style={s.solText}>{sol}</Text>
                                    </View>
                                ))}
                                <Pressable style={s.contactSupportBtn} onPress={openWhatsApp}>
                                    <Ionicons name="chatbubble-ellipses-outline" size={16} color={COLORS.white} />
                                    <Text style={s.contactSupportText}>Still need help? Contact Support</Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                ))}
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
    sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.gray500, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
    contactRow: { flexDirection: 'row', gap: 12 },
    contactCard: {
        flex: 1, backgroundColor: COLORS.white, borderRadius: 14, padding: 16,
        alignItems: 'center', borderWidth: 1, borderColor: COLORS.gray100,
    },
    contactIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    contactLabel: { fontSize: 13, fontWeight: '600', color: COLORS.black },
    faqCard: {
        backgroundColor: COLORS.white, borderRadius: 14, marginBottom: 10,
        overflow: 'hidden', borderWidth: 1, borderColor: COLORS.gray100,
    },
    faqHeader: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14,
    },
    faqLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
    faqIconWrap: {
        width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.maroon + '10',
        justifyContent: 'center', alignItems: 'center',
    },
    faqTitle: { fontSize: 15, fontWeight: '600', color: COLORS.black, flex: 1 },
    faqBody: { paddingHorizontal: 14, paddingBottom: 14, paddingTop: 4 },
    solRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, gap: 8 },
    solDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: COLORS.gold, marginTop: 7 },
    solText: { fontSize: 13, color: COLORS.gray600, lineHeight: 19, flex: 1 },
    contactSupportBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
        backgroundColor: COLORS.whatsapp, borderRadius: 10, paddingVertical: 10, marginTop: 8,
    },
    contactSupportText: { fontSize: 13, fontWeight: '600', color: COLORS.white },
});
