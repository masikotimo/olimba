import React, {useState, useEffect} from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Button, Input } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SelectComponent from '../../components/SelectDropdown';
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
const titles = ["Electricity", "Water", "Security", "Plumbing", "Others"]
const severities = [{"name":"Low"}, {"name":"Medium"}, {"name":"High"}, {"name":"Urgent"}]


const TicketCreateScreen = ({navigation}) => {
  const [unit, setUnit] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState("");
  const [loadingTicketCreate, setLoadingTicketCreate] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const [rentals, setRentals] = useState([]);
  const [loadingRentals, setLoadingRentals] = useState(false)
  const [isLoadingAddTicket, setLoadingAddTicket] = useState(false);

  const useGetOccupancyList = async () => {    
    try {
      const response = await axios.get(`https://api.rentbeta.iolabsug.com/api/v1/tenants/occupancy_list?tenant_id=${user.id}&option=false`);
      setRentals(response.data.data);
      setLoadingRentals(false);
    } catch (e) {
      setError(true);
      setLoadingRentals(false);
    }
  }

  useEffect(() => {
    useGetOccupancyList();

    const unsubscribe = navigation.addListener('focus', () => {
      useGetOccupancyList();
    })

    return unsubscribe
  }, [navigation])

  const textAfterSelectionUnit = (selectedItem) => {
    return selectedItem.related_rental_unit.unit_name
  }

  const textForSelectionUnit = (selectedItem) => {
    return selectedItem.related_rental_unit.unit_name
  }

  const onSelectUnit = (selectedItem) => {
    setUnit(selectedItem.related_rental_unit.id)
  }

  const textAfterSelectionTicket = (selectedItem) => {
    return selectedItem
  }

  const textForSelectionTicket = (selectedItem) => {
    return selectedItem
  }

  const onSelectTicket = (selectedItem) => {
    setTitle(selectedItem)
  }

  const textAfterSelectionSeverity = (selectedItem) => {
    return selectedItem.name
  }

  const textForSelectionSeverity = (selectedItem) => {
    return selectedItem.name
  }

  const onSelectSeverity = (selectedItem) => {
    setSeverity(selectedItem.name)
  }

  const submitTicket = async () => {
    try {
      setLoadingTicketCreate(true)
      const response = await axios.post("https://api.rentbeta.iolabsug.com/api/v1/tenants/tickets", { "related_rental_unit": unit, "related_tenant": user.id, "title": title, "description": description });
    //   console.log(response)
      navigation.navigate("TicketList");
    } catch (err) {
      console.log(err)
      setErrorMessage("Payment Failed")
      setLoadingTicketCreate(false)
    }
};

  return (
    <View style={styles.container}>
      {loadingRentals ? (
        <ActivityIndicator size="large" color="#FCB200" style={{marginTop: 25, marginBottom: 25}}/>

      ) : (
        <View style={styles.formContainer}>
          <SelectComponent buttonText={"Select Unit"} data={rentals} afterSelection={textAfterSelectionUnit} textForSelection={textForSelectionUnit} onSelect={onSelectUnit}/>

          <SelectComponent buttonText={"Select Ticket"} data={titles} afterSelection={textAfterSelectionTicket} textForSelection={textForSelectionTicket} onSelect={onSelectTicket}/>

          <Input
            label="Ticket Description"
            value={description}
            onChangeText={setDescription}
            autoCapitalize="none"
            autoCorrect={false}
            inputStyle={styles.bottomInputStyle}
          />

          <SelectComponent buttonText={"Select Severity"} data={severities} afterSelection={textAfterSelectionSeverity} textForSelection={textForSelectionSeverity} onSelect={onSelectSeverity}/>
        </View>
      )}

        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}

        {loadingTicketCreate ? (
          <Button
            buttonStyle={styles.buttonStyle}
            title="Submit Ticket"
            loading
            disabled
          />
        ) : (
          <Button
            buttonStyle={styles.buttonStyle}
            title="Submit Ticket"
            onPress={submitTicket}
          />
        )}
      </View>
  )
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30
  },
  formContainer: {
    marginLeft: 15,
    marginRight: 15
  },
  buttonStyle: {
    backgroundColor: '#FCB200',
    padding: 15,
    borderRadius: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 30
  },
  bottomInputStyle: {
    // marginLeft: 15,
    // marginRight: 15
  },
});

export default TicketCreateScreen;