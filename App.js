import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Экран списка пользователей
const UsersScreen = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:3000/users")
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} />;
    }

    return (
        <View style={{ padding: 10 }}>
            <TextInput placeholder="Поиск..." style={styles.input} />
            <FlatList
                data={users}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.item}>
                        <Text style={styles.username}>{item.username}</Text>
                        <Text style={styles.email}>{item.email}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

// Пустой экран деталей
const UserDetailsScreen = () => {
    const [user, setUser] = useState(null);
    const route=useRoute();
    const {userId} = route.params;
  //  console.log(userId);


    useEffect(() => {
        fetch(`http://localhost:3000/users/${userId}`)
            .then((response) => response.json())
            .then((data) => setUser(data))
             console.log(data)
    })



    return (
        <View style={{flex: 1, padding: 20}}>
            <Text style={{fontSize: 24, fontWeight: 'bold'}}>{user.name}</Text>
            <Text style={{fontSize: 18, color: 'gray'}}>{user.email}</Text>
            <Text style={{fontSize: 16, marginTop: 10}}>📞 {user.phone}</Text>
            <Text style={{fontSize: 16}}>🏢 {user.company?.name}</Text>
            <Text style={{fontSize: 16}}>📍 {user.address?.city}, {user.address?.street}</Text>
        </View>
    );
};

// Навигация
const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Users" component={UsersScreen} />
                <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

// Стили
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        paddingHorizontal: 10,
        height: 40,
        borderRadius: 5,
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
    },
   email: {
        fontSize: 14,
        color: '#666',
    },
});

