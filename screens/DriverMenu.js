import React, { useEffect, useState } from 'react';
import { Button, FlatList, Image, KeyboardAvoidingView, StatusBar, StyleSheet, Text, View } from 'react-native';
//import { FIREBASE_AUTH, FIRESTORE } from '../FirebaseConfig';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

export default function DriverMenu() {

    const [orders, setOrders] = useState([]);
    const firestore = getFirestore();

    useEffect(() => {
        // Fetch orders from Firestore
        const fetchOrders = async () => {
            try {
                const ordersRef = collection(firestore, 'orderdetailsdb'); // Use collection() function
                const orderSnapshots = await getDocs(ordersRef); // Use getDocs() function
                const orderDetailsData = orderSnapshots.docs.map((doc) => doc.data());
                setOrders(orderDetailsData);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(refreshOrders, 5000); // Refresh orders every 5 seconds
        return () => clearInterval(intervalId); // Clean up timer on unmount
    }, []);

    const refreshOrders = async () => {
        try {
            const ordersRef = collection(firestore, 'orderdetailsdb');
            const orderSnapshots = await getDocs(ordersRef);
            const orderDetailsData = orderSnapshots.docs.map((doc) => doc.data());
            setOrders(orderDetailsData);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
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
                <View style={styles.refreshButtonContainer}>
                    <Button title="Refresh Orders" onPress={refreshOrders} />
                </View>
                {/* Display orders in a FlatList */}
                <FlatList
                    data={orders}
                    keyExtractor={(item, index) => `order-${index}`}
                    renderItem={({ item }) => (
                        <View>
                            <Text>Order ID: {item.orderId}</Text>
                            <Text>Pickup Address: {item.origin.name}</Text>
                            <Text>Delivery Address: {item.destination.name}</Text>
                            <Text>Total Price: {item.totalPrice}</Text>
                            <Text>Distance: {item.distance}</Text>
                        </View>
                    )}
                />
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
