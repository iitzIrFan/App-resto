import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

const MAROON = '#7A0C0C';
const CREAM = '#FFF8F3';

const RESTAURANTS = [
    {
        id: '1',
        name: 'Paradise Biryani',
        cuisine: 'Hyderabadi • Biryani',
        rating: 4.5,
        distance: '2.5 km',
        time: '30-35 min',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
    },
    {
        id: '2',
        name: 'Pizza Hut',
        cuisine: 'Italian • Pizza',
        rating: 4.2,
        distance: '1.8 km',
        time: '25-30 min',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    },
    {
        id: '3',
        name: 'Chinese Wok',
        cuisine: 'Chinese • Noodles',
        rating: 4.0,
        distance: '3.2 km',
        time: '40-45 min',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400',
    },
    {
        id: '4',
        name: 'Burger King',
        cuisine: 'American • Burgers',
        rating: 4.3,
        distance: '1.2 km',
        time: '20-25 min',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    },
];

export default function DiningScreen() {
    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Dine Out</Text>
                <Text style={styles.headerSubtitle}>Discover restaurants near you</Text>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Search and Filter */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBox}>
                        <Ionicons name="search" size={20} color="#9CA3AF" />
                        <Text style={styles.searchPlaceholder}>Search restaurants...</Text>
                    </View>
                    <Pressable style={styles.filterBtn}>
                        <Ionicons name="options" size={20} color={MAROON} />
                    </Pressable>
                </View>

                {/* Quick Filters */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
                    {['All', 'Pure Veg', 'Rating 4.0+', 'Near Me', 'Offers'].map((filter, idx) => (
                        <Pressable key={idx} style={[styles.filterChip, idx === 0 && styles.filterChipActive]}>
                            <Text style={[styles.filterChipText, idx === 0 && styles.filterChipTextActive]}>
                                {filter}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* Restaurant List */}
                <View style={styles.restaurantsList}>
                    {RESTAURANTS.map((restaurant) => (
                        <Pressable key={restaurant.id} style={styles.restaurantCard}>
                            <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
                            <View style={styles.restaurantInfo}>
                                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                                <Text style={styles.restaurantCuisine}>{restaurant.cuisine}</Text>
                                <View style={styles.restaurantMeta}>
                                    <View style={styles.ratingBadge}>
                                        <Ionicons name="star" size={12} color="#FFFFFF" />
                                        <Text style={styles.ratingText}>{restaurant.rating}</Text>
                                    </View>
                                    <Text style={styles.metaText}>{restaurant.distance}</Text>
                                    <Text style={styles.metaDot}>•</Text>
                                    <Text style={styles.metaText}>{restaurant.time}</Text>
                                </View>
                            </View>
                            <Pressable style={styles.bookmarkBtn}>
                                <Ionicons name="bookmark-outline" size={20} color="#6B7280" />
                            </Pressable>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CREAM,
    },
    header: {
        padding: 16,
        backgroundColor: MAROON,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#FFF8F3',
        marginTop: 4,
    },
    scrollView: {
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        gap: 8,
    },
    searchPlaceholder: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    filterBtn: {
        width: 48,
        height: 48,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filtersScroll: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    filterChipActive: {
        backgroundColor: MAROON,
        borderColor: MAROON,
    },
    filterChipText: {
        fontSize: 14,
        color: '#374151',
    },
    filterChipTextActive: {
        color: '#FFFFFF',
    },
    restaurantsList: {
        paddingHorizontal: 16,
    },
    restaurantCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        flexDirection: 'row',
        position: 'relative',
    },
    restaurantImage: {
        width: 100,
        height: 100,
    },
    restaurantInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    restaurantName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    restaurantCuisine: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    restaurantMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 8,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#22C55E',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 2,
    },
    ratingText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    metaText: {
        fontSize: 12,
        color: '#6B7280',
    },
    metaDot: {
        color: '#D1D5DB',
    },
    bookmarkBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
});
