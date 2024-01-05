import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { collection, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE } from '../FirebaseConfig';

export default function DriverWallet() {

    const navigation = useNavigation();
    const [balance, setBalance] = useState(0);
    const [userData, setUserData] = useState(null);
    const auth = FIREBASE_AUTH;
    const firestore = FIRESTORE;

    useEffect(() => {
        // Function to fetch balance from Firestore
        const fetchBalance = async () => {
            try {
                const userId = auth.currentUser.uid;
                const userDocRef = doc(collection(firestore, 'driverdb'), userId);
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    setBalance(userData.wallet); // Assuming 'wallet' is the field in Firestore
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching balance: ', error);
            }
        };

        const refreshBalance = () => {
            fetchBalance(); // Fetch balance initially

            const intervalId = setInterval(fetchBalance, 2000);

            return () => clearInterval(intervalId); // Clean up interval on unmount
        };

        refreshBalance(); // Call the refresh function when component mounts

        return () => { }; // No cleanup required for this effect
    }, []);
    const handleTopUpPress = () => {
        navigation.navigate('WithdrawWallet');
    };

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
                <View >
                    <Text style={styles.title}>JustGo Wallet</Text>
                </View>

                <View style={styles.walletContainer}>
                    <View style={styles.walletLogoContainer}>
                        <Image
                            source={require('../assets/images/wallet.png')} // Update the path to your image
                            style={styles.Walletlogo}
                            resizeMode="contain"
                        />
                    </View>

                    <View style={styles.balanceContainer}>
                        <Text style={styles.balanceText}>Current Balance:</Text>
                        <Text style={styles.balanceAmount}>RM {balance}</Text>
                    </View>

                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.TopUpButton}
                        onPress={handleTopUpPress}
                    >
                        <Text style={styles.TopUpButtonText}>Withdraw Wallet</Text>
                    </TouchableOpacity>
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
        borderBottomLeftRadius: 0, // Bottom left corner radius
        borderBottomRightRadius: 0, // Bottom right corner radius
    },
    logo: {
        width: 150, // Set the width of your logo
        height: 50, // Set the height of your logo
    },
    Walletlogo: {
        width: 100, // Set the width of your logo
        height: 100, // Set the height of your logo
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
    walletLogoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'left',
        marginLeft: 0,
    },
    logoImage: {
        width: 300,
        height: 300,
    },
    formContainer: {
        flex: 1 / 4,
        //justifyContent: 'top',
        alignItems: 'left',
        marginTop: 0,
        backgroundColor: 'maroon',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    walletContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
    },
    balanceContainer: {
        marginRight: 100,
    },
    balanceText: {
        marginBottom: 15,
        marginTop: -5,
        color: 'white',
        fontSize: 18,
    },
    balanceAmount: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold'
    },
    title: {
        color: 'white',
        fontSize: 24,
        marginLeft: 30,
        marginVertical: 10,
        fontWeight: 'bold',
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 420, // Adjust this value as needed for spacing
    },
    TopUpButton: {
        backgroundColor: 'maroon',
        padding: 5,
        borderRadius: 20,
        marginTop: 150,
        width: '80%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    TopUpButtonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
});