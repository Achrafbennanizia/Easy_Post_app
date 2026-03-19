import { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { getPosts, deletePost, type Post } from '../api/posts';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await getPosts();
      setPosts(data);
    } catch {
      setError('Could not reach the backend. Is it running?');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => fetchPosts());
    return unsubscribe;
  }, [navigation, fetchPosts]);

  const performDelete = async (post: Post) => {
    try {
      await deletePost(post.id);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    } catch {
      if (Platform.OS === 'web') {
        alert('Could not delete post.');
      } else {
        Alert.alert('Error', 'Could not delete post.');
      }
    }
  };

  const handleDelete = (post: Post) => {
    if (Platform.OS === 'web') {
      if (confirm(`Remove "${post.title}"?`)) {
        performDelete(post);
      }
      return;
    }
    Alert.alert('Delete', `Remove "${post.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => performDelete(post),
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={posts.length === 0 ? styles.emptyContainer : styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchPosts(true)}
            tintColor="#6366f1"
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No posts yet. Create one!</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.title[0]?.toUpperCase()}</Text>
              </View>
              <View style={styles.cardMeta}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardId}>#{item.id}</Text>
              </View>
              <Pressable
                style={styles.editBtn}
                onPress={() => navigation.navigate('EditPost', { post: item })}
              >
                <Text style={styles.editBtnText}>Edit</Text>
              </Pressable>
              <Pressable style={styles.deleteBtn} onPress={() => handleDelete(item)}>
                <Text style={styles.deleteBtnText}>✕</Text>
              </Pressable>
            </View>
            <Text style={styles.cardContent} numberOfLines={3}>{item.content}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 16, gap: 12 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#94a3b8', fontSize: 15 },
  errorBanner: { backgroundColor: '#fee2e2', padding: 12, margin: 16, borderRadius: 8 },
  errorText: { color: '#b91c1c', fontSize: 13 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ede9fe',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: { color: '#6366f1', fontWeight: '700', fontSize: 15 },
  cardMeta: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
  cardId: { fontSize: 12, color: '#94a3b8', marginTop: 1 },
  cardContent: { fontSize: 14, color: '#475569', lineHeight: 20 },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  editBtnText: { fontSize: 13, fontWeight: '600', color: '#1e293b' },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: { color: '#ef4444', fontWeight: '700', fontSize: 13 },
});
