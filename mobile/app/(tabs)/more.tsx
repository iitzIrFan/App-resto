import React from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable,
    Image, Alert, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';

const MAROON = '#7A0C0C';
const MAROON_DARK = '#5A0808';
const GOLD = '#D4A843';
const GOLD_LIGHT = '#F5D77A';
const CREAM = '#FFF8F3';
const WHITE = '#FFFFFF';

const MENU_SECTIONS = [
    {
        title: 'My Activity',
        items: [
            { icon: 'receipt-outline', label: 'Orders', desc: 'Track & view past orders', route: '/more/orders', color: '#FC8019' },
            { icon: 'heart-outline', label: 'Favorites', desc: 'Your saved items', route: '/more/favorites', color: '#EF4444' },
        ],
    },
    {
        title: 'Account',
        items: [
            { icon: 'location-outline', label: 'Addresses', desc: 'Manage delivery addresses', route: '/more/addresses', color: '#3B82F6' },
            { icon: 'wallet-outline', label: 'Payment Methods', desc: 'Cash & UPI options', route: '/more/payment', color: '#10B981' },
            { icon: 'pricetag-outline', label: 'Coupons', desc: 'Available offers & deals', route: '/more/coupons', color: '#8B5CF6' },
        ],
    },
    {
        title: 'Support',
        items: [
            { icon: 'chatbubble-ellipses-outline', label: 'Help & Support', desc: 'Get help with issues', route: '/more/support', color: '#06B6D4' },
            { icon: 'settings-outline', label: 'Settings', desc: 'App preferences', route: '/more/settings', color: '#6B7280' },
            { icon: 'information-circle-outline', label: 'About', desc: 'Know more about YummyFi', route: '/more/about', color: MAROON },
        ],
    },
];

