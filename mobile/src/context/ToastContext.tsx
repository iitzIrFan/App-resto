import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';
import { Animated } from 'react-native';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    title?: string;
    type: ToastType;
}

interface ToastContextType {
    showSuccess: (message: string, title?: string) => void;
    showError: (message: string, title?: string) => void;
    showInfo: (message: string, title?: string) => void;
    showWarning: (message: string, title?: string) => void;
    toast: Toast | null;
    fadeAnim: Animated.Value;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toast, setToast] = useState<Toast | null>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showToast = useCallback(
        (message: string, type: ToastType, title?: string) => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            const id = Date.now().toString();
            setToast({ id, message, title, type });

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            timeoutRef.current = setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => setToast(null));
            }, 3000);
        },
        [fadeAnim]
    );

    return (
        <ToastContext.Provider
            value={{
                showSuccess: (msg, title) => showToast(msg, 'success', title),
                showError: (msg, title) => showToast(msg, 'error', title),
                showInfo: (msg, title) => showToast(msg, 'info', title),
                showWarning: (msg, title) => showToast(msg, 'warning', title),
                toast,
                fadeAnim,
            }}
        >
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
};
