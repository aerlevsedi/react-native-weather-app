import React from 'react';
import { StyleSheet, View } from 'react-native';
import Weather from './src/index.js';
import Weather2 from './src/Weather2.js';

import {NavigationContainer} from '@react-navigation/native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		// <View style={styles.container}>
		// 	<Weather />
		// </View>

		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
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
		</NavigationContainer>

	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
