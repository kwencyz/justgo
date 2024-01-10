import { useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { getFirestore } from 'firebase/firestore';
import { default as React } from 'react';
import { Image, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { FIREBASE_AUTH } from '../FirebaseConfig';

export default function PassengerStatusScreen() {

    const auth = FIREBASE_AUTH;
    const firestore = getFirestore();

    // Get the route object using useRoute()
    const route = useRoute();

    // Retrieve orderId from route.params
    const order = route.params?.orderId;

    return (
        <KeyboardAvoidingView style={styles.container}>
            <StatusBar backgroundColor="black" style='light' />
            <Image style={styles.backgroundImage} source={require('../assets/images/background.png')} />

            {/* logo and back button */}
            <View style={styles.headerContainer}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/images/justgoHeader.png')} // Update the path to your image
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
            </View>

            <View>
                <Text>Order ID: {order?.orderId}</Text>
                <Text>Status: {order?.status}</Text>
                {/* Render other components and details based on order properties */}
            </View>

        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: 'maroon',
        padding: 5,
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 40,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    logo: {
        width: 150,
        height: 50,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        marginBottom: 90,
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
    formContainer: {
        flex: 1,
        marginTop: 20,
        marginHorizontal: 10,
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        fontSize: 24,
        fontWeight: '300',
        marginBottom: 10,
        color: 'white',
    },
    orderItem: {
        padding: 10,
        backgroundColor: 'white',
        marginBottom: 10,
        borderRadius: 10,
    },
    destination: {
        // Styles for destination text
        fontSize: 16,
    },
    price: {
        // Styles for price text
        fontSize: 16,
    },
    orderText: {
        fontSize: 16,
        // /fontWeight: 'bold',
    },
    flatListContainer: {
        width: '95%',
        marginLeft: 10,
        marginBottom: 10,
    },
});