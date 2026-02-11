import { Post } from '../types/Post';
import { client } from '../utils/fetchClient';

export function getUserPostsRequest(userId: number) {
  return client.get<Post[]>('/posts?userId=' + userId);
}
