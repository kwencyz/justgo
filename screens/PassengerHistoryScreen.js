import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { default as React, useEffect, useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';

export default function PassengerHistoryScreen() {

  const [jobHistory, setJobHistory] = useState([]);
  const navigation = useNavigation();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);

  useEffect(() => {

    const filteredPending = jobHistory.filter((order) => order.status === 'Pending');
    const filteredCompleted = jobHistory.filter((order) => order.status === 'Completed');
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
      {
        id: '3',
        date: '2023-12-15',
        time: '09:40 AM',
        startDestination: 'Perpustakaan Tun Seri Lanang, UKM',
        endDestination: 'Stesen Komuter UKM, Bangi',
        price: 'RM 6',
        status: 'Pending',
        rating: 0,
      },
      // add more job history if needed
    ];

    //can fetch job history data from an API
    setJobHistory(dummyJobHistory);
    setPendingOrders(filteredPending);
    setCompletedOrders(filteredCompleted);
  }, []);

  const handleRatingSelection = (itemId, selectedRating) => {
    // to manage the rating selected in the data.
    console.log('Job ID: ${ itemId }', 'Selected Rating: ${ selectedRating }');
  };

  const renderOrderItem = ({ item }) => {
    return (
      <View style={styles.orderItem}>
        <Text style={styles.orderText}>{item.date} at {item.time}</Text>
        {/* Render other order details here */}
        <Text style={styles.destination}>{item.startDestination}</Text>
        <Text style={styles.destination}>{item.endDestination}</Text>
        <Text style={styles.price}>{item.price}</Text>
        {/*         <CustomRatingBar
          rating={item.rating}
          onRatingPress={(selectedRating) => handleRatingSelection(item.id, selectedRating)}
        /> */}
      </View>
    );
  };

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

      <View style={styles.formContainer}>
        {/* container */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Pending Orders</Text>
          <FlatList
            data={pendingOrders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Completed Orders</Text>
          <FlatList
            data={completedOrders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
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
    fontWeight: 'bold',
  },
});