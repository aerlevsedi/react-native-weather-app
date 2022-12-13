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
	FlatList,
	Pressable
} from 'react-native';
import SearchBar from './SearchBar';
import List from './List';

import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import {NavigationHelpersContext, useNavigation} from '@react-navigation/native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

export const openWeatherKey = `01eb218c1c36ecb20bfce9572410dffb`;
export let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${openWeatherKey}`;
export let url5days = `https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=${openWeatherKey}`;

const Weather = (navigation) => {
	const [forecast, setForecast] = useState(null);
	const [forecast5DaysDivided, setForecast5DaysDivided] = useState(null);
	const [refreshing, setRefreshing] = useState(false);
	const [apiResponse, setApiResponse] = useState(null);
	const [gpsGranted, setGpsGranted] = useState(false);
	const [gpsConnection, setGpsConnection] = useState(false);
	const weekDays = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];

	function getDayOfWeek(date) {
		var day = date.getDay();
		if (day == new Date().getDay()) return 'Today';
		else return weekDays[day];
	}

	const [searchPhrase, setSearchPhrase] = useState('');
	const [clicked, setClicked] = useState(false);
	const [cities, setCities] = useState();
	const [favCities, setFavCities] = useState([]);

	navigation = useNavigation();

	const updateCities = (value) => {
		setCities(value);
	};

	const onLocationPressed = () => {
		if (Platform.OS === 'android') {
		  RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
		  .then(data => {
			alert(data);
		  }).catch(err => {
			// The user has not accepted to enable the location services or something went wrong during the process
			// "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
			// codes : 
			//  - ERR00 : The user has clicked on Cancel button in the popup
			//  - ERR01 : If the Settings change are unavailable
			//  - ERR02 : If the popup has failed to open
			alert("Error " + err.message + ", Code : " + err.code);
		  });
		}
	}

	const setMainLocalization = async (latitudeMain, longitudeMain) => {
		const response = await fetch(
			`${url}&lat=${latitudeMain}&lon=${longitudeMain}`
		);

		const response5days = await fetch(
			`${url5days}&lat=${latitudeMain}&lon=${longitudeMain}`
		);

		
		const data = await response.json();
		const data5days = await response5days.json();


		console.log('RESPONSE: ' + JSON.stringify(data));
		console.log({ data5days });
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
			let days = Array(6);
			for (var i = 0; i < days.length; i++) {
				days[i] = new Array(0);
			}

			days[0].push(data5days.list[0]);
			let dayNumber = 0;

			for (let i = 1; i < data5days.list.length; i++) {
				if (
					data5days.list[i].dt_txt.split(' ')[0] !=
					data5days.list[i - 1].dt_txt.split(' ')[0]
				) {
					dayNumber += 1;
				}

				days[dayNumber].push(data5days.list[i]);
			}

			setForecast5DaysDivided(days);
		}
	}

	const loadForecast = async () => {
		setRefreshing(true);
		let location = null;

		console.log('tutaj!!');
		console.log({favCities});
		const { status } = await Location.requestForegroundPermissionsAsync();

		if (status !== 'granted') {
			Alert.alert('Permission to access location was denied.');
		}

		setGpsGranted(status === 'granted');

		let gpsIsEnabled = await Location.hasServicesEnabledAsync();
		console.log(gpsIsEnabled);
		
		if(gpsIsEnabled !== false){

			console.log("There is  connection!!!!");
			setGpsConnection(true);
			location = await Location.getCurrentPositionAsync({
				enableHighAccuracy: true,
			});
	
			console.log('LOCATION: ' + JSON.stringify(location));
			setMainLocalization(location.coords.latitude, location.coords.longitude);

		}else{

			console.log("There is no connection!!!!");
			setGpsConnection(false);

			//Default Wroclaw
			setMainLocalization(51.1079, 17.0385);
			navigation.navigate('Favourites');
		}

		setRefreshing(false);
	};

	useEffect(() => {
		loadForecast();
	}, []);


	if (!gpsGranted && !forecast) {
		return (
			<SafeAreaView >
				<Text style={{ textAlign: 'center' }}>Nothing to show here without GPS on!</Text>
				{/* <ActivityIndicator size='large' /> */}
			</SafeAreaView>
		);
	}
	else if (!forecast) {
		return (
			<SafeAreaView style={styles.loading}>
				<Text style={{ textAlign: 'center' }}>Loading</Text>
				<ActivityIndicator size='large' />
			</SafeAreaView>
		);
	}

	console.log('FORECAST: ' + JSON.stringify(forecast));

	const current = forecast.weather[0];

	if(!gpsConnection){
		return(
			<SafeAreaView style={styles.container}>
			<SafeAreaView style={styles.root}>
				{!clicked}
				<SearchBar
					searchPhrase={searchPhrase}
					setSearchPhrase={setSearchPhrase}
					clicked={clicked}
					setClicked={setClicked}
					updateCities={updateCities}
				/>

				{clicked && (
					<List
						searchPhrase={searchPhrase}
						data={cities}
						setClicked={setClicked}
					/>
				)}
			</SafeAreaView>

			<ScrollView
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={() => loadForecast()}
						/>
					}
				>
			<View style={styles.gpsMassage}>
				<Text style={styles.titleGPS}>No connection to GPS</Text>
				<Text style={styles.text}>Sorry, but we weren't able to get your location. 
				If you want to use this function of our app, you must eneble your location.</Text>
				<Pressable style={styles.buttonGPS}  onPress={() =>
                        onLocationPressed()}><Text style={styles.textButtonGPS}>Press to enable GPS</Text></Pressable>
			</View>
			</ScrollView>
		</SafeAreaView>
	
		);
	}else {
		return (
			<SafeAreaView style={styles.container}>
				<SafeAreaView style={styles.root}>
					{!clicked}
					<SearchBar
						searchPhrase={searchPhrase}
						setSearchPhrase={setSearchPhrase}
						clicked={clicked}
						setClicked={setClicked}
						updateCities={updateCities}
					/>
	
					{clicked && (
						<List
							searchPhrase={searchPhrase}
							data={cities}
							setClicked={setClicked}
						/>
					)}
				</SafeAreaView>
	
				<ScrollView
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={() => loadForecast()}
						/>
					}
				>
					<Text style={styles.title}>Current Weather</Text>
	
					<Text style={styles.text}>Your Location: {forecast.name}</Text>
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
	
					<Text style={styles.currentDescription}>{current.description}</Text>
	
					<View style={styles.extraInfo}>
						<View style={styles.info}>
							{/* <Image
								source={require('../assets/temp.png')}
								style={{width:40, height:40, borderRadius:40/2, marginLeft:50}}
								/> */}
							<Text style={styles.text}>{forecast.main.feels_like} &#8451;</Text>
							<Text style={styles.text}>Feels Like</Text>
						</View>
	
						<View style={styles.info}>
							{/* <Image
								source={require('../assets/temp.png')}
								style={{width:40, height:40, borderRadius:40/2, marginLeft:50}}
								/> */}
							<Text style={styles.text}>{forecast.main.humidity} %</Text>
							<Text style={styles.text}>Humidity</Text>
						</View>
					</View>
	
					<View>
						<Text style={styles.subtitle}>Hourly Forecast</Text>
					</View>
	
					{forecast5DaysDivided?.map((days, index) => {
						return (
							<View style={styles.dayContainer}>
								<Text style={styles.text}>
									{getDayOfWeek(new Date(days[0].dt_txt.split(' ')[0]))}
								</Text>
								<FlatList
									horizontal
									data={days}
									keyExtractor={(item, index) => index.toString()}
									persistentScrollbar={true}
									renderItem={(day) => {
										const weather = day.item.weather[0];
										var dt = new Date(day.item.dt * 1000);
										return (
											<View style={styles.hours}>
												<Text style={{ fontWeight: 'bold', color: '#346751' }}>
													{dt.toISOString().split('T')[1].replace(':00.000Z', '')}
												</Text>
												<Text style={{ fontWeight: 'bold', color: '#346751' }}>
													{Math.round(day.item.main.temp)} &#8451;
												</Text>
												<Image
													style={styles.smallIcon}
													source={{
														uri: `http://openweathermap.org/img/wn/${weather.icon}@4x.png`,
													}}
												/>
												<Text style={{ fontWeight: 'bold', color: '#346751' }}>
													{weather.description}
												</Text>
											</View>
										);
									}}
								/>
							</View>
						);
					})}
				</ScrollView>
			</SafeAreaView>
		);
	}

};

