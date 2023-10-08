import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeMapScreen from '../screens/HomeMapScreen';
import RewardsScreen from '../screens/RewardsScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="HomeMap">
      <Tab.Screen 
        name="HomeMap" 
        component={HomeMapScreen} 
        options={{ tabBarLabel: 'Map' }} 
      />
      <Tab.Screen 
        name="Rewards" 
        component={RewardsScreen} 
        options={{ tabBarLabel: 'Rewards' }} 
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen} 
        options={{ tabBarLabel: 'History' }} 
      />
    </Tab.Navigator>
  );
}

export default BottomNavigator;