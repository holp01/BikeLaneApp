import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Image, Button, Modal } from "react-native";

import { getActiveRewards } from '../services/api';

function RewardsScreen() {
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedReward, setSelectedReward] = useState(null);

    useEffect(() => {
        fetchActiveRewards();
        console.log(rewards);  // Log the rewards to inspect the data
    }, [rewards]);

    const fetchActiveRewards = async () => {
        try {
            const fetchedRewards = await getActiveRewards();
            setRewards(fetchedRewards);
            setLoading(false);
        } catch (error) {
            console.error('There was an error fetching the rewards', error);
            setLoading(false);
        }
    };

    const handleRedeemReward = async (rewardId) => {
        try {
          const response = await redeemReward(rewardId);
          alert(response.Message);  // Or use a more user-friendly notification
        } catch (error) {
          alert('Failed to redeem the reward. Please try again.');  // Consider displaying the specific error message
        }
      };

    const renderItem = ({ item }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', margin: 20, borderWidth: 1, borderColor: '#e0e0e0', padding: 10, borderRadius: 10 }}>
            <Image 
                source={{ uri: 'https://example.com/placeholder-image-url.png' }}
                style={{ width: 60, height: 60, borderRadius: 30 }}
            />
            <View style={{ marginLeft: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
                <Text style={{ marginTop: 6 }}>{item.description}</Text>
                <Text style={{ marginTop: 4, color: 'gray' }}>{item.pointCost} Points</Text>
                <Button title="Redeem" onPress={() => {setSelectedReward(item); setModalVisible(true);}} />
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <>
            <FlatList 
                data={rewards}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
            {selectedReward && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {setModalVisible(false);}}
                >
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center'}}>
                            <Text style={{marginBottom: 20}}>Are you sure you want to redeem {selectedReward.name} for {selectedReward.pointCost} Points?</Text>
                            <Button title="Yes" onPress={() => handleRedeemReward(selectedReward.id)} />
                            <Button title="No" onPress={() => setModalVisible(false)} />
                        </View>
                    </View>
                </Modal>
            )}
        </>
    );
}

export default RewardsScreen;
