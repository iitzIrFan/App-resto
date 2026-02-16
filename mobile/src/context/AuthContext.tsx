import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    onAuthStateChanged,
    signInWithCredential,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { AuthUser, AppUser, UserRole } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
    user: AuthUser;
    appUser: AppUser | null;
    loading: boolean;
    isAuthenticated: boolean;
    needsRoleSelection: boolean;
    signInWithGoogleToken: (idToken: string | null, accessToken?: string | null) => Promise<User>;
    signIn: (email: string, pass: string) => Promise<User>;
    signUp: (email: string, pass: string, name: string) => Promise<User>;
    signOut: () => Promise<void>;
    updateUserProfile: (data: Partial<AppUser>) => Promise<void>;
    setUserRole: (role: UserRole, additionalData?: Partial<AppUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser>(null);
    const [appUser, setAppUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [needsRoleSelection, setNeedsRoleSelection] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                console.log('AuthStateChanged: User is logged in:', firebaseUser.uid);
                await loadUserProfile(firebaseUser);
            } else {
                setAppUser(null);
                setNeedsRoleSelection(false);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const loadUserProfile = async (firebaseUser: User) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data() as AppUser;
                setAppUser(userData);
                // Check if role is set
                if (!userData.role) {
                    setNeedsRoleSelection(true);
                } else {
                    setNeedsRoleSelection(false);
                }
            } else {
                // New user - needs role selection
                setNeedsRoleSelection(true);
                const newUser: Partial<AppUser> = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    displayName: firebaseUser.displayName || 'User',
                    photoURL: firebaseUser.photoURL || undefined,
                    addresses: [],
                    favorites: [],
                    createdAt: new Date().toISOString(),
                    // role will be set after selection
                };
                try {
                    await setDoc(doc(db, 'users', firebaseUser.uid), newUser, { merge: true });
                    console.log('User document created in Firestore for:', firebaseUser.uid);
                } catch (e) {
                    console.error('Error creating user document:', e);
                }
                setAppUser(newUser as AppUser);
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
            // Fallback: set basic app user from firebaseUser even if Firestore fails
            const fallbackUser: Partial<AppUser> = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || 'User',
                photoURL: firebaseUser.photoURL || undefined,
            };
            setAppUser(fallbackUser as AppUser);
        }
    };

    const signInWithGoogleToken = async (idToken: string | null, accessToken?: string | null): Promise<User> => {
        const credential = GoogleAuthProvider.credential(idToken, accessToken);
        const result = await signInWithCredential(auth, credential);
        await loadUserProfile(result.user);
        return result.user;
    };

    const signIn = async (email: string, pass: string): Promise<User> => {
        const result = await signInWithEmailAndPassword(auth, email, pass);
        await loadUserProfile(result.user);
        return result.user;
    };

    const signUp = async (email: string, pass: string, name: string): Promise<User> => {
        const result = await createUserWithEmailAndPassword(auth, email, pass);

        // Update profile with name
        await updateProfile(result.user, {
            displayName: name
        });

        // Initialize user profile in Firestore
        // We do this explicitly here to ensure the name is captured correctly
        // even if onAuthStateChanged triggers first
        const newUser: Partial<AppUser> = {
            uid: result.user.uid,
            email: email,
            displayName: name,
            createdAt: new Date().toISOString(),
            addresses: [],
            favorites: [],
            // Role will be processed by loadUserProfile or subsequent logic
        };

        await setDoc(doc(db, 'users', result.user.uid), newUser, { merge: true });

        await loadUserProfile(result.user);

        return result.user;
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
        await AsyncStorage.clear();
        setAppUser(null);
    };

    const updateUserProfile = async (data: Partial<AppUser>) => {
        if (!user) return;
        await setDoc(doc(db, 'users', user.uid), data, { merge: true });
        setAppUser(prev => prev ? { ...prev, ...data } : null);
    };

    const setUserRole = async (role: UserRole, additionalData?: Partial<AppUser>) => {
        if (!user) return;

        const updates: Partial<AppUser> = {
            role,
            ...additionalData,
        };

        // If delivery partner, create a delivery boy document
        if (role === 'delivery_partner') {
            const deliveryBoyData = {
                id: user.uid,
                name: appUser?.displayName || 'Delivery Partner',
                phone: appUser?.phone || '',
                email: user.email || '',
                photoUrl: appUser?.photoURL || '',
                vehicleType: additionalData?.vehicleType || 'bike',
                vehicleNumber: additionalData?.vehicleNumber || '',
                isAvailable: false,
                isOnline: false,
                rating: 5.0,
                totalDeliveries: 0,
                userId: user.uid,
            };

            await setDoc(doc(db, 'deliveryBoys', user.uid), deliveryBoyData);
            updates.deliveryBoyId = user.uid;
            updates.vehicleType = deliveryBoyData.vehicleType;
            updates.vehicleNumber = deliveryBoyData.vehicleNumber;
            updates.isAvailable = false;
            updates.isOnline = false;
            updates.rating = 5.0;
            updates.totalDeliveries = 0;
        }

        await updateUserProfile(updates);
        setNeedsRoleSelection(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                appUser,
                loading,
                isAuthenticated: !!user,
                needsRoleSelection,
                signInWithGoogleToken,
                signIn,
                signUp,
                signOut,
                updateUserProfile,
                setUserRole,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
