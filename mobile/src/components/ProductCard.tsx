import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '../theme';
import { Product } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - Spacing.lg * 3) / 2;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ProductCardProps {
    product: Product;
    onPress: () => void;
    onAddToCart: () => void;
    isFavorite: boolean;
    onToggleFavorite: () => void;
    showDescription?: boolean;
}

export const ProductCard = ({
    product,
    onPress,
    onAddToCart,
    isFavorite,
    onToggleFavorite,
    showDescription = false,
}: ProductCardProps) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.96);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    const hasDiscount = product.offerPrice && product.offerPrice < product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.price - product.offerPrice!) / product.price) * 100)
        : 0;

    return (
        <AnimatedPressable
            style={[styles.card, animatedStyle]}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: product.imageUrl }}
                    style={styles.image}
                    contentFit="cover"
                    transition={300}
                    placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
                />
                {/* Veg/Non-Veg Badge */}
                <View style={[styles.vegBadge, { borderColor: product.isVeg ? Colors.veg : Colors.nonVeg }]}>
                    <View style={[styles.vegDot, { backgroundColor: product.isVeg ? Colors.veg : Colors.nonVeg }]} />
                </View>
                {/* Favorite Button */}
                <Pressable style={styles.favoriteBtn} onPress={onToggleFavorite}>
                    <Ionicons
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={20}
                        color={isFavorite ? Colors.status.error : Colors.text.white}
                    />
                </Pressable>
                {/* Discount Badge */}
                {hasDiscount && (
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{discountPercent}% OFF</Text>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={1}>
                    {product.name}
                </Text>
                {showDescription ? (
                    <Text style={styles.description} numberOfLines={2}>
                        {product.description}
                    </Text>
                ) : (
                    <Text style={styles.category} numberOfLines={1}>
                        {product.category}
                    </Text>
                )}
                <View style={styles.priceRow}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>₹{product.offerPrice || product.price}</Text>
                        {hasDiscount && <Text style={styles.originalPrice}>₹{product.price}</Text>}
                    </View>
                    <Pressable style={styles.addBtn} onPress={onAddToCart}>
                        <Text style={styles.addBtnText}>ADD</Text>
                    </Pressable>
                </View>
                {product.rating !== undefined && (
                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={12} color={Colors.accent.yellow} />
                        <Text style={styles.ratingText}>{product.rating}</Text>
                        {product.reviewCount !== undefined && (
                            <Text style={styles.reviewCount}>({product.reviewCount})</Text>
                        )}
                    </View>
                )}
            </View>
        </AnimatedPressable>
    );
};

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        backgroundColor: Colors.background.white,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        marginBottom: Spacing.lg,
        ...Shadow.medium,
    },
    imageContainer: {
        width: '100%',
        height: 130,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    vegBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        width: 18,
        height: 18,
        borderWidth: 2,
        borderRadius: 3,
        backgroundColor: Colors.background.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    vegDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    favoriteBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    discountBadge: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: Colors.primary.maroon,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: BorderRadius.sm,
    },
    discountText: {
        color: Colors.text.white,
        fontSize: FontSize.xs,
        fontWeight: '700',
    },
    content: {
        padding: Spacing.md,
    },
    name: {
        fontSize: FontSize.md,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 2,
    },
    category: {
        fontSize: FontSize.xs,
        color: Colors.text.secondary,
        marginBottom: Spacing.sm,
    },
    description: {
        fontSize: FontSize.xs,
        color: Colors.text.secondary,
        marginBottom: Spacing.sm,
        lineHeight: 16,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    price: {
        fontSize: FontSize.lg,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    originalPrice: {
        fontSize: FontSize.sm,
        color: Colors.text.light,
        textDecorationLine: 'line-through',
    },
    addBtn: {
        backgroundColor: Colors.primary.maroon,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.sm,
    },
    addBtnText: {
        color: Colors.text.white,
        fontSize: FontSize.sm,
        fontWeight: '700',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        marginTop: Spacing.xs,
    },
    ratingText: {
        fontSize: FontSize.xs,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    reviewCount: {
        fontSize: FontSize.xs,
        color: Colors.text.light,
    },
});
