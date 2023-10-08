import React, { useState, useEffect, useRef } from 'react';
import { View, Button, Text } from "react-native";
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { startUserTrip, endUserTrip } from '../services/api';

function HomeMapScreen() {
    const [initialPosition, setInitialPosition] = useState(null);
    const [isTripActive, setIsTripActive] = useState(false);
    const [distanceTravelled, setDistanceTravelled] = useState(0);
    const [tripTime, setTripTime] = useState(0);
    const [waypoints, setWaypoints] = useState([]);
    const waypointIntervalRef = useRef(null);
    const [currentTripId, setCurrentTripId] = useState(0);

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
        }

        fetchLocation();
    }, []);

    const startTrip = async () => {
        setIsTripActive(true);

        // Initial waypoint capture
        const location = await Location.getCurrentPositionAsync({});
        const currentDateTime = new Date().toISOString();
        setWaypoints(prevWaypoints => [...prevWaypoints, { ...location.coords, timestamp: currentDateTime }]);

        // Set up a timer to capture waypoints every few seconds
        const waypointInterval = setInterval(async () => {
            const location = await Location.getCurrentPositionAsync({});
            const currentDateTimeInterval = new Date().toISOString();
            setWaypoints(prevWaypoints => [...prevWaypoints, { ...location.coords, timestamp: currentDateTimeInterval }]);
        }, 5000);  // for example, every 5 seconds

        // Store the interval ID in a ref so you can clear it later
        waypointIntervalRef.current = waypointInterval;

        // Start trip in backend
        const tripId = await startUserTrip(new Date().toISOString());
        setCurrentTripId(tripId); // Assuming you've useState to store the current trip ID
    };

    const endTrip = async () => {
        setIsTripActive(false);

        clearInterval(waypointIntervalRef.current); // Stop capturing waypoints

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

    return (
        <View style={{ flex: 1 }}>
            {initialPosition ? (
                <>
                    <MapView
                        style={{ flex: 1 }}
                        initialRegion={initialPosition}
                    />
                    {isTripActive ? (
                        <>
                            <Button title="End Trip" onPress={endTrip} />
                            <Text>Distance Travelled: {distanceTravelled} km</Text>
                            <Text>Time Elapsed: {tripTime} seconds</Text>
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
