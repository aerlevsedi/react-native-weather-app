import React from 'react';
import { StyleSheet, View } from 'react-native';
import LocalWeather from './src/index.js';
import Weather from './src/index2.js';
import Weather2 from './src/Weather2.js';

import {NavigationContainer} from '@react-navigation/native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Ionicons, MaterialIcons} from '@expo/vector-icons'

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const localName = 'Local Weather';
const searchName = 'Search Weather';
const favName = 'Favorites';

export default function App() {
	return (
		// <View style={styles.container}>
		// 	<Weather />
		// </View>

		// <NavigationContainer>
		// 	<Stack.Navigator>
		// 		<Stack.Screen
		// 			name="Weather"
		// 			component={Weather}
		// 			options={{
		// 			title: 'Weather',
		// 			headerTitleStyle: {
		// 				fontWeight: 'bold',
		// 			},
		// 			}}
		// 		/>
		// 		<Stack.Screen
		// 			name="Weather2"
		// 			component={Weather2}
		// 			options={{
		// 			title: 'Searched Weather',
		// 			headerTitleStyle: {
		// 				fontWeight: 'bold',
		// 			},
		// 			}}
		// 		/>
		// 	</Stack.Navigator>
		// </NavigationContainer>

		<NavigationContainer>
			<Tab.Navigator initialRouteName={localName}
        screenOptions={({route}) => ({
          headerStyle: {backgroundColor: 'white', },
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            let rn = route.name;

            if(rn === localName){
              iconName = focused ? 'home' : 'home-outline'
			  return <Ionicons name={iconName} size={size} color={color}/>
            } else if (rn === searchName){
				iconName = focused ? 'search' : 'search-outline'
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
        <Tab.Screen name="Local Weather" component={LocalWeather} />
		<Tab.Screen name="Search Weather" component={Weather} />
        <Tab.Screen name="Favorites" component={Weather} />
      </Tab.Navigator>
		</NavigationContainer>

	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
