import AsyncStorage from "@react-native-async-storage/async-storage";
import createDataContext from "./createDataContext";
import backendApi from "../api/backend";

const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "signin":
      return { errorMessage: "", token: action.payload };
    case "clear_error_message":
      return { ...state, errorMessage: "" };
    case "signout":
      return { token: null, errorMessage: "" };
    default:
      return state;
  }
};

const tryLocalSignin = (dispatch) => async () => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    dispatch({ type: "signin", payload: token });
    navigate("RentalTracker");
  } else {
    navigate("Signup");
  }
};

const isSignedIn = () => {
  const token = state.token;
  if (token) {
    return true
  } else {
    return false
  }
};

const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: "clear_error_message" });
};

const signup =
  (dispatch) =>
  async ({ email, password, firstname, lastname, phonenumber }) => {
    try {
      const response = await backendApi.post("/accounts/users", { "email":email, "password":password, "first_name": firstname, "last_name":lastname, "phone_number":phonenumber });
      // await AsyncStorage.setItem("token", response.data.token);
      console.log(response)

      navigate("Signin");
    } catch (err) {
      dispatch({
        type: "add_error",
        payload: "Something went wrong with sign up",
      });
    }
  };

const signin =
  (dispatch) =>
  async ({ email, password, navigation }) => {
    try {
      const response = await backendApi.post("/accounts/authenticate", { "username": email, "password": password });
      await AsyncStorage.setItem("token", response.data.data.token.token);
      dispatch({ type: "signin", payload: response.data.data.token.token });
      navigation.navigate("MyTabs", {screen: "HomeScreen"});
    } catch (err) {
      console.log(err)
      dispatch({
        type: "add_error",
        payload: "Something went wrong with sign in",
      });
    }
  };

const signout = (dispatch) => async () => {
  await AsyncStorage.removeItem("token");
  dispatch({ type: "signout" });
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signout, signup, clearErrorMessage, tryLocalSignin, isSignedIn },
  { token: null, errorMessage: "" }
);