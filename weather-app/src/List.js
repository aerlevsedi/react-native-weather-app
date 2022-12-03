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

// definition of the Item, which will be rendered in the FlatList
const Item = ({ text, place_name }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{text}</Text>
    <Text style={styles.details}>{place_name}</Text>
  </View>
);

// the filter
const List = ({ searchPhrase, setClicked, data, navigation }) => {

    const [choosen, setChoosen] = useState([]);
    const [dataToRender, setDataToRender] = useState([]);

    navigation = useNavigation();

    const renderItem = ({ item }) => {
    console.log({item});
    // when no input, show all
    // if (searchPhrase === "") {
    //   return <Item text={item.text} details={item.place_name} onClick={e => {setChoosen(e)}} />;
    // }
    // // filter of the name
    // if (item.text.toUpperCase().includes(searchPhrase.toUpperCase().trim().replace(/\s/g, ""))) {
    //   return <Item text={item.text} details={item.place_name} onClick={e => {setChoosen(e)}} />;
    // }
    // // filter of the description
    // if (item.place_name.toUpperCase().includes(searchPhrase.toUpperCase().trim().replace(/\s/g, ""))) {
    //   return <Item text={item.text} details={item.place_name} onClick={e => {setChoosen(e)}} />;
    // }
  };

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
      <View
        onStartShouldSetResponder={() => {
          setClicked(false);
        }}
      >
        {/* <Text>hello</Text> */}
        {/* <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        /> */}
        {dataToRender?.map((item) => {
            // return renderItem(item);
            return  <Pressable style={styles.item} 
                        onPress={() =>
                        navigation.navigate('Weather2', {
                        city: item,
                    })}>
                        <Text style={styles.title}>{item.text}</Text>
                        <Text>{item.place_name}</Text>
                    </Pressable>
            
            // return <Text>{item.text}</Text>
            // return 
        })}

      </View>
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