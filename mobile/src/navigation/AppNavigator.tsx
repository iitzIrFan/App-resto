import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize } from '../theme';

// Screens
import {
    HomeScreen,
    DiningScreen,
    OrdersScreen,
    ProfileScreen,
    MoreScreen,
    ProductDetailScreen,
    CartScreen,
    LiveTrackingScreen,
    SearchScreen,
    OrderDetailScreen,
    AddressScreen,
    PaymentScreen,
} from '../screens';

export type RootStackParamList = {
    MainTabs: undefined;
    ProductDetail: { productId: string };
    Cart: undefined;
    LiveTracking: { orderId: string };
    Search: undefined;
    OrderDetail: { orderId: string };
    Address: undefined;
    Payment: { orderId?: string };
};

export type TabParamList = {
    Home: undefined;
    Dining: undefined;
    Orders: undefined;
    Profile: undefined;
    More: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TAB_ICONS: Record<keyof TabParamList, { outline: string; filled: string }> = {
    Home: { outline: 'home-outline', filled: 'home' },
    Dining: { outline: 'restaurant-outline', filled: 'restaurant' },
    Orders: { outline: 'receipt-outline', filled: 'receipt' },
    Profile: { outline: 'person-outline', filled: 'person' },
    More: { outline: 'grid-outline', filled: 'grid' },
};

const TabNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused }: { focused: boolean }) => {
                const icons = TAB_ICONS[route.name as keyof typeof TAB_ICONS];
                return (
                    <Ionicons
                        name={(focused ? icons.filled : icons.outline) as any}
                        size={22}
                        color={focused ? Colors.primary.maroon : Colors.text.light}
                    />
                );
            },
            tabBarActiveTintColor: Colors.primary.maroon,
            tabBarInactiveTintColor: Colors.text.light,
            tabBarStyle: {
                height: 60,
                paddingBottom: 8,
                paddingTop: 4,
                borderTopWidth: 0.5,
                borderTopColor: Colors.border,
                backgroundColor: Colors.background.white,
            },
            tabBarLabelStyle: {
                fontSize: FontSize.xs,
                fontWeight: '600',
            },
        })}
    >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Dining" component={DiningScreen} />
        <Tab.Screen name="Orders" component={OrdersScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
);

export const AppNavigator = () => (
    <NavigationContainer>
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
            <Stack.Screen name="Address" component={AddressScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
        </Stack.Navigator>
    </NavigationContainer>
);
