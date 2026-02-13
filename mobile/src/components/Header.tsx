import React from 'react';
import { View, Text, StyleSheet, Pressable, StatusBar, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize } from '../theme';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
    address: string;
    addressLoading: boolean;
    onLocationPress: () => void;
    onSearchPress: () => void;
    onAvatarPress: () => void;
}

export const Header = ({
    address,
    addressLoading,
    onLocationPress,
    onSearchPress,
    onAvatarPress,
}: HeaderProps) => {
    const { user } = useAuth();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.primary.maroon} />

            {/* Top Row: Location + Avatar */}
            <View style={styles.topRow}>
                <Pressable style={styles.locationBtn} onPress={onLocationPress}>
                    <Ionicons name="location" size={20} color={Colors.accent.yellow} />
                    <View style={styles.locationTextContainer}>
                        <Text style={styles.locationLabel}>Deliver to</Text>
                        <View style={styles.addressRow}>
                            <Text style={styles.locationAddress} numberOfLines={1}>
                                {addressLoading ? 'Getting location...' : address}
                            </Text>
                            <Ionicons name="chevron-down" size={16} color={Colors.text.white} />
                        </View>
                    </View>
                </Pressable>

                <Pressable style={styles.avatarBtn} onPress={onAvatarPress}>
                    {user?.photoURL ? (
                        <Image source={{ uri: user.photoURL }} style={styles.avatar} contentFit="cover" />
                    ) : (
                        <Ionicons name="person-circle" size={36} color={Colors.text.white} />
                    )}
                </Pressable>
            </View>

            {/* Search Bar */}
            <Pressable style={styles.searchBar} onPress={onSearchPress}>
                <Ionicons name="search" size={20} color={Colors.text.light} />
                <Text style={styles.searchPlaceholder}>Search for dishes, cuisines...</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.primary.maroon,
        paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 24) + 10,
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.lg,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    locationBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: Spacing.sm,
    },
    locationTextContainer: {
        flex: 1,
    },
    locationLabel: {
        fontSize: FontSize.xs,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '500',
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationAddress: {
        fontSize: FontSize.md,
        fontWeight: '700',
        color: Colors.text.white,
        maxWidth: '80%',
    },
    avatarBtn: {
        marginLeft: Spacing.sm,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: Colors.accent.yellow,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background.white,
        borderRadius: 12,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        gap: Spacing.sm,
    },
    searchPlaceholder: {
        fontSize: FontSize.md,
        color: Colors.text.light,
    },
});
