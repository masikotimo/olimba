import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { Text, Card } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axiosInstance from "../../api/axiosInstance";
import { PAYMENT_TYPES, UTILITY_TYPES } from "../../constants/paymentFlows";
import KeyboardAwareFormScroll from "../../components/KeyboardAwareFormScroll";

const UTILITY_OPTIONS = [
  {
    type: UTILITY_TYPES.ELECTRICITY,
    label: "Electricity",
    icon: "flash",
    enabledKey: "electricity_enabled",
  },
  {
    type: UTILITY_TYPES.WATER,
    label: "Water",
    icon: "water",
    enabledKey: "water_enabled",
  },
];

const UtilityPaymentsScreen = ({ navigation, route }) => {
  const occupancyId = route?.params?.occupancyId;
  const utilities = route?.params?.utilities ?? {};

  const [balanceData, setBalanceData] = useState(null);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchBalance = useCallback(async () => {
    if (!occupancyId) {
      setErrorMessage("Tenancy details are missing.");
      setLoadingBalance(false);
      return;
    }

    try {
      setErrorMessage("");
      const response = await axiosInstance.get("/tenants/utilities/balance", {
        params: { occupancy_id: occupancyId },
      });
      setBalanceData(response.data);
    } catch (e) {
      setErrorMessage("Unable to load utility balance. You can still buy credit.");
    } finally {
      setLoadingBalance(false);
      setRefreshing(false);
    }
  }, [occupancyId]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBalance();
  };

  const enabledUtilities = UTILITY_OPTIONS.filter((option) => utilities?.[option.enabledKey]);

  const meterBalance = balanceData?.balance?.data ?? {};
  const showElectricity =
    (balanceData?.electricity_enabled ?? utilities?.electricity_enabled) === true;
  const showWater = (balanceData?.water_enabled ?? utilities?.water_enabled) === true;

  const formatMeterBalance = (value, unit) => {
    if (value === null || value === undefined || value === "") return `— ${unit}`;
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return `${value} ${unit}`;
    return `${numeric} ${unit}`;
  };

  const handleUtilityPress = (utilityType) => {
    navigation.navigate("MobileMoneyPayment", {
      paymentType: PAYMENT_TYPES.UTILITY,
      utilityType,
      occupancyId,
    });
  };

  return (
    <KeyboardAwareFormScroll
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.pageTitle}>Pay Utilities</Text>
      <Text style={styles.subtitle}>
        Buy electricity or water credit for your unit. Payments use the same mobile money flow as rent.
      </Text>

      <Card containerStyle={styles.infoCard}>
        <Text style={styles.infoLabel}>Account</Text>
        <Text style={styles.infoValue}>{utilities?.account_number_masked || "—"}</Text>
        {meterBalance?.apartment ? (
          <>
            <Text style={[styles.infoLabel, styles.infoSpacing]}>Apartment</Text>
            <Text style={styles.infoValue}>{meterBalance.apartment}</Text>
          </>
        ) : null}
      </Card>

      {loadingBalance ? (
        <ActivityIndicator size="large" color="#FCB200" style={styles.loader} />
      ) : (
        <Card containerStyle={styles.infoCard}>
          <Text style={styles.sectionTitle}>Balance</Text>
          {showElectricity ? (
            <View style={styles.balanceRow}>
              <Text style={styles.balanceKey}>Electricity</Text>
              <Text style={styles.balanceValue}>
                {formatMeterBalance(meterBalance.electricity_balance_kwh, "kWh")}
              </Text>
            </View>
          ) : null}
          {showWater ? (
            <View style={styles.balanceRow}>
              <Text style={styles.balanceKey}>Water</Text>
              <Text style={styles.balanceValue}>
                {formatMeterBalance(meterBalance.water_balance_m3, "m³")}
              </Text>
            </View>
          ) : null}
          {!showElectricity && !showWater ? (
            <Text style={styles.balanceValue}>No utility balances available</Text>
          ) : null}
        </Card>
      )}

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <Text style={styles.sectionTitle}>Select Utility</Text>
      <View style={styles.optionsGrid}>
        {enabledUtilities.map((option) => (
          <TouchableOpacity
            key={option.type}
            style={styles.utilityCard}
            activeOpacity={0.85}
            onPress={() => handleUtilityPress(option.type)}
          >
            <MaterialCommunityIcons name={option.icon} size={34} color="#FCB200" />
            <Text style={styles.utilityLabel}>{option.label}</Text>
            <Text style={styles.utilityAction}>Buy Credit</Text>
          </TouchableOpacity>
        ))}
      </View>

      {enabledUtilities.length === 0 ? (
        <Text style={styles.emptyText}>No utilities are enabled for this unit.</Text>
      ) : null}
    </KeyboardAwareFormScroll>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F0ECE6",
  },
  content: {
    padding: 15,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f1f1f",
    marginTop: 8,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 12,
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  infoCard: {
    borderRadius: 14,
    marginBottom: 12,
    marginHorizontal: 0,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FCB200",
    marginBottom: 10,
    marginTop: 8,
  },
  infoLabel: {
    color: "#666",
    fontSize: 13,
  },
  infoSpacing: {
    marginTop: 10,
  },
  infoValue: {
    color: "#1f1f1f",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  balanceKey: {
    color: "#666",
    fontSize: 15,
    fontWeight: "500",
  },
  balanceValue: {
    color: "#1f1f1f",
    fontSize: 16,
    fontWeight: "700",
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 4,
  },
  utilityCard: {
    flexGrow: 1,
    minWidth: "45%",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F0D88C",
    padding: 18,
    alignItems: "center",
  },
  utilityLabel: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "700",
    color: "#1f1f1f",
  },
  utilityAction: {
    marginTop: 6,
    fontSize: 13,
    color: "#FCB200",
    fontWeight: "600",
  },
  loader: {
    marginVertical: 24,
  },
  errorText: {
    color: "#D64545",
    marginBottom: 8,
    fontWeight: "600",
  },
  emptyText: {
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
});

export default UtilityPaymentsScreen;
