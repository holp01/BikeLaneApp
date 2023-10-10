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

    const renderItem = ({ item }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10, borderWidth: 1, borderColor: '#e0e0e0', padding: 15, borderRadius: 10 }}>
            <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Start Time:</Text>
                <Text style={{ marginBottom: 6 }}>{item.startTime}</Text>
                
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>End Time:</Text>
                <Text style={{ marginBottom: 6 }}>{item.endTime}</Text>
                
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Distance:</Text>
                <Text style={{ marginBottom: 6 }}>{item.rewardableDistance} km</Text>
                
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Reward Points:</Text>
                <Text>{item.rewardPoints}</Text>
            </View>
        </View>
    );
    
    return (
        <FlatList
            data={trips}
            keyExtractor={(item) => item.tripId.toString()}
            renderItem={renderItem}
            refreshing={refreshing}
            onRefresh={loadTrips}
        />
    );
}

export default HistoryScreen;
