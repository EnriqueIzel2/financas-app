import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/auth";
import { format } from "date-fns";
import firebase from "../../services/firebaseConnection";

import Header from "../../components/Header";
import HistoricoList from "../../components/HistoricoList";
import { Background, Container, Name, Saldo, Title, List } from "./styles";

const Home = () => {
  const [historico, setHistorico] = useState([]);
  const [saldo, setSaldo] = useState(0);

  const { user } = useContext(AuthContext);
  const uid = user && user.uid;

  useEffect(() => {
    async function loadList() {
      firebase
        .database()
        .ref("users")
        .child(uid)
        .on("value", (snapshot) => {
          setSaldo(snapshot.val().saldo);
        });

      await firebase
        .database()
        .ref("historico")
        .child(uid)
        .orderByChild("date")
        .equalTo(format(new Date(), "dd/MM/yy"))
        .limitToLast(10)
        .on("value", (snapshot) => {
          setHistorico([]);

          snapshot.forEach((childItem) => {
            const list = {
              key: childItem.key,
              tipo: childItem.val().tipo,
              valor: childItem.val().valor,
            };

            setHistorico((oldArray) => [...oldArray, list]);
          });
        });
    }

    loadList();
  }, []);

  return (
    <Background>
      <Header />
      <Container>
        <Name>{user && user.name}</Name>
        <Saldo>
          R$ {saldo.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
        </Saldo>
      </Container>

      <Title>Últimas Movimentações Hoje</Title>

      <List
        showsVerticalScrollIndicator={false}
        data={historico}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => <HistoricoList data={item} />}
      />
    </Background>
  );
};

export default Home;
