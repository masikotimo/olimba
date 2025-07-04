import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, ScrollView, Alert } from 'react-native';
import { Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const PropertyDetailsScreen = ({ route }) => {
  const { result } = route.params;


  // Get image (first image or fallback)
  const hasImage = result.images && result.images.length > 0 && result.images[0].image;
  const imageUri = hasImage
    ? result.images[0].image
    : 'https://images.unsplash.com/photo-1586105251261-c1tdtQVXda0?auto=format&fit=crop&w=400&q=80';

  // Open Google Maps
  const openLocation = () => {
    if (result.location_url) {
        Linking.openURL(result.location_url);
        Alert.alert("Property Location",result.location_url);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: '#F5F6FA' }}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{result.related_rental.rental_name}</Text>
          <Text style={styles.price}>
            {Number(result.metadata.unit_rent).toLocaleString()} UGX
          </Text>
        </View>
        <Text style={styles.location}>{result.related_rental.location}</Text>
        <View style={styles.iconRow}>
          <View style={styles.iconItem}>
            <FontAwesome5 name="bed" size={18} color="#b4b5b8" />
            <Text style={styles.iconText}>{result.number_of_bedrooms}</Text>
          </View>
          <View style={styles.iconItem}>
            <FontAwesome5 name="bath" size={18} color="#b4b5b8" />
            <Text style={styles.iconText}>{result.number_of_bathrooms}</Text>
          </View>
          <TouchableOpacity style={styles.iconItem} onPress={openLocation}>
            <MaterialIcons name="location-pin" size={20} color="#FFC107" />
            <Text style={[styles.iconText, { color: '#FFC107', textDecorationLine: 'underline' }]}>Map</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{result.description}</Text>
        <TouchableOpacity
          style={styles.bookingButton}
          onPress={() => Linking.openURL('tel:+256774453453')}
        >
          <Text style={styles.bookingButtonText}>Make a call</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 220,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 24,
    minHeight: 400,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFC107',
    marginLeft: 12,
  },
  location: {
    color: '#888',
    fontSize: 15,
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 4,
  },
  iconItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  iconText: {
    marginLeft: 6,
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 6,
    color: '#222',
  },
  description: {
    fontSize: 15,
    color: '#444',
    marginBottom: 24,
    lineHeight: 22,
  },
  bookingButton: {
    backgroundColor: '#FFC107',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  bookingButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default PropertyDetailsScreen;