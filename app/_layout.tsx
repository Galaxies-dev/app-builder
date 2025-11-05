import { db } from '@/lib/db';
import '@/polyfills';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function RootLayout() {
  const { isLoading, user, error } = db.useAuth();
  // console.log('🚀 ~ RootLayout ~ user:', user);

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Protected guard={!!user}>
        <Stack.Screen
          name="index"
          options={{
            title: 'App Builder',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  db.auth.signOut();
                }}>
                <Ionicons name="log-out-outline" size={24} />
              </TouchableOpacity>
            ),
          }}
        />
      </Stack.Protected>

      <Stack.Protected guard={!user}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
