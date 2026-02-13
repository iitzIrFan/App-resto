import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Platform,
    StatusBar,
} from 'react-native';
// Image not used but kept for future expansion
// import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '../theme';

const DINING_FEATURES = [
    { title: 'Dining Rewards', subtitle: 'Earn rewards on every dining', icon: 'trophy', color: '#F59E0B' },
    { title: 'Table Booking', subtitle: 'Reserve your table now', icon: 'calendar', color: '#8B5CF6' },
    { title: 'Your Collection', subtitle: 'Saved restaurants & dishes', icon: 'bookmark', color: '#EC4899' },
];

export const DiningScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Dining</Text>
                <Text style={styles.headerSubtitle}>Discover the best dining experiences</Text>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Hero Banner */}
                <Animated.View entering={FadeInDown.delay(100)} style={styles.heroBanner}>
                    <View style={styles.heroContent}>
                        <Text style={styles.heroTitle}>Dining Rewards</Text>
                        <Text style={styles.heroSubtitle}>
                            Get up to 20% cashback on dining at partner restaurants
                        </Text>
                        <Pressable style={styles.heroBtn}>
                            <Text style={styles.heroBtnText}>Explore</Text>
                        </Pressable>
                    </View>
                    <View style={styles.heroIcon}>
                        <Ionicons name="restaurant" size={60} color="rgba(255,255,255,0.3)" />
                    </View>
                </Animated.View>

                {/* Feature Cards */}
                {DINING_FEATURES.map((feature, index) => (
                    <Animated.View key={feature.title} entering={FadeInDown.delay(200 + index * 100)}>
                        <Pressable style={styles.featureCard}>
                            <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                                <Ionicons name={feature.icon as any} size={24} color={feature.color} />
                            </View>
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>{feature.title}</Text>
                                <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={Colors.text.light} />
                        </Pressable>
                    </Animated.View>
                ))}

                {/* Your Bookings */}
                <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
                    <Text style={styles.sectionTitle}>Your Bookings</Text>
                    <View style={styles.emptyState}>
                        <Ionicons name="calendar-outline" size={48} color={Colors.text.light} />
                        <Text style={styles.emptyText}>No bookings yet</Text>
                        <Text style={styles.emptySubtext}>Book a table to see your bookings here</Text>
                    </View>
                </Animated.View>

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
        paddingBottom: Spacing.lg,
        backgroundColor: Colors.background.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerTitle: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.text.primary },
    headerSubtitle: { fontSize: FontSize.sm, color: Colors.text.secondary, marginTop: 4 },
    scrollView: { flex: 1 },
    heroBanner: {
        backgroundColor: Colors.primary.maroon,
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.lg,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    heroContent: { flex: 1 },
    heroTitle: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.text.white },
    heroSubtitle: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)', marginTop: Spacing.sm, lineHeight: 20 },
    heroBtn: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.accent.yellow,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        marginTop: Spacing.md,
    },
    heroBtnText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary.darkRed },
    heroIcon: { justifyContent: 'center', marginLeft: Spacing.md },
    featureCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background.white,
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.md,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        gap: Spacing.md,
        ...Shadow.small,
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureContent: { flex: 1 },
    featureTitle: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text.primary },
    featureSubtitle: { fontSize: FontSize.sm, color: Colors.text.secondary, marginTop: 2 },
    section: { paddingHorizontal: Spacing.lg, marginTop: Spacing.xxl },
    sectionTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text.primary, marginBottom: Spacing.md },
    emptyState: {
        alignItems: 'center',
        backgroundColor: Colors.background.white,
        borderRadius: BorderRadius.lg,
        padding: Spacing.xxl,
        ...Shadow.small,
    },
    emptyText: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text.primary, marginTop: Spacing.md },
    emptySubtext: { fontSize: FontSize.sm, color: Colors.text.secondary, marginTop: 4 },
});
