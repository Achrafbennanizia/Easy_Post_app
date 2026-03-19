import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, Text } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import AddPostScreen from './src/screens/AddPostScreen';
import EditPostScreen from './src/screens/EditPostScreen';
import type { Post } from './src/api/posts';

export type RootStackParamList = {
  Home: undefined;
  AddPost: undefined;
  EditPost: { post: Post };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#fff' },
          headerTitleStyle: { fontWeight: '700', color: '#1e293b' },
          headerTintColor: '#6366f1',
          contentStyle: { backgroundColor: '#f8fafc' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: 'Posts',
            headerRight: () => (
              <Pressable onPress={() => navigation.navigate('AddPost')}>
                <Text style={{ color: '#6366f1', fontWeight: '700', fontSize: 16 }}>
                  + New
                </Text>
              </Pressable>
            ),
          })}
        />
        <Stack.Screen
          name="AddPost"
          component={AddPostScreen}
          options={{ title: 'New Post' }}
        />
        <Stack.Screen
          name="EditPost"
          component={EditPostScreen}
          options={{ title: 'Edit Post' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

