import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ProductCard } from '../../src/components/ProductCard';
import { useApp } from '../../src/context/AppContext';
import { Product } from '../../src/types';

const MAROON = '#7A0C0C';
const CREAM = '#FFF8F3';

export default function DiningScreen() {
    const router = useRouter();
    const { products, productsLoading, favorites, toggleFavorite, addToCart } = useApp();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'veg' | 'nonveg'>('all');

    // Filter products by "Dining" category
    const diningProducts = useMemo(() => {
        let filtered = products.filter(p => 
            p.category.toLowerCase() === 'dining' || p.category.toLowerCase() === 'dinning'
        );

        // Apply veg filter
        if (activeFilter === 'veg') {
            filtered = filtered.filter(p => p.isVeg);
        } else if (activeFilter === 'nonveg') {
            filtered = filtered.filter(p => !p.isVeg);
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q)
            );
        }

        return filtered;
    }, [products, searchQuery, activeFilter]);

    const handleProductPress = (product: Product) => {
        // TODO: Navigate to product detail screen
        // router.push(`/product/${product.id}`);
        console.log('Product pressed:', product.name);
    };

    const handleAddToCart = (product: Product) => {
        addToCart(product);
    };

    const renderEmptyState = () => {
        if (productsLoading) {
            return (
                <View style={styles.emptyContainer}>
                    <Ionicons name="restaurant-outline" size={64} color="#D1D5DB" />
                    <Text style={styles.emptyText}>Loading dining products...</Text>
                </View>
            );
        }

        if (searchQuery.trim()) {
            return (
                <View style={styles.emptyContainer}>
                    <Ionicons name="search-outline" size={64} color="#D1D5DB" />
                    <Text style={styles.emptyText}>No products found</Text>
                    <Text style={styles.emptySubtext}>Try a different search term</Text>
                </View>
            );
        }

        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="restaurant-outline" size={64} color="#D1D5DB" />
                <Text style={styles.emptyText}>No dining products available</Text>
                <Text style={styles.emptySubtext}>
                    Please create a "Dining" category and add products to it in the admin panel
                </Text>
            </View>
        );
    };

    const renderProductItem = ({ item, index }: { item: Product; index: number }) => (
        <View style={styles.productItem}>
            <ProductCard
                product={item}
                onPress={() => handleProductPress(item)}
                onAddToCart={() => handleAddToCart(item)}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={() => toggleFavorite(item.id)}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Dine In</Text>
                <Text style={styles.headerSubtitle}>Discover dining menu items</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                    <Ionicons name="search" size={20} color="#9CA3AF" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search products..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery ? (
                        <Pressable onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                        </Pressable>
                    ) : null}
                </View>
            </View>

            {/* Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
                <Pressable 
                    style={[styles.filterChip, activeFilter === 'all' && styles.filterChipActive]}
                    onPress={() => setActiveFilter('all')}
                >
                    <Text style={[styles.filterChipText, activeFilter === 'all' && styles.filterChipTextActive]}>
                        All
                    </Text>
                </Pressable>
                <Pressable 
                    style={[styles.filterChip, activeFilter === 'veg' && styles.filterChipActive]}
                    onPress={() => setActiveFilter('veg')}
                >
                    <View style={[styles.vegDot, { backgroundColor: '#22C55E' }]} />
                    <Text style={[styles.filterChipText, activeFilter === 'veg' && styles.filterChipTextActive]}>
                        Veg Only
                    </Text>
                </Pressable>
                <Pressable 
                    style={[styles.filterChip, activeFilter === 'nonveg' && styles.filterChipActive]}
                    onPress={() => setActiveFilter('nonveg')}
                >
                    <View style={[styles.vegDot, { backgroundColor: '#EF4444' }]} />
                    <Text style={[styles.filterChipText, activeFilter === 'nonveg' && styles.filterChipTextActive]}>
                        Non-Veg
                    </Text>
                </Pressable>
            </ScrollView>

            {/* Products Grid */}
            {diningProducts.length === 0 ? (
                <ScrollView 
                    style={styles.scrollView} 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {renderEmptyState()}
                </ScrollView>
            ) : (
                <FlatList
                    data={diningProducts}
                    renderItem={renderProductItem}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.productsGrid}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={styles.columnWrapper}
                />
            )}
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
    searchContainer: {
        padding: 16,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#111827',
    },
    filtersScroll: {
        paddingHorizontal: 16,
        marginBottom: 16,
        flexGrow: 0,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 6,
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
    vegDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    productsGrid: {
        padding: 16,
        paddingTop: 0,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    productItem: {
        width: '48%',
        marginBottom: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 64,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginTop: 16,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 8,
        textAlign: 'center',
        lineHeight: 20,
    },
});
