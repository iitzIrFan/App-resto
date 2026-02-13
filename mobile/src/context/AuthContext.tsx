import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    onAuthStateChanged,
    signInWithCredential,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { AuthUser, AppUser } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
    user: AuthUser;
    appUser: AppUser | null;
    loading: boolean;
    isAuthenticated: boolean;
    signInWithGoogleToken: (idToken: string) => Promise<User>;
    signOut: () => Promise<void>;
    updateUserProfile: (data: Partial<AppUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser>(null);
    const [appUser, setAppUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                await loadUserProfile(firebaseUser);
            } else {
                setAppUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const loadUserProfile = async (firebaseUser: User) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
                setAppUser(userDoc.data() as AppUser);
            } else {
                const newUser: AppUser = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    displayName: firebaseUser.displayName || 'User',
                    photoURL: firebaseUser.photoURL || undefined,
                    addresses: [],
                    favorites: [],
                    createdAt: new Date().toISOString(),
                };
                await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
                setAppUser(newUser);
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    };

    const signInWithGoogleToken = async (idToken: string): Promise<User> => {
        const credential = GoogleAuthProvider.credential(idToken);
        const result = await signInWithCredential(auth, credential);
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

    return (
        <AuthContext.Provider
            value={{
                user,
                appUser,
                loading,
                isAuthenticated: !!user,
                signInWithGoogleToken,
                signOut,
                updateUserProfile,
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
