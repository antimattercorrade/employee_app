import React from 'react';
import { StyleSheet, Text, View, Settings } from 'react-native';
import Constants from 'expo-constants';
import Home from './screens/Home.js';
import CreateEmployee from './screens/CreateEmployee';
import Profile from './screens/Profile.js';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { reducer } from './reducers/reducer.js'

const store = createStore(reducer)

const Stack = createStackNavigator()

const myoptions = {
    title: "Dashboard",
    headerTintColor: "white",
    headerStyle: {
      backgroundColor: "#006aff"
    }
}

function App() {
  return (
    <View style={styles.container}>
      <Stack.Navigator>
        <Stack.Screen 
          name = "Home" 
          component = {Home} 
          options = {myoptions}
          />
        <Stack.Screen 
          name = "Create" 
          component = {CreateEmployee} 
          options = {{...myoptions, title: "Create Employee"}}
          />
        <Stack.Screen 
        name = "Profile"
        component = {Profile} 
        options = {{...myoptions, title: "Profile"}}
        />
      </Stack.Navigator>
    </View>
  );
}

export default () => {
  return (
    <Provider store = {store}>
    <NavigationContainer>
      <App />
    </NavigationContainer>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e0e0',
  },
});
