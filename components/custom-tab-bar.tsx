import { BottomTabBarProps, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { LinearGradient } from 'expo-linear-gradient'
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native'
import Animated, {
    useAnimatedStyle,
    useDerivedValue,
    withTiming
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets()
    const { width: screenWidth } = useWindowDimensions()
    
    const TAB_BAR_WIDTH_PERCENT = 0.45
    const tabBarWidth = screenWidth * TAB_BAR_WIDTH_PERCENT
    const PADDING = 5
    
    const innerWidth = tabBarWidth - (PADDING * 2)
    const totalUnits = state.routes.length + 1
    const unitWidth = innerWidth / totalUnits    
    const targetX = state.index * unitWidth

    const cursorX = useDerivedValue(() => {
        return withTiming(targetX, { duration: 200 })
    }, [targetX])

    const cursorStyle = useAnimatedStyle(() => {
        return { transform: [{ translateX: cursorX.value }] }
    })

    return (
        <View style={styles.container} pointerEvents="box-none">
            <LinearGradient
                colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={[styles.gradient, { bottom: 0, height: 120 + insets.bottom }]}
                pointerEvents="none"
            />

            <View style={[styles.tabBarContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                <View style={[styles.floatingPill, { width: tabBarWidth, padding: PADDING }]}>
                    <Animated.View style={[
                        styles.cursor, 
                        cursorStyle, 
                        { top: PADDING, bottom: PADDING, left: PADDING, width: unitWidth * 2 }
                    ]} />

                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key]
                        const label = options.tabBarLabel !== undefined
                            ? options.tabBarLabel : options.title !== undefined
                            ? options.title : route.name

                        const isFocused = state.index === index

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            })

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name, route.params)
                            }
                        }

                        return (
                            <TabItem
                                key={route.key}
                                isFocused={isFocused}
                                options={options}
                                label={label as string}
                                onPress={onPress}
                            />
                        )
                    })}
                </View>
            </View>
        </View>
    )
}

const TabItem = ({ isFocused, options, label, onPress }: { 
    isFocused: boolean
    options: BottomTabNavigationOptions
    label: string
    onPress: () => void
}) => {
    const animatedContainerStyle = useAnimatedStyle(() => {
        return {
            flex: isFocused ? 2 : 1
        }
    }, [isFocused])

    const animatedTextStyle = useAnimatedStyle(() => {
        return {
            color: isFocused ? 'black' : 'white',
            opacity: isFocused ? withTiming(1) : withTiming(0),
        }
    })

    return (
        <Animated.View 
            style={[styles.tabItemContainer, animatedContainerStyle]}
        >
            <Pressable
                onPress={onPress}
                style={styles.tabItemButton}
            >
                {options.tabBarIcon && options.tabBarIcon({
                    focused: isFocused,
                    color: isFocused ? 'black' : 'white',
                    size: 20
                })}

                {isFocused && (
                    <Animated.Text style={[styles.label, animatedTextStyle]} numberOfLines={1}>
                        {label}
                    </Animated.Text>
                )}
            </Pressable>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
    },
    tabBarContainer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%'
    },
    floatingPill: {
        flexDirection: 'row',
        backgroundColor: '#1e293b',
        borderRadius: 1000,
        height: 60,
        padding: 6,
        overflow: 'hidden'
    },
    cursor: {
        position: 'absolute',
        top: 6,
        bottom: 6,
        left: 0,
        backgroundColor: 'white',
        borderRadius: 1000,
        zIndex: 0
    },
    tabItemContainer: {
        borderRadius: 1000,
        justifyContent: 'center',
        overflow: 'hidden',
        zIndex: 1
    },
    tabItemButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: 'black'
    },
})
