import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DashboardScreen() {
    const navigation = useNavigation();

    return (
        <KeyboardAvoidingView style={styles.container}>
            <StatusBar style='light'/>
            <Image style={styles.backgroundImage} source={require('../assets/images/background.png')}/>

            {/* logo */}
            <View style={styles.logoContainer}>
                <Image source={require('../assets/images/justgo.png')} style={styles.logoImage}/>
            </View>

            <View style={styles.formContainer}>
                {/* form */}
                <View style={styles.linkContainer}>
                    <TouchableOpacity onPress={() => navigation.push('Signup')}>
                        <Text style={styles.linkText}> Signup </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
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
        alignItems: 'center',
    },
    logoImage: {
        width: 300,
        height: 300,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
});
