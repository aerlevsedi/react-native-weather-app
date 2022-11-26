import {
	View,
	Text,
	Alert,
	SafeAreaView,
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	RefreshControl,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';

const openWeatherKey = '0f9e4326196f24163f84592ae32807b1';
let url =
	'http://api.openweathermap.org/data/2.5/onecall?&units=metric&exclude=minutely&appid=${openWeatherKey}';

const Weather = () => {
	const [forecast, setForecast] = useState(null);
	const [refreshing, setRefreshing] = useState(false);

	const loadForecast = async () => {
		setRefreshing(true);

		const { status } = await Location.requestPermissionsAsync();

		console.log('Here 1');

		if (status !== 'granted') {
			Alert.alert('Permission to access location was denied.');
		}

		console.log('Here 2');

		let location = await Location.getCurrentPositionAsync({
			enableHighAccuracy: true,
		});

		console.log(location);

		console.log('Here 3');

		const response = await fetch(
			url +
				'&lat=' +
				location.coords.latitude +
				'&lon=' +
				location.coords.longitude
		);

		console.log('Here 4');

		const data = await response.json();
		console.log('Here 5');

		if (!response.ok) {
			console.log(response);
			Alert.alert('Error', 'Something went wrong');
		} else {
			setForecast(data);
		}
		console.log('Here 6');
		setRefreshing(false);
	};

	useEffect(() => {
		loadForecast();
	}, []);

	if (!forecast) {
		return (
			<SafeAreaView style={styles.loading}>
				<Text style={{ textAlign: 'center' }}>Loading</Text>
				<ActivityIndicator size='large' />
			</SafeAreaView>
		);
	}

	const current = forecast.current.weather[0];

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={() => loadForecast()}
					/>
				}
			>
				<Text style={styles.title}>Current Weather</Text>

				<Text style={{ alignItems: 'center', textAlign: 'center' }}>
					Your Location
				</Text>
				<View style={styles.current}>
					<Image
						style={styles.largeIcon}
						source={{
							uri: 'http://openweathermap.org/img/wn/${current.icon}@4x.png',
						}}
					/>
					<Text style={styles.currentTemp}>
						{Math.round(forecast.current.temp)}
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Weather;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ECDBBA',
	},
	title: {
		textAlign: 'center',
		fontSize: 36,
		fontWeight: 'bold',
		color: '#C84B31',
	},
	curren: {
		flexDirection: 'row',
		alignItems: 'center',
		alignContent: 'center',
	},
	largeIcon: {
		width: 300,
		height: 250,
	},
	currentTemp: {
		fontSize: 32,
		fontWeight: 'bold',
		textAlign: 'center',
	},
});
