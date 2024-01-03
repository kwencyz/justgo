import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { default as React, useEffect, useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { FIREBASE_AUTH } from '../FirebaseConfig';

export default function PassengerHistoryScreen() {

  const [orderHistory, setOrderHistory] = useState([]);
  const navigation = useNavigation();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);

  const auth = FIREBASE_AUTH;
  const firestore = getFirestore();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        // Assuming you have stored the user ID in auth.currentUser.uid
        const userId = auth.currentUser.uid;

        // Fetch order history data from Firestore
        const orderHistoryRef = collection(firestore, 'orderdetailsdb');
        const orderHistorySnapshots = await getDocs(orderHistoryRef);
        const orderHistoryData = orderHistorySnapshots.docs.map((doc) => doc.data());

        // Filter orders based on passengerId
        const filteredPending = orderHistoryData.filter((order) => order.status === 'pending' && order.passengerId === userId);
        const filteredCompleted = orderHistoryData.filter((order) => order.status === 'completed' && order.passengerId === userId);

        // Set the order history and orders in state
        setOrderHistory(orderHistoryData);
        setPendingOrders(filteredPending);
        setCompletedOrders(filteredCompleted);
      } catch (error) {
        console.error('Error fetching order history:', error);
      }
    };

    fetchOrderHistory();
  }, [auth.currentUser.uid, firestore]);

  const renderOrderItem = ({ item }) => {
    // Assuming 'timestamp' is the field containing the Firestore Timestamp
    const orderTimestamp = item.timestamp.toDate();

    return (
      <View style={styles.orderItem}>
        <Text style={styles.orderText}>Pickup Address: {item.origin.name}</Text>
        <Text style={styles.orderText}>Delivery Address: {item.destination.name}</Text>
        <Text style={styles.orderText}>Total Price: RM{item.price}</Text>

        <Text style={styles.orderText}>Date: {orderTimestamp.toLocaleDateString()}</Text>
        <Text style={styles.orderText}>Time: {orderTimestamp.toLocaleTimeString()}</Text>

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
            keyExtractor={(item) => `pending-${item.id}`}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Completed Orders</Text>
          <FlatList
            data={completedOrders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => `completed-${item.id}`}
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
    // /fontWeight: 'bold',
  },
  flatListContainer: {
    flex: 1,
    marginTop: 10,
    width: '90%',
  },
});