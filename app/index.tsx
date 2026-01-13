import { Feather, FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

export default function HomeScreen() {
    const [daysLeft, setDaysLeft] = useState(0)
    const [dateString, setDateString] = useState({ part1: "", part2: "" })
    const [activeTab, setActiveTab] = useState(0)
    const TOP_DASHBOARD_HEIGHT = 570

    const insets = useSafeAreaInsets()
    
    const dashboardHeight = useSharedValue(TOP_DASHBOARD_HEIGHT);
    const startHeight = useSharedValue(0);
    const collapseHeight = insets.top + 100

    const pan = Gesture.Pan()
        .onStart(() => {
            startHeight.value = dashboardHeight.value;
        })
        .onUpdate((event) => {
            const newHeight = startHeight.value + event.translationY;
            // Collapse at 150 (hard limit)
            if (newHeight < collapseHeight) {
                dashboardHeight.value = collapseHeight;
            } else {
                // Allow dragging past the expanded height (overshoot)
                dashboardHeight.value = newHeight;
            }
        })
        .onEnd(() => {
            const expandedHeight = TOP_DASHBOARD_HEIGHT;
            const currentHeight = dashboardHeight.value;

            // Snap to the closest point
            const distToCollapsed = Math.abs(currentHeight - collapseHeight);
            const distToExpanded = Math.abs(currentHeight - expandedHeight);

            if (distToCollapsed < distToExpanded) {
                dashboardHeight.value = withTiming(collapseHeight, { duration: 500, easing: Easing.ease });
            } else {
                dashboardHeight.value = withTiming(expandedHeight, { duration: 500, easing: Easing.ease });
            }
        });

    const animatedDashboardStyle = useAnimatedStyle(() => {
        return {
            height: dashboardHeight.value,
        };
    });
    
    const indicatorStyle = useAnimatedStyle(() => {
        return {
            left: withTiming(activeTab === 0 ? 5 : 60, { duration: 300, easing: Easing.out(Easing.quad) }),
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
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: TOP_DASHBOARD_HEIGHT + 20, paddingBottom: 120 }
                ]}
                showsVerticalScrollIndicator={false}
            >
                {/* <View style={styles.dateDivider}>
                    <Text style={styles.dateDividerText}>TODAY</Text>
                </View>

                <View style={styles.chatBubble}>
                    <Text style={styles.chatAuthor}>AI Companion</Text>
                    <Text style={styles.chatText}>
                        Reviewing last week's notes, you mentioned wanting to focus on cardio. 
                        Shall we schedule a run for tomorrow morning?
                    </Text>
                </View>

                <View style={[styles.chatBubble, styles.userBubble]}>
                    <Text style={styles.chatText}>
                        That sounds good. Let's do 7 AM.
                    </Text>
                </View>
                
                 <View style={styles.chatBubble}>
                    <Text style={styles.chatAuthor}>AI Companion</Text>
                    <Text style={styles.chatText}>
                        Scheduled. Weather looks clear.
                    </Text>
                </View>*/}
                
                 <View style={{ height: 400 }} /> 
            </ScrollView>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={[styles.inputWrapper, { paddingBottom: insets.bottom + 10 }]}
            >
                {/* <View style={styles.floatingMenu}>
                    <View style={styles.menuPill}>
                         <Text style={styles.menuText}>Yesterday</Text>
                         <View style={styles.menuDivider} />
                         <Text style={styles.menuText}>Last Week</Text>
                    </View>
                    <View style={styles.menuArrow} />
                </View> */}

                <View style={styles.inputPill}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Feather name="clock" size={20} color="#666" />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Type a message..."
                        placeholderTextColor="#999"
                    />
                    <TouchableOpacity style={styles.sendButton}>
                        <Feather name="arrow-up" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            <Animated.View style={[styles.topDashboard, animatedDashboardStyle]}>
                <View style={[styles.topDashboardContent, { paddingTop: insets.top + 20 }]}>
                    <View style={styles.header}>
                        <Feather name="box" size={24} color="#rgba(255,255,255,0.8)" />
                        <View style={styles.headerIcons}>
                            <Ionicons name="trophy-outline" size={24} color="#rgba(255,255,255,0.8)" style={{ marginRight: 24 }} />
                            <Feather name="settings" size={24} color="#rgba(255,255,255,0.8)" />
                        </View>
                    </View>

                    <View style={styles.heroContainer}>
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
                    </View>

                    <View style={styles.footerContainer}>
                        <View style={styles.footerLine} />
                        <Text style={styles.footerText}>Last conversation — 5 hours ago</Text>
                    </View>
                </View>

                <GestureDetector gesture={pan}>
                    <View style={{ padding: 10 }}>
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
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    topDashboard: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },
    topDashboardContent: {
        flex: 1,
        backgroundColor: '#0060FD',
        justifyContent: 'space-between',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        padding: 25
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingBottom: 20,
        width: '95%'
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
    },
    footerLine: {
        height: 1,
        backgroundColor: '#fff',
        opacity: 0.2,
        marginBottom: 12,
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
        marginBottom: 12,
        borderRadius: 100,
        width: 50,
        marginHorizontal: 'auto',
    },
    scrollContent: {
        paddingHorizontal: 24,
        backgroundColor: '#080808'
    },
    tabRow: {
        flexDirection: 'row',
        marginBottom: 24,
        backgroundColor: '#222222',
        borderRadius: 1000,
        position: 'relative',
        marginHorizontal: 'auto',
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
    chatBubble: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        borderTopLeftRadius: 4,
        marginBottom: 12,
        maxWidth: '85%',
        alignSelf: 'flex-start',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    userBubble: {
        backgroundColor: '#EBEBEB',
        alignSelf: 'flex-end',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 4,
    },
    chatAuthor: {
        fontSize: 12,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    chatText: {
        fontSize: 15,
        lineHeight: 22,
        color: '#333',
    },
    // Input Area
    inputWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        zIndex: 110,
        paddingTop: 10,
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
        backgroundColor: '#fff',
        borderRadius: 32,
        paddingVertical: 6,
        paddingHorizontal: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
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
        backgroundColor: '#111',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
