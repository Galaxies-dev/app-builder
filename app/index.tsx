import Builds from '@/components/Builds';
import { Colors } from '@/constants/Colors';
import { db } from '@/lib/db';
import { id } from '@instantdb/react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Index() {
  const [prompt, setPrompt] = useState('Build a Tic Tac Toe game');
  const user = db.useUser();
  const [buildId, setBuildId] = useState<string | null>(null);
  const router = useRouter();

  const handleGenerate = async () => {
    const appPrompt = prompt;
    setPrompt('');
    const buildId = id();

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        RefreshToken: `${user.refresh_token}`,
      },
      body: JSON.stringify({ prompt: appPrompt, buildId }),
    });
    if (!response.ok) {
      console.error('Failed to get response from LLM');
    }

    const data = await response.json();
    console.log(data);
    // setBuildId(data.buildId);
    router.push(`/build/${buildId}`);
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      {buildId ? (
        <Text>Build ID: {buildId}</Text>
      ) : (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            multiline={true}
            numberOfLines={5}
            textAlignVertical="top"
            placeholder="Build a workout tracker..."
            value={prompt}
            onChangeText={setPrompt}
          />
          <TouchableOpacity style={styles.button} onPress={handleGenerate}>
            <Text style={styles.buttonText}>Generate Mini App</Text>
          </TouchableOpacity>
        </View>
      )}

      <Builds />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    padding: 8,
    marginVertical: 16,
    backgroundColor: '#fff',
    minHeight: 120,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
