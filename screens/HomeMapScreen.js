import React, { useState, useEffect, useRef } from 'react';
import { View, Button, Text } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { startUserTrip, endUserTrip } from '../services/api';

function HomeMapScreen() {
    const [initialPosition, setInitialPosition] = useState(null);
    const [isTripActive, setIsTripActive] = useState(false);
    const [distanceTravelled, setDistanceTravelled] = useState(0);
    const [tripTime, setTripTime] = useState(0);
    const [waypoints, setWaypoints] = useState([]);
    const waypointIntervalRef = useRef(null);
    const tripTimeIntervalRef = useRef(null);
    const [currentTripId, setCurrentTripId] = useState(0);
    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
        async function fetchLocation() {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                console.error("Location permission not granted");
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            setInitialPosition({
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            });
            setCurrentLocation(location.coords);
        }

        fetchLocation();
    }, []);

    const startTrip = async () => {
        setIsTripActive(true);
        // Set up a timer to update tripTime every second
        const tripTimeInterval = setInterval(() => {
            setTripTime(prevTime => prevTime + 1);
        }, 1000);  // Every second

        // Initial waypoint capture
        const location = await Location.getCurrentPositionAsync({});
        const currentDateTime = new Date().toISOString();
        setWaypoints(prevWaypoints => [...prevWaypoints, { ...location.coords, timestamp: currentDateTime }]);

        setCurrentLocation(location.coords);  // Set current location

        // Set up a timer to capture waypoints every few seconds
        const waypointInterval = setInterval(async () => {
            const location = await Location.getCurrentPositionAsync({});
            const currentDateTimeInterval = new Date().toISOString();
            setWaypoints(prevWaypoints => [...prevWaypoints, { ...location.coords, timestamp: currentDateTimeInterval }]);
        }, 5000);  // for example, every 5 seconds

        // Store the interval ID in a ref so you can clear it later
        waypointIntervalRef.current = waypointInterval;
        tripTimeIntervalRef.current = tripTimeInterval;

        // Start trip in backend
        const tripId = await startUserTrip(new Date().toISOString());
        setCurrentTripId(tripId); // Assuming you've useState to store the current trip ID
    };

    const endTrip = async () => {
        setIsTripActive(false);

        clearInterval(waypointIntervalRef.current); // Stop capturing waypoints

        clearInterval(tripTimeIntervalRef.current); //Clear time interval

        // Prepare data to send to backend
        const tripData = {
            TripId: currentTripId,
            EndTime: new Date().toISOString(),
            Waypoints: waypoints.map(point => ({
                Latitude: point.latitude,
                Longitude: point.longitude,
                Timestamp: point.timestamp
            }))
        };

        // Send data to backend
        try {
            const response = await endUserTrip(tripData);
            console.log("Trip ended successfully:", response);
        } catch (error) {
            console.error("Error ending trip:", error);
        }

        // Reset waypoints for the next trip
        setWaypoints([]);

        // Reset current trip ID
        setCurrentTripId(null);
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds - (hours * 3600)) / 60);
        const remainingSeconds = seconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <View style={{ flex: 1 }}>
            {initialPosition ? (
                <>
                    <MapView
                        style={{ flex: 1 }}
                        region={{
                            ...currentLocation,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421
                        }}
                        showsUserLocation={true}
                        followsUserLocation={true}
                    >
                    </MapView>

                    {isTripActive ? (
                        <>
                            <Button title="End Trip" onPress={endTrip} />
                            <Text>Distance Travelled: {distanceTravelled} km</Text>
                            <Text>Time Elapsed: {formatTime(tripTime)}</Text>
                        </>
                    ) : (
                        <Button title="Start Trip" onPress={startTrip} />
                    )}
                </>
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
}

export default HomeMapScreen;
