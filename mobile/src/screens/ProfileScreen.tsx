import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Platform,
    StatusBar,
    Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useAuth } from '../context/AuthContext';
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '../theme';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MENU_SECTIONS = [
    {
        title: 'Food',
        items: [
            { icon: 'receipt-outline', label: 'Your Orders', screen: 'Orders' },
            { icon: 'location-outline', label: 'Address Book', screen: 'Address' },
            { icon: 'bookmark-outline', label: 'Your Collection', screen: null },
        ],
    },
    {
        title: 'Dining & Experience',
        items: [
            { icon: 'trophy-outline', label: 'Dining Rewards', screen: null },
            { icon: 'calendar-outline', label: 'Your Bookings', screen: null },
            { icon: 'albums-outline', label: 'Your Collection', screen: null },
        ],
    },
    {
        title: 'More',
        items: [
            { icon: 'chatbubble-outline', label: 'Feedback', screen: null },
            { icon: 'information-circle-outline', label: 'About', screen: null },
            { icon: 'bug-outline', label: 'Report Technical Issue', screen: null },
            { icon: 'settings-outline', label: 'Settings', screen: null },
        ],
    },
];

export const ProfileScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { user, appUser, signOut, isAuthenticated: _isAuthenticated } = useAuth();
    void _isAuthenticated; // Reserved for conditional rendering

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: signOut },
        ]);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Profile Header */}
            <View style={styles.header}>
                <View style={styles.profileRow}>
                    {user?.photoURL ? (
                        <Image source={{ uri: user.photoURL }} style={styles.avatar} contentFit="cover" />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Ionicons name="person" size={36} color={Colors.text.white} />
                        </View>
                    )}
                    <View style={styles.profileInfo}>
                        <Text style={styles.userName}>{appUser?.displayName || 'Guest'}</Text>
                        <Text style={styles.userId}>{appUser?.email || 'Not logged in'}</Text>
                    </View>
                </View>
                <Pressable style={styles.editBtn}>
                    <Text style={styles.editBtnText}>Edit Profile</Text>
                </Pressable>

                {/* Quick Cards */}
                <View style={styles.quickCards}>
                    <Pressable
                        style={styles.quickCard}
                        onPress={() => navigation.navigate('MainTabs', { screen: 'Orders' } as any)}
                    >
                        <Ionicons name="receipt" size={22} color={Colors.primary.maroon} />
                        <Text style={styles.quickCardLabel}>Orders</Text>
                    </Pressable>
                    <Pressable style={styles.quickCard}>
                        <Ionicons name="pricetag" size={22} color={Colors.primary.maroon} />
                        <Text style={styles.quickCardLabel}>Coupons</Text>
                    </Pressable>
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {MENU_SECTIONS.map((section, sIndex) => (
                    <Animated.View key={section.title} entering={FadeInDown.delay(sIndex * 100)}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <View style={styles.menuCard}>
                            {section.items.map((item, iIndex) => (
                                <Pressable
                                    key={item.label}
                                    style={[styles.menuItem, iIndex < section.items.length - 1 && styles.menuItemBorder]}
                                    onPress={() => {
                                        if (item.screen) {
                                            navigation.navigate(item.screen as any);
                                        }
                                    }}
                                >
                                    <Ionicons name={item.icon as any} size={20} color={Colors.text.secondary} />
                                    <Text style={styles.menuItemLabel}>{item.label}</Text>
                                    <Ionicons name="chevron-forward" size={18} color={Colors.text.light} />
                                </Pressable>
                            ))}
                        </View>
                    </Animated.View>
                ))}

                {/* Logout */}
                <Pressable style={styles.logoutBtn} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color={Colors.status.error} />
                    <Text style={styles.logoutText}>Logout</Text>
                </Pressable>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background.offWhite },
    header: {
        backgroundColor: Colors.primary.maroon,
        paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 24) + 10,
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    profileRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg },
    avatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 3, borderColor: Colors.accent.yellow },
    avatarPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInfo: { flex: 1 },
    userName: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text.white },
    userId: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
    editBtn: {
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
        borderRadius: BorderRadius.full,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.xs,
        marginTop: Spacing.md,
    },
    editBtnText: { color: Colors.text.white, fontSize: FontSize.sm, fontWeight: '600' },
    quickCards: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginTop: Spacing.lg,
    },
    quickCard: {
        flex: 1,
        backgroundColor: Colors.background.white,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        alignItems: 'center',
        gap: Spacing.sm,
        ...Shadow.small,
    },
    quickCardLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text.primary },
    scrollView: { flex: 1 },
    sectionTitle: {
        fontSize: FontSize.md,
        fontWeight: '700',
        color: Colors.text.secondary,
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.xl,
        marginBottom: Spacing.sm,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    menuCard: {
        backgroundColor: Colors.background.white,
        marginHorizontal: Spacing.lg,
        borderRadius: BorderRadius.lg,
        ...Shadow.small,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
        gap: Spacing.md,
    },
    menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
    menuItemLabel: { flex: 1, fontSize: FontSize.md, color: Colors.text.primary, fontWeight: '500' },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.xxl,
        paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.status.error,
    },
    logoutText: { fontSize: FontSize.md, fontWeight: '600', color: Colors.status.error },
});
