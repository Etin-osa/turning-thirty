import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export interface ChatMessage {
    id: string;
    variant: 'user' | 'ai';
    message: string;
}

export const DUMMY_CHAT: ChatMessage[] = [
    { id: '1', variant: 'user', message: 'Hey, how are things looking for the party?' },
    { id: '2312', variant: 'ai', message: 'Things are on track! Here is what we have so far:\n\nVenue booked for Saturday\nCatering confirmed for 50 guests\nMusic playlist curated' },
    { id: '3', variant: 'user', message: 'That sounds great! What about the decorations?' },
    { id: '4', variant: 'ai', message: 'I have ordered the balloons and streamers. They should arrive by Friday.' },
    { id: '5', variant: 'user', message: 'Perfect. Did we invite Sarah and Mike?' },
    { id: '6', variant: 'ai', message: 'Yes, invitations were sent to them yesterday. Waiting for their RSVP.' },
    { id: '7', variant: 'user', message: 'Can you remind me what the theme is again?' },
    { id: '8', variant: 'ai', message: 'The theme is "Roaring Twenties". Think Gatsby style - gold, black, and art deco.' },
    { id: '9', variant: 'user', message: 'Right! I need to find a costume.' },
    { id: '10', variant: 'ai', message: 'I can suggest some rental places nearby if you like?' },
    { id: '11', variant: 'user', message: 'Yes please, send me a list.' },
    { id: '12', variant: 'ai', message: 'Here are a few top-rated ones:\n\nVintage Vogue Rentals\nCostume Castle\nRetro Fit Outfitters' },
    { id: '13', variant: 'user', message: 'Thanks! Also, are we doing a cake?' },
    { id: '14', variant: 'ai', message: 'Absolutely! A three-tier deco-style cake has been ordered from Sweet Dreams Bakery.' },
    { id: '15', variant: 'user', message: 'What flavor did we pick?' },
    { id: '16', variant: 'ai', message: 'Chocolate ganache with raspberry filling. A classic choice.' },
    { id: '17', variant: 'user', message: 'Yum. What about drinks?' },
    { id: '18', variant: 'ai', message: 'We have a mixologist hired for the night. They will be serving prohibition-era cocktails like Old Fashioneds and Gin Rickeys.' },
    { id: '19', variant: 'user', message: 'Sounds amazing. I am really looking forward to it.' },
    { id: '20', variant: 'ai', message: 'It is going to be a fantastic night! Let me know if you need anything else.' },
];

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

export function ChatBubble() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {DUMMY_CHAT.map((chat) => (
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
