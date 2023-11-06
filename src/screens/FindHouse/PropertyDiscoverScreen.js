import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList} from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, Card } from 'react-native-elements';
import SearchBar from '../../components/SearchBar';
import PropertyCardTop from '../../components/PropertyCardTop';
import { AntDesign } from '@expo/vector-icons'; 

const PropertyDiscoverScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false)
  const [error, setError] = useState(false);
  const token = useSelector((state) => state.auth.token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  const useGetHouses = async () => {    
    try {
      const response = await axios.get(`https://api.rentbeta.iolabsug.com/api/v1/tenants/houses`);
      setResults(response.data.data);
      setLoadingResults(false);
    } catch (e) {
      setError(true);
      setLoadingResults(false);
    }
  }

  useEffect(() => {
    useGetHouses()
    console.log(results)
  }, [])

  return (
    <ScrollView >
      <SearchBar 
        term={searchTerm}
      />
      <ScrollView>
        <Text style={styles.headerText} h3>Categories</Text>
        <View style={styles.categoriesView}>
            <TouchableOpacity
            >
              <Card containerStyle={styles.categoriesCard}>
                <Text style={styles.serviceCardh5} h5>Near You</Text>
              </Card>
            </TouchableOpacity>
          
            <TouchableOpacity
            >
              <Card containerStyle={styles.categoriesCard}>
                <Text style={styles.serviceCardh5} h5>Apartment</Text>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity>
              <Card containerStyle={styles.categoriesCard}>
                <Text style={styles.serviceCardh5} h5>Full House</Text>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity
            >
              <Card containerStyle={styles.categoriesCard}>
                <Text style={styles.serviceCardh5} h5>Condominium</Text>
              </Card>
            </TouchableOpacity>
        </View>
        <PropertyCardTop results={results} />
        <Text h3>Recommended For You</Text>
        <PropertyCardTop results={results}/>
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
  }
});

export default PropertyDiscoverScreen;