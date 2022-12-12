// SearchBar.js
import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, View, Keyboard, Button } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import { openWeatherKey } from "./Weather";

let url = `http://api.openweathermap.org/geo/1.0/direct`;
let mapBoxKey = `pk.eyJ1Ijoia2Fyb2xpbmE2MDYiLCJhIjoiY2xiM3Z5Mzk4MDRkNDN2cXNzOGhoZzZ1bCJ9.KT8tsfa44s4GqWUnfeu42Q`;
const SearchBar = ({clicked, searchPhrase, setSearchPhrase, setClicked, updateCities}) => {
  var [hitol1, setHitol] = useState({});

  const searchForCities = async () => {
    var response2 = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchPhrase}.json?&access_token=${mapBoxKey}`
    );

    if (!response2.ok) {
      console.error("Cannot get geo coord based on city name!");
    }else{
      const hit = await response2.json();
      console.log({response2});
      setHitol(hit.features);
    }
};


  // const searchForCity = async () => {
  //   var response = await fetch(
  //     `${url}?q=${searchPhrase}&limit=5&appid=${openWeatherKey}`
	// 	);

  //   if (!response.ok) {
  //     console.error("Cannot get geo coord based on city name!");
  //   }else{
  //     const hit = await response.json();
  //     console.log("workin");
  //     setHitol(hit.features);
  //   }
  // };

  useEffect(() => {
    console.log({hitol1});
    updateCities(hitol1);
  }, [hitol1]);

  useEffect(() => {
    searchForCities();
  }, [searchPhrase])

  return (
    <View style={styles.container}>
      <View
        style={
          clicked
            ? styles.searchBar__clicked
            : styles.searchBar__unclicked
        }
      >
        {/* search Icon */}
        <Feather
          name="search"
          size={20}
          color="black"
          style={{ marginLeft: 1 }}
        />
        {/* Input field */}
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={searchPhrase}
          onChangeText={setSearchPhrase}
          onFocus={() => {
            setClicked(true);
          }}
        />
        {/* cross Icon, depending on whether the search bar is clicked or not */}
        {clicked && (
          <Entypo name="cross" size={20} color="black" style={{ padding: 1 }} onPress={() => {
              setSearchPhrase("")
          }}/>
        )}
      </View>
      {/* cancel button, depending on whether the search bar is clicked or not */}
      {clicked && (
        <View style={styles.button}>
          <Button
            color={'#C84B31'}
            title="Cancel"
            onPress={() => {
              Keyboard.dismiss();
              setClicked(false);
            }}
          ></Button>
        </View>
      )}
    </View>
  );
};
export default SearchBar;

// styles
const styles = StyleSheet.create({
  container: {
    margin: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
  },
  searchBar__unclicked: {
    padding: 10,
    flexDirection: "row",
    width: "95%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
  },
  searchBar__clicked: {
    marginTop: 30,
    padding: 10,
    flexDirection: "row",
    width: "80%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  input: {
    fontSize: 20,
    marginLeft: 10,
    width: "90%",
  },
  button: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    // paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#C84B31',
  },
});