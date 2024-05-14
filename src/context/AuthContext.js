import {StyleSheet} from "react-native";
import React, {createContext, useEffect, useState} from "react";
import {BASE_URL, createConfig} from "../constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callingCode, setCallingCode] = useState("216");
  const [isFirstAuth, setIsFirstAuth] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/auth/signin`, {
        phoneNumber: callingCode + "" + phoneNumber,
      });
      console.log(response.data);
      setUserToken(response.data.accessToken);

      await AsyncStorage.setItem("userToken", response.data.accessToken);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log(error.response.data);
      } else {
        console.log(error);
      }
    }

    setIsLoading(false);
  };

  const logout = async () => {
    setUserToken(null);
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("existingUser");
    setIsLoading(false);
  };

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        setIsLoading(true);
        if (!userToken) {
          let fetchedUserToken = await AsyncStorage.getItem("userToken");
          setUserToken(fetchedUserToken);
        }

        setIsLoading(false);
      } catch (error) {
        console.log(`is LoggedIn Error : ${error}`);
      }
    };

    isLoggedIn();
    checkExistingUser();
  }, []);

  useEffect(() => {
    const authenticateToken = async () => {
      if (userToken) {
        const config = createConfig(userToken);

        try {
          const response = await axios.get(
            `${BASE_URL}/auth/authenticateToken`,
            config,
          );
          if (response) {
            setUserId(response.data.id);
          }
        } catch (error) {
          console.log(`Error authenticating token ${error}`);
        }
      }
    };

    authenticateToken();
  }, [userToken]);

  const checkExistingUser = async () => {
    try {
      const existingUser = await AsyncStorage.getItem("existingUser");
      setIsFirstAuth(!existingUser);
      setIsAuthenticated(existingUser === "true");
    } catch (error) {
      console.error("Error reading authentication status:", error);
    }
  };

  const setAuthStatus = async status => {
    setIsAuthenticated(status);
    await AsyncStorage.setItem("isAuthenticated", status.toString());
    if (status) {
      console.log("status", status);
      await AsyncStorage.setItem("existingUser", JSON.stringify(status));
    } else {
      await AsyncStorage.removeItem("existingUser");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        phoneNumber,
        setPhoneNumber,
        isLoading,
        setIsLoading,
        userToken,
        setUserToken,
        callingCode,
        setCallingCode,
        login,
        logout,
        userId,
        checkExistingUser,
        isFirstAuth,
        setIsFirstAuth,
        setAuthStatus,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({});
