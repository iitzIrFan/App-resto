import { Tabs } from 'expo-router';
import { Home, Search, Utensils, ShoppingCart, Menu } from 'lucide-react-native';

const MAROON = '#7A0C0C';
const GRAY = '#9CA3AF';

type TabIconProps = { color: string; size: number };

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: MAROON,
                tabBarInactiveTintColor: GRAY,
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#E5E7EB',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }: TabIconProps) => <Home color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color, size }: TabIconProps) => <Search color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="dining"
                options={{
                    title: 'Dining',
                    tabBarIcon: ({ color, size }: TabIconProps) => <Utensils color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: 'Cart',
                    tabBarIcon: ({ color, size }: TabIconProps) => <ShoppingCart color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="more"
                options={{
                    title: 'More',
                    tabBarIcon: ({ color, size }: TabIconProps) => <Menu color={color} size={size} />,
                }}
            />
        </Tabs>
    );
}
