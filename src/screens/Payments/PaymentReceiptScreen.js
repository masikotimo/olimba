import React from "react";
import { ScrollView, StyleSheet, View, Alert } from "react-native";
import { Text, Card, Button, Divider } from "react-native-elements";
import { useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { currencyFormatter } from "../../utilities/currencyFormatter";
import { dateFormatter } from "../../utilities/dateFormatter";

const getPaymentMethodName = (payment) => payment?.payment_method?.name || "N/A";

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const htmlEscape = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const formatDateValue = (value) => {
  if (!value) return "N/A";
  return dateFormatter(value);
};

const buildReceiptHtml = (paymentDetails) => {
  const tenantName = `${paymentDetails?.related_tenant?.first_name || ""} ${paymentDetails?.related_tenant?.last_name || ""}`.trim() || "N/A";
  const tenantPhone = paymentDetails?.related_tenant?.username || paymentDetails?.related_tenant?.phone_number || "N/A";
  const unitName = paymentDetails?.related_rental_unit?.unit_name || "N/A";
  const unitType = paymentDetails?.related_rental_unit?.unit_type || "";
  const propertyName = `${unitName} ${unitType}`.trim();
  const monthPaidFor = paymentDetails?.related_month
    ? `${paymentDetails.related_month.month} ${paymentDetails.related_month.year}`
    : "N/A";
  const paymentDate = formatDateValue(paymentDetails?.date_paid || paymentDetails?.date_created);
  const receiptDate = formatDateValue(new Date());
  const amountText = currencyFormatter(toNumber(paymentDetails?.amount));
  const paymentMethod = getPaymentMethodName(paymentDetails);
  const paymentReference = paymentDetails?.external_reference || "N/A";
  const hasOutstandingBalanceAfter =
    paymentDetails?.outstanding_balance_after !== null &&
    paymentDetails?.outstanding_balance_after !== undefined;
  const outstandingBalanceAfterText = currencyFormatter(toNumber(paymentDetails?.outstanding_balance_after));

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #111; }
          .header { background: #000; color: #FCB200; padding: 16px; border-radius: 8px; }
          .title { text-align: center; margin: 18px 0 10px; font-size: 22px; font-weight: bold; }
          .row { display: flex; justify-content: space-between; margin: 8px 0; gap: 12px; }
          .label { font-weight: bold; }
          .section { margin-top: 14px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
          .section-head { background: #000; color: #fff; padding: 10px; font-weight: bold; }
          .section-body { padding: 12px; }
          .summary { margin-top: 14px; padding: 12px; background: #f8f8f8; border-radius: 8px; }
          .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #444; }
        </style>
      </head>
      <body>
        <div class="header">
          <div style="font-size:20px;font-weight:bold;">RentBeta</div>
          <div>ICT Innovation Hub Nakawa, Plot 19-12 Port Bell Road, Kampala</div>
          <div>Tel: +256 703330943 / +256 774453453</div>
          <div>Website: www.rentbeta.africa | Email: admin@rentbeta.africa</div>
        </div>
        <div class="title">Rent Payment Receipt</div>
        <hr />
        <div class="row"><div><span class="label">Tenant Name:</span> ${htmlEscape(tenantName)}</div><div><span class="label">Receipt Date:</span> ${htmlEscape(receiptDate)}</div></div>
        <div class="row"><div><span class="label">Telephone:</span> ${htmlEscape(tenantPhone)}</div><div><span class="label">Rental Property:</span> ${htmlEscape(propertyName)}</div></div>
        <div class="row"><div><span class="label">Month Paid For:</span> ${htmlEscape(monthPaidFor)}</div><div><span class="label">Payment Method:</span> ${htmlEscape(paymentMethod)}</div></div>
        <div class="row"><div><span class="label">Payment Date:</span> ${htmlEscape(paymentDate)}</div><div><span class="label">Reference:</span> ${htmlEscape(paymentReference)}</div></div>
        <div class="section">
          <div class="section-head">Payment Details</div>
          <div class="section-body">
            <div class="row"><div>Rent payment for ${htmlEscape(monthPaidFor)}</div><div>${htmlEscape(amountText)}</div></div>
          </div>
        </div>
        <div class="summary">
          <div class="row"><div class="label">PAYMENT AMOUNT:</div><div>${htmlEscape(amountText)}</div></div>
          ${
            hasOutstandingBalanceAfter
              ? `<div class="row"><div class="label">BALANCE:</div><div>${htmlEscape(outstandingBalanceAfterText)}</div></div>`
              : ""
          }
        </div>
        <div class="footer">
          Powered by RentBeta.africa<br />
          This is an autogenerated receipt. Do not sign.
        </div>
      </body>
    </html>
  `;
};

const PaymentReceiptScreen = () => {
  const insets = useSafeAreaInsets();
  const paymentDetails = useSelector((state) => state.auth.paymentDetails);

  const handlePrint = async () => {
    try {
      const html = buildReceiptHtml(paymentDetails);
      await Print.printAsync({ html });
    } catch (error) {
      Alert.alert("Print Error", "Unable to print receipt right now.");
    }
  };

  const handleDownload = async () => {
    try {
      const html = buildReceiptHtml(paymentDetails);
      const file = await Print.printToFileAsync({
        html,
        base64: false,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(file.uri, {
          mimeType: "application/pdf",
          dialogTitle: "Download Receipt",
          UTI: "com.adobe.pdf",
        });
      } else {
        Alert.alert("Receipt Ready", `PDF saved at: ${file.uri}`);
      }
    } catch (error) {
      Alert.alert("Download Error", "Unable to generate receipt PDF right now.");
    }
  };

  const amountText = currencyFormatter(toNumber(paymentDetails?.amount));
  const hasOutstandingBalanceAfter =
    paymentDetails?.outstanding_balance_after !== null &&
    paymentDetails?.outstanding_balance_after !== undefined;
  const outstandingBalanceAfterText = currencyFormatter(toNumber(paymentDetails?.outstanding_balance_after));
  const paymentDate = formatDateValue(paymentDetails?.date_paid || paymentDetails?.date_created);
  const monthPaidFor = paymentDetails?.related_month
    ? `${paymentDetails.related_month.month} ${paymentDetails.related_month.year}`
    : "N/A";
  const unitName = paymentDetails?.related_rental_unit?.unit_name || "N/A";

  return (
    <ScrollView style={{ paddingBottom: insets.bottom, backgroundColor: "#F0ECE6" }}>
      <View style={styles.container}>
        <Card containerStyle={styles.headerCard}>
          <Text h4 style={styles.headerTitle}>
            Rent Payment Receipt
          </Text>
          <Text style={styles.headerSubtext}>Auto-generated receipt for your payment record.</Text>
        </Card>

        <Card containerStyle={styles.detailsCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Unit:</Text>
            <Text style={styles.value}>{unitName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Amount:</Text>
            <Text style={styles.value}>{amountText}</Text>
          </View>
          {hasOutstandingBalanceAfter ? (
            <View style={styles.row}>
              <Text style={styles.label}>Balance:</Text>
              <Text style={styles.value}>{outstandingBalanceAfterText}</Text>
            </View>
          ) : null}
          <View style={styles.row}>
            <Text style={styles.label}>Payment Date:</Text>
            <Text style={styles.value}>{paymentDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Month Paid For:</Text>
            <Text style={styles.value}>{monthPaidFor}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Method:</Text>
            <Text style={styles.value}>{getPaymentMethodName(paymentDetails)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Reference:</Text>
            <Text style={styles.value}>{paymentDetails?.external_reference || "N/A"}</Text>
          </View>
          <Divider style={{ marginTop: 14, marginBottom: 12 }} />
          <Text style={styles.footerText}>Powered by RentBeta.africa</Text>
        </Card>

        <Button title="Print Receipt" buttonStyle={styles.printButton} onPress={handlePrint} />
        <Button title="Download Receipt PDF" buttonStyle={styles.downloadButton} onPress={handleDownload} />
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
    backgroundColor: "#EFECEC",
    borderColor: "#EFECEC",
  },
  headerTitle: {
    color: "#FCB200",
    fontWeight: "700",
    marginBottom: 6,
  },
  headerSubtext: {
    color: "#444",
  },
  detailsCard: {
    borderRadius: 12,
    marginTop: 14,
    backgroundColor: "#FFF",
    borderColor: "#F0ECE6",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 10,
  },
  label: {
    fontWeight: "700",
    color: "#333",
    flex: 1,
  },
  value: {
    color: "#111",
    flex: 1,
    textAlign: "right",
  },
  footerText: {
    textAlign: "center",
    color: "#444",
    fontSize: 12,
    marginTop: 6,
  },
  printButton: {
    backgroundColor: "#1f1f1f",
    borderRadius: 10,
    paddingVertical: 13,
    marginTop: 12,
  },
  downloadButton: {
    backgroundColor: "#FCB200",
    borderRadius: 10,
    paddingVertical: 13,
    marginTop: 12,
    marginBottom: 20,
  },
});

export default PaymentReceiptScreen;
