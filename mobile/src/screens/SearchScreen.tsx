import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    FlatList,
    Platform,
    StatusBar,
    Keyboard,
} from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useApp } from '../context/AppContext';
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '../theme';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const SearchScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { products, addToCart } = useApp();
    const [query, setQuery] = useState('');
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        setTimeout(() => inputRef.current?.focus(), 300);
    }, []);

    const results = query.trim()
        ? products.filter(
            (p) =>
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.category.toLowerCase().includes(query.toLowerCase()) ||
                p.description.toLowerCase().includes(query.toLowerCase())
        )
        : [];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
                </Pressable>
                <TextInput
                    ref={inputRef}
                    style={styles.searchInput}
                    placeholder="Search for dishes, cuisines..."
                    value={query}
                    onChangeText={setQuery}
                    returnKeyType="search"
                    autoCorrect={false}
                />
                {query.length > 0 && (
                    <Pressable onPress={() => setQuery('')}>
                        <Ionicons name="close-circle" size={22} color={Colors.text.light} />
                    </Pressable>
                )}
            </View>

            <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item, index }) => (
                    <Animated.View entering={FadeInDown.delay(index * 50)}>
                        <Pressable
                            style={styles.resultItem}
                            onPress={() => {
                                Keyboard.dismiss();
                                navigation.navigate('ProductDetail', { productId: item.id });
                            }}
                        >
                            <Image source={{ uri: item.imageUrl }} style={styles.resultImage} contentFit="cover" />
                            <View style={styles.resultContent}>
                                <View style={styles.resultHeader}>
                                    <View style={[styles.vegIcon, { borderColor: item.isVeg ? Colors.veg : Colors.nonVeg }]}>
                                        <View style={[styles.vegDot, { backgroundColor: item.isVeg ? Colors.veg : Colors.nonVeg }]} />
                                    </View>
                                    <Text style={styles.resultName} numberOfLines={1}>{item.name}</Text>
                                </View>
                                <Text style={styles.resultCategory}>{item.category}</Text>
                                <Text style={styles.resultPrice}>₹{item.offerPrice || item.price}</Text>
                            </View>
                            <Pressable style={styles.addBtn} onPress={() => addToCart(item)}>
                                <Text style={styles.addBtnText}>ADD</Text>
                            </Pressable>
                        </Pressable>
                    </Animated.View>
                )}
                ListEmptyComponent={
                    query.trim().length > 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="search-outline" size={48} color={Colors.text.light} />
                            <Text style={styles.emptyText}>No results for "{query}"</Text>
                        </View>
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="search" size={48} color={Colors.text.light} />
                            <Text style={styles.emptyText}>Search for your favorite dishes</Text>
                        </View>
                    )
                }
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background.offWhite },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 24) + 10,
        paddingBottom: Spacing.md,
        backgroundColor: Colors.background.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        gap: Spacing.md,
    },
    searchInput: {
        flex: 1,
        fontSize: FontSize.md,
        color: Colors.text.primary,
        paddingVertical: Spacing.sm,
    },
    listContent: { padding: Spacing.lg },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background.white,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        ...Shadow.small,
    },
    resultImage: { width: 65, height: 65, borderRadius: BorderRadius.md },
    resultContent: { flex: 1, marginLeft: Spacing.md },
    resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    vegIcon: { width: 14, height: 14, borderWidth: 2, borderRadius: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    vegDot: { width: 6, height: 6, borderRadius: 3 },
    resultName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text.primary, flex: 1 },
    resultCategory: { fontSize: FontSize.xs, color: Colors.text.secondary, marginTop: 2 },
    resultPrice: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text.primary, marginTop: 4 },
    addBtn: {
        backgroundColor: Colors.primary.maroon,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.sm,
        marginLeft: Spacing.sm,
    },
    addBtnText: { color: Colors.text.white, fontSize: FontSize.sm, fontWeight: '700' },
    emptyState: { alignItems: 'center', paddingTop: 60 },
    emptyText: { fontSize: FontSize.md, color: Colors.text.secondary, marginTop: Spacing.md },
});
