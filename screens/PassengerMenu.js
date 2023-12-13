import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Callout, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { ToastProvider, useToast } from 'react-native-toast-notifications';
import { FIREBASE_AUTH, FIRESTORE } from '../FirebaseConfig';

export default function PassengerMenu() {
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const [origin, setOrigin] = useState();
    const [destination, setDestination] = useState();

    const [distance, setDistance] = useState(null);
    const [price, setPrice] = useState(null);
    const mapRef = useRef(null);

    const toast = useToast();

    const [pin, setPin] = React.useState({
        latitude: 2.9290,
        longitude: 101.7801
    })
    const [region, setRegion] = React.useState({
        latitude: 2.9290,
        longitude: 101.7801,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
    })

    const [userData, setUserData] = useState(null);
    const auth = FIREBASE_AUTH;
    const firestore = FIRESTORE;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Assuming you have stored the user ID in auth.currentUser.uid
                const userId = auth.currentUser.uid;

                // Fetch user data from Firestore
                const userDocRef = doc(collection(firestore, 'passengerdb'), userId);
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                    // Set user data in state
                    setUserData(userDocSnapshot.data());
                } else {
                    console.warn('User document does not exist.');
                }
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };

        fetchUserData();
    }, [auth.currentUser.uid, firestore]);

    const YOUR_GOOGLE_MAPS_API_KEY = 'AIzaSyCeZnCGy1kggLJnYpVBjrms39JD9SBjlQ0';

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
        })();
    }, []);

    const handleSelectPickupLocation = async (details) => {
        // Handle the selected pickup location
        console.log('Selected Pickup Location:', details);

        // Set pickup location coordinates
        const pickupCoordinates = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
        };
        setOrigin({
            name: details.name,
            address: details.formatted_address,
            coordinates: pickupCoordinates,
        });

        // Move to the selected pickup location
        setRegion({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        });
    };

    const handleSelectLocation = async (details) => {
        // Handle the selected location
        console.log('Selected Location:', details);

        // Set destination coordinates
        const destinationCoordinates = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
        };
        //setDestination(destinationCoordinates);
        setDestination({
            name: details.name,
            address: details.formatted_address,
            coordinates: destinationCoordinates,
        });
        // Move to the selected location
        setRegion({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        });
    };

    useEffect(() => {
        const calculateDistance = async () => {
            // Only calculate if both origin and destination are available
            if (origin && destination) {
                try {
                    const response = await axios.get(
                        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.coordinates.latitude},${origin.coordinates.longitude}&destinations=${destination.coordinates.latitude},${destination.coordinates.longitude}&key=${YOUR_GOOGLE_MAPS_API_KEY}`
                    );
                    const distance = response.data.rows[0].elements[0].distance.text;
                    setDistance(distance);

                    const formattedPrice = Math.round(parseFloat(distance.split(' ')[0]) * 1.5);
                    const price = formattedPrice.toFixed(2);
                    setPrice(price);

                    console.log(`Distance: ${distance}, Price: ${price}`);
                } catch (error) {
                    console.error('Error calculating distance:', error.message);
                }
            }
        };

        calculateDistance();
    }, [origin, destination]);

    const handleOrderNow = async () => {
        try {

            // Customize your order data
            const orderData = {
                origin: origin,
                destination: destination,
                userId: auth.currentUser.uid,
                distance: distance,
                price: price,
                timestamp: serverTimestamp(), // Firestore server timestamp
            };

            // Add data to a new "orders" collection
            const orderDocRef = await addDoc(collection(firestore, 'orderdetailsdb'), {
                ...orderData,
            });

            await setDoc(orderDocRef, {
                ...orderData,
                orderId: orderDocRef.id, // Set order ID with the auto-generated ID
            });

            console.log('Order placed successfully:', orderDocRef.id);

            // Show a notification or navigate to a confirmation screen
            console.log('Order Now pressed');
            const showToast = () => {
                ToastAndroid.show('We will notify you once a driver accepts your order', ToastAndroid.SHORT);
            };
            showToast();
        } catch (error) {
            console.error('Error placing order:', error.message);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <ToastProvider>
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
                    {/* search bar for pickup location */}
                    <GooglePlacesAutocomplete
                        placeholder="Search Pickup Location"
                        fetchDetails={true}
                        onPress={(data, details = null) => {
                            console.log(data, details);
                            handleSelectPickupLocation(details);
                        }}
                        query={{
                            key: "AIzaSyCeZnCGy1kggLJnYpVBjrms39JD9SBjlQ0",
                            language: 'en',
                            components: 'country:my',
                            types: 'establishment',
                            radius: 1000,
                            location: `${region.latitude}, ${region.longitude}`,
                        }}
                        styles={{
                            container: { width: '44%', flex: 0, position: 'absolute', zIndex: 1, top: -10, left: 20 },
                            listView: { backgroundColor: 'white', width: '200%' },
                        }}
                    />
                    {/* search bar */}
                    <GooglePlacesAutocomplete
                        placeholder="Search Destination"
                        fetchDetails={true}
                        GooglePlacesSearchQuery={{
                            rankby: "distance"
                        }}
                        onPress={(data, details = null) => {
                            // 'details' is provided when fetchDetails = true
                            console.log(data, details)
                            handleSelectLocation(details)
                        }}
                        query={{
                            key: "AIzaSyCeZnCGy1kggLJnYpVBjrms39JD9SBjlQ0",
                            language: "en",
                            components: "country:my",
                            types: "establishment",
                            radius: 1000,
                            location: '${region.latitude}, ${region.longitude}'
                        }}
                        styles={{
                            container: { width: '44%', flex: 0, position: "absolute", zIndex: 1, top: -10, right: 20 },
                            listView: { backgroundColor: "white", width: '200%', right: 180 }
                        }}
                    />

                    {/* <View style={{ marginTop: 50, marginBottom: 10, }}>
                        <Text style={styles.text}>Username: {userData?.username}</Text>
                    </View> */}

                    <View style={styles.mapContainer}>
                        <MapView
                            style={styles.map}
                            region={region}
                            provider="google"
                            showsUserLocation={true}
                        >
                            {destination && (
                                <Marker coordinate={destination.coordinates} pinColor="red">
                                    <Callout>
                                        <Text>Your Destination</Text>
                                    </Callout>
                                </Marker>
                            )}

                            {origin && destination && (
                                <MapViewDirections
                                    origin={origin.coordinates}
                                    destination={destination.coordinates}
                                    apikey={'AIzaSyCeZnCGy1kggLJnYpVBjrms39JD9SBjlQ0'}
                                    strokeWidth={3}
                                    strokeColor="red"
                                />
                            )}
                        </MapView>
                        <View style={{ marginTop: 5 }}>
                            <Text style={styles.text}>Total Distance: {distance}</Text>
                            <TouchableOpacity
                                style={styles.orderNowButton}
                                onPress={handleOrderNow}
                            >
                                <Text style={styles.orderNowButtonText}>Order Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ToastProvider>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: 'maroon', // Set the background color of the header
        padding: 10,
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
        marginRight: 20,
    },
    logoImage: {
        width: 300,
        height: 300,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'top',
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
        paddingTop: 50,
        zIndex: 0,
    },
    text: {
        color: 'white',
        fontSize: 18,
    },
    orderNowButton: {
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 20,
        marginTop: 5,
    },
    orderNowButtonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
});