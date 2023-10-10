import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import RewardsScreen from '../screens/RewardsScreen';
import MyTripsScreen from '../screens/MyTripsScreen';
import EventsScreen from '../screens/EventsScreen';

const TopTab = createMaterialTopTabNavigator();

function TopNavigator() {
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="Rewards" component={RewardsScreen} />
      <TopTab.Screen name="My Trips" component={MyTripsScreen} />
      <TopTab.Screen name="Events" component={EventsScreen} />
    </TopTab.Navigator>
  );
}

export default TopNavigator;
