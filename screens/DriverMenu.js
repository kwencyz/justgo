import { collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, Modal, StatusBar, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { FIREBASE_AUTH } from '../FirebaseConfig';

export default function DriverMenu() {

    const [orders, setOrders] = useState([]);
    const firestore = getFirestore();

    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('pending'); //Default to pending

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [userData, setUserData] = useState(null);
    const auth = FIREBASE_AUTH;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Assuming you have stored the user ID in auth.currentUser.uid
                const userId = auth.currentUser.uid;

                // Fetch user data from Firestore
                const userDocRef = doc(collection(firestore, 'driverdb'), userId);
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

    const toggleModal = (order) => {
        setSelectedOrder(order);
        setModalVisible(!modalVisible);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.FlatViewButton} onPress={() => toggleModal(item)}>
            <View style={styles.orderItem}>
                <Text style={styles.orderText}>Pickup Address: {item.origin.name}</Text>
                <Text style={styles.orderText}>Delivery Address: {item.destination.name}</Text>
                <Text style={styles.orderText}>Total Price: RM{item.price}</Text>

                {item.status === 'pending' && (
                    <TouchableOpacity style={styles.acceptButton} onPress={() => acceptOrder(item)}>
                        <Text style={styles.acceptButtonText}>Accept Order</Text>
                    </TouchableOpacity>
                )}

                {item.status === 'accepted' && (
                    <TouchableOpacity style={styles.pickupButton} onPress={() => pickupPassenger(item)}>
                        <Text style={styles.pickupButtonText}>Pickup</Text>
                    </TouchableOpacity>
                )}

                {item.status === 'in-progress' && (
                    <TouchableOpacity style={styles.dropOffButton} onPress={() => dropOffPassenger(item)}>
                        <Text style={styles.dropOffButtonText}>Drop-off Passenger</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );

    useEffect(() => {
        // Fetch orders from Firestore
        const fetchOrders = async () => {
            try {
                const ordersRef = collection(firestore, 'orderdetailsdb'); // Use collection() function
                const orderSnapshots = await getDocs(ordersRef);
                const orderDetailsData = orderSnapshots.docs.map((doc) => doc.data());

                /*                 //Filter orders based on status
                                const filteredOrders = orderDetailsData.filter(order => order.status === selectedStatus); */

                // Filter orders based on status and current user's ID
                const filteredOrders = orderDetailsData.filter(order => {
                    if ((selectedStatus === 'pending' && order.status === 'pending') ||
                        (order.status === selectedStatus && order.driverId === auth.currentUser.uid)
                    ) {
                        return true;
                    }
                    return false;
                });

                setOrders(orderDetailsData);
                setFilteredOrders(filteredOrders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, [auth.currentUser.uid, firestore, selectedStatus]);

    useEffect(() => {
        const intervalId = setInterval(refreshOrders, 5000); // Refresh orders every 5 seconds
        return () => clearInterval(intervalId); // Clean up timer on unmount
    }, []);

    const refreshOrders = async () => {
        try {
            const ordersRef = collection(firestore, 'orderdetailsdb');
            const orderSnapshots = await getDocs(ordersRef)
            const orderDetailsData = orderSnapshots.docs.map((doc) => doc.data());
            setOrders(orderDetailsData);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const acceptOrder = async (selectedOrder) => {
        try {
            const orderRef = doc(firestore, 'orderdetailsdb', selectedOrder.orderId);

            // Update order data
            const orderData = {
                driverId: auth.currentUser.uid,
                status: 'accepted',
            };

            // Update the order document in the 'orderdetailsdb' collection
            await updateDoc(orderRef, orderData);

            // Show a notification or navigate to a confirmation screen
            console.log('Order accepted successfully:', selectedOrder.orderId);

            // Refresh the orders if needed
            refreshOrders();

            // Show a toast notification
            console.log('Accept Order pressed');
            const showToast = () => {
                ToastAndroid.show('You have successfully accepted the order', ToastAndroid.SHORT);
            };
            showToast();
        } catch (error) {
            console.error('Error accepting order:', error.message);
        }
    };

    const pickupPassenger = async (selectedOrder) => {
        try {
            const orderToUpdateRef = doc(firestore, 'orderdetailsdb', selectedOrder.orderId);
            await setDoc(orderToUpdateRef, {
                ...selectedOrder,
                status: 'in-progress',
            });

            // Refresh the orders
            refreshOrders();

            const showToast = () => {
                ToastAndroid.show('You have picked up the passenger', ToastAndroid.SHORT);
            };
            showToast();
        } catch (error) {
            console.error('Error updating order status to in-progress:', error.message);
        }
    };

    const dropOffPassenger = async (selectedOrder) => {
        try {
            const orderToUpdateRef = doc(firestore, 'orderdetailsdb', selectedOrder.orderId);
            await setDoc(orderToUpdateRef, {
                ...selectedOrder,
                status: 'completed',
            });

            // Fetch the driver's current wallet balance
            const driverDocRef = doc(firestore, 'driverdb', selectedOrder.driverId);
            const driverDocSnapshot = await getDoc(driverDocRef);
            const currentWalletBalance = driverDocSnapshot.data().wallet;

            // Subtract the order price from the current wallet balance
            const updatedWalletBalance = currentWalletBalance + selectedOrder.price;

            // Update the wallet field in the driverdb with the new balance
            await updateDoc(driverDocRef, {
                wallet: updatedWalletBalance,
            });

            // Refresh the orders
            refreshOrders();

            const showToast = () => {
                ToastAndroid.show('You have dropped off the passenger. Order completed!', ToastAndroid.SHORT);
            };
            showToast();
        } catch (error) {
            console.error('Error updating order status to completed:', error.message);
        }
    };

    const ModalButton = ({ text, onPress }) => (
        <TouchableOpacity style={styles.ModalButton} onPress={onPress}>
            <Text style={styles.acceptModalButtonText}>{text}</Text>
        </TouchableOpacity>
    );

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
                <TouchableOpacity style={styles.refreshButton} onPress={refreshOrders}>
                    <Text style={styles.refreshButtonText}>Refresh</Text>
                </TouchableOpacity>
                <View style={styles.filterButtonsContainer}>
                    <TouchableOpacity
                        style={[styles.filterButton, selectedStatus === 'pending' && styles.selectedFilterButton]}
                        onPress={() => setSelectedStatus('pending')}
                    >
                        <Text>Pending</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterButton, selectedStatus === 'accepted' && styles.selectedFilterButton]}
                        onPress={() => setSelectedStatus('accepted')}
                    >
                        <Text>Accepted</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterButton, selectedStatus === 'in-progress' && styles.selectedFilterButton]}
                        onPress={() => setSelectedStatus('in-progress')}
                    >
                        <Text>In Progress</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterButton, selectedStatus === 'completed' && styles.selectedFilterButton]}
                        onPress={() => setSelectedStatus('completed')}
                    >
                        <Text>Completed</Text>
                    </TouchableOpacity>
                </View>

                {/* Display orders in a FlatList */}
                <FlatList
                    style={styles.flatListContainer}
                    data={filteredOrders}
                    keyExtractor={(item, index) => `order-${index}`}
                    renderItem={renderItem}
                />

                <Modal
                    animationType="slide"
                    /* if true --> modal appear same page */
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(false);
                    }}
                >
                    <View style={styles.modalContainer}>
                        {selectedOrder && (
                            <View style={styles.modalContent}>
                                <Text style={styles.orderText}>Order ID: {selectedOrder.orderId}</Text>
                                <Text style={styles.orderText}>Pickup Address: {selectedOrder.origin.name}</Text>
                                <Text style={styles.orderText}>Delivery Address: {selectedOrder.destination.name}</Text>
                                <Text style={styles.orderText}>Distance: {selectedOrder.distance}</Text>
                                <Text style={styles.orderText}>Total Price: RM{selectedOrder.price}</Text>

                                {selectedOrder.status === 'pending' && (
                                    <ModalButton text="Accept Order" onPress={() => acceptOrder(selectedOrder, setModalVisible(false))} />
                                )}

                                {selectedOrder.status === 'accepted' && (
                                    <ModalButton text="Pickup" onPress={() => pickupPassenger(selectedOrder)} />
                                )}

                                {selectedOrder.status === 'in-progress' && (
                                    <ModalButton text="Drop-off Passenger" onPress={() => dropOffPassenger(selectedOrder)} />
                                )}

                                <ModalButton text="Close" onPress={() => setModalVisible(false)} />
                            </View>
                        )}

                    </View>
                </Modal>

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
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 100,
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
    orderItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: 'white',
        marginTop: 0,
        borderRadius: 12,
    },
    orderText: {
        fontSize: 16,
        marginBottom: 5,
        marginTop: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 0,
        width: '80%',
    },
    ModalButton: {
        marginTop: 20,
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 20,
    },
    acceptModalButtonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },
    FlatViewButton: {
        marginTop: 0,
        padding: 10,
        borderRadius: 20,
    },
    refreshButton: {
        backgroundColor: 'red',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 10,
        marginLeft: 250,
        marginBottom: 5,
    },
    refreshButtonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
    filterButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    filterButton: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'lightgray',
    },
    selectedFilterButton: {
        backgroundColor: 'gray',
    },
    flatListContainer: {
        flex: 1,
        marginTop: 10,
        width: '90%',
    },
});