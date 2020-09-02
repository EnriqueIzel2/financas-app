import React, { useContext } from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { AuthContext } from "../../contexts/auth";

import { Container, Logo, WelcomeText, NameText } from "./styles";

const CustomDrawer = (props) => {
  const { user, signOut } = useContext(AuthContext);

  return (
    <DrawerContentScrollView {...props}>
      <Container>
        <Logo source={require("../../assets/Logo.png")} resizeMode="contain" />

        <WelcomeText>Bem-vindo</WelcomeText>

        <NameText>{user && user.name}</NameText>
      </Container>

      <DrawerItemList {...props} />

      <DrawerItem
        {...props}
        label="Sair"
        inactiveBackgroundColor="#c62c36"
        onPress={() => signOut()}
      />
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;
