import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../src/context/AppContext';

const MAROON = '#7A0C0C';
const CREAM = '#FFF8F3';

export default function CartScreen() {
    const router = useRouter();
    const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useApp();

    // Check if all items are from Dining category (no delivery fee for dine-in)
    const isDiningOnly = cart.length > 0 && cart.every(item => 
        item.category.toLowerCase() === 'dining' || item.category.toLowerCase() === 'dinning'
    );
    
    const deliveryFee = (cart.length > 0 && !isDiningOnly) ? 40 : 0;
    const taxes = Math.round(cartTotal * 0.05);
    const grandTotal = cartTotal + deliveryFee + taxes;

    if (cart.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Your Cart</Text>
                </View>
                <View style={styles.emptyContainer}>
                    <Ionicons name="cart-outline" size={80} color="#D1D5DB" />
                    <Text style={styles.emptyTitle}>Your cart is empty</Text>
                    <Text style={styles.emptySubtitle}>Add items to get started</Text>
                    <Pressable style={styles.browseBtn} onPress={() => router.push('/')}>
                        <Text style={styles.browseBtnText}>Browse Menu</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Your Cart</Text>
                <Pressable onPress={clearCart}>
                    <Text style={styles.clearBtn}>Clear All</Text>
                </Pressable>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Cart Items */}
                <View style={styles.cartItems}>
                    {cart.map((item) => (
                        <View key={item.id} style={styles.cartItem}>
                            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
                            <View style={styles.itemInfo}>
                                <View style={styles.vegBadge}>
                                    <View
                                        style={[
                                            styles.vegDot,
                                            { backgroundColor: item.isVeg ? '#22C55E' : '#EF4444' },
                                        ]}
                                    />
                                </View>
                                <Text style={styles.itemName} numberOfLines={1}>
                                    {item.name}
                                </Text>
                                <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                            </View>
                            <View style={styles.quantityControls}>
                                <Pressable
                                    style={styles.quantityBtn}
                                    onPress={() => updateQuantity(item.id, -1)}
                                >
                                    <Ionicons name="remove" size={16} color={MAROON} />
                                </Pressable>
                                <Text style={styles.quantityText}>{item.quantity}</Text>
                                <Pressable
                                    style={styles.quantityBtn}
                                    onPress={() => updateQuantity(item.id, 1)}
                                >
                                    <Ionicons name="add" size={16} color={MAROON} />
                                </Pressable>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Bill Details */}
                <View style={styles.billCard}>
                    <Text style={styles.billTitle}>Bill Details</Text>
                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Item Total</Text>
                        <Text style={styles.billValue}>₹{cartTotal}</Text>
                    </View>
                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Delivery Fee</Text>
                        <Text style={styles.billValue}>₹{deliveryFee}</Text>
                    </View>
                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Taxes & Charges</Text>
                        <Text style={styles.billValue}>₹{taxes}</Text>
                    </View>
                    <View style={[styles.billRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Grand Total</Text>
                        <Text style={styles.totalValue}>₹{grandTotal}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Checkout Button */}
            <View style={styles.checkoutContainer}>
                <View style={styles.checkoutInfo}>
                    <Text style={styles.checkoutTotal}>₹{grandTotal}</Text>
                    <Text style={styles.checkoutItems}>{cart.length} items</Text>
                </View>
                <Pressable style={styles.checkoutBtn}>
                    <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CREAM,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    clearBtn: {
        color: MAROON,
        fontSize: 14,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#374151',
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#9CA3AF',
        marginTop: 4,
    },
    browseBtn: {
        backgroundColor: MAROON,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 24,
    },
    browseBtnText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
    },
    cartItems: {
        padding: 16,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        alignItems: 'center',
    },
    itemImage: {
        width: 80,
        height: 80,
    },
    itemInfo: {
        flex: 1,
        padding: 12,
    },
    vegBadge: {
        width: 14,
        height: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    vegDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '700',
        color: MAROON,
        marginTop: 4,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
        backgroundColor: '#FFF8F3',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: MAROON,
    },
    quantityBtn: {
        padding: 8,
    },
    quantityText: {
        fontSize: 14,
        fontWeight: '700',
        color: MAROON,
        minWidth: 24,
        textAlign: 'center',
    },
    billCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 100,
    },
    billTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 12,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    billLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    billValue: {
        fontSize: 14,
        color: '#111827',
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        marginTop: 8,
        paddingTop: 12,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: '700',
        color: MAROON,
    },
    checkoutContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        alignItems: 'center',
    },
    checkoutInfo: {
        flex: 1,
    },
    checkoutTotal: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    checkoutItems: {
        fontSize: 12,
        color: '#6B7280',
    },
    checkoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: MAROON,
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    checkoutBtnText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
    },
});
