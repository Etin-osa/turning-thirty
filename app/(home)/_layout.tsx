import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import CustomTabBar from '@/components/custom-tab-bar';

export default function HomeLayout() {
    return (
        <Tabs
            tabBar={props => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <FontAwesome size={24} name="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="milestones"
                options={{
                    title: 'Milestones',
                    tabBarIcon: ({ color }) => <MaterialIcons name="flight-land" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
