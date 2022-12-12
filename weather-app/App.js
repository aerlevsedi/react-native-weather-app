import React from 'react';
import { StyleSheet, View } from 'react-native';
import Weather from './src/Weather.js';
import Weather2 from './src/Weather2.js';
import Favourites from './src/Favourites.js';

import {NavigationContainer} from '@react-navigation/native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Ionicons, MaterialIcons} from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";


const Tab = createBottomTabNavigator();

const weatherName = 'Weather';
const favName = 'Favourites';

const Stack = createNativeStackNavigator();
function SearchStackScreen() {
	return (
		<Stack.Navigator>
				<Stack.Screen
					name="Nav"
					component={NavBar}
					options={{ headerShown: false }}
					/>

		 		<Stack.Screen
					showLabel = 'false'
					name="Weather"
					component={Weather}
					options={{
					title: 'Weather',
					headerTitleStyle: {
						fontWeight: 'bold',
					},
					}}
				/>
				<Stack.Screen
					name="Weather2"
					component={Weather2}
					options={{
					title: 'Searched Weather',
					headerTitleStyle: {
						fontWeight: 'bold',
					},
					}}
				/>
			</Stack.Navigator>
	);
  }

  function NavBar() {
	return (
		<Tab.Navigator initialRouteName={weatherName}
        screenOptions={({route}) => ({
          headerStyle: {backgroundColor: 'white', },
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            let rn = route.name;

            if(rn === weatherName){
              iconName = focused ? 'home' : 'home-outline'
			  return <Ionicons name={iconName} size={size} color={color}/>
            } 
			else if (rn === favName){
				iconName = focused ? 'favorite' : 'favorite-outline'
				return <MaterialIcons name={iconName} size={size} color={color}/>
			}
          },
          labelStyle: { fontSize: 10},
          tabBarStyle: {
            backgroundColor:'white',
            height:60,
            paddingBottom: 10,
          },
        })}
        tabBarOptions= {{
          activeTintColor: 'black',
          inactiveTintColor: 'black',
        }}

        >
        <Tab.Screen name="Weather" component={Weather} />
        <Tab.Screen name="Favourites" component={Favourites} />
	  </Tab.Navigator>
	);
  }

export default function App() {
	return ( 
		<NavigationContainer>
			<SearchStackScreen/>
			{/* <NavBar/> */}
		</NavigationContainer>

	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export const storeData = async (value) => {
	try {
	  const jsonValue = JSON.stringify(value);
	  await AsyncStorage.setItem(value.text, jsonValue);
	} catch (e) {
	  console.error("Cannot store value")
	}
  };

  export const getData = async (key) => {
	try {
	  const jsonValue = await AsyncStorage.getItem(key);
	  return jsonValue != null ? JSON.parse(jsonValue) : null;
	} catch (e) {
	  console.error("Cannot get value")
	}
  };

  export const getAllKeys = async () => {
	let keys = [];
	try {
	  keys = await AsyncStorage.getAllKeys();
	  console.log({ keys });
	  return keys;
	} catch (e) {
	  console.error("Cannot get keys")
	}
  };

  export const removeValue = async (key) => {
	try {
	  await AsyncStorage.removeItem(key);
	} catch (e) {
	  console.error("Cannot remove value")
	}

	console.log("Done.");
  };
