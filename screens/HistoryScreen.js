import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { fetchTrips } from '../services/api';

function HistoryScreen() {
    const [trips, setTrips] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadTrips();
    }, []);

    const loadTrips = async () => {
        setRefreshing(true);
        try {
            const fetchedTrips = await fetchTrips();
            setTrips(fetchedTrips);
        } catch (error) {
            console.error('Failed to fetch trips:', error);
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <View style={{ padding: 16 }}>
            <FlatList
                data={trips}
                keyExtractor={(item) => item.TripId.toString()}
                renderItem={({ item }) => (
                    <View style={{ padding: 10, borderBottomWidth: 1 }}>
                        <Text>Start Time: {item.StartTime}</Text>
                        <Text>End Time: {item.EndTime}</Text>
                        <Text>Distance: {item.RewardableDistance} km</Text>
                        <Text>Reward Points: {item.RewardPoints}</Text>
                    </View>
                )}
                refreshing={refreshing}
                onRefresh={loadTrips}
            />
        </View>
    );
}

export default HistoryScreen;
