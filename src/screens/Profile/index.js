import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../contexts/auth";
import Header from "../../components/Header";
import {
  Container,
  Name,
  LinkButton,
  LinkText,
  Logout,
  LogoutText,
} from "./styles";

const Profile = () => {
  const { user, signOut } = useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <Container>
      <Header />

      <Name>{user && user.name}</Name>

      <LinkButton onPress={() => navigation.navigate("Registrar")}>
        <LinkText>Registrar Gastos</LinkText>
      </LinkButton>

      <Logout onPress={() => signOut()}>
        <LogoutText>Sair</LogoutText>
      </Logout>
    </Container>
  );
};

export default Profile;
