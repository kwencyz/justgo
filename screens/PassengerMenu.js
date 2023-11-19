import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Callout, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

export default function PassengerMenu() {
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const [origin, setOrigin] = useState();
    const [destination, setDestination] = useState();

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

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setRegion((prevRegion) => ({
                ...prevRegion,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            }));
        })();
    }, []);

    const handleSelectLocation = (details) => {
        // Handle the selected location
        console.log('Selected Location:', details);

        // Set destination coordinates
        const destinationCoordinates = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
        };
        setDestination(destinationCoordinates);

        // Set origin coordinates to the current location
        const currentLocation = region;
        setOrigin(currentLocation);

        // Move to the selected location
        setRegion({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        });
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
                {/* search bar */}
                <GooglePlacesAutocomplete
                    placeholder="Search"
                    fetchDetails={true}
                    GooglePlacesSearchQuery={{
                        rankby: "distance"
                    }}
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        console.log(data, details)
                        handleSelectLocation(details)
                        /*setRegion({
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005
                        })*/
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
                        container: { width: '80%', flex: 0, position: "absolute", zIndex: 1 },
                        listView: { backgroundColor: "white", zIndex: 1 }
                    }}
                />

                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        region={region}
                        provider="google"
                        showsUserLocation={true}
                    >
                        <Marker coordinate={region} pinColor="red">
                            <Callout>
                                <Text>Destination</Text>
                            </Callout>
                        </Marker>

                        {origin && destination && (
                            <MapViewDirections
                                origin={origin}
                                destination={destination}
                                apikey={'AIzaSyCeZnCGy1kggLJnYpVBjrms39JD9SBjlQ0'}
                                strokeWidth={3}
                                strokeColor="red"
                            />
                        )}
                    </MapView>
                </View>
            </View>
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
        paddingTop: 70,
    },
});