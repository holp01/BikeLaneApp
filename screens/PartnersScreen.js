import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { getPartners } from '../services/api'; // Make sure to import the getPartners function

const PartnersScreen = ({ navigation }) => {
    const [partners, setPartners] = useState([]);

    useEffect(() => {
        // Fetch Partners from API
        getPartners()
            .then(data => setPartners(data))
            .catch(error => console.error('Error fetching partners:', error));
    }, []);

    const renderPartner = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('RewardsScreen', { partnerId: item.id })}>
            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 20, borderWidth: 1, borderColor: '#e0e0e0', padding: 10, borderRadius: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
                <Text style={{ marginTop: 6 }}>{item.description}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={partners}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPartner}
        />
    );
}

export default PartnersScreen;
