// List.js
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  Pressable,
  ScrollView,
  RefreshControl
} from "react-native";
import {useNavigation} from '@react-navigation/native';
import { getData, getAllKeys} from "../App";

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

// the filter
const Favourites = ({ setClicked, data, navigation}) => {
  const [dataToRender, setDataToRender] = useState([]);
  const [favCities, setFavCities] = useState([]);

  navigation = useNavigation();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));

    setDataToRender([]);
    getAllKeys()
      .then((resp) => {
        setFavCities(resp);
        console.log({ resp });
      })
      .finally((e) => {
        console.log({favCities});
      });
  }, []);

  useEffect(() => {
    favCities?.forEach((city) => {
      console.log({city});
      if (city !== undefined && city !== null){ 
        getData(city).then((resp) => {
          // console.log({ resp });
          if (resp !== null && resp.length !== 0) {
            // setDataToRender([...dataToRender, resp]);
            dataToRender.push(resp);
          }
        });
      }
    });
    console.log({dataToRender});
  }, [favCities]);

  return (
    <SafeAreaView style={styles.list__container}>
      <ScrollView
        onStartShouldSetResponder={() => {
          setClicked(false);
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
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

export default Favourites;

const styles = StyleSheet.create({
  list__container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#ECDBBA",
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