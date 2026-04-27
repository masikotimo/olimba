import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, ScrollView, FlatList, Dimensions } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const PropertyDetailsScreen = ({ route }) => {
  const { result } = route.params;
  const screenWidth = Dimensions.get('window').width;

  const normalizeImageUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http://') ? url.replace('http://', 'https://') : url;
  };

  const gallery = Array.isArray(result.images)
    ? result.images
        .map((img) => normalizeImageUrl(img?.image))
        .filter(Boolean)
    : [];

  const fallbackImage = 'https://images.unsplash.com/photo-1586105251261-c1tdtQVXda0?auto=format&fit=crop&w=400&q=80';
  const imageUris = gallery.length > 0 ? gallery : [fallbackImage];
  const [activeImage, setActiveImage] = useState(0);

  // Open Google Maps
  const openLocation = () => {
    const locationUrl = result?.related_rental?.location_url;
    if (locationUrl) {
        Linking.openURL(locationUrl);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: '#F5F6FA' }}>
      <FlatList
        data={imageUris}
        keyExtractor={(item, index) => `${item}-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const nextIndex = Math.round(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
          setActiveImage(nextIndex);
        }}
        renderItem={({ item }) => <Image source={{ uri: item }} style={[styles.image, { width: screenWidth }]} />}
      />
      {imageUris.length > 1 ? (
        <View style={styles.paginationRow}>
          {imageUris.map((_, index) => (
            <View key={index} style={[styles.paginationDot, index === activeImage ? styles.paginationDotActive : null]} />
          ))}
        </View>
      ) : null}
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
    height: 220,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    gap: 6,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d0d0d0',
  },
  paginationDotActive: {
    backgroundColor: '#FFC107',
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