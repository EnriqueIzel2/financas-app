import React, { useState, useContext, useRef } from "react";
import { Platform, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { AuthContext } from "../../contexts/auth";

import {
  Background,
  Container,
  Logo,
  InputContainer,
  Input,
  SubmitButton,
  SubmitText,
  Link,
  LinkText,
} from "./styles";

const SignIn = () => {
  const input2 = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, loadingAuth } = useContext(AuthContext);
  const navigation = useNavigation();

  function handleLogin() {
    signIn(email, password);
  }

  return (
    <Background>
      <Container behavior={Platform.OS === "ios" ? "padding" : ""} enabled>
        <Logo source={require("../../assets/Logo.png")} />

        <InputContainer>
          <Input
            placeholder="Email"
            autoCorrect={false}
            autoCapitalize="none"
            value={email}
            returnKeyType="next"
            keyboardType="email-address"
            onChangeText={(text) => setEmail(text)}
            blurOnSubmit={false}
            onSubmitEditing={() => input2.current.focus()}
          />
        </InputContainer>

        <InputContainer>
          <Input
            placeholder="Senha"
            autoCorrect={false}
            autoCapitalize="none"
            value={password}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            ref={input2}
          />
        </InputContainer>

        <SubmitButton onPress={handleLogin}>
          {loadingAuth ? (
            <ActivityIndicator size={20} color="#fff" />
          ) : (
            <SubmitText>Acessar</SubmitText>
          )}
        </SubmitButton>

        <Link onPress={() => navigation.navigate("SignUp")}>
          <LinkText>Criar uma conta!</LinkText>
        </Link>
      </Container>
    </Background>
  );
};

export default SignIn;
