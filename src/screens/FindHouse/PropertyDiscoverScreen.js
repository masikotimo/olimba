import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList} from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, Card } from 'react-native-elements';
import SearchBar from '../../components/SearchBar';
import PropertyCardTop from '../../components/PropertyCardTop';
import { AntDesign } from '@expo/vector-icons'; 
import axiosInstance from '../../api/axiosInstance';
import CategoryButton from '../../components/CategoryButton';

const categories = ['Near You', 'Apartment', 'Full House', 'Condominium'];

const PropertyDiscoverScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false)
  const [error, setError] = useState(false);
  const token = useSelector((state) => state.auth.token);
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
          <View style={{ flexDirection: 'row', marginBottom: 16, marginLeft: 12, paddingRight: 12 }}>
            {categories.map(category => (
              <CategoryButton
                key={category}
                title={category}
                selected={selectedCategory === category}
                onPress={() => setSelectedCategory(category)}
              />
            ))}
          </View>
          <PropertyCardTop results={results} />
          <Text style={styles.recommendedText}>Recommended for you</Text>
          <PropertyCardTop results={results}/>
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