import React, { useState, useEffect, useRef } from 'react';
import { View, Button, Text, Modal } from "react-native";
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
    const [speed, setSpeed] = useState(0);
    const [showTransportModal, setShowTransportModal] = useState(false);

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

    const startTrip = () => {
        setShowTransportModal(true);
    };

    const commenceTrip = async (selectedMode) => {
        setShowTransportModal(selectedMode);
        setIsTripActive(true);

        // Clear any existing intervals for tripTime
        clearInterval(tripTimeIntervalRef.current);
        // Set up a timer to update tripTime every second and directly assign to tripTimeIntervalRef.current
        tripTimeIntervalRef.current = setInterval(() => {
            setTripTime(prevTime => prevTime + 1);
        }, 1000); // Increment every second

        // Initial waypoint capture
        const location = await Location.getCurrentPositionAsync({});
        const currentDateTime = new Date().toISOString();
        setWaypoints(prevWaypoints => [...prevWaypoints, { ...location.coords, timestamp: currentDateTime }]);

        setCurrentLocation(location.coords);  // Set current location

        // Clear any existing intervals for waypoints
        clearInterval(waypointIntervalRef.current);

        // Set up a timer to capture waypoints every few seconds and directly assign to waypointIntervalRef.current
        waypointIntervalRef.current = setInterval(async () => {
            const newLocation = await Location.getCurrentPositionAsync({});
            const currentDateTimeInterval = new Date().toISOString();
            const deltaTime = 1;  // in seconds

            setWaypoints(prevWaypoints => {
                if (prevWaypoints.length > 0) {
                    const lastWaypoint = prevWaypoints[prevWaypoints.length - 1];
                    const distance = haversine(lastWaypoint.latitude, lastWaypoint.longitude, newLocation.coords.latitude, newLocation.coords.longitude);
                    const newSpeed = distance / deltaTime * 3600;  // Multiply by 3600 to convert to km/h

                    // Check speed against selected transport mode
                    const speedLimit = {
                        'Walking': 15,
                        'Bicycle': 25,
                        'Electric Scooter': 30,
                        'Bus': 50
                    };

                    if (newSpeed <= speedLimit[selectedMode]) {
                        setDistanceTravelled(prevDistance => prevDistance + distance);
                        setSpeed(newSpeed);
                        return [...prevWaypoints, { ...newLocation.coords, timestamp: currentDateTimeInterval }];
                    }
                }
                return prevWaypoints; // this ensures that if the speed is surpassed, waypoints remain unchanged.
            });
        }, 1000);

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
        //Reset distance
        setDistanceTravelled(0);
        //reset trip time
        setTripTime(0);
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds - (hours * 3600)) / 60);
        const remainingSeconds = seconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const haversine = (lat1, lon1, lat2, lon2) => {
        const toRad = (value) => (value * Math.PI) / 180;

        const R = 6371; // Earth radius in kilometers
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const formatDistance = (distanceInKm) => {
        if (distanceInKm < 1) {
            return `${Math.round(distanceInKm * 1000)} meters`;
        }
        return `${distanceInKm.toFixed(1)} km`;
    };

    return (
        <View style={{ flex: 1 }}>
            {/* Map Section */}
            <MapView
                style={{ flex: 0.6 }}
                region={{
                    ...currentLocation,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                }}
                showsUserLocation={true}
                followsUserLocation={true}
            />

            {/* Display the "Loading..." message over the map */}
            {!initialPosition && (
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',  // Slight white background to make text more readable
                }}>
                    <Text>Loading...</Text>
                </View>
            )}

            {/* Trip Info Section */}
            <View style={{ flex: 0.2, padding: 10 }}>
                {isTripActive && (
                    <>
                        <Text>Distance Travelled: {formatDistance(distanceTravelled)}</Text>
                        <Text>Time Elapsed: {formatTime(tripTime)}</Text>
                        <Text>Speed: {speed} km/h</Text>
                    </>
                )}
            </View>

            {/* Buttons Section */}
            <View style={{ flex: 0.2, justifyContent: 'center' }}>
                {isTripActive ? (
                    <Button title="End Trip" onPress={endTrip} />
                ) : (
                    <Button title="Start Trip" onPress={startTrip} />
                )}
            </View>
            {showTransportModal && (
                <Modal animationType="slide" transparent={true} visible={showTransportModal}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
                            <Text>Choose your mean of transport</Text>
                            <Button title="Walking" onPress={() => { commenceTrip('Walking'); setShowTransportModal(false); }} />
                            <Button title="Bicycle" onPress={() => { commenceTrip('Bicycle'); setShowTransportModal(false); }} />
                            <Button title="Electric Scooter" onPress={() => { commenceTrip('Electric Scooter'); setShowTransportModal(false); }} />
                            <Button title="Bus" onPress={() => { commenceTrip('Bus'); setShowTransportModal(false); }} />
                        </View>
                    </View>
                </Modal>
            )}

        </View>
    );
}

export default HomeMapScreen;
