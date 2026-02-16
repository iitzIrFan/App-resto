import React from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, FlatList, Pressable,
    Image, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/context/AppContext';
import { COLORS, SIZES } from '../../src/constants/theme';

export default function FavoritesScreen() {
    const router = useRouter();
    const { products, favorites, toggleFavorite, addToCart, productsLoading } = useApp();

    const favoriteProducts = products.filter(p => favorites.includes(p.id));

    return (
        <SafeAreaView style={s.container}>
            {/* Header */}
            <View style={s.header}>
                <Pressable onPress={() => router.back()} style={s.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                </Pressable>
                <Text style={s.headerTitle}>Favorites</Text>
                <View style={{ width: 40 }} />
            </View>

            {productsLoading ? (
                <View style={s.center}>
                    <ActivityIndicator size="large" color={COLORS.maroon} />
                </View>
            ) : favoriteProducts.length === 0 ? (
                <View style={s.center}>
                    <Ionicons name="heart-outline" size={64} color={COLORS.gray300} />
                    <Text style={s.emptyText}>No favorites yet</Text>
                    <Text style={s.emptySubtext}>Items you love will appear here</Text>
                </View>
            ) : (
                <FlatList
                    data={favoriteProducts}
                    keyExtractor={p => p.id}
                    contentContainerStyle={{ padding: SIZES.padding }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={s.card}>
                            {item.imageUrl ? (
                                <Image source={{ uri: item.imageUrl }} style={s.image} />
                            ) : (
                                <View style={[s.image, s.imagePlaceholder]}>
                                    <Ionicons name="fast-food" size={32} color={COLORS.gray300} />
                                </View>
                            )}
                            <View style={s.info}>
                                <View style={s.topRow}>
                                    <View style={[s.vegBadge, { borderColor: item.isVeg ? COLORS.green : COLORS.red }]}>
                                        <View style={[s.vegDot, { backgroundColor: item.isVeg ? COLORS.green : COLORS.red }]} />
                                    </View>
                                    <Pressable onPress={() => toggleFavorite(item.id)} hitSlop={8}>
                                        <Ionicons name="heart" size={22} color={COLORS.red} />
                                    </Pressable>
                                </View>
                                <Text style={s.name} numberOfLines={2}>{item.name}</Text>
                                <View style={s.priceRow}>
                                    <Text style={s.price}>₹{item.offerPrice || item.price}</Text>
                                    {item.offerPrice && item.offerPrice < item.price && (
                                        <Text style={s.oldPrice}>₹{item.price}</Text>
                                    )}
                                </View>
                                <Pressable style={s.addBtn} onPress={() => addToCart(item)}>
                                    <Ionicons name="add" size={18} color={COLORS.white} />
                                    <Text style={s.addBtnText}>Add</Text>
                                </Pressable>
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
    backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
    headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.white },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 60 },
    emptyText: { fontSize: 18, fontWeight: '600', color: COLORS.gray500, marginTop: 16 },
    emptySubtext: { fontSize: 14, color: COLORS.gray400, marginTop: 4 },
    card: {
        flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 16,
        marginBottom: 12, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.gray100,
    },
    image: { width: 110, height: 130 },
    imagePlaceholder: { backgroundColor: COLORS.gray100, justifyContent: 'center', alignItems: 'center' },
    info: { flex: 1, padding: 12 },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    vegBadge: {
        width: 18, height: 18, borderRadius: 3, borderWidth: 1.5,
        justifyContent: 'center', alignItems: 'center',
    },
    vegDot: { width: 9, height: 9, borderRadius: 5 },
    name: { fontSize: 15, fontWeight: '600', color: COLORS.black, marginBottom: 4 },
    priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
    price: { fontSize: 17, fontWeight: '700', color: COLORS.maroon },
    oldPrice: { fontSize: 13, color: COLORS.gray400, textDecorationLine: 'line-through' },
    addBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
        backgroundColor: COLORS.maroon, borderRadius: 8, paddingVertical: 7, paddingHorizontal: 16,
        alignSelf: 'flex-start',
    },
    addBtnText: { color: COLORS.white, fontSize: 13, fontWeight: '700' },
});
