// List.js
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  Touchable,
  Button,
  Pressable,
} from "react-native";
import {useNavigation} from '@react-navigation/native';
import { ScrollView } from "react-native";

// the filter
const List = ({ searchPhrase, setClicked, data, navigation }) => {

    const [choosen, setChoosen] = useState([]);
    const [dataToRender, setDataToRender] = useState([]);

    navigation = useNavigation();

  useEffect(() => {
    console.log({choosen});
  }, [choosen]);

  useEffect(() => {
    console.log({data});
    setDataToRender(data);
  }, [data]);

  useEffect(() => {
    console.log({dataToRender});
  }, [dataToRender]);

  return (
    <SafeAreaView style={styles.list__container}>
      <ScrollView
        onStartShouldSetResponder={() => {
          setClicked(false);
        }}
      >
        {dataToRender?.map((item) => {
            return  <Pressable style={styles.item} 
                        onPress={() =>
                        navigation.navigate('Weather2', {
                        city: item,
                    })}>
                        <Text style={styles.title}>{item.text}</Text>
                        <Text>{item.place_name}</Text>
                    </Pressable>
        })}

      </ScrollView>
    </SafeAreaView>
  );
};

export default List;

const styles = StyleSheet.create({
  list__container: {
    margin: 10,
    height: "85%",
    width: "100%",
  },
  item: {
    margin: 30,
    borderBottomWidth: 2,
    borderBottomColor: "lightgrey"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    fontStyle: "italic",
  },
});