export default Weather;

const styles = StyleSheet.create({
	root: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	container: {
		flex: 1,
		backgroundColor: '#ECDBBA',
	},
	dayContainer: {
		flex: 1,
		backgroundColor: '#dec697',
		paddingTop: 10,
		paddingBottom: 10,
		margin: 10,
		borderRadius: 15,
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
		width: '100%',
		textAlign: 'center',
		fontWeight: '200',
		fontSize: 24,
		marginBottom: 5,
	},
	info: {
		width: Dimensions.get('screen').width / 2.5,
		backgroundColor: 'rgba(0,0,0,0.5)',
		padding: 10,
		borderRadius: 15,
		justifyContent: 'center',
	},
	extraInfo: {
		flexDirection: 'row',
		marginTop: 20,
		justifyContent: 'space-between',
		padding: 10,
	},
	text: {
		fontSize: 20,
		color: '#fff',
		textAlign: 'center',
	},
	subtitle: {
		textAlign: 'center',
		fontSize: 24,
		marginVertical: 12,
		color: '#C84B31',
		fontWeight: 'bold',
	},
	hours: {
		padding: 6,
		alignItems: 'center',
	},
	smallIcon: {
		width: 100,
		height: 100,
	},
	gpsMassage: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		margin: 10,
		height: '100%',
		
	},
	titleGPS: {
		textAlign: 'center',
		fontSize: 36,
		fontWeight: 'bold',
		color: '#C84B31',
		margin: 22,
	},

	buttonGPS: {
		textAlign: 'center',
		fontSize: 36,
		fontWeight: 'bold',
		color: '#C84B31',
		margin: 25,
		padding: 10,
		borderRadius: 10,
		backgroundColor: 'black'
	},

	textButtonGPS: {
		textAlign: 'center',
		fontSize: 16,
		fontWeight: 'bold',
		color: 'white',
	},
});
