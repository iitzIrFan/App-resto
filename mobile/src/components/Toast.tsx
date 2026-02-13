import React from 'react';
import { View, Text, StyleSheet, Animated, SafeAreaView } from 'react-native';
import { useToast } from '../context/ToastContext';
import { Colors, Spacing, BorderRadius, FontSize } from '../theme';
import { Ionicons } from '@expo/vector-icons';

const TOAST_COLORS = {
    success: { bg: '#ECFDF5', border: Colors.status.success, icon: 'checkmark-circle' as const },
    error: { bg: '#FEF2F2', border: Colors.status.error, icon: 'alert-circle' as const },
    info: { bg: '#EFF6FF', border: Colors.status.info, icon: 'information-circle' as const },
    warning: { bg: '#FFFBEB', border: Colors.status.warning, icon: 'warning' as const },
};

export const ToastOverlay = () => {
    const { toast, fadeAnim } = useToast();
    if (!toast) return null;

    const colors = TOAST_COLORS[toast.type];

    return (
        <SafeAreaView style={styles.container} pointerEvents="none">
            <Animated.View
                style={[
                    styles.toast,
                    { backgroundColor: colors.bg, borderLeftColor: colors.border, opacity: fadeAnim },
                ]}
            >
                <Ionicons name={colors.icon} size={22} color={colors.border} />
                <View style={styles.textContainer}>
                    {toast.title && <Text style={styles.title}>{toast.title}</Text>}
                    <Text style={styles.message}>{toast.message}</Text>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        alignItems: 'center',
        paddingTop: Spacing.xl,
    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        marginHorizontal: Spacing.lg,
        borderRadius: BorderRadius.md,
        borderLeftWidth: 4,
        gap: Spacing.sm,
        maxWidth: 400,
        width: '90%',
    },
    textContainer: { flex: 1 },
    title: {
        fontSize: FontSize.sm,
        fontWeight: '700',
        color: Colors.text.primary,
        marginBottom: 2,
    },
    message: {
        fontSize: FontSize.sm,
        color: Colors.text.secondary,
    },
});
