import React from 'react';
import { StyleSheet, View } from 'react-native';
import Weather from './src/index.js';

export default function App() {
	return (
		<View style={styles.container}>
			<Weather />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
