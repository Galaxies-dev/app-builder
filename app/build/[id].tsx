import { db } from '@/lib/db';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isLoading, error, data } = db.useQuery({
    builds: {
      $: { where: { id } },
    },
  });
  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return <Text>Error: {error.message}</Text>;
  }
  console.log('🚀 ~ Page ~ data:', data);

  if (!data || !data.builds[0]) {
    return <Text>Build not found</Text>;
  }

  return (
    <View style={styles.container}>
      <Text>Build {id}</Text>
      <Text>Instant App ID: {data?.builds[0].instantAppId}</Text>
      <Text>Is Previewable: {data?.builds[0].isPreviewable ? 'Yes' : 'No'}</Text>
      <Text>{data?.builds[0].code}</Text>
    </View>
  );
};
export default Page;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
