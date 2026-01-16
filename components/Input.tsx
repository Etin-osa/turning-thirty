import { Feather } from '@expo/vector-icons'
import React, { useEffect, useRef, useState } from 'react'
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardStickyView } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useApp } from '../context/AppContext'

const Input = () => {
    const insets = useSafeAreaInsets()
    const inputRef = useRef<TextInput>(null)
    const [showHistoryMenu, setShowHistoryMenu] = useState(false)
    const [selectedHistoryItem, setSelectedHistoryItem] = useState<string | null>(null)
    const [inputValue, setInputValue] = useState('')
    const { addNote, addChatMessage, activeTab } = useApp()

    useEffect(() => {
        const subscription = Keyboard.addListener('keyboardDidHide', () => {
            inputRef.current?.blur();
        });

        return () => subscription.remove()
    }, [])

    return (
        <KeyboardStickyView enabled offset={{ closed: 0, opened: insets.bottom }} style={styles.inputWrapper}>
            {showHistoryMenu && (
                <View style={styles.historyMenu}>
                    <Text style={styles.historyHeader}>Remember Conversation</Text>
                    {["Yesterday", "last week", "last month"].map((item, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={[styles.historyItem, selectedHistoryItem === item && styles.historyItemSelected]}
                            onPress={() => {
                                if (selectedHistoryItem !== item) {
                                    inputRef.current?.focus()
                                }
                                setSelectedHistoryItem(prev => prev === item ? null : item)
                                setShowHistoryMenu(false)

                            }}
                        >
                            <Text style={styles.historyItemText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
            <View style={[styles.inputPill, { marginBottom: insets.bottom + 10 }]}>
                <TouchableOpacity 
                    style={[
                        styles.iconButton,
                        {
                            backgroundColor: selectedHistoryItem ? "rgba(0, 97, 253, 0.63)" : "#2D2D2D"
                        }
                    ]} 
                    onPress={() => setShowHistoryMenu(!showHistoryMenu)}
                >
                    <Feather name="clock" size={20} color={selectedHistoryItem ? "#ffffff" : "#737373"} />
                </TouchableOpacity>
                <TextInput
                    style={styles.textInput}
                    placeholder="Let's talk about your day..."
                    placeholderTextColor="#535353"
                    ref={inputRef}
                    value={inputValue}
                    onChangeText={(text) => setInputValue(text)}
                />
                <TouchableOpacity 
                    style={styles.sendButton}
                    onPress={() => {
                        if (inputValue.length > 0) {
                            if (activeTab === 'notes') {
                                addNote(inputValue);
                            } else {
                                addChatMessage(inputValue);
                            }
                            setInputValue('');
                            inputRef.current?.clear();
                        }
                    }}
                >
                    <Feather name="arrow-up" size={20} color={inputValue.length > 0 ? "#ffffffff" : "#737373"} />
                </TouchableOpacity>
            </View>
        </KeyboardStickyView>
    )
}

export default Input

const styles = StyleSheet.create({
    inputWrapper: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        zIndex: 110,
        backgroundColor: '#080808'
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
        color: '#ffffffd3',
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#2D2D2D',
        justifyContent: 'center',
        alignItems: 'center',
    },
    historyMenu: {
        position: 'absolute',
        bottom: 85,
        left: 20,
        backgroundColor: '#080808',
        borderRadius: 24,
        padding: 16,
        minWidth: 220,
        gap: 6,
        borderWidth: 1,
        borderColor: '#2D2D2D',
    },
    historyHeader: {
        color: '#737373',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        paddingHorizontal: 8,
    },
    historyItem: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    historyItemSelected: {
        backgroundColor: '#161616ff',
    },
    historyItemText: {
        color: '#ffffffd3',
        fontSize: 14,
        fontWeight: '500',
    }
})