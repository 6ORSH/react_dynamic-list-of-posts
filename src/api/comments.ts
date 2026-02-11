import { Comment } from '../types/Comment';
import { client } from '../utils/fetchClient';

export function getPostCommentsRequest(postId: number) {
  return client.get<Comment[]>('/comments?postId=' + postId);
}

export function deleteCommentRequest(commentId: number) {
  return client.delete(`/comments/${commentId}`);
}
