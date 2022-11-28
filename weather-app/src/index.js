import {
	View,
	Text,
	Alert,
	SafeAreaView,
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	RefreshControl,
	Image,
	Dimensions,
	FlatList
} from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';

const openWeatherKey = `86e4219117302e99c1870693b5d46e19`;
let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${openWeatherKey}`;
let url5days = `https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=${openWeatherKey}`;


const Weather = () => {
	const [forecast, setForecast] = useState(null);
	const [forecast5days, setForecast5days] = useState(null);
	const [refreshing, setRefreshing] = useState(false);
	const [apiResponse, setApiResponse] = useState(null);

	const loadForecast = async () => {
		setRefreshing(true);

		const { status } = await Location.requestForegroundPermissionsAsync();

		if (status !== 'granted') {
			Alert.alert('Permission to access location was denied.');
		}

		let location = await Location.getCurrentPositionAsync({
			enableHighAccuracy: true,
		});

		console.log('LOCATION: ' + JSON.stringify(location));

		const response = await fetch(
			`${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`
		);

		const response5days = await fetch(
			`${url5days}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`
		);

		const data = await response.json();
		const data5days = await response5days.json();
		const k = data5days.list[0].weather;

		console.log('RESPONSE: ' + JSON.stringify(data));
		console.log({data5days});
		setApiResponse(response);

		if (!response.ok) {
			console.log(response);
			Alert.alert('Error', 'Something went wrong');
		} else {
			setForecast(data);
		}

		if (!response5days.ok) {
			console.log(response5days);
			Alert.alert('Error', 'Something went wrong');
		} else {
			setForecast5days(data5days);
		}
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

	console.log('FORECAST: ' + JSON.stringify(forecast));

	const current = forecast.weather[0];

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
					Your Location: {forecast.name}
				</Text>
				<View style={styles.current}>
					<Image
						style={styles.largeIcon}
						source={{
							uri: `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@4x.png`,
						}}
					/>
					<Text style={styles.currentTemp}>
						Temperature: {Math.round(forecast.main.temp)} &#8451;
					</Text>
				</View>

				<Text style={styles.currentDescription}>
					{current.description}
				</Text>

				<View style={styles.extraInfo}>
					<View style={styles.info}>
						{/* <Image
							source={require('../assets/temp.png')}
							style={{width:40, height:40, borderRadius:40/2, marginLeft:50}}
							/> */}
							<Text style={styles.text}>
								{forecast.main.feels_like} &#8451;
							</Text>
							<Text style={styles.text}>
								Feels Like
							</Text>
					</View>
					
					<View style={styles.info}>
						{/* <Image
							source={require('../assets/temp.png')}
							style={{width:40, height:40, borderRadius:40/2, marginLeft:50}}
							/> */}
							<Text style={styles.text}>
								{forecast.main.humidity} %
							</Text>
							<Text style={styles.text}>
								Humidity
							</Text>
					</View>
				</View>

				<View>
					<Text style={styles.subtitle}>Hourly Forecast</Text>
				</View>

				<FlatList
					horizontal
					data={forecast5days?.list}
					keyExtractor={(item, index) => index.toString()}
					renderItem={(day) => {
						const weather = day.item.weather[0];
						var dt = new Date(day.item.dt * 1000);
						return (
							<View style={styles.hours}>
								<Text style={{fontWeight:'bold', color:'#346751'}}>
									{dt.toISOString().split('T')[0]}
								</Text>
								<Text style={{fontWeight:'bold', color:'#346751'}}>
									{dt.toISOString().split('T')[1].replace(':00.000Z', '')}
								</Text>
								<Text style={{fontWeight:'bold', color:'#346751'}}>
									{Math.round(day.item.main.temp)} &#8451;
								</Text>
								<Image
								style={styles.smallIcon}
								source={{
									uri: `http://openweathermap.org/img/wn/${weather.icon}@4x.png`
								}}
								/>
								<Text style={{fontWeight:'bold', color:'#346751'}}>
									{weather.description}
								</Text>
							</View>
						)
					}}
				/>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Weather;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ECDBBA',
		paddingTop: 40
	},
	title: {
		textAlign: 'center',
		fontSize: 36,
		fontWeight: 'bold',
		color: '#C84B31',
	},
	current: {
		flexDirection: 'column',
		alignItems: 'center',
		alignContent: 'center',
	},
	largeIcon: {
		width: 300,
		height: 200,
	},
	currentTemp: {
		fontSize: 32,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	currentDescription: {
		width:'100%',
		textAlign:'center',
		fontWeight:'200',
		fontSize:24,
		marginBottom:5
	},
	info:{
		width: Dimensions.get('screen').width/2.5,
		backgroundColor:'rgba(0,0,0,0.5)',
		padding:10,
		borderRadius:15,
		justifyContent:'center'
	},
	extraInfo:{
		flexDirection:'row',
		marginTop:20,
		justifyContent:'space-between',
		padding:10
	},
	text:{
		fontSize:20,
		color:'#fff',
		textAlign:'center',
	},
	subtitle:{
		textAlign:'center',
		fontSize:24,
		marginVertical:12,
		color:'#C84B31',
		fontWeight:'bold'
	},
	hours:{
		padding: 6,
		alignItems: 'center'
	},
	smallIcon:{
		width:100,
		height:100
	}
});
