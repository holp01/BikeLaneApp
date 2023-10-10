import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import PartnersScreen from '../screens/PartnersScreen';
import MyTripsScreen from '../screens/MyTripsScreen';
import EventsScreen from '../screens/EventsScreen';

const TopTab = createMaterialTopTabNavigator();

function TopNavigator() {
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="Partners" component={PartnersScreen} />
      <TopTab.Screen name="My Trips" component={MyTripsScreen} />
      <TopTab.Screen name="Events" component={EventsScreen} />
    </TopTab.Navigator>
  );
}

export default TopNavigator;
