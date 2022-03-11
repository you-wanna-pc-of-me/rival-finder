import React, { FC, useState, useEffect } from "react";
import { View, Alert, Platform, Pressable } from "react-native";
import { auth }from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
// import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from "firebase/compat/app";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/index";
import {
  Container,
  LoginText,
  Login,
  Input,
  StyledButton,
  StyledButtonText,
  RegisterBtn,
} from "../components/Stylesheet";



type signInStack = NativeStackNavigationProp<RootStackParamList, "LogIn">;

const LogIn: FC = ({}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [user, loading, error] = useAuthState(auth);


  const navigation = useNavigation<signInStack>();

  // useEffect(() => {
  //   if (user !== null) {
  //     navigation.navigate("HomePage");
  //   }
  // });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("HomePage");
      }
    });
    return unsubscribe;
  }, []);

  function handleLogin() {
    // try {
      email.replace(/\s/g, "");
      password.replace(/\s/g, "");
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => signInWithEmailAndPassword(auth, email, password)).catch((error) => console.log(error));
    //   const userCredential = await signInWithEmailAndPassword(
    //     auth,
    //     email,
    //     password
    //   );
    //   const user = userCredential.user;
    // } catch (error: any) {
    //   Alert.alert(error.message);
    // }
  }

  return (
    <Container {...(Platform.OS === "ios" ? { behavior: "padding" } : null)}>
      <View>
        <Login>
          <LoginText>Get Ready!</LoginText>
          <Input
            autoCapitalize="none"
            keyboardType="email-address"
            clearButtonMode="while-editing"
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          ></Input>
          <Input
            clearButtonMode="while-editing"
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          ></Input>
          <StyledButton onPress={handleLogin}>
            <StyledButtonText>Login</StyledButtonText>
          </StyledButton>
          <Pressable
            onPress={() => {
              navigation.navigate("SignUp");
            }}
          >
            <RegisterBtn>No Account? Register here.</RegisterBtn>
          </Pressable>
        </Login>
      </View>
    </Container>
  );
};

export default LogIn;
