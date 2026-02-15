import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, User, ArrowRight, Chrome, ArrowLeft } from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';

// Only import Google auth if we have a client ID configured
const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const GOOGLE_ENABLED = !!GOOGLE_WEB_CLIENT_ID;

let useGoogleAuth: () => { request: any; response: any; promptAsync: () => void };

if (GOOGLE_ENABLED) {
    const Google = require('expo-auth-session/providers/google');
    const WebBrowser = require('expo-web-browser');
    WebBrowser.maybeCompleteAuthSession();

    useGoogleAuth = () => {
        const [request, response, promptAsync] = Google.useAuthRequest({
            webClientId: GOOGLE_WEB_CLIENT_ID,
            androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
            iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        });
        return { request, response, promptAsync };
    };
} else {
    useGoogleAuth = () => ({ request: null, response: null, promptAsync: () => { } });
}

export default function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signUp, signInWithGoogleToken } = useAuth();

    const { request, response, promptAsync } = useGoogleAuth();

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            handleGoogleSignIn(id_token);
        }
    }, [response]);

    const handleGoogleSignIn = async (token: string) => {
        setLoading(true);
        try {
            await signInWithGoogleToken(token);
            router.replace('/(tabs)');
        } catch (err: any) {
            Alert.alert("Google Sign In Error", err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Error', 'Password should be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            await signUp(email, password, name);
            router.replace('/(tabs)');
        } catch (err: any) {
            let message = err.message;
            if (err.code === 'auth/email-already-in-use') {
                message = 'This email is already in use';
            } else if (err.code === 'auth/weak-password') {
                message = 'Password should be at least 6 characters';
            }
            Alert.alert('Sign Up Failed', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={['#7A0C0C', '#4E0A0A']}
                style={styles.background}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft color="#fff" size={24} />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join Yummyfi today</Text>
                    </View>

                    <View style={styles.formCard}>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Full Name</Text>
                            <View style={styles.inputContainer}>
                                <User color="#9CA3AF" size={20} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="John Doe"
                                    placeholderTextColor="#9CA3AF"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                        </View>

                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputContainer}>
                                <Mail color="#9CA3AF" size={20} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="name@example.com"
                                    placeholderTextColor="#9CA3AF"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>

                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputContainer}>
                                <Lock color="#9CA3AF" size={20} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Create a password (min 6 chars)"
                                    placeholderTextColor="#9CA3AF"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.signUpButton}
                            onPress={handleSignUp}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Text style={styles.signUpButtonText}>Sign Up</Text>
                                    <ArrowRight color="#fff" size={20} />
                                </>
                            )}
                        </TouchableOpacity>

                        {GOOGLE_ENABLED && (
                            <>
                                <View style={styles.divider}>
                                    <View style={styles.dividerLine} />
                                    <Text style={styles.dividerText}>OR</Text>
                                    <View style={styles.dividerLine} />
                                </View>

                                <TouchableOpacity
                                    style={styles.googleButton}
                                    onPress={() => promptAsync()}
                                    disabled={!request || loading}
                                >
                                    <Chrome color="#DB4437" size={20} />
                                    <Text style={styles.googleButtonText}>Sign up with Google</Text>
                                </TouchableOpacity>
                            </>
                        )}

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/auth/sign-in')}>
                                <Text style={styles.linkText}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#4E0A0A',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 60,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
    },
    inputWrapper: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#1F2937',
    },
    signUpButton: {
        backgroundColor: '#7A0C0C',
        borderRadius: 16,
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 8,
    },
    signUpButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#6B7280',
        fontSize: 14,
        fontWeight: '500',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        height: 56,
        gap: 12,
    },
    googleButtonText: {
        color: '#374151',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        color: '#6B7280',
        fontSize: 14,
    },
    linkText: {
        color: '#7A0C0C',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
