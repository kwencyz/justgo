import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
//untuk custom rating bar bentuk star

const CustomRatingBar = ({ rating, onRatingPress }) => {
    const handleRatingPress = (selectedRating) => {
        onRatingPress(selectedRating);
    };

    return (
        <View style={styles.container}>
            {[1, 2, 3, 4, 5].map((index) => (
                <TouchableOpacity key={index} onPress={() => handleRatingPress(index)}>
                    <Text style={styles.star}>{index <= rating ? '★' : '☆'}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    star: {
        fontSize: 25,
        color: 'orange', // Change the color as desired
    },
});

export default CustomRatingBar;