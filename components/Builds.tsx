import { Colors } from '@/constants/Colors';
import { db } from '@/lib/db';
import { Link } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Builds = () => {
  const user = db.useUser();
  const { isLoading, error, data } = db.useQuery(
    user
      ? {
          $users: {
            $: {
              where: {
                id: user.id,
              },
            },
            builds: {},
          },
        }
      : null
  );
  console.log('🚀 ~ Builds ~ data:', data);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  if (!data || !data.$users[0] || !data.$users[0].builds) {
    return <Text>No builds found</Text>;
  }

  const renderListItem = ({ item }: { item: any }) => {
    return (
      <Link href={`/build/${item.id}`} asChild>
        <TouchableOpacity>
          <Text>{item.id}</Text>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Previous Builds</Text>
      <FlatList
        data={data.$users[0].builds}
        renderItem={renderListItem}
        ListEmptyComponent={<Text>No builds found</Text>}
      />
    </View>
  );
};
export default Builds;
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.gray,
  },
});
