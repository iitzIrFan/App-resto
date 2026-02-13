import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';

const MAROON = '#7A0C0C';
const CREAM = '#FFF8F3';

const MENU_ITEMS = [
    { icon: 'receipt-outline', label: 'Orders', route: '/orders' },
    { icon: 'heart-outline', label: 'Favorites', route: '/favorites' },
    { icon: 'location-outline', label: 'Addresses', route: '/addresses' },
    { icon: 'card-outline', label: 'Payment Methods', route: '/payment' },
    { icon: 'gift-outline', label: 'Offers & Coupons', route: '/offers' },
    { icon: 'help-circle-outline', label: 'Help & Support', route: '/support' },
    { icon: 'settings-outline', label: 'Settings', route: '/settings' },
    { icon: 'information-circle-outline', label: 'About', route: '/about' },
];

export default function MoreScreen() {
    const router = useRouter();
    const { user, appUser, signOut } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Profile Card */}
                <Pressable style={styles.profileCard}>
                    <View style={styles.avatar}>
                        {user?.photoURL ? (
                            <Ionicons name="person" size={32} color="#FFFFFF" />
                        ) : (
                            <Ionicons name="person" size={32} color="#FFFFFF" />
                        )}
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{appUser?.displayName || user?.displayName || 'Guest User'}</Text>
                        <Text style={styles.profileEmail}>{user?.email || 'Sign in to access all features'}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </Pressable>

                {/* Menu Items */}
                <View style={styles.menuCard}>
                    {MENU_ITEMS.map((item, idx) => (
                        <Pressable
                            key={idx}
                            style={[styles.menuItem, idx < MENU_ITEMS.length - 1 && styles.menuItemBorder]}
                            onPress={() => {
                                // Navigate when routes are implemented
                            }}
                        >
                            <Ionicons name={item.icon as any} size={24} color="#374151" />
                            <Text style={styles.menuLabel}>{item.label}</Text>
                            <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                        </Pressable>
                    ))}
                </View>

                {/* Sign Out Button */}
                {user && (
                    <Pressable style={styles.signOutBtn} onPress={handleSignOut}>
                        <Ionicons name="log-out-outline" size={24} color={MAROON} />
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </Pressable>
                )}

                {/* Sign In Button (for guests) */}
                {!user && (
                    <Pressable style={styles.signInBtn}>
                        <Ionicons name="log-in-outline" size={24} color="#FFFFFF" />
                        <Text style={styles.signInText}>Sign In</Text>
                    </Pressable>
                )}

                {/* App Version */}
                <Text style={styles.version}>Yummyfi v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CREAM,
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: MAROON,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInfo: {
        flex: 1,
        marginLeft: 12,
    },
    profileName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    profileEmail: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    menuCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    menuLabel: {
        flex: 1,
        fontSize: 16,
        color: '#111827',
    },
    signOutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        gap: 8,
        borderWidth: 1,
        borderColor: MAROON,
    },
    signOutText: {
        fontSize: 16,
        fontWeight: '600',
        color: MAROON,
    },
    signInBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: MAROON,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        gap: 8,
    },
    signInText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    version: {
        textAlign: 'center',
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 32,
    },
});
