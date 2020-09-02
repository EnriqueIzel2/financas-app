import React, { useContext, useState, useEffect } from "react";
import { Alert, TouchableOpacity, Platform } from "react-native";
import { AuthContext } from "../../contexts/auth";
import { format } from "date-fns";
import firebase from "../../services/firebaseConnection";

import Icon from "@expo/vector-icons/MaterialIcons";
import Header from "../../components/Header";
import HistoricoList from "../../components/HistoricoList";
import DatePicker from "../../components/DatePicker";
import {
  Background,
  Container,
  Name,
  Saldo,
  Title,
  Area,
  List,
} from "./styles";

const Home = () => {
  const [historico, setHistorico] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [newDate, setNewDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const { user } = useContext(AuthContext);
  const uid = user && user.uid;

  useEffect(() => {
    async function loadList() {
      await firebase
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
        .equalTo(format(newDate, "dd/MM/yyyy"))
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

            setHistorico((oldArray) => [...oldArray, list].reverse());
          });
        });
    }

    loadList();
  }, [newDate]);

  function handleDelete(data) {
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
  }

  async function handleDeleteSuccess(data) {
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

  function handleShowPicker() {
    setShowPicker(true);
  }

  function handleClose() {
    setShowPicker(false);
  }

  const onChange = (date) => {
    setShowPicker(Platform.OS === "ios");
    setNewDate(date);
  };

  return (
    <Background>
      <Header />
      <Container>
        <Name>{user && user.name}</Name>
        <Saldo>
          R$ {saldo.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")}
        </Saldo>
      </Container>

      <Area>
        <TouchableOpacity onPress={handleShowPicker}>
          <Icon name="event" color="#fff" size={30} />
        </TouchableOpacity>
        <Title>Últimas Movimentações Hoje</Title>
      </Area>

      <List
        showsVerticalScrollIndicator={false}
        data={historico}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <HistoricoList data={item} deleteItem={handleDelete} />
        )}
      />

      {showPicker && (
        <DatePicker onClose={handleClose} date={newDate} onChange={onChange} />
      )}
    </Background>
  );
};

export default Home;
