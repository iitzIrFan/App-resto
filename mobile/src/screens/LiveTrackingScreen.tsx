import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Platform,
    StatusBar,
    Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { doc, onSnapshot } from 'firebase/firestore';
import { io, Socket } from 'socket.io-client';
import Animated, { FadeInUp, SlideInUp } from 'react-native-reanimated';

import { db } from '../config/firebase';
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '../theme';
import { Order, TrackingData, OrderStatus } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:3001';
const OSM_TILE = process.env.EXPO_PUBLIC_OSM_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

const TRACKING_STEPS: { key: OrderStatus; label: string; icon: string }[] = [
    { key: 'confirmed', label: 'Order Confirmed', icon: '✓' },
    { key: 'preparing', label: 'Preparing', icon: '🍳' },
    { key: 'picked_up', label: 'Picked Up', icon: '📦' },
    { key: 'on_the_way', label: 'On the Way', icon: '🏍️' },
    { key: 'delivered', label: 'Delivered', icon: '✅' },
];

export const LiveTrackingScreen = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'LiveTracking'>>();
    const navigation = useNavigation();
    const [order, setOrder] = useState<Order | null>(null);
    const [tracking, setTracking] = useState<TrackingData | null>(null);
    const socketRef = useRef<Socket | null>(null);

    // Subscribe to order updates
    useEffect(() => {
        const unsubscribe = onSnapshot(
            doc(db, 'orders', route.params.orderId),
            (snapshot) => {
                if (snapshot.exists()) {
                    setOrder({ ...snapshot.data(), id: snapshot.id } as Order);
                }
            }
        );
        return () => unsubscribe();
    }, [route.params.orderId]);

    // Subscribe to tracking updates via Socket.io
    useEffect(() => {
        const socket = io(SOCKET_URL, { transports: ['websocket'] });
        socketRef.current = socket;

        socket.emit('join-tracking', { orderId: route.params.orderId });

        socket.on('location-update', (data: TrackingData) => {
            setTracking(data);
        });

        // Also listen from Firebase
        const unsubscribe = onSnapshot(
            doc(db, 'tracking', route.params.orderId),
            (snapshot) => {
                if (snapshot.exists()) {
                    setTracking(snapshot.data() as TrackingData);
                }
            }
        );

        return () => {
            socket.emit('leave-tracking', { orderId: route.params.orderId });
            socket.disconnect();
            unsubscribe();
        };
    }, [route.params.orderId]);

    const currentStepIndex = order
        ? TRACKING_STEPS.findIndex((s) => s.key === order.status)
        : 0;

    // Leaflet map HTML for WebView
    const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        * { margin: 0; padding: 0; }
        #map { width: 100vw; height: 100vh; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const map = L.map('map').setView([${tracking?.kitchenLatLng?.lat || 28.6139}, ${tracking?.kitchenLatLng?.lng || 77.209}], 14);
        L.tileLayer('${OSM_TILE}', {
          attribution: '© OpenStreetMap',
          maxZoom: 19,
        }).addTo(map);

        // Kitchen marker
        const kitchenIcon = L.divIcon({
          html: '<div style="font-size:24px">🏪</div>',
          className: 'custom-marker',
          iconSize: [30, 30],
        });
        L.marker([${tracking?.kitchenLatLng?.lat || 28.6139}, ${tracking?.kitchenLatLng?.lng || 77.209}], { icon: kitchenIcon })
          .addTo(map).bindPopup('Cloud Kitchen');

        // User marker
        const userIcon = L.divIcon({
          html: '<div style="font-size:24px">📍</div>',
          className: 'custom-marker',
          iconSize: [30, 30],
        });
        ${tracking?.userLatLng ? `
        L.marker([${tracking.userLatLng.lat}, ${tracking.userLatLng.lng}], { icon: userIcon })
          .addTo(map).bindPopup('Your Location');
        ` : ''}

        // Delivery boy marker
        const bikeIcon = L.divIcon({
          html: '<div style="font-size:28px">🏍️</div>',
          className: 'custom-marker',
          iconSize: [35, 35],
        });
        let deliveryMarker;
        ${tracking?.deliveryBoyLatLng ? `
        deliveryMarker = L.marker([${tracking.deliveryBoyLatLng.lat}, ${tracking.deliveryBoyLatLng.lng}], { icon: bikeIcon })
          .addTo(map).bindPopup('Delivery Partner');
        ` : ''}

        // Route polyline
        ${tracking?.routePolyline ? `
        const routeCoords = ${JSON.stringify(tracking.routePolyline)};
        L.polyline(routeCoords, {
          color: '#7A0C0C',
          weight: 4,
          opacity: 0.8,
          dashArray: '10, 10',
        }).addTo(map);
        
        // Fit bounds
        if (routeCoords.length > 0) {
          map.fitBounds(routeCoords, { padding: [40, 40] });
        }
        ` : ''}

        // Listen for location updates from React Native
        window.addEventListener('message', function(e) {
          try {
            const data = JSON.parse(e.data);
            if (data.type === 'location-update' && deliveryMarker) {
              deliveryMarker.setLatLng([data.lat, data.lng]);
            }
          } catch(err) {}
        });
      </script>
    </body>
    </html>
  `;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
                </Pressable>
                <Text style={styles.headerTitle}>Live Tracking</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Map */}
            <View style={styles.mapContainer}>
                <WebView
                    source={{ html: mapHtml }}
                    style={styles.map}
                    javaScriptEnabled
                    domStorageEnabled
                    scrollEnabled={false}
                />
            </View>

            {/* ETA Card */}
            {tracking && (
                <Animated.View entering={SlideInUp} style={styles.etaCard}>
                    <View style={styles.etaRow}>
                        <View>
                            <Text style={styles.etaLabel}>Estimated Time</Text>
                            <Text style={styles.etaValue}>{tracking.etaMinutes} min</Text>
                        </View>
                        <View style={styles.etaDivider} />
                        <View>
                            <Text style={styles.etaLabel}>Distance</Text>
                            <Text style={styles.etaValue}>{tracking.distanceKm.toFixed(1)} km</Text>
                        </View>
                    </View>
                </Animated.View>
            )}

            {/* Status Steps */}
            <Animated.View entering={FadeInUp.delay(200)} style={styles.stepsContainer}>
                {TRACKING_STEPS.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                        <View key={step.key} style={styles.stepRow}>
                            <View style={styles.stepIndicator}>
                                <View
                                    style={[
                                        styles.stepDot,
                                        isCompleted && styles.stepDotCompleted,
                                        isCurrent && styles.stepDotCurrent,
                                    ]}
                                >
                                    <Text style={styles.stepIcon}>{isCompleted ? step.icon : ''}</Text>
                                </View>
                                {index < TRACKING_STEPS.length - 1 && (
                                    <View style={[styles.stepLine, isCompleted && styles.stepLineCompleted]} />
                                )}
                            </View>
                            <Text style={[styles.stepLabel, isCompleted && styles.stepLabelCompleted]}>
                                {step.label}
                            </Text>
                        </View>
                    );
                })}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background.offWhite },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 24) + 10,
        paddingBottom: Spacing.md,
        backgroundColor: Colors.background.white,
        zIndex: 10,
    },
    headerTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text.primary },
    mapContainer: { height: SCREEN_HEIGHT * 0.45 },
    map: { flex: 1 },
    etaCard: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 110 : 80,
        left: Spacing.lg,
        right: Spacing.lg,
        backgroundColor: Colors.background.white,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        ...Shadow.large,
        zIndex: 5,
    },
    etaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    etaLabel: { fontSize: FontSize.sm, color: Colors.text.secondary, textAlign: 'center' },
    etaValue: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.primary.maroon, textAlign: 'center' },
    etaDivider: { width: 1, height: 40, backgroundColor: Colors.border, marginHorizontal: Spacing.xxl },
    stepsContainer: {
        backgroundColor: Colors.background.white,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        marginTop: -20,
        padding: Spacing.xl,
        flex: 1,
    },
    stepRow: { flexDirection: 'row', alignItems: 'flex-start' },
    stepIndicator: { alignItems: 'center', marginRight: Spacing.lg, width: 30 },
    stepDot: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepDotCompleted: { backgroundColor: Colors.status.success },
    stepDotCurrent: { backgroundColor: Colors.primary.maroon, borderWidth: 3, borderColor: Colors.accent.goldGlow },
    stepIcon: { fontSize: 13 },
    stepLine: { width: 2, height: 30, backgroundColor: Colors.border, marginVertical: 2 },
    stepLineCompleted: { backgroundColor: Colors.status.success },
    stepLabel: { fontSize: FontSize.md, color: Colors.text.light, paddingTop: 4 },
    stepLabelCompleted: { color: Colors.text.primary, fontWeight: '600' },
});
