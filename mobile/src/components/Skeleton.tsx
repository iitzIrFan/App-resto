import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Colors, BorderRadius } from '../theme';

import type { ViewStyle } from 'react-native';

interface SkeletonProps {
    width: number | string;
    height: number;
    borderRadius?: number;
    style?: ViewStyle;
}

export const Skeleton = ({ width, height, borderRadius = BorderRadius.md, style }: SkeletonProps) => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 1200,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const opacity = shimmerAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.3, 0.7, 0.3],
    });

    return (
        <Animated.View
            style={[
                { width: width as number | `${number}%`, height, borderRadius, backgroundColor: '#E5E7EB', opacity },
                style,
            ]}
        />
    );
};

export const ProductCardSkeleton = () => (
    <View style={skeletonStyles.card}>
        <Skeleton width="100%" height={150} borderRadius={BorderRadius.lg} />
        <View style={{ padding: 12 }}>
            <Skeleton width="70%" height={16} style={{ marginBottom: 8 }} />
            <Skeleton width="40%" height={14} style={{ marginBottom: 6 }} />
            <Skeleton width="30%" height={18} />
        </View>
    </View>
);

const skeletonStyles = StyleSheet.create({
    card: {
        backgroundColor: Colors.background.white,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        marginBottom: 16,
    },
});
