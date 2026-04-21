import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Text, StyleSheet, ScrollView, TextInput, View, TouchableOpacity } from "react-native";
import { Button } from "react-native-elements";
import { useSelector, useDispatch } from "react-redux";
import { setUnitId, setUnitName } from "../../store/authslice";
import DatePickerComponent from "../../components/DatePicker";

const RentScheduleScreen = ({ navigation }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [loadingScheduleCall, setLoadingScheduleCall] = useState(false);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [form, setForm] = useState({
    whatsapp_phone: user?.phone_number ? `+256${String(user.phone_number).replace(/^0/, "")}` : "+256",
    tenant_first_name: user?.first_name ?? "",
    tenant_last_name: user?.last_name ?? "",
    monthly_rent: "",
    property_name: "",
    property_location: "",
    unit_name: "",
    has_payment_backlog: false,
    balance_mode: "OUTSTANDING",
    rent_backlog_amount: "",
    rent_backlog_description: "",
    is_rent_backlog_outstanding: true,
    is_rent_backlog_carried: false,
    balance_carried_forward: "",
    landlord_name: "",
    landlord_phone: "",
    landlord_payment_mode: "MOBILE_MONEY",
    landlord_payment_account: "",
    landlord_mobile_registered_name: "",
    landlord_bank_name: "",
    landlord_bank_account_number: "",
    landlord_bank_account_name: "",
    landlord_bank_branch: "",
    landlord_bank_sort_code: "",
  });

  const formatDate = (value) =>
    value
      .toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .split("/")
      .reverse()
      .join("-");

  const formatStringDate = (value) =>
    value?.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const normalizePhone = (phone) => {
    const clean = (phone ?? "").replaceAll(" ", "");
    if (!clean) return "";
    if (clean.startsWith("+")) return clean;
    if (clean.startsWith("0")) return `+256${clean.slice(1)}`;
    if (clean.startsWith("256")) return `+${clean}`;
    if (/^\d{9}$/.test(clean)) return `+256${clean}`;
    return `+${clean}`;
  };

  const formatMoneyString = (value) => {
    const clean = String(value ?? "").replace(/,/g, "").trim();
    return clean || "0";
  };

  const onInputChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleBoolean = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    if (!form.whatsapp_phone.trim()) return "WhatsApp phone is required.";
    if (!form.tenant_first_name.trim()) return "Tenant first name is required.";
    if (!form.tenant_last_name.trim()) return "Tenant last name is required.";
    if (!form.monthly_rent.trim()) return "Monthly rent is required.";
    if (!form.property_name.trim()) return "Property name is required.";
    if (!form.property_location.trim()) return "Property location is required.";
    if (!form.unit_name.trim()) return "Unit name is required.";

    if (form.has_payment_backlog && form.balance_mode === "OUTSTANDING" && !form.rent_backlog_amount.trim()) {
      return "Outstanding balance is required.";
    }

    if (form.has_payment_backlog && form.balance_mode === "CARRIED_FORWARD" && !form.balance_carried_forward.trim()) {
      return "Balance carried forward is required.";
    }

    if (form.landlord_payment_mode === "MOBILE_MONEY") {
      if (!form.landlord_payment_account.trim()) return "Landlord mobile money number is required.";
      if (!form.landlord_mobile_registered_name.trim()) {
        return "Registered mobile money name is required.";
      }
    }

    if (form.landlord_payment_mode === "BANK") {
      if (!form.landlord_bank_name.trim()) return "Bank name is required.";
      if (!form.landlord_bank_account_number.trim()) return "Bank account number is required.";
      if (!form.landlord_bank_account_name.trim()) return "Bank account name is required.";
      if (!form.landlord_bank_branch.trim()) return "Bank branch is required.";
    }

    return "";
  };

  const submitOnboarding = async () => {
    const formError = validateForm();
    if (formError) {
      setErrorMessage(formError);
      return;
    }

    setLoadingScheduleCall(true);
    setErrorMessage("");
    setSuccessMessage("");

    const payload = {
      whatsapp_phone: normalizePhone(form.whatsapp_phone),
      tenant_first_name: form.tenant_first_name.trim(),
      tenant_last_name: form.tenant_last_name.trim(),
      monthly_rent: formatMoneyString(form.monthly_rent),
      property_name: form.property_name.trim(),
      property_location: form.property_location.trim(),
      unit_name: form.unit_name.trim(),
      next_payment_date: formatDate(new Date(date)),
      has_payment_backlog: form.has_payment_backlog,
      rent_backlog_amount:
        form.has_payment_backlog && form.balance_mode === "OUTSTANDING"
          ? formatMoneyString(form.rent_backlog_amount)
          : "0.00",
      rent_backlog_description: form.has_payment_backlog ? form.rent_backlog_description.trim() : "",
      is_rent_backlog_outstanding: form.has_payment_backlog && form.balance_mode === "OUTSTANDING",
      is_rent_backlog_carried: form.has_payment_backlog && form.balance_mode === "CARRIED_FORWARD",
      balance_carried_forward:
        form.has_payment_backlog && form.balance_mode === "CARRIED_FORWARD"
          ? formatMoneyString(form.balance_carried_forward)
          : "0.00",
      landlord_name: form.landlord_name.trim(),
      landlord_phone: normalizePhone(form.landlord_phone),
      landlord_payment_mode: form.landlord_payment_mode || "MOBILE_MONEY",
      landlord_payment_account:
        form.landlord_payment_mode === "MOBILE_MONEY"
          ? normalizePhone(form.landlord_payment_account)
          : form.landlord_bank_account_number.trim(),
      landlord_mobile_registered_name:
        form.landlord_payment_mode === "MOBILE_MONEY" ? form.landlord_mobile_registered_name.trim() : "",
      landlord_bank_name: form.landlord_payment_mode === "BANK" ? form.landlord_bank_name.trim() : "",
      landlord_bank_account_number:
        form.landlord_payment_mode === "BANK" ? form.landlord_bank_account_number.trim() : "",
      landlord_bank_account_name:
        form.landlord_payment_mode === "BANK" ? form.landlord_bank_account_name.trim() : "",
      landlord_bank_branch: form.landlord_payment_mode === "BANK" ? form.landlord_bank_branch.trim() : "",
      landlord_bank_sort_code: form.landlord_payment_mode === "BANK" ? form.landlord_bank_sort_code.trim() : "",
      vendor_tag: "RB",
    };
    console.log("payload", payload);

    try {
      const response = await axiosInstance.post("/tenants/onboard", payload);
      const responseData = response?.data ?? {};
      if (responseData?.unit_id) {
        dispatch(setUnitId(responseData.unit_id));
      }
      if (payload.unit_name) {
        dispatch(setUnitName(payload.unit_name));
      }
      setSuccessMessage("Onboarding saved successfully.");
      const parentNavigator = navigation.getParent();
      if (parentNavigator) {
        parentNavigator.navigate("HomeScreen", { screen: "RentalTracker" });
      } else {
        navigation.navigate("RentalTracker");
      }
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Onboarding failed. Please check your details and try again.");
    } finally {
      setLoadingScheduleCall(false);
    }
  };

  return (
    <ScrollView style={styles.formContainer} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.pageTitle}>Tenant Self Onboarding</Text>
      <Text style={styles.disclaimer}>
        Fill in the details below to create your tenancy profile and activate your rent cycle.
      </Text>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Tenant Details</Text>
        <TextInput
          placeholder="WhatsApp Phone (+256...)"
          style={styles.inputBox}
          onChangeText={(value) => onInputChange("whatsapp_phone", value)}
          value={form.whatsapp_phone}
        />
        <TextInput
          placeholder="First Name"
          style={styles.inputBox}
          onChangeText={(value) => onInputChange("tenant_first_name", value)}
          value={form.tenant_first_name}
        />
        <TextInput
          placeholder="Last Name"
          style={styles.inputBox}
          onChangeText={(value) => onInputChange("tenant_last_name", value)}
          value={form.tenant_last_name}
        />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Property and Rent</Text>
        <TextInput
          placeholder="Monthly Rent (e.g. 150000.00)"
          style={styles.inputBox}
          keyboardType="numeric"
          onChangeText={(value) => onInputChange("monthly_rent", value)}
          value={form.monthly_rent}
        />
        <TextInput
          placeholder="Property Name"
          style={styles.inputBox}
          onChangeText={(value) => onInputChange("property_name", value)}
          value={form.property_name}
        />
        <TextInput
          placeholder="Property Location"
          style={styles.inputBox}
          onChangeText={(value) => onInputChange("property_location", value)}
          value={form.property_location}
        />
        <TextInput
          placeholder="Unit Name"
          style={styles.inputBox}
          onChangeText={(value) => onInputChange("unit_name", value)}
          value={form.unit_name}
        />
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Next Payment Date</Text>
        <Text style={styles.helperText}>
          Select a date within the next 60 days. This date starts your occupancy cycle.
        </Text>
        <View style={styles.pickerContainer}>
          <Text style={styles.information}>Select Date:</Text>
          <DatePickerComponent setOpen={setOpen} setDate={setDate} open={open} date={date} />
          <Button buttonStyle={styles.scheduleButton} title={formatStringDate(date)} onPress={() => setOpen(true)} />
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Balances</Text>
        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>Does tenant have any balances?</Text>
          <View style={styles.chipRow}>
            <TouchableOpacity
              style={[styles.optionChip, form.has_payment_backlog ? styles.optionChipActive : null]}
              onPress={() =>
                setForm((prev) => ({
                  ...prev,
                  has_payment_backlog: true,
                  balance_mode: prev.balance_mode || "OUTSTANDING",
                  is_rent_backlog_outstanding: prev.balance_mode !== "CARRIED_FORWARD",
                  is_rent_backlog_carried: prev.balance_mode === "CARRIED_FORWARD",
                }))
              }
            >
              <Text style={[styles.optionChipText, form.has_payment_backlog ? styles.optionChipTextActive : null]}>
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionChip, !form.has_payment_backlog ? styles.optionChipActive : null]}
              onPress={() =>
                setForm((prev) => ({
                  ...prev,
                  has_payment_backlog: false,
                  balance_mode: "OUTSTANDING",
                  rent_backlog_amount: "",
                  balance_carried_forward: "",
                  rent_backlog_description: "",
                  is_rent_backlog_outstanding: false,
                  is_rent_backlog_carried: false,
                }))
              }
            >
              <Text style={[styles.optionChipText, !form.has_payment_backlog ? styles.optionChipTextActive : null]}>
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {form.has_payment_backlog ? (
          <>
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>Choose balance type</Text>
              <View style={styles.chipRowBalance}>
                <TouchableOpacity
                  style={[
                    styles.optionChipBalance,
                    form.balance_mode === "OUTSTANDING" ? styles.optionChipActive : null,
                  ]}
                  onPress={() =>
                    setForm((prev) => ({
                      ...prev,
                      balance_mode: "OUTSTANDING",
                      is_rent_backlog_outstanding: true,
                      is_rent_backlog_carried: false,
                      balance_carried_forward: "",
                    }))
                  }
                >
                  <Text
                    numberOfLines={2}
                    adjustsFontSizeToFit
                    minimumFontScale={0.85}
                    style={[
                      styles.optionChipTextBalance,
                      form.balance_mode === "OUTSTANDING" ? styles.optionChipTextActive : null,
                    ]}
                  >
                    Outstanding
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionChipBalance,
                    form.balance_mode === "CARRIED_FORWARD" ? styles.optionChipActive : null,
                  ]}
                  onPress={() =>
                    setForm((prev) => ({
                      ...prev,
                      balance_mode: "CARRIED_FORWARD",
                      is_rent_backlog_outstanding: false,
                      is_rent_backlog_carried: true,
                      rent_backlog_amount: "",
                    }))
                  }
                >
                  <Text
                    numberOfLines={2}
                    adjustsFontSizeToFit
                    minimumFontScale={0.85}
                    style={[
                      styles.optionChipTextBalance,
                      form.balance_mode === "CARRIED_FORWARD" ? styles.optionChipTextActive : null,
                    ]}
                  >
                    Carried forward
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {form.balance_mode === "OUTSTANDING" ? (
              <TextInput
                placeholder="Outstanding Balance Amount"
                style={styles.inputBox}
                keyboardType="numeric"
                onChangeText={(value) => onInputChange("rent_backlog_amount", value)}
                value={form.rent_backlog_amount}
              />
            ) : (
              <TextInput
                placeholder="Balance Carried Forward Amount"
                style={styles.inputBox}
                keyboardType="numeric"
                onChangeText={(value) => onInputChange("balance_carried_forward", value)}
                value={form.balance_carried_forward}
              />
            )}

            <TextInput
              placeholder="Description of Balance (optional)"
              style={styles.inputBox}
              onChangeText={(value) => onInputChange("rent_backlog_description", value)}
              value={form.rent_backlog_description}
            />
          </>
        ) : null}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Landlord Payment Details</Text>
        <TextInput
          placeholder="Landlord Name"
          style={styles.inputBox}
          onChangeText={(value) => onInputChange("landlord_name", value)}
          value={form.landlord_name}
        />
        <TextInput
          placeholder="Landlord Phone"
          style={styles.inputBox}
          onChangeText={(value) => onInputChange("landlord_phone", value)}
          value={form.landlord_phone}
        />

        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>Payment Mode</Text>
          <View style={styles.chipRow}>
            <TouchableOpacity
              style={[styles.optionChip, form.landlord_payment_mode === "MOBILE_MONEY" ? styles.optionChipActive : null]}
              onPress={() => onInputChange("landlord_payment_mode", "MOBILE_MONEY")}
            >
              <Text
                style={[
                  styles.optionChipText,
                  form.landlord_payment_mode === "MOBILE_MONEY" ? styles.optionChipTextActive : null,
                ]}
              >
                Mobile Money
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionChip, form.landlord_payment_mode === "BANK" ? styles.optionChipActive : null]}
              onPress={() => onInputChange("landlord_payment_mode", "BANK")}
            >
              <Text
                style={[styles.optionChipText, form.landlord_payment_mode === "BANK" ? styles.optionChipTextActive : null]}
              >
                Bank
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {form.landlord_payment_mode === "MOBILE_MONEY" ? (
          <>
            <TextInput
              placeholder="Mobile Money Number"
              style={styles.inputBox}
              onChangeText={(value) => onInputChange("landlord_payment_account", value)}
              value={form.landlord_payment_account}
            />
            <TextInput
              placeholder="Registered Mobile Money Name"
              style={styles.inputBox}
              onChangeText={(value) => onInputChange("landlord_mobile_registered_name", value)}
              value={form.landlord_mobile_registered_name}
            />
          </>
        ) : (
          <>
            <TextInput
              placeholder="Bank Name"
              style={styles.inputBox}
              onChangeText={(value) => onInputChange("landlord_bank_name", value)}
              value={form.landlord_bank_name}
            />
            <TextInput
              placeholder="Bank Account Number"
              style={styles.inputBox}
              onChangeText={(value) => onInputChange("landlord_bank_account_number", value)}
              value={form.landlord_bank_account_number}
            />
            <TextInput
              placeholder="Bank Account Name"
              style={styles.inputBox}
              onChangeText={(value) => onInputChange("landlord_bank_account_name", value)}
              value={form.landlord_bank_account_name}
            />
            <TextInput
              placeholder="Bank Branch"
              style={styles.inputBox}
              onChangeText={(value) => onInputChange("landlord_bank_branch", value)}
              value={form.landlord_bank_branch}
            />
            <TextInput
              placeholder="Bank Sort Code (optional)"
              style={styles.inputBox}
              onChangeText={(value) => onInputChange("landlord_bank_sort_code", value)}
              value={form.landlord_bank_sort_code}
            />
          </>
        )}
      </View>

      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
      {successMessage ? <Text style={styles.successMessage}>{successMessage}</Text> : null}

      {loadingScheduleCall ? (
        <Button buttonStyle={styles.buttonStyle} title="Submitting..." disabled loading />
      ) : (
        <Button buttonStyle={styles.buttonStyle} title="Submit Onboarding" onPress={submitOnboarding} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F0ECE6",
  },
  contentContainer: {
    paddingBottom: 40,
  },
  pageTitle: {
    marginTop: 18,
    marginHorizontal: 15,
    fontSize: 24,
    fontWeight: "700",
    color: "#1f1f1f",
  },
  disclaimer: {
    marginTop: 8,
    marginBottom: 6,
    paddingHorizontal: 15,
    fontSize: 15,
    fontWeight: "300",
    color: "#3d3d3d",
  },
  sectionCard: {
    backgroundColor: "white",
    marginHorizontal: 15,
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FCB200",
    marginBottom: 10,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#b7b7b7",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    color: "#1f1f1f",
    backgroundColor: "#fff",
  },
  helperText: {
    color: "#666",
    marginBottom: 10,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  information: {
    fontSize: 15,
    marginRight: 6,
  },
  scheduleButton: {
    backgroundColor: "#424447",
    paddingHorizontal: 10,
  },
  optionRow: {
    marginBottom: 12,
  },
  optionLabel: {
    marginBottom: 8,
    color: "#303030",
    fontWeight: "500",
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
  },
  chipRowBalance: {
    flexDirection: "row",
    flexWrap: "nowrap",
    width: "100%",
    gap: 6,
    alignItems: "stretch",
  },
  optionChip: {
    borderWidth: 1,
    borderColor: "#FCB200",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#fff",
  },
  optionChipBalance: {
    flex: 1,
    minWidth: 0,
    borderWidth: 1,
    borderColor: "#FCB200",
    borderRadius: 16,
    paddingHorizontal: 6,
    paddingVertical: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  optionChipActive: {
    backgroundColor: "#FCB200",
  },
  optionChipText: {
    color: "#FCB200",
    fontWeight: "600",
  },
  optionChipTextBalance: {
    color: "#FCB200",
    fontWeight: "600",
    fontSize: 11,
    lineHeight: 14,
    textAlign: "center",
  },
  optionChipTextActive: {
    color: "#fff",
  },
  buttonStyle: {
    backgroundColor: "#FCB200",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 18,
    marginHorizontal: 15,
  },
  errorMessage: {
    color: "#D64545",
    marginTop: 12,
    marginHorizontal: 18,
    fontWeight: "600",
  },
  successMessage: {
    color: "#1E8E3E",
    marginTop: 12,
    marginHorizontal: 18,
    fontWeight: "600",
  },
});

export default RentScheduleScreen;