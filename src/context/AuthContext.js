import { StyleSheet } from "react-native";
import React, { createContext, useEffect, useState} from "react";
import { BASE_URL, createConfig } from "../constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstAuth, setIsFirstAuth] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callingCode, setCallingCode] = useState("216");

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
    setIsLoading(false);
  };

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        setIsLoading(true);
        if (!userToken) {
          let userToken = await AsyncStorage.getItem("userToken");
          setUserToken(userToken);
        }

        setIsLoading(false);
      } catch (error) {
        console.log(`is LoggedIn Error : ${error}`);
      }
    };

    isLoggedIn();
  }, []);

  useEffect(() => {
    const authenticateToken = async () => {
      if (userToken) {
        const config = createConfig(userToken);

        try {
          const response = await axios.get(
            `${BASE_URL}/auth/authenticateToken`,
            config
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

  return (
    <AuthContext.Provider
      value={{
        phoneNumber,
        setPhoneNumber,
        isLoading,
        userToken,
        setUserToken,
        callingCode,
        setCallingCode,
        isFirstAuth,
        setIsFirstAuth,
        login,
        logout,
        userId,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({});
