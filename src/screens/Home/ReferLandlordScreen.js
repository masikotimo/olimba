import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, Input } from 'react-native-elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useSelector } from "react-redux";
import axiosInstance from '../../api/axiosInstance';

const ReferLandlordScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const user = useSelector((state) => state.auth.user);
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    referrer_name: user?.first_name || '',
    referrer_phone: user?.username || '',
    referrer_email: user?.email || '',
    landlord_name: '',
    landlord_phone: '',
    landlord_email: '',
    property_location: '',
    rent_amount: '',
    number_of_units: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = ['landlord_name', 'landlord_phone', 'landlord_email', 'property_location', 'rent_amount', 'number_of_units'];
    const missingFields = requiredFields.filter(field => !formData[field].trim());
    
    if (missingFields.length > 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.landlord_email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return false;
    }

    // Basic phone validation (should start with +)
    if (!formData.landlord_phone.startsWith('+')) {
      Alert.alert('Invalid Phone', 'Phone number should start with +');
      return false;
    }

    const units = Number(formData.number_of_units);
    if (!Number.isInteger(units) || units <= 0) {
      Alert.alert('Invalid Units', 'Number of units must be a whole number greater than 0');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/admin/referrals/landlord', formData);
      
      Alert.alert(
        'Success!', 
        'Landlord referral submitted successfully. Thank you for helping us grow!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Referral submission error:', error);
      Alert.alert(
        'Error', 
        'Failed to submit referral. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: "#F0ECE6"
      }}
    >
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Card containerStyle={styles.headerCard}>
          <Text style={styles.headerTitle} h4>Refer Your Landlord</Text>
          <Text style={styles.headerSubtitle}>
            Help us grow by referring landlords to our platform. You'll be helping other tenants find great rental opportunities!
          </Text>
        </Card>

        <Card containerStyle={styles.formCard}>
          <Text style={styles.sectionTitle} h5>Your Information</Text>
          <Card.Divider color="#FCB200" style={{ marginBottom: 15 }} />
          
          <Input
            label="Your Email"
            value={formData.referrer_email}
            onChangeText={(value) => handleInputChange('referrer_email', value)}
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            placeholder="Enter your email address"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </Card>

        <Card containerStyle={styles.formCard}>
          <Text style={styles.sectionTitle} h5>Landlord Information</Text>
          <Card.Divider color="#FCB200" style={{ marginBottom: 15 }} />
          
          <Input
            label="Landlord Name *"
            value={formData.landlord_name}
            onChangeText={(value) => handleInputChange('landlord_name', value)}
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            placeholder="Enter landlord's full name"
          />
          
          <Input
            label="Landlord Phone *"
            value={formData.landlord_phone}
            onChangeText={(value) => handleInputChange('landlord_phone', value)}
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            placeholder="+256XXXXXXXXX"
            keyboardType="phone-pad"
          />
          
          <Input
            label="Landlord Email *"
            value={formData.landlord_email}
            onChangeText={(value) => handleInputChange('landlord_email', value)}
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            placeholder="landlord@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Input
            label="Property Location *"
            value={formData.property_location}
            onChangeText={(value) => handleInputChange('property_location', value)}
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            placeholder="e.g., Kiwatule, Kampala"
          />
          
          <Input
            label="Rent Amount *"
            value={formData.rent_amount}
            onChangeText={(value) => handleInputChange('rent_amount', value)}
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            placeholder="e.g., 500000"
            keyboardType="numeric"
          />

          <Input
            label="Number of Units *"
            value={formData.number_of_units}
            onChangeText={(value) => handleInputChange('number_of_units', value)}
            containerStyle={styles.inputContainer}
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            placeholder="e.g., 12"
            keyboardType="numeric"
          />
        </Card>

        <Button
          title={isLoading ? "Submitting..." : "Submit Referral"}
          buttonStyle={styles.submitButton}
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
        />
        
        <Text style={styles.disclaimer}>
          * Required fields. By submitting this referral, you confirm that the information provided is accurate.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  headerCard: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    backgroundColor: "#82ed9f"
  },
  headerTitle: {
    color: "#FCB200",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center"
  },
  headerSubtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    lineHeight: 20
  },
  formCard: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    backgroundColor: "#fff"
  },
  sectionTitle: {
    color: "#FCB200",
    fontWeight: "bold",
    marginBottom: 5
  },
  inputContainer: {
    marginBottom: 10
  },
  inputStyle: {
    fontSize: 16,
    color: "#333"
  },
  labelStyle: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500"
  },
  submitButton: {
    backgroundColor: '#FCB200',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20
  },
  disclaimer: {
    textAlign: "center",
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 20
  }
});

export default ReferLandlordScreen;
