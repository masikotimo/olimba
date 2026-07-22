export const PAYMENT_TYPES = {
  RENT: "rent",
  UTILITY: "utility",
};

export const UTILITY_TYPES = {
  ELECTRICITY: "electricity",
  WATER: "water",
};

export const getPaymentFlowConfig = (paymentType = PAYMENT_TYPES.RENT) => {
  if (paymentType === PAYMENT_TYPES.UTILITY) {
    return {
      paymentType: PAYMENT_TYPES.UTILITY,
      submitLabel: "Pay Utilities",
      showChargeQuote: false,
      initiateEndpoint: "/tenants/utilities/payments",
      statusEndpoint: "/tenants/utilities/payments/status",
      successRoute: "RentalTracker",
      retryRoute: "MobileMoneyPayment",
      successMessage: "you will be redirected to the Home screen",
    };
  }

  return {
    paymentType: PAYMENT_TYPES.RENT,
    submitLabel: "Pay Rent",
    showChargeQuote: true,
    chargeQuoteEndpoint: "/tenants/payments/charge-quote",
    initiateEndpoint: "/tenants/payments",
    statusEndpoint: "/tenants/payments/status",
    successRoute: "RentalTracker",
    retryRoute: "MobileMoneyPayment",
    successMessage: "you will be redirected to the Rental Tracker",
  };
};
