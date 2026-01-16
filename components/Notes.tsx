import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

export default function Notes() {
    const { notes } = useApp();
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            {notes.map((note, index) => (
                <View key={note.id} style={[styles.noteContainer, { borderLeftWidth: index === notes.length - 1 ? 0 : 1 }]}>
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