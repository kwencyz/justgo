import { endOfWeek, format, startOfWeek } from 'date-fns';
import { StatusBar } from 'expo-status-bar';
import { collection, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { FIREBASE_AUTH, FIRESTORE } from '../FirebaseConfig';

export default function DriverAnalyticsScreen() {

    const auth = FIREBASE_AUTH;
    const firestore = FIRESTORE;

    const [earningsData, setEarningsData] = useState([]);

    useEffect(() => {
        // Function to fetch Earnings from Firestore
        const fetchEarnings = async () => {
            try {
                const userId = auth.currentUser.uid;
                const userDocRef = doc(collection(firestore, 'driverwallet'), userId);
                const userDocSnapshot = await getDoc(userDocRef);
                console.log(userId);

                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();

                    // Assuming 'timestamp' is the field in your data
                    const formattedData = Object.values(userData)
                        .map(entry => ({ timestamp: entry.timestamp, earningAmount: entry.earningAmount }))
                        .sort((a, b) => a.timestamp - b.timestamp)
                        .reduce((weeklyData, entry) => {
                            const weekStart = startOfWeek(entry.timestamp.toDate());
                            const weekEnd = endOfWeek(entry.timestamp.toDate());
                            const weekKey = format(weekStart, 'yyyy-MM-dd');

                            // Initialize or update the weekly earnings for the given week
                            if (!weeklyData[weekKey]) {
                                weeklyData[weekKey] = { date: weekKey, earningAmount: 0 };
                            }

                            weeklyData[weekKey].earningAmount += entry.earningAmount;

                            return weeklyData;
                        }, {});

                    // Convert the object back to an array
                    const finalData = Object.values(formattedData);

                    setEarningsData(finalData);
                    
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching Earnings: ', error);
            }
        };

        fetchEarnings(); // Fetch Earnings when component mounts
    }, []);

    return (
        <KeyboardAvoidingView style={styles.container}>
            <StatusBar backgroundColor="black" style='light' />
            <Image style={styles.backgroundImage} source={require('../assets/images/background.png')} />

            {/* logo */}
            <View style={styles.headerContainer}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/images/justgoHeader.png')} // Update the path to your image
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
            </View>

            <View style={styles.formContainer}>
                {/* container */}
                <View>
                    <Text>Weekly Earnings Graph</Text>
                    <LineChart
                        data={{
                            labels: earningsData.map((entry) => entry.date),
                            datasets: [
                                {
                                    data: earningsData.map((entry) => entry.earningAmount),
                                },
                            ],
                        }}
                        width={400}
                        height={220}
                        yAxisLabel="$"
                        yAxisSuffix="k"
                        chartConfig={{
                            backgroundColor: '#e26a00',
                            backgroundGradientFrom: '#fb8c00',
                            backgroundGradientTo: '#ffa726',
                            decimalPlaces: 2, // Adjust as needed based on your data
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: '6',
                                strokeWidth: '2',
                                stroke: '#ffa726',
                            },
                        }}
                        bezier
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: 'maroon', // Set the background color of the header
        padding: 5,
        justifyContent: 'space-between',
        flexDirection: 'row', // Arrange children in a row
        marginTop: 40,
        borderBottomLeftRadius: 20, // Bottom left corner radius
        borderBottomRightRadius: 20, // Bottom right corner radius
    },
    logo: {
        width: 150, // Set the width of your logo
        height: 50, // Set the height of your logo
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginRight: 10,
    },
    logoImage: {
        width: 300,
        height: 300,
    },
    formContainer: {
        flex: 1,
        //justifyContent: 'top',
        alignItems: 'center',
        marginTop: 20,
    },
    inputContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        marginBottom: 20,
        padding: 10,
        elevation: 3,
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    input: {
        color: 'maroon',
    },
    buttonContainer: {
        width: '80%',
        marginBottom: 20,
    },
    button: {
        width: '100%',
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 20,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    linkText: {
        color: 'white',
        textDecorationLine: 'underline',
        marginLeft: 5,
    },
    searchContainer: {
        width: '80%',
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
        borderTopWidth: 0,
        marginBottom: 20,
    },
    searchInputContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        borderBottomWidth: 0, // Remove the default border
    },
    searchInput: {
        color: 'maroon',
    },
    searchResultsContainer: {
        marginTop: 10,
        width: '80%',
    },
    searchResultItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
    searchResultText: {
        color: 'white',
        fontSize: 16,
    },
    map: {
        width: 350,
        height: 500,
    },
    mapContainer: {
        flex: 1,
        paddingTop: 70,
    },
    errorContainer: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    errorText: {
        color: 'white',
        textAlign: 'center',
    },
});