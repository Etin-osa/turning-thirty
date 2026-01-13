import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function padWithZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
}
const faintGray = '#cacaca';

export default function HomeScreen() {

    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const targetDate = new Date('2030-02-15T00:00:00').getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference <= 0) {
                clearInterval(interval);
            } else {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View>
                <View>
                    <Text style={styles.header}>{timeLeft.days.toString().slice(0, 2)}</Text>
                    <Text style={styles.header}>{timeLeft.days.toString().slice(2)}</Text>
                </View>
                <Text style={styles.subTitle}>DAYS</Text>
            </View>
            <View style={[styles.flowCenter, styles.timer]}>
                <View style={styles.timerView}>
                    <Text style={[styles.timerValue]}>{padWithZero(timeLeft.hours)}</Text>
                    <Text style={styles.whiteText}>h</Text>
                </View>
                <View><Text style={{ color: faintGray}}>:</Text></View>
                <View style={styles.timerView}>
                    <Text style={[styles.timerValue]}>{padWithZero(timeLeft.minutes)}</Text>
                    <Text style={styles.whiteText}>m</Text>
                </View>
                <View><Text style={{ color: faintGray}}>:</Text></View>
                <View style={styles.timerView}>
                    <Text style={[styles.timerValue]}>{padWithZero(timeLeft.seconds)}</Text>
                    <Text style={styles.whiteText}>s</Text>
                </View>
            </View>
            <View style={{ marginTop: 10, alignItems: 'center' }}>
                <Text  style={{ fontSize: 20, }}>Until your 30th</Text>
            </View>
        </SafeAreaView>  
    );
}

const styles = StyleSheet.create({
    flowCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 250,
        fontWeight: 'bold',
        letterSpacing: -13,
        transform: [{ translateX: -10 }],
        lineHeight: 200
    },
    subTitle: { 
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
        letterSpacing: 23,
    },
    timer: {
        marginTop: 100,
        width: '95%',
        alignItems: 'center',
        fontSize: 40,
        fontWeight: '600',
        marginHorizontal: 'auto',
        backgroundColor: '#131313',
        borderRadius: 10,
        paddingVertical: 25,
    },
    timerValue: {
        fontSize: 70,
        fontWeight: '700',
        lineHeight: 65,
        color: 'white',
    },
    whiteText: {
        color: faintGray,
        fontSize: 20,
        transform: [{ translateY: -2 }],
    },
    timerView: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginHorizontal: 10,
        gap: 5
    }
});
