import React, { useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { AuthContext } from "../../contexts/auth";
import { format, isBefore } from "date-fns";
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
        .equalTo(format(new Date(), "dd/MM/yyyy"))
        .limitToLast(10)
        .on("value", (snapshot) => {
          setHistorico([]);

          snapshot.forEach((childItem) => {
            const list = {
              key: childItem.key,
              tipo: childItem.val().tipo,
              valor: childItem.val().valor,
              date: childItem.val().date,
            };

            setHistorico((oldArray) => [...oldArray, list]);
          });
        });
    }

    loadList();
  }, []);

  function handleDelete(data) {
    const [diaItem, mesItem, anoItem] = data.date.split("/");
    const dateItem = new Date(`${anoItem}/${mesItem}/${diaItem}`);

    const formatDataHoje = format(new Date(), "dd/MM/yyyy");
    const [diaHoje, mesHoje, anoHoje] = formatDataHoje.split("/");
    const dateHoje = new Date(`${anoHoje}/${mesHoje}/${diaHoje}`);

    if (isBefore(dateItem, dateHoje)) {
      alert("Você não pode excluir um registro antigo");
      return;
    }

    Alert.alert(
      "Cuidado, Atenção",
      `Você deseja excluir ${data.tipo} - Valor: ${data.valor}`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Continuar",
          onPress: () => handleDeleteSuccess(data),
        },
      ]
    );

    async function handleDeleteSuccess() {
      await firebase
        .database()
        .ref("historico")
        .child(uid)
        .child(data.key)
        .remove()
        .then(async () => {
          let saldoAtual = saldo;

          data.tipo === "despesa"
            ? (saldoAtual += parseFloat(data.valor))
            : (saldoAtual -= parseFloat(data.valor));

          await firebase
            .database()
            .ref("users")
            .child(uid)
            .child("saldo")
            .set(saldoAtual);
        })
        .catch((error) => {
          console.log("Erro ao excluir: ", error);
        });
    }
  }

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
        renderItem={({ item }) => (
          <HistoricoList data={item} deleteItem={handleDelete} />
        )}
      />
    </Background>
  );
};

export default Home;
