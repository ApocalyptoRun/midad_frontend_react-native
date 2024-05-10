import {
  PermissionsAndroid,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  useEffect,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import {AuthContext} from "../context/AuthContext";
import {SafeAreaView} from "react-native-safe-area-context";
import {COLORS, SIZES, FONTS} from "../constants/themes";
import {useNavigation} from "@react-navigation/native";
import axios from "axios";
import {BASE_URL, createConfig} from "../constants/config";
import User from "../components/User";
import Contacts from "react-native-contacts";
import Ionicons from "react-native-vector-icons/Ionicons";

const HomeScreen = () => {
  const {userToken, logout} = useContext(AuthContext);
  const navigation = useNavigation();
  const [matchedContacts, setMatchedContacts] = useState([]);
  const [phoneContacts, setPhoneContacts] = useState([]);

  useEffect(() => {
    const requestContactsPermission = async () => {
      if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
              title: "Contacts Permission",
              message: "This app needs access to your contacts.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK",
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            fetchContacts();
          } else {
            console.log("Contacts permission denied");
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    const fetchContacts = () => {
      Contacts.getAll().then(contacts => {
        try {
          const phoneNumbers = contacts.map(contact => {
            const phoneNumber = contact?.phoneNumbers[0]?.number;
            return phoneNumber;
          });

          if (phoneNumbers.length > 0) {
            const contactsWithNumbers = phoneNumbers.filter(
              number =>
                number && typeof number === "string" && number.trim() !== "",
            );

            setPhoneContacts(contactsWithNumbers);
          } else {
            console.log("No Contacts Found");
          }
        } catch (error) {
          console.log("error getting phoneNumbers", error);
        }
      });
    };

    requestContactsPermission();
  }, []);

  useEffect(() => {
    const fetchMatchedContacts = async () => {
      const postData = {
        phoneContacts: phoneContacts,
      };

      const config = createConfig(userToken);
      try {
        const response = await axios.post(
          `${BASE_URL}/user/compareContacts`,
          postData,
          config,
        );
        if (response.status === 200) {
          setMatchedContacts(response.data);
        }
      } catch (error) {
        console.error(`Error comparing contacts with backend: ${error}`);
      }
    };

    fetchMatchedContacts();
  }, [phoneContacts]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <TouchableOpacity>
            <Ionicons
              name="menu"
              size={24}
              color="white"
              style={{marginLeft: 12}}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: "white",
              marginLeft: 12,
            }}>
            Midad
          </Text>
        </View>
      ),
      headerRight: () => (
        <View
          style={{flexDirection: "row", alignItems: "center", marginRight: 12}}>
          <Ionicons name="search" size={24} color="white" />
        </View>
      ),
      headerStyle: {
        backgroundColor: "#4E73DE",
      },
    });
  }, []);

  return (
    <SafeAreaView style={{margin: 12}}>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor="#4E73DE"
        translucent={false}
      />

      {matchedContacts.map((item, index) => (
        <User key={index} item={item} navigation={navigation} />
      ))}

      <Pressable style={{marginTop: 15, alignItems: "center"}} onPress={logout}>
        <Text style={{color: COLORS.black}}>logout</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default HomeScreen;
