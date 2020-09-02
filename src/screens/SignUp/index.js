import React, { useState, useContext, useRef } from "react";
import { Platform, ActivityIndicator } from "react-native";

import { AuthContext } from "../../contexts/auth";

import {
  Background,
  Container,
  InputContainer,
  Input,
  SubmitButton,
  SubmitText,
} from "../SignIn/styles";

const SignUp = () => {
  const input2 = useRef();
  const input3 = useRef();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signUp, loadingAuth } = useContext(AuthContext);

  function handleSignUp() {
    signUp(email, password, name);
  }

  return (
    <Background>
      <Container behavior={Platform.OS === "ios" ? "padding" : ""} enabled>
        <InputContainer>
          <Input
            placeholder="Nome"
            autoCorrect={false}
            autoCapitalize="none"
            value={name}
            returnKeyType="next"
            onChangeText={(text) => setName(text)}
            blurOnSubmit={false}
            onSubmitEditing={() => input2.current.focus()}
          />
        </InputContainer>

        <InputContainer>
          <Input
            placeholder="Email"
            autoCorrect={false}
            autoCapitalize="none"
            value={email}
            returnKeyType="next"
            onChangeText={(text) => setEmail(text)}
            ref={input2}
            blurOnSubmit={false}
            onSubmitEditing={() => input3.current.focus()}
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
            ref={input3}
          />
        </InputContainer>

        <SubmitButton onPress={handleSignUp}>
          {loadingAuth ? (
            <ActivityIndicator size={20} color="#fff" />
          ) : (
            <SubmitText>Cadastrar</SubmitText>
          )}
        </SubmitButton>
      </Container>
    </Background>
  );
};

export default SignUp;
