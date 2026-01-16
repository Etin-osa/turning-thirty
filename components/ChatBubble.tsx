import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

import { useApp } from '../context/AppContext';

interface SingleBubbleProps {
    variant: 'user' | 'ai';
    message: string;
}

function SingleBubble({ variant, message }: SingleBubbleProps) {
    const isUser = variant === 'user';

    return (
        <View style={[styles.bubbleContainer, isUser ? styles.userBubble : styles.aiBubble]}>
            <Text style={[styles.text, isUser ? styles.userText : styles.aiText]}>
                {message}
            </Text>
        </View>
    );
}

function LoadingBubble({ variant }: { variant: 'user' | 'ai' }) {
    const isUser = variant === 'user';
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1000 }),
                withTiming(0, { duration: 1000 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            progress.value,
            [0, 1],
            ['#303030ff', '#242424ff']
        );
        return { backgroundColor };
    });

    if (isUser) {
        return (
            <View style={[styles.bubbleContainer, styles.userBubble, { width: '85%' }]}>
                <Animated.View style={[styles.skeletonBlock, { width: '100%', height: 14, marginBottom: 6 }, animatedStyle]} />
                <Animated.View style={[styles.skeletonBlock, { width: '60%', height: 14 }, animatedStyle]} />
            </View>
        );
    }

    return (
        <View style={[styles.bubbleContainer, styles.aiBubble, { width: '100%' }]}>
            <Animated.View style={[styles.skeletonBlock, { width: '100%', height: 60, marginBottom: 15, borderRadius: 8 }, animatedStyle]} />
            <Animated.View style={[styles.skeletonBlock, { width: '100%', height: 12, marginBottom: 6 }, animatedStyle]} />
            <Animated.View style={[styles.skeletonBlock, { width: '60%', height: 12, marginBottom: 6 }, animatedStyle]} />
            <Animated.View style={[styles.skeletonBlock, { width: '80%', height: 12 }, animatedStyle]} />
        </View>
    );
}

export default function ChatBubble() {
    const { chatMessages } = useApp();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {chatMessages.map((chat) => (
                isLoading ? (
                    <LoadingBubble key={chat.id} variant={chat.variant} />
                ) : (
                    <SingleBubble key={chat.id} variant={chat.variant} message={chat.message} />
                )
            ))}
        </>
    );
}

const styles = StyleSheet.create({
    bubbleContainer: {
        marginBottom: 12,
        maxWidth: '85%',
        padding: 12,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#1b1b1bff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    aiBubble: {
        alignSelf: 'flex-start',
        backgroundColor: 'transparent',
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
    },
    userText: {
        color: '#ffffffd3',
    },
    aiText: {
        color: '#ffffffd3',
    },
    skeletonBlock: {
        borderRadius: 4,
    }
});
