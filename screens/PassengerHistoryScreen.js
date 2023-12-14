import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { default as React, useEffect, useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import CustomRatingBar from './CustomRatingBar'; //saje nak try rating jadi dalam bentuk star

export default function PassengerHistoryScreen() {

  const [jobHistory, setJobHistory] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // This is just dummy data for job history of the driver
    //structure data ade id,date,time,start & end destination.price,status and rating
    //This is where to implement the function to fetch the driver's job history from Firebase Firestore
    const dummyJobHistory = [
      {
        id: '1',
        date: '2023-12-10',
        time: '10:30 AM',
        startDestination: 'KTM, UKM',
        endDestination: 'Kolej Pendeta Zaaba, UKM',
        price: 'RM 10',
        status: 'Completed',
        rating: 4,
      },
      {
        id: '2',
        date: '2023-12-08',
        time: '09:00 AM',
        startDestination: 'Pusanika, UKM',
        endDestination: 'Kolej Keris Mas, UKM',
        price: 'RM 6',
        status: 'Completed',
        rating: 3,
      },
      // add more job history if needed
    ];

    //can fetch job history data from an API
    setJobHistory(dummyJobHistory);
  }, []);

  const handleRatingSelection = (itemId, selectedRating) => {
    // to manage the rating selected in the data.
    //console.log(Job ID: ${ itemId }, Selected Rating: ${ selectedRating });
  };

  //kat bawah ni ade line untuk include custom rating bar star dalam list data utk display
  const renderJobItem = ({ item }) => (
    <View style={styles.jobItem}>
      <View style={styles.jobHeader}>
        <View>
          <Text style={styles.date}>{item.date} at {item.time}</Text>
        </View>
        <View>
          <Text style={styles.status}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.destination}>{item.startDestination}</Text>
      <Text style={styles.destination}>{item.endDestination}</Text>
      <Text style={styles.price}>{item.price}</Text>
      <CustomRatingBar rating={item.rating} onRatingPress={(selectedRating) => handleRatingSelection(item.id, selectedRating)} />
    </View>
  );

  const navigateToSearchBar = () => {
    navigation.navigate('SearchBar'); // This line is to navigate this page to suitable page (main menu.js rasanya) such as in this, SearchBar page when user push the back button
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
        <View>
          <FlatList
            data={jobHistory}
            renderItem={renderJobItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
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
