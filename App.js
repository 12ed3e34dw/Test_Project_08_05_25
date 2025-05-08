import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {useEffect, useState} from "react";
import {createStackNavigation} from "@react-native/stack";
import * as trace_events from "node:trace_events";


const UsersScreen = () => {

  const [users,setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/users")
        .then(response => response.json())
        .then(data => {setUsers(data)
          console.log(data)})
        .catch(error => console.log(error));
    //После запроса FALSE до этого True
   setLoading(false);
  }, [])



  return (
      <View style={styles.container}>

      </View>
  )
}



const UserDetailsScreen=()=>{

  return(
      <View style={styles.container}>

      </View>
  )

}





const Stack=createStackNavigation()
export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
