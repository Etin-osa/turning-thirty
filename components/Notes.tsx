import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Note {
    id: string;
    timestamp: string;
    text: string;
}

const DUMMY_NOTES: Note[] = [
    { id: '1', timestamp: '12:39 PM', text: 'Meeting with the event coordinator went well. We need to finalize the menu by Tuesday.' },
    { id: '2', timestamp: '2:15 PM', text: 'Checked out the venue again to measure the stage area for the band. It looks spacious enough.' },
    { id: '3', timestamp: '4:45 PM', text: 'Reminder: Send the guest list to the security team by end of day.' },
    { id: '4', timestamp: '10:00 AM', text: 'Budget review call joined. We are slightly under budget for decorations.' },
    { id: '5', timestamp: '11:20 AM', text: 'Called the bakery. Cake tasting is scheduled for Saturday morning. Chocolate vs Vanilla?' },
    { id: '6', timestamp: '1:00 PM', text: 'Lunch with Sarah to discuss the surprise gift. She has some great ideas.' },
    { id: '7', timestamp: '3:30 PM', text: 'Vendor payments processed. All deposits are now cleared.' },
    { id: '8', timestamp: '6:00 PM', text: 'Drafted the welcome speech. Need to keep it under 5 minutes.' },
    { id: '9', timestamp: '9:15 AM', text: 'Morning check-in with the team. Everyone is on track for the deadlines.' },
    { id: '10', timestamp: '8:45 PM', text: 'Reviewing the playlist one last time. Adding a few more classics.' },
];

export function Notes() {
    return (
        <View style={styles.container}>
            {DUMMY_NOTES.map((note, index) => (
                <View key={note.id} style={[styles.noteContainer, { borderLeftWidth: index === DUMMY_NOTES.length - 1 ? 0 : 1 }]}>
                    <View style={styles.timestampContainer}>
                        <Text style={styles.timestampText}>{note.timestamp}</Text>
                    </View>
                    <Text style={styles.noteText}>{note.text}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    noteContainer: {
        position: 'relative',
        borderLeftWidth: 1,
        borderColor: '#333',
        paddingLeft: 20,
        paddingVertical: 45,
    },
    timestampContainer: {
        position: 'absolute',
        top: -12,
        left: -30,
        height: 24,
        width: 65,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1C1C1C', 
        borderColor: '#333',
        borderRadius: 12,
        borderWidth: 1,
    },
    timestampText: {
        color: '#999',
        fontSize: 11,
        fontWeight: '600',
    },
    noteText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#ffffffd3',
        marginTop: -4, 
    },
});2