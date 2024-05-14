import {
  Alert,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {useContext, useEffect, useRef, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {COLORS, FONTS, SIZES} from "../constants/themes";
import {OtpInput} from "react-native-otp-entry";
import images from "../constants/images";
import Button from "../components/Button";
import axios from "axios";
import {AuthContext} from "../context/AuthContext";
import {BASE_URL} from "../constants/config";
import {getHash, startOtpListener} from "react-native-otp-verify";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const {login} = useContext(AuthContext);
  const otpInputRef = useRef(null);

  useEffect(() => {
    getHash()
      .then(hash => {console.log(hash)})
      .catch(console.log);

    startOtpListener(message => {
      Keyboard.dismiss();
      const match = /(\d{4})/g.exec(message);
      const otp = match ? match[1] : null;
      setOtp(otp);
      setOtpValue(otp);
    });
  }, []);

  const sendOTP = () => {
    const postData = {
      OTP: otp,
    };

    axios
      .post(`${BASE_URL}/auth/verifyOTP`, postData)
      .then(response => {
        console.log(response?.data);

        login();
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          console.log(error.response.data);
          Alert.alert(error.response.data.msg);
        } else {
          console.log(error);
        }
      });
  };

  const resendCode = () => {};

  const setOtpValue = value => {
    if (value !== null) {
      otpInputRef.current?.setValue(value);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
          padding: 16,
          alignItems: "centerw",
        }}>
        <Image
          source={images.verificationLogin}
          resizeMode="contain"
          style={{
            width: SIZES.width * 0.8,
            height: SIZES.height * 0.3,
            marginBottom: 16,
          }}
        />

        <Text style={{...FONTS.h2, marginVertical: 12, textAlign: "center"}}>
          Enter Verification Code
        </Text>
        <Text style={{...FONTS.h4, textAlign: "center", color: "black"}}>
          Please enter the verification code we send {"\n"} to your phone number
        </Text>
        <View
          style={{
            marginVertical: 22,
            width: SIZES.width - 72,
          }}>
          <OtpInput
            ref={otpInputRef}
            numberOfDigits={4}
            focusColor="#4E73DE"
            focusStickBlinkingDuration={400}
            onFilled={() => sendOTP()}
            // onFilled={(text) => setOtp(text)}
            // onTextChange={(text) => setOtp(text)}
            theme={{
              pinCodeContainerStyle: {
                backgroundColor: COLORS.white,
                width: 58,
                height: 58,
                borderRadius: 12,
              },
              pinCodeTextStyle: {
                color: COLORS.black,
              },
            }}
          />
        </View>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}>
          <Text style={{color: "black"}}>Don't receive the code ? </Text>
          <TouchableOpacity onPress={resendCode}>
            <Text style={{color: "#4E73DE"}}>Resend Code</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* <Button title="OKEY" style={{ marginVertical: 25 }} onPress={sendOTP} /> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default OTPVerification;
