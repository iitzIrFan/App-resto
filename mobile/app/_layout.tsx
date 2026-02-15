import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { AppProvider } from '../src/context/AppContext';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

function RootLayoutNav() {
    const { user, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = segments[0] === 'auth';

        if (!user && !inAuthGroup) {
            router.replace('/auth/sign-in');
        } else if (user && inAuthGroup) {
            router.replace('/(tabs)');
        }
    }, [user, loading, segments]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#7A0C0C' }}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
                name="location"
                options={{
                    headerShown: false,
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                }}
            />
            {/* product/[id] and tracking/[id] routes can be added here once their files are created */}
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AuthProvider>
                <AppProvider>
                    <StatusBar style="light" />
                    <RootLayoutNav />
                </AppProvider>
            </AuthProvider>
        </GestureHandlerRootView>
    );
}
