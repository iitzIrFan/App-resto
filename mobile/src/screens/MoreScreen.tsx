import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Platform,
    StatusBar,
    // Linking imported but kept for future use
    // Linking,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '../theme';

const MORE_ITEMS = [
    { icon: 'settings-outline', label: 'Settings', action: 'settings' },
    { icon: 'help-circle-outline', label: 'Support', action: 'support' },
    { icon: 'information-circle-outline', label: 'About Yummyfi', action: 'about' },
    { icon: 'document-text-outline', label: 'Terms & Conditions', action: 'terms' },
    { icon: 'shield-outline', label: 'Privacy Policy', action: 'privacy' },
    { icon: 'star-outline', label: 'Rate Us', action: 'rate' },
    { icon: 'share-social-outline', label: 'Share App', action: 'share' },
];

export const MoreScreen = () => {
    const { signOut, isAuthenticated } = useAuth();

    const handleAction = (action: string) => {
        switch (action) {
            case 'support':
                Alert.alert('Support', 'Email: support@yummyfi.com\nPhone: +91-9999999999');
                break;
            case 'about':
                Alert.alert('About', 'Yummyfi v1.0.0\nFood ordering & dining app');
                break;
            default:
                Alert.alert('Coming Soon', 'This feature is under development.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>More</Text>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.menuCard}>
                    {MORE_ITEMS.map((item, index) => (
                        <Pressable
                            key={item.label}
                            style={[styles.menuItem, index < MORE_ITEMS.length - 1 && styles.menuItemBorder]}
                            onPress={() => handleAction(item.action)}
                        >
                            <Ionicons name={item.icon as any} size={22} color={Colors.text.secondary} />
                            <Text style={styles.menuItemLabel}>{item.label}</Text>
                            <Ionicons name="chevron-forward" size={18} color={Colors.text.light} />
                        </Pressable>
                    ))}
                </View>

                {isAuthenticated && (
                    <Pressable style={styles.logoutBtn} onPress={() => {
                        Alert.alert('Logout', 'Are you sure?', [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Logout', style: 'destructive', onPress: signOut },
                        ]);
                    }}>
                        <Ionicons name="log-out-outline" size={20} color={Colors.status.error} />
                        <Text style={styles.logoutText}>Logout</Text>
                    </Pressable>
                )}

                <Text style={styles.version}>Version 1.0.0</Text>
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background.offWhite },
    header: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 24) + 10,
        paddingBottom: Spacing.md,
        backgroundColor: Colors.background.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerTitle: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.text.primary },
    scrollView: { flex: 1 },
    menuCard: {
        backgroundColor: Colors.background.white,
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.lg,
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
    version: {
        textAlign: 'center',
        fontSize: FontSize.sm,
        color: Colors.text.light,
        marginTop: Spacing.xl,
    },
});
