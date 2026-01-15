
import { Feather, FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView, KeyboardAwareScrollViewRef, useKeyboardHandler } from 'react-native-keyboard-controller';
import Animated, { Easing, Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatBubble } from '../components/ChatBubble';
import { Notes } from '../components/Notes';
import Input from '@/components/Input';

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
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const TOP_DASHBOARD_HEIGHT = 450
const collapseHeight = 110
const collapseGradientHeight = collapseHeight + 100
const collapseScrollPadding = collapseHeight + 100

export default function HomeScreen() {
    const [daysLeft, setDaysLeft] = useState(0)
    const [dateString, setDateString] = useState({ part1: "", part2: "" })
    const scrollX = useSharedValue(SCREEN_WIDTH)

    const insets = useSafeAreaInsets()
    const chatScrollViewRef = useRef<KeyboardAwareScrollViewRef>(null)
    const notesScrollViewRef = useRef<KeyboardAwareScrollViewRef>(null)
    const dashboardHeight = useSharedValue(TOP_DASHBOARD_HEIGHT)
    const startHeight = useSharedValue(0)

    const dashboardPan = Gesture.Pan()
        .onStart(() => {
            startHeight.value = dashboardHeight.value
        })
        .onUpdate((event) => {
            const newHeight = startHeight.value + event.translationY

            if (newHeight < collapseHeight) {
                dashboardHeight.value = collapseHeight
            } else {
                dashboardHeight.value = newHeight
            }
        })
        .onEnd((event) => {
            const expandedHeight = TOP_DASHBOARD_HEIGHT;

            if (event.velocityY > 0) {
                dashboardHeight.value = withTiming(
                    expandedHeight, { duration: 300, easing: Easing.out(Easing.quad) }
                )
            } else {
                dashboardHeight.value = withTiming(
                    collapseHeight, { duration: 300, easing: Easing.out(Easing.quad) }
                )
            }
        });

    useKeyboardHandler(
        {
            onStart: (e) => {
                'worklet';
                if (e.height > 0) {
                    dashboardHeight.value = withTiming(collapseHeight, { duration: 300, easing: Easing.out(Easing.quad) });
                }
            },
        },
        []
    );

    const ctxX = useSharedValue(0);
    const horizontalPan = Gesture.Pan()
        .activeOffsetX([-5, 5])
        .failOffsetY([-5, 5])
        .onStart(() => {
            ctxX.value = scrollX.value;
        })
        .onUpdate((e) => {
            let nextVal = ctxX.value - e.translationX;
            if (nextVal < 0) nextVal = 0;
            if (nextVal > SCREEN_WIDTH) nextVal = SCREEN_WIDTH;
            scrollX.value = nextVal;
        })
        .onEnd((e) => {
            const currentX = scrollX.value;
            const target = (currentX > SCREEN_WIDTH / 2) || (e.velocityX < -500) 
                ? SCREEN_WIDTH 
                : 0;
            
            let finalDest = target;
            if (e.velocityX < -500) finalDest = SCREEN_WIDTH
            else if (e.velocityX > 500) finalDest = 0
            else {
                finalDest = (currentX > SCREEN_WIDTH / 2) ? SCREEN_WIDTH : 0
            }

            scrollX.value = withTiming(finalDest, { duration: 300, easing: Easing.out(Easing.quad) })
        });


    const indicatorStyle = useAnimatedStyle(() => {
        return {
            left: interpolate(scrollX.value, [0, SCREEN_WIDTH], [5, 60]),
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
            height: withTiming(interpolate(
                dashboardHeight.value,
                [collapseHeight, collapseHeight + 60],
                [collapseGradientHeight, collapseGradientHeight + 100]
            ), { duration: 100, easing: Easing.out(Easing.quad) }),
        };
    });

    const animatedScrollPaddingStyle = useAnimatedStyle(() => {
        return {
            paddingTop: withTiming(interpolate(
                dashboardHeight.value,
                [collapseHeight, collapseHeight + 60],
                [collapseScrollPadding, collapseScrollPadding + 60]
            ), { duration: 100, easing: Easing.out(Easing.quad) })
        };
    });

    const trackStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: -scrollX.value }],
        };
    });

    const notesContentStyle = useAnimatedStyle(() => {
        return {
            transform: [{ 
                translateX: interpolate(scrollX.value, [0, SCREEN_WIDTH], [0, 150]) 
            }],
        };
    });

    const chatContentStyle = useAnimatedStyle(() => {
        return {
            transform: [{ 
                translateX: interpolate(scrollX.value, [0, SCREEN_WIDTH], [-150, 0]) 
            }],
        };
    });

    const handleTabPress = (tabIndex: number) => {
        const targetX = tabIndex === 0 ? 0 : SCREEN_WIDTH;
        scrollX.value = withTiming(targetX, { duration: 300, easing: Easing.out(Easing.quad) });
    };

    const notesActiveOpacity = useAnimatedStyle(() => ({ opacity: interpolate(scrollX.value, [0, SCREEN_WIDTH], [1, 0]) }));
    const notesInactiveOpacity = useAnimatedStyle(() => ({ opacity: interpolate(scrollX.value, [0, SCREEN_WIDTH], [0, 1]) }));

    const chatActiveOpacity = useAnimatedStyle(() => ({ opacity: interpolate(scrollX.value, [0, SCREEN_WIDTH], [0, 1]) }));
    const chatInactiveOpacity = useAnimatedStyle(() => ({ opacity: interpolate(scrollX.value, [0, SCREEN_WIDTH], [1, 0]) }));


    useEffect(() => {
        const targetDate = new Date('2030-02-15T00:00:00').getTime()

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

        return () => {
            clearInterval(interval)
        }
    }, []);

    return (
        <View style={styles.container}>
            <GestureDetector gesture={horizontalPan}>
                <View style={styles.rootContainer}>
                    <Animated.View style={[styles.horizontalTrack, trackStyle]}> 
                        <View style={[styles.viewport, { left: 0 }]}>
                            <Animated.View style={[styles.parallaxContent, notesContentStyle]}>
                                <KeyboardAwareScrollView
                                    ref={notesScrollViewRef}
                                    contentContainerStyle={styles.scrollContent}
                                    style={[animatedScrollPaddingStyle]}
                                    onContentSizeChange={() => notesScrollViewRef.current?.scrollToEnd({ animated: false })}
                                >
                                    <Notes />
                                    <View style={{ height: insets.bottom + 300 }} />
                                </KeyboardAwareScrollView>
                            </Animated.View>
                        </View>

                        <View style={[styles.viewport, { left: SCREEN_WIDTH }]}>
                            <Animated.View style={[styles.parallaxContent, chatContentStyle]}>
                                <KeyboardAwareScrollView
                                    ref={chatScrollViewRef}
                                    contentContainerStyle={styles.scrollContent}
                                    style={[animatedScrollPaddingStyle]}
                                    onContentSizeChange={() => chatScrollViewRef.current?.scrollToEnd({ animated: false })}
                                >
                                    <ChatBubble />
                                    <View style={{ height: insets.bottom + 300 }} /> 
                                </KeyboardAwareScrollView>
                            </Animated.View>
                        </View>
                    </Animated.View>
                </View>
            </GestureDetector>

            <Input />

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

                <GestureDetector gesture={dashboardPan}>
                    <View style={{ padding: 15, position: 'relative', zIndex: 12 }}>
                        <View style={styles.topDashboardLine} />
                    </View>
                </GestureDetector>

                <View style={styles.tabRow}>
                    <Animated.View style={[styles.tabIndicator, indicatorStyle]} />
                    <Pressable style={styles.tabButton} onPress={() => handleTabPress(0)}>
                        <Animated.View style={[StyleSheet.absoluteFill, styles.tabIcon, notesActiveOpacity]}>
                            <FontAwesome6 name="file-invoice" size={22} color="#fff" />
                        </Animated.View>
                        <Animated.View style={[StyleSheet.absoluteFill, styles.tabIcon, notesInactiveOpacity]}>
                            <FontAwesome6 name="file" size={22} color="gray" />
                        </Animated.View>
                    </Pressable>
                    <Pressable style={styles.tabButton} onPress={() => handleTabPress(1)}>
                        <Animated.View style={[StyleSheet.absoluteFill, styles.tabIcon, chatActiveOpacity]}>
                            <MaterialCommunityIcons name="chat" size={22} color="#fff" />
                        </Animated.View>
                        <Animated.View style={[StyleSheet.absoluteFill, styles.tabIcon, chatInactiveOpacity]}>
                            <MaterialCommunityIcons name="chat-outline" size={22} color="gray" />
                        </Animated.View>
                    </Pressable>
                </View>

                <Animated.View style={[styles.gradientContainer, animatedGradientHeightStyle]}>
                    <LinearGradient
                        colors={['#000000ff', 'rgba(0,0,0,0)']}
                        locations={[0.65, 1]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={{ width: '100%', height: '100%' }}
                    />
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#080808',
        position: 'relative'
    },
    rootContainer: {
        flex: 1,
        width: '100%',
        overflow: 'hidden'
    },
    horizontalTrack: {
        flex: 1,
        flexDirection: 'row',
        width: '200%'
    },
    viewport: {
        width: SCREEN_WIDTH,
        height: '100%',
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        bottom: 0
    },
    parallaxContent: {
        flex: 1,
        width: '100%',
        height: '100%'
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
        height: 45
    },
    tabIcon: {
        justifyContent: 'center',
        alignItems: 'center'
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
    }
});
