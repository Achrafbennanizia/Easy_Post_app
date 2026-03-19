import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { updatePost, deletePost } from '../api/posts';

type Props = NativeStackScreenProps<RootStackParamList, 'EditPost'>;

export default function EditPostScreen({ navigation, route }: Props) {
  const { post } = route.params;
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    try {
      await updatePost(post.id, title.trim(), content.trim());
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Could not update post.');
    } finally {
      setLoading(false);
    }
  };

  const performDelete = async () => {
    setLoading(true);
    try {
      await deletePost(post.id);
      navigation.goBack();
    } catch {
      if (Platform.OS === 'web') {
        alert('Could not delete post.');
      } else {
        Alert.alert('Error', 'Could not delete post.');
      }
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (confirm(`Remove "${post.title}"? This cannot be undone.`)) {
        performDelete();
      }
      return;
    }
    Alert.alert('Delete', `Remove "${post.title}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => performDelete(),
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.label}>TITLE</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Post title"
            placeholderTextColor="#94a3b8"
            autoFocus
            returnKeyType="next"
          />

          <Text style={styles.label}>CONTENT</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={content}
            onChangeText={setContent}
            placeholder="Write your post…"
            placeholderTextColor="#94a3b8"
            multiline
            textAlignVertical="top"
          />

          <View style={styles.actions}>
            <Pressable
              style={[styles.btn, styles.btnDanger]}
              onPress={handleDelete}
              disabled={loading}
            >
              <Text style={styles.btnDangerText}>Delete</Text>
            </Pressable>

            <View style={styles.actionsRight}>
              <Pressable
                style={[styles.btn, styles.btnSecondary]}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.btnSecondaryText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, styles.btnPrimary, (!title.trim() || !content.trim() || loading) && styles.btnDisabled]}
                onPress={handleSave}
                disabled={!title.trim() || !content.trim() || loading}
              >
                {loading
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.btnPrimaryText}>Save</Text>
                }
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  input: {
    height: 44,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#1e293b',
    backgroundColor: '#f8fafc',
  },
  textarea: {
    height: 140,
    paddingTop: 10,
    paddingBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  actionsRight: { flexDirection: 'row', gap: 8 },
  btn: {
    height: 40,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: { backgroundColor: '#6366f1' },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  btnSecondary: { backgroundColor: '#f1f5f9' },
  btnSecondaryText: { color: '#1e293b', fontWeight: '600', fontSize: 14 },
  btnDanger: { backgroundColor: '#fee2e2' },
  btnDangerText: { color: '#ef4444', fontWeight: '600', fontSize: 14 },
  btnDisabled: { opacity: 0.4 },
});
