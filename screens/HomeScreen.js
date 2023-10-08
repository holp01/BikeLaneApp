import React from "react";
import { View, Button, TextInput, Text } from "react-native";
import { useNavigation } from '@react-navigation/native';

function HomeScreen() {
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text>HomeScreen</Text>
        </View>
    )
}


export default HomeScreen;