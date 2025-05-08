import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator, Alert, Button,
    FlatList, StyleSheet, Text,
    TextInput, TouchableOpacity, View
} from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Экран формы добавления/редактирования пользователя
const UserFormScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const navigation = useNavigation();
    const route = useRoute();
    const userId = route.params?.userId;

    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:3000/users/${userId}`)
                .then((response) => response.json())
                .then((data) => {
                    setName(data.name || '');
                    setEmail(data.email || '');
                })
                .catch(() => Alert.alert("Не вдалося завантажити дані користувача"));
        }
    }, [userId]);

    const handleSubmit = () => {
        if (!name || !email) {
            Alert.alert("Будь ласка, заповніть всі поля.");
            return;
        }

        const method = userId ? 'PUT' : 'POST';
        const url = userId
            ? `http://localhost:3000/users/${userId}`
            : `http://localhost:3000/users`;

        fetch(url, {
            method,
            body: JSON.stringify({ name, email }),
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        })
            .then((response) => {
                if (!response.ok) throw new Error("Помилка збереження");
                return response.json();
            })
            .then(() => {
                Alert.alert(userId ? 'Користувача оновлено' : 'Користувача додано');
                navigation.goBack();
            })
            .catch(() => Alert.alert("Помилка під час збереження користувача"));
    };

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <TextInput
                placeholder="Ім'я"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <Button title={userId ? "Оновити" : "Додати"} onPress={handleSubmit} />
        </View>
    );
};

// Экран списка пользователей
const UsersScreen = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        fetch("http://localhost:3000/users")
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(() => Alert.alert("Не вдалося завантажити користувачів"))
            .finally(() => setLoading(false));
    }, []);

    const handleDeleteUser = (id) => {
        fetch(`http://localhost:3000/users/${id}`, { method: 'DELETE' })
            .then((response) => {
                if (!response.ok) throw new Error();
                setUsers(prev => prev.filter(user => user.id !== id));
                Alert.alert("Користувача видалено.");
            })
            .catch(() => Alert.alert("Помилка при видаленні користувача"));
    };

    if (loading) {
        return <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} />;
    }

    return (
        <View style={{ padding: 10 }}>
            <Button title="Додати користувача" onPress={() => navigation.navigate('UserForm')} />
            <FlatList
                data={users}
                keyExtractor={(item) => item.id?.toString()}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <TouchableOpacity
                            style={styles.item}
                            onPress={() => navigation.navigate('UserDetails', { userId: item.id })}
                        >
                            <Text style={styles.username}>{item.name}</Text>
                            <Text style={styles.email}>{item.email}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteUser(item.id)}>
                            <Icon name="delete" size={24} color="gray" />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

// Экран деталей пользователя
const UserDetailsScreen = () => {
    const [user, setUser] = useState(null);
    const route = useRoute();
    const navigation = useNavigation();
    const { userId } = route.params;

    useEffect(() => {
        fetch(`http://localhost:3000/users/${userId}`)
            .then((response) => response.json())
            .then((data) => setUser(data))
            .catch(() => Alert.alert("Не вдалося завантажити користувача"));
    }, [userId]);

    if (!user) {
        return <ActivityIndicator size="large" color="blue" style={{ marginTop: 20 }} />;
    }

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{user.name}</Text>
            <Text style={{ fontSize: 18, color: 'gray' }}>{user.email}</Text>
            <Text style={{ fontSize: 16, marginTop: 10 }}>📞 {user.phone}</Text>
            <Text style={{ fontSize: 16 }}>🏢 {user.company?.name}</Text>
            <Text style={{ fontSize: 16 }}>📍 {user.address?.city}, {user.address?.street}</Text>
            <Button title="Редагувати" onPress={() => navigation.navigate('UserForm', { userId })} />
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
                <Stack.Screen name="UserForm" component={UserFormScreen} />
            </Stack.Navigator>
            <StatusBar style="auto" />
        </NavigationContainer>
    );
}

// Стили
const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        paddingHorizontal: 10,
        height: 40,
        borderRadius: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 10,
    },
    item: {
        flex: 1,
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
