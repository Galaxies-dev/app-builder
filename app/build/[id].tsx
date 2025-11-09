import EvalComp from '@/components/EvalComp';
import { Colors } from '@/constants/Colors';
import { db } from '@/lib/db';
import { codeStrToReactElement } from '@/utils/codeStrToReactElement';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedView, setSelectedView] = useState<'code' | 'preview'>('code');
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { isLoading, data } = db.useQuery({
    builds: {
      $: { where: { id } },
    },
  });

  useEffect(() => {
    // if (!data || !data.builds[0] || selectedView !== 'code') return;
    if (!data || !data.builds[0]) return;
    try {
      // Clean the code: find the first import statement and start from there
      let cleanCode = data.builds[0].code;
      const importIndex = cleanCode.indexOf('import ');
      if (importIndex > 0) {
        cleanCode = cleanCode.substring(importIndex);
      }

      // Trim any text after "export default App;"
      const exportText = 'export default App;';
      const exportIndex = cleanCode.indexOf(exportText);
      if (exportIndex > -1) {
        cleanCode = cleanCode.substring(0, exportIndex + exportText.length);
      }

      const { element: ReactComponent } = codeStrToReactElement(cleanCode);
      console.log('🚀 ~ Page ~ reactElement:', ReactComponent);

      if (typeof ReactComponent !== 'function') {
        throw new Error('Code did not export a valid React component');
      }

      setComponent(() => ReactComponent);
      setError(null);
    } catch (err) {
      console.error('Error evaluating code:', err);
      setError(err instanceof Error ? err.message : 'Failed to evaluate code');
      setComponent(null);
    }
  }, [data, selectedView]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!data || !data.builds[0]) {
    return <Text>Build not found</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: data?.builds[0].title || 'Build' }} />
      <View style={styles.tabs}>
        <TouchableOpacity style={styles.tab} onPress={() => setSelectedView('code')}>
          <Text
            style={[
              styles.tabText,
              { color: selectedView === 'code' ? Colors.primary : Colors.gray },
            ]}>
            Code
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setSelectedView('preview')}>
          <Text
            style={[
              styles.tabText,
              { color: selectedView === 'preview' ? Colors.primary : Colors.gray },
            ]}>
            Preview
          </Text>
        </TouchableOpacity>
      </View>
      {selectedView === 'code' && (
        <ScrollView style={styles.code}>
          <Text style={styles.code}>{codeStrToReactElement(data?.builds[0].code).element}</Text>
        </ScrollView>
      )}
      {selectedView === 'preview' && <EvalComp id={id} />}
    </View>
  );
};
export default Page;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    gap: 10,
    margin: 10,
  },
  tab: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.gray,
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  code: {
    fontSize: 14,
    fontFamily: 'monospace',
    padding: 10,
  },
});
