import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing } from '../theme';

export const OrderDetailScreen = () => (
    <View style={styles.container}>
        <Text style={styles.title}>Order Details</Text>
        <Text style={styles.subtitle}>Full order detail view</Text>
    </View>
);

export const AddressScreen = () => (
    <View style={styles.container}>
        <Text style={styles.title}>Address Book</Text>
        <Text style={styles.subtitle}>Manage delivery addresses</Text>
    </View>
);

export const PaymentScreen = () => (
    <View style={styles.container}>
        <Text style={styles.title}>Payment</Text>
        <Text style={styles.subtitle}>Razorpay UPI payment screen</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background.offWhite },
    title: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.text.primary },
    subtitle: { fontSize: FontSize.md, color: Colors.text.secondary, marginTop: Spacing.sm },
});
