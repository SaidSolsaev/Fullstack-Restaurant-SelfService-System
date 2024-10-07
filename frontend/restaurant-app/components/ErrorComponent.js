import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const ErrorComponent = ({ message, duration = 2000, resetKey}) => {
    const [visible, setVisible] = useState(true);
    const fadeAnim = new Animated.Value(1);

    useEffect(() => {
        setVisible(true);
        fadeAnim.setValue(1);

        const timer = setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => setVisible(false));
        }, duration - 500);

        return () => clearTimeout(timer);
    }, [duration, resetKey, message]);

    if (!visible) return null;

    return (
        <Animated.View style={[styles.errorContainer, { opacity: fadeAnim }]}>
            <Text style={styles.errorMessage}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    errorContainer: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        padding: 10,
        borderRadius: 8,
        marginHorizontal: 20,
        alignItems: 'center',
        zIndex: 10,
    },
    errorMessage: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ErrorComponent;
