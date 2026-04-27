import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

const PropertyDetail = ({result}) => {
    const normalizeImageUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http://') ? url.replace('http://', 'https://') : url;
    };

    // Check if there is at least one image
    const hasImage = result.images && result.images.length > 0 && result.images[0].image;
    const imageUri = hasImage
        ? normalizeImageUrl(result.images[0].image)
        : 'https://images.unsplash.com/photo-1586105251261-c1tdtQVXda0?auto=format&fit=crop&w=400&q=80'; // Unsplash static house image

    return (
        <View style={styles.card}>
            <Image style={styles.image} source={{ uri: imageUri }}/>
            <View style={styles.info}>
                <Text style={styles.name}>{result.related_rental.rental_name}</Text>
                <Text style={styles.price}>{result.metadata.unit_rent} UGX</Text>
                <Text style={styles.location}>{result.related_rental.location}</Text>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        marginHorizontal: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 140,
        borderRadius: 12,
        marginBottom: 10,
    },
    info: {
        paddingHorizontal: 4,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 4,
    },
    price: {
        color: '#FFC107', // yellow
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 2,
    },
    location: {
        color: '#888',
        fontSize: 14,
    },
});

const CategoryButton = ({ title, selected, onPress }) => (
    <TouchableOpacity
        style={[styles.button, selected && styles.selectedButton]}
        onPress={onPress}
    >
        <Text style={[styles.buttonText, selected && styles.selectedButtonText]}>
            {title}
        </Text>
    </TouchableOpacity>
);

export default PropertyDetail;