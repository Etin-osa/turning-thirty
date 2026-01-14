import { Feather, FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Dimensions, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { KeyboardAvoidingView, KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, { Easing, Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatBubble } from '../components/ChatBubble';
import { Notes } from '../components/Notes';

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const daysOfWeek = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

function getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
}

const WELCOME_FONT_SIZE = 27
const WELCOME_LINE_HEIGHT = 42
const WELCOME_FAINT_COLOR = '#ffffff9a'
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeScreen() {
    const [daysLeft, setDaysLeft] = useState(0)
    const [dateString, setDateString] = useState({ part1: "", part2: "" })
    const [activeTab, setActiveTab] = useState(1)
    const TOP_DASHBOARD_HEIGHT = 450
    const GRADIENT_HEIGHT = 800
    const SCROLL_PADDING = 450

    const insets = useSafeAreaInsets()
    const dashboardHeight = useSharedValue(TOP_DASHBOARD_HEIGHT)
    const gradientHeight = useSharedValue(GRADIENT_HEIGHT)
    const scrollPadding = useSharedValue(SCROLL_PADDING)
    const startHeight = useSharedValue(0)
    const collapseHeight = 110
    const collapseGradientHeight = collapseHeight + 100
    const collapseScrollPadding = collapseHeight + 100

    const pan = Gesture.Pan()
        .onStart(() => {
            startHeight.value = dashboardHeight.value
        })
        .onUpdate((event) => {
            const newHeight = startHeight.value + event.translationY

            if (newHeight < collapseHeight) {
                dashboardHeight.value = collapseHeight
                gradientHeight.value = collapseGradientHeight
            } else {
                dashboardHeight.value = newHeight
                gradientHeight.value = newHeight + (GRADIENT_HEIGHT - TOP_DASHBOARD_HEIGHT)
            }
        })
        .onEnd((event) => {
            const expandedHeight = TOP_DASHBOARD_HEIGHT;

            if (event.velocityY > 0) {
                dashboardHeight.value = withTiming(
                    expandedHeight, { duration: 500, easing: Easing.linear }
                )
                gradientHeight.value = withTiming(
                    expandedHeight + (GRADIENT_HEIGHT - TOP_DASHBOARD_HEIGHT), { duration: 500, easing: Easing.linear }
                )
                scrollPadding.value = withTiming(
                    SCROLL_PADDING, { duration: 500, easing: Easing.linear }
                )
            } else {
                dashboardHeight.value = withTiming(
                    collapseHeight, { duration: 500, easing: Easing.linear }
                )
                gradientHeight.value = withTiming(
                    collapseGradientHeight, { duration: 500, easing: Easing.linear }
                )
                scrollPadding.value = withTiming(
                    collapseScrollPadding, { duration: 500, easing: Easing.linear }
                )
            }
        });

    const indicatorStyle = useAnimatedStyle(() => {
        return {
            left: withTiming(activeTab === 0 ? 5 : 60, { duration: 300, easing: Easing.out(Easing.quad) }),
        };
    });

    const contentOpacityStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                dashboardHeight.value,
                [collapseHeight, collapseHeight + 60],
                [0, 1],
                Extrapolation.CLAMP
            ),
        };
    });

    const animatedContentHeightStyle = useAnimatedStyle(() => {
        return {
            height: dashboardHeight.value,
        };
    });

    const animatedGradientHeightStyle = useAnimatedStyle(() => {
        return {
            height: gradientHeight.value,
        };
    });

    const animatedScrolPaddingStyle = useAnimatedStyle(() => {
        return {
            paddingTop: scrollPadding.value
        };
    });

    useEffect(() => {
        const targetDate = new Date('2030-02-15T00:00:00').getTime();

        const updateTime = () => {
            const now = new Date();
            const nowTime = now.getTime();
            const difference = targetDate - nowTime;

            if (difference > 0) {
                setDaysLeft(Math.floor(difference / (1000 * 60 * 60 * 24)));
            } else {
                setDaysLeft(0);
            }

            const dayName = daysOfWeek[now.getDay()];
            const month = months[now.getMonth()];
            const day = now.getDate();
            const year = now.getFullYear();

            const part1 = `${dayName} — ${month} ${day}${getOrdinalSuffix(day)} ${year}`;
            setDateString({ part1, part2: " 📅" });
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 100}
        >
            <KeyboardAwareScrollView
                contentContainerStyle={styles.scrollContent}
                style={[animatedScrolPaddingStyle]}
            >                
                {activeTab === 1 && (
                    <ChatBubble />
                )}
                {activeTab === 0 && (
                    <Notes />
                )}
                <View style={{ height: insets.bottom + 300 }} /> 
            </KeyboardAwareScrollView>

            <View style={[styles.inputWrapper, { paddingBottom: insets.bottom + 10 }]}>
                <View style={styles.inputPill}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Feather name="clock" size={20} color="#737373" />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Let's talk about your day..."
                        placeholderTextColor="#535353"
                    />
                    <TouchableOpacity style={styles.sendButton}>
                        <Feather name="arrow-up" size={20} color="#737373" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.topDashboard}>
                <Animated.View style={[styles.topDashboardContent, { paddingTop: insets.top + 20 }, animatedContentHeightStyle]}>
                    <View style={styles.header}>
                        <Feather name="box" size={24} color="#rgba(255,255,255,0.8)" />
                        <View style={styles.headerIcons}>
                            <Ionicons name="trophy-outline" size={24} color="#rgba(255,255,255,0.8)" style={{ marginRight: 24 }} />
                            <Feather name="settings" size={24} color="#rgba(255,255,255,0.8)" />
                        </View>
                    </View>
                    
                    <Animated.View style={[styles.heroContainer, { top: insets.top + (0.47 * TOP_DASHBOARD_HEIGHT) }, contentOpacityStyle]}>
                        <View style={styles.greetingContainer}>
                            <Text style={styles.greetingText}>Good morning, </Text>
                            <View style={styles.profileCircle} />
                            <Text style={styles.greetingName}> Alexey, </Text>
                        </View>
                        <Text>
                            <Text style={styles.regularText}>It's </Text>
                            <Text style={styles.boldText}>{dateString.part1}</Text>
                            <View style={{ transform: [{ rotate: '-10deg' }, { translateY: 7 }]}}>
                                <Text style={{ fontSize: WELCOME_FONT_SIZE }}>{dateString.part2}</Text>
                            </View>
                            <Text style={styles.regularText}> and you have </Text>
                            <Text style={styles.boldText}>{daysLeft} days</Text>
                            <Text style={styles.regularText}> remaining until your</Text>
                            <Text style={styles.boldText}> 30th Birthday.</Text>
                        </Text>
                    </Animated.View>

                    <Animated.View style={[styles.footerContainer, contentOpacityStyle]}>
                        <View style={styles.footerLine} />
                        <Text style={styles.footerText}>Last conversation — 5 hours ago</Text>
                    </Animated.View>
                </Animated.View>

                <GestureDetector gesture={pan}>
                    <View style={{ padding: 15, position: 'relative', zIndex: 12 }}>
                        <View style={styles.topDashboardLine} />
                    </View>
                </GestureDetector>

                <View style={styles.tabRow}>
                    <Animated.View style={[styles.tabIndicator, indicatorStyle]} />
                    <Pressable style={styles.tabButton} onPress={() => setActiveTab(0)}>
                        {activeTab === 0 ? (
                            <FontAwesome6 name="file-invoice" size={22} color="#fff" />
                        ) : (
                            <FontAwesome6 name="file" size={22} color="gray" />
                        )}
                    </Pressable>
                    <Pressable style={styles.tabButton} onPress={() => setActiveTab(1)}>
                         {activeTab === 1 ? (
                            <MaterialCommunityIcons name="chat" size={22} color="#fff" />
                        ) : (
                             <MaterialCommunityIcons name="chat-outline" size={22} color="gray" />
                        )}
                    </Pressable>
                </View>

                <Animated.View style={[styles.gradientContainer, animatedGradientHeightStyle]}>
                    <LinearGradient
                        colors={['#000000', 'rgba(0,0,0,0)']}
                        locations={[0.65, 1]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={{ width: '100%', height: '100%' }}
                    />
                </Animated.View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#080808',
        position: 'relative',
    },
    topDashboard: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    topDashboardContent: {
        backgroundColor: '#0060FD',
        justifyContent: 'space-between',
        flexDirection: 'column',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        paddingHorizontal: 25,
        overflow: 'hidden',
        position: 'relative',
        zIndex: 12
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    headerIcons: {
        flexDirection: 'row',
    },
    heroContainer: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '95%',
        overflow: 'hidden',
        position: 'absolute',
        left: 25,
        transform: [{ translateY: '-50%' }],
    },
    greetingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    greetingText: {
        fontSize: WELCOME_FONT_SIZE,
        color: '#ffffff9a',
        fontWeight: '600',
        lineHeight: WELCOME_LINE_HEIGHT
    },
    greetingName: {
        fontSize: WELCOME_FONT_SIZE,
        color: '#fff',
        fontWeight: '800',
        opacity: 1.0, 
        lineHeight: WELCOME_LINE_HEIGHT
    },
    profileCircle: {
        width: 30,
        height: 30,
        borderRadius: 100,
        backgroundColor: '#fff',
    },
    regularText: {
        fontWeight: '600',
        fontSize: WELCOME_FONT_SIZE,
        color: WELCOME_FAINT_COLOR,
        lineHeight: WELCOME_LINE_HEIGHT
    },
    boldText: {
        fontWeight: '900',
        fontSize: WELCOME_FONT_SIZE,
        color: '#fff',
        lineHeight: WELCOME_LINE_HEIGHT
    },
    calendarEmoji: {
        fontSize: 30,
        transform: [{ rotate: '-15deg' }],
    },
    footerContainer: {
        marginTop: 'auto',
        gap: 10,
        paddingBottom: 15
    },
    footerLine: {
        height: 1,
        backgroundColor: '#fff',
        opacity: 0.2
    },
    footerText: {
        color: '#fff',
        opacity: 0.5,
        fontSize: 12,
        fontWeight: '500',
    },
    topDashboardLine: {
        height: 5,
        backgroundColor: '#fff',
        opacity: 0.2,
        borderRadius: 100,
        width: 50,
        marginHorizontal: 'auto',
    },
    scrollContent: {
        paddingHorizontal: 24,
        width: '100%',
        minHeight: SCREEN_HEIGHT,
    },
    tabRow: {
        flexDirection: 'row',
        backgroundColor: '#222222',
        borderRadius: 1000,
        position: 'relative',
        marginHorizontal: 'auto',
        zIndex: 12
    },
    tabIndicator: {
        position: 'absolute',
        top: 5,
        backgroundColor: '#3D3D3D',
        borderRadius: 100,
        width: 45,
        height: 45,
    },
    tabButton: {
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        width: 55,
        height: 55,
        borderRadius: 100
    },
    gradientContainer: {
        position: 'absolute', 
        top: 0,
        left: 0, 
        width: '100%',
        zIndex: 10
    },
    dateDivider: {
        alignItems: 'center',
        marginBottom: 20,
    },
    dateDividerText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#999',
        letterSpacing: 1,
    },
    inputWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        zIndex: 110,
        backgroundColor: 'black'
    },
    floatingMenu: {
        position: 'absolute',
        top: -60,
        left: 20,
        alignItems: 'flex-start',
    },
    menuPill: {
        flexDirection: 'row',
        backgroundColor: '#333',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    menuText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    menuDivider: {
        width: 1,
        height: 12,
        backgroundColor: '#666',
        marginHorizontal: 12,
    },
    menuArrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 6,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#333',
        marginLeft: 20,
        marginBottom: 8,
    },
    inputPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1C',
        borderRadius: 32,
        paddingVertical: 6,
        paddingHorizontal: 6,
        borderWidth: 1,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2D2D2D',
    },
    textInput: {
        flex: 1,
        height: 44,
        marginHorizontal: 12,
        fontSize: 16,
        color: '#333',
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#2D2D2D',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