export default function MoreScreen() {
    const router = useRouter();
    const { user, appUser, signOut } = useAuth();

    // Google profile image fix
    const photoURL = appUser?.photoURL || user?.photoURL;
    const displayName = appUser?.displayName || user?.displayName || 'Guest User';
    const email = user?.email || 'Sign in to access all features';
    const initials = displayName
        .split(' ')
        .map((w: string) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const handleSignOut = async () => {
        console.log('handleSignOut button clicked');
        
        // For web, Alert doesn't work well, so use window.confirm
        if (Platform.OS === 'web') {
            const confirmed = window.confirm('Are you sure you want to sign out?');
            if (confirmed) {
                try {
                    console.log('User initiated sign out (web)');
                    await signOut();
                    console.log('Sign out complete, navigating to sign-in');
                    router.replace('/auth/sign-in');
                } catch (e) {
                    console.error('Sign out error:', e);
                    window.alert('Failed to sign out. Please try again.');
                }
            }
        } else {
            Alert.alert(
                'Sign Out',
                'Are you sure you want to sign out?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Sign Out',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                console.log('User initiated sign out (native)');
                                await signOut();
                                console.log('Sign out complete, navigating to sign-in');
                                router.replace('/auth/sign-in');
                            } catch (e) {
                                console.error('Sign out error:', e);
                                Alert.alert('Error', 'Failed to sign out. Please try again.');
                            }
                        }
                    },
                ]
            );
        }
    };

    return (
        <SafeAreaView style={s.container}>
            <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
                {/* Profile Card */}
                <Pressable style={s.profileCard} onPress={() => router.push('/more/profile')}>
                    <View style={s.profileGradient}>
                        {/* Avatar */}
                        {photoURL ? (
                            <Image source={{ uri: photoURL }} style={s.avatar} />
                        ) : (
                            <View style={[s.avatar, s.avatarFallback]}>
                                <Text style={s.avatarInitials}>{initials}</Text>
                            </View>
                        )}
                        <View style={s.profileInfo}>
                            <Text style={s.profileName}>{displayName}</Text>
                            <Text style={s.profileEmail}>{email}</Text>
                        </View>
                        <View style={s.profileArrow}>
                            <Ionicons name="chevron-forward" size={20} color={GOLD_LIGHT} />
                        </View>
                    </View>
                </Pressable>

                {/* Menu Sections */}
                {MENU_SECTIONS.map((section, si) => (
                    <View key={si} style={s.section}>
                        <Text style={s.sectionTitle}>{section.title}</Text>
                        <View style={s.sectionCard}>
                            {section.items.map((item, ii) => (
                                <Pressable
                                    key={ii}
                                    style={({ pressed }) => [
                                        s.menuItem,
                                        ii < section.items.length - 1 && s.menuItemBorder,
                                        pressed && s.menuItemPressed,
                                    ]}
                                    onPress={() => router.push(item.route as any)}
                                >
                                    <View style={[s.menuIconWrap, { backgroundColor: item.color + '12' }]}>
                                        <Ionicons name={item.icon as any} size={22} color={item.color} />
                                    </View>
                                    <View style={s.menuTextWrap}>
                                        <Text style={s.menuLabel}>{item.label}</Text>
                                        <Text style={s.menuDesc}>{item.desc}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
                                </Pressable>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Sign Out / Sign In */}
                {user ? (
                    <Pressable
                        style={({ pressed }) => [s.signOutBtn, pressed && { opacity: 0.85 }]}
                        onPress={handleSignOut}
                    >
                        <View style={s.signOutInner}>
                            <Ionicons name="log-out-outline" size={22} color={MAROON} />
                            <Text style={s.signOutText}>Sign Out</Text>
                        </View>
                    </Pressable>
                ) : (
                    <Pressable
                        style={({ pressed }) => [s.signInBtn, pressed && { opacity: 0.85 }]}
                        onPress={() => router.push('/auth/sign-in')}
                    >
                        <Ionicons name="log-in-outline" size={22} color={WHITE} />
                        <Text style={s.signInText}>Sign In</Text>
                    </Pressable>
                )}

                {/* App Version */}
                <Text style={s.version}>YummyFi v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: CREAM },
    scroll: { flex: 1 },

    // Profile Card
    profileCard: {
        margin: 16, marginBottom: 8, borderRadius: 20, overflow: 'hidden',
        elevation: 4,
        shadowColor: MAROON,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    profileGradient: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: MAROON, padding: 18,
    },
    avatar: {
        width: 58, height: 58, borderRadius: 29,
        borderWidth: 2.5, borderColor: GOLD,
    },
    avatarFallback: {
        backgroundColor: MAROON_DARK,
        justifyContent: 'center', alignItems: 'center',
    },
    avatarInitials: {
        fontSize: 22, fontWeight: '800', color: GOLD_LIGHT,
    },
    profileInfo: { flex: 1, marginLeft: 14 },
    profileName: { fontSize: 19, fontWeight: '700', color: WHITE },
    profileEmail: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
    profileArrow: {
        width: 34, height: 34, borderRadius: 17,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center', alignItems: 'center',
    },

    // Sections
    section: { marginHorizontal: 16, marginTop: 12 },
    sectionTitle: {
        fontSize: 12, fontWeight: '700', color: '#9CA3AF',
        textTransform: 'uppercase', letterSpacing: 0.6,
        marginBottom: 8, marginLeft: 4,
    },
    sectionCard: {
        backgroundColor: WHITE, borderRadius: 16,
        borderWidth: 1, borderColor: '#F3F4F6',
    },
    menuItem: {
        flexDirection: 'row', alignItems: 'center',
        padding: 14, paddingVertical: 13,
    },
    menuItemBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    menuItemPressed: { backgroundColor: '#FAFAFA' },
    menuIconWrap: {
        width: 42, height: 42, borderRadius: 12,
        justifyContent: 'center', alignItems: 'center',
    },
    menuTextWrap: { flex: 1, marginLeft: 12 },
    menuLabel: { fontSize: 15, fontWeight: '600', color: '#111827' },
    menuDesc: { fontSize: 12, color: '#9CA3AF', marginTop: 1 },

    // Sign Out
    signOutBtn: {
        marginHorizontal: 16, marginTop: 20,
        borderRadius: 14, borderWidth: 1.5, borderColor: MAROON,
        backgroundColor: WHITE,
    },
    signOutInner: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 14, gap: 8,
    },
    signOutText: { fontSize: 16, fontWeight: '700', color: MAROON },

    // Sign In
    signInBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        marginHorizontal: 16, marginTop: 20,
        backgroundColor: MAROON, borderRadius: 14,
        paddingVertical: 14, gap: 8,
    },
    signInText: { fontSize: 16, fontWeight: '700', color: WHITE },

    // Version
    version: {
        textAlign: 'center', fontSize: 12, color: '#9CA3AF',
        marginTop: 16, marginBottom: 32,
    },
});
