import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    StatusBar,
    Platform,
    Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, SlideInRight } from 'react-native-reanimated';

import { useApp } from '../context/AppContext';
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '../theme';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ProductDetailScreen = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'ProductDetail'>>();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { products, addToCart, favorites, toggleFavorite, cart } = useApp();

    const product = useMemo(
        () => products.find((p) => p.id === route.params.productId),
        [products, route.params.productId]
    );

    if (!product) {
        return (
            <View style={styles.notFound}>
                <Text style={styles.notFoundText}>Product not found</Text>
            </View>
        );
    }

    const isFavorite = favorites.includes(product.id);
    const cartItem = cart.find((c) => c.id === product.id);
    const hasDiscount = product.offerPrice && product.offerPrice < product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.price - product.offerPrice!) / product.price) * 100)
        : 0;

    const images = product.images?.length ? product.images : [product.imageUrl];

    // Similar items
    const similarItems = products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 6);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                {/* Image Carousel */}
                <View style={styles.imageContainer}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                    >
                        {images.map((img, i) => (
                            <Image key={i} source={{ uri: img }} style={styles.image} contentFit="cover" transition={300} />
                        ))}
                    </ScrollView>

                    {/* Back & Favorite Buttons */}
                    <View style={styles.topBar}>
                        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={24} color={Colors.text.white} />
                        </Pressable>
                        <Pressable style={styles.backBtn} onPress={() => toggleFavorite(product.id)}>
                            <Ionicons
                                name={isFavorite ? 'heart' : 'heart-outline'}
                                size={24}
                                color={isFavorite ? Colors.status.error : Colors.text.white}
                            />
                        </Pressable>
                    </View>

                    {/* Veg Badge on Image */}
                    <View style={styles.vegBadgeOnImage}>
                        <View style={[styles.vegIcon, { borderColor: product.isVeg ? Colors.veg : Colors.nonVeg }]}>
                            <View style={[styles.vegDot, { backgroundColor: product.isVeg ? Colors.veg : Colors.nonVeg }]} />
                        </View>
                        <Text style={styles.vegLabel}>{product.isVeg ? 'VEG' : 'NON-VEG'}</Text>
                    </View>
                </View>

                {/* Details Card */}
                <Animated.View entering={FadeInUp.delay(100)} style={styles.detailsCard}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.category}>{product.category}</Text>

                    {/* Rating */}
                    {product.rating && (
                        <View style={styles.ratingRow}>
                            <View style={styles.ratingBadge}>
                                <Ionicons name="star" size={14} color={Colors.text.white} />
                                <Text style={styles.ratingText}>{product.rating}</Text>
                            </View>
                            <Text style={styles.reviewText}>
                                {product.reviewCount || 0} ratings
                            </Text>
                        </View>
                    )}

                    {/* Price */}
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>₹{product.offerPrice || product.price}</Text>
                        {hasDiscount && (
                            <>
                                <Text style={styles.originalPrice}>₹{product.price}</Text>
                                <View style={styles.discountBadge}>
                                    <Text style={styles.discountText}>{discountPercent}% OFF</Text>
                                </View>
                            </>
                        )}
                    </View>

                    <Text style={styles.description}>{product.description}</Text>

                    {/* Preparation Time */}
                    {product.preparationTime && (
                        <View style={styles.infoRow}>
                            <Ionicons name="time-outline" size={16} color={Colors.text.secondary} />
                            <Text style={styles.infoText}>{product.preparationTime} min prep time</Text>
                        </View>
                    )}
                </Animated.View>

                {/* Similar Items */}
                {similarItems.length > 0 && (
                    <Animated.View entering={FadeInUp.delay(200)} style={styles.similarSection}>
                        <Text style={styles.sectionTitle}>Similar Items</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {similarItems.map((item) => (
                                <Pressable
                                    key={item.id}
                                    style={styles.similarCard}
                                    onPress={() => navigation.push('ProductDetail', { productId: item.id })}
                                >
                                    <Image source={{ uri: item.imageUrl }} style={styles.similarImage} contentFit="cover" />
                                    <Text style={styles.similarName} numberOfLines={1}>{item.name}</Text>
                                    <Text style={styles.similarPrice}>₹{item.offerPrice || item.price}</Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </Animated.View>
                )}

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Bottom Add to Cart Bar */}
            <Animated.View entering={SlideInRight.delay(300)} style={styles.bottomBar}>
                <View style={styles.bottomPriceContainer}>
                    <Text style={styles.bottomPrice}>₹{product.offerPrice || product.price}</Text>
                    {cartItem && (
                        <Text style={styles.bottomQty}>{cartItem.quantity} in cart</Text>
                    )}
                </View>
                <Pressable style={styles.addToCartBtn} onPress={() => addToCart(product)}>
                    <Text style={styles.addToCartText}>
                        {cartItem ? 'Add More' : 'Add to Cart'}
                    </Text>
                </Pressable>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background.offWhite },
    notFound: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    notFoundText: { fontSize: FontSize.lg, color: Colors.text.secondary },
    imageContainer: { width: SCREEN_WIDTH, height: 280, position: 'relative' },
    image: { width: SCREEN_WIDTH, height: 280 },
    topBar: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 24) + 10,
        left: Spacing.lg,
        right: Spacing.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    vegBadgeOnImage: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: BorderRadius.sm,
        gap: 4,
    },
    vegIcon: { width: 16, height: 16, borderWidth: 2, borderRadius: 3, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    vegDot: { width: 7, height: 7, borderRadius: 4 },
    vegLabel: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.text.primary },
    detailsCard: {
        backgroundColor: Colors.background.white,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        marginTop: -20,
        padding: Spacing.xl,
    },
    productName: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.text.primary },
    category: { fontSize: FontSize.md, color: Colors.text.secondary, marginTop: 4 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.md, gap: Spacing.sm },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.status.success,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: BorderRadius.sm,
        gap: 3,
    },
    ratingText: { color: Colors.text.white, fontSize: FontSize.sm, fontWeight: '700' },
    reviewText: { fontSize: FontSize.sm, color: Colors.text.secondary },
    priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.md, gap: Spacing.sm },
    price: { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.text.primary },
    originalPrice: { fontSize: FontSize.lg, color: Colors.text.light, textDecorationLine: 'line-through' },
    discountBadge: {
        backgroundColor: Colors.primary.maroon,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: BorderRadius.sm,
    },
    discountText: { color: Colors.text.white, fontSize: FontSize.xs, fontWeight: '700' },
    description: {
        fontSize: FontSize.md,
        color: Colors.text.secondary,
        lineHeight: 22,
        marginTop: Spacing.lg,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: Spacing.md,
    },
    infoText: { fontSize: FontSize.sm, color: Colors.text.secondary },
    similarSection: { padding: Spacing.xl },
    sectionTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text.primary, marginBottom: Spacing.md },
    similarCard: {
        width: 130,
        marginRight: Spacing.md,
        backgroundColor: Colors.background.white,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        ...Shadow.small,
    },
    similarImage: { width: '100%', height: 90 },
    similarName: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text.primary, padding: 8, paddingBottom: 2 },
    similarPrice: { fontSize: FontSize.md, fontWeight: '700', color: Colors.primary.maroon, paddingHorizontal: 8, paddingBottom: 8 },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.background.white,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.lg,
        paddingBottom: Platform.OS === 'ios' ? 30 : Spacing.lg,
    },
    bottomPriceContainer: {},
    bottomPrice: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.text.primary },
    bottomQty: { fontSize: FontSize.xs, color: Colors.status.success, fontWeight: '600' },
    addToCartBtn: {
        backgroundColor: Colors.primary.maroon,
        paddingHorizontal: Spacing.xxl,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
    },
    addToCartText: { color: Colors.text.white, fontSize: FontSize.lg, fontWeight: '700' },
});
