import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { KeyboardProvider } from "react-native-keyboard-controller";
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppProvider } from '../context/AppContext';

export default function RootLayout() {

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AppProvider>
                <KeyboardProvider>
                    <Stack>
                        <Stack.Screen name="index" options={{ headerShown: false }} />
                    </Stack>
                    <StatusBar style="light" />
                </KeyboardProvider>
            </AppProvider>
        </GestureHandlerRootView>
    );
}
