import React, {useEffect, useMemo, useState} from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-elements';
import SearchBar from '../../components/SearchBar';
import PropertyCardTop from '../../components/PropertyCardTop';
import { AntDesign } from '@expo/vector-icons'; 
import axiosInstance from '../../api/axiosInstance';
import CategoryButton from '../../components/CategoryButton';

const categories = ['Near You', 'Apartment', 'Full House', 'Condominium'];

const hasUnitImages = (unit) =>
  Array.isArray(unit?.images) && unit.images.some((img) => Boolean(img?.image));

const PropertyDiscoverScreen = ({navigation}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(true)
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const useGetHouses = async () => {    
    try {
        const response = await axiosInstance.get(`/tenants/houses`);
        setResults(response.data.data);
        setLoadingResults(false);
    } catch (e) {
        setError(true);
        setLoadingResults(false);
    }
  }

  const filteredResults = useMemo(() => {
    const locationFiltered = results.filter((result) => {
      const location = result?.related_rental?.location ?? "";
      return location.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return [...locationFiltered].sort((a, b) => {
      const aHasImage = hasUnitImages(a);
      const bHasImage = hasUnitImages(b);
      if (aHasImage === bHasImage) return 0;
      return aHasImage ? -1 : 1;
    });
  }, [results, searchTerm]);

  useEffect(() => {
    useGetHouses()
  }, [])

  return (
    <ScrollView >
      <SearchBar
        term={searchTerm}
        onTermChange={setSearchTerm}
        onTermSubmit={() => {/* handle search submit here */}}
      />
      <ScrollView>
        {results.length > 0 ? (
        <>
          <Text style={styles.headerText}>Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 16, marginLeft: 12, paddingRight: 12 }}
            contentContainerStyle={{ paddingRight: 24 }}
          >
            {categories.map(category => (
              <CategoryButton
                key={category}
                title={category}
                selected={selectedCategory === category}
                onPress={() => setSelectedCategory(category)}
              />
            ))}
          </ScrollView>
          <PropertyCardTop results={filteredResults} />
          <Text style={styles.recommendedText}>Recommended for you</Text>
          <PropertyCardTop results={filteredResults}/>
        </>
          ) : (
          <View style={styles.emptyView}>
          <Text h4Style={{fontSize: 18, color: "#b4b5b8", marginBottom: 20}} h4>There aren't any listed properties, Please check back later</Text>
          <AntDesign name="codesquareo" size={70} color="#b4b5b8" />
          </View>
        )}
      </ScrollView>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  categoriesView: {
    display: "flex",
    flexDirection: "row",
    marginTop: 10
  },
  categoriesCard: {
    borderRadius: 30
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginLeft: 20,
    marginTop: 24,
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  recommendedText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginLeft: 20,
    marginTop: 28,
    marginBottom: 12,
    letterSpacing: 0.1,
  },
  emptyView: {
    marginTop: 50,
    alignItems: "center"
  }
});

export default PropertyDiscoverScreen;