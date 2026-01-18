import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { KeyboardProvider } from "react-native-keyboard-controller";
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(home)',
};

import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
                <Stack>
                    <Stack.Screen name="(home)" options={{ headerShown: false }} />
                </Stack>
                <StatusBar style="dark" />
            </KeyboardProvider>
        </GestureHandlerRootView>
    )
}
