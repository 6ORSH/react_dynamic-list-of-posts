import React, { useEffect, useState } from 'react';
import { deleteCommentRequest, getPostCommentsRequest } from '../api/comments';
import { Comment } from '../types/Comment';
import { Post } from '../types/Post';
import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';

type Props = {
  post: Post;
};

interface CommentsState {
  isLoading: boolean;
  isCommentsLoadingError: boolean;
  isCommentDeleteError: boolean;
  comments: Comment[];
  isFormOpened: boolean;
}

export const PostDetails: React.FC<Props> = ({ post }) => {
  const [commentsState, setCommentsState] = useState<CommentsState>({
    isLoading: false,
    isCommentsLoadingError: false,
    isCommentDeleteError: false,
    comments: [],
    isFormOpened: false,
  });
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [lastRemoved, setLastRemoved] = useState<{
    comment: Comment | null;
    index: number | null;
  }>({ comment: null, index: null });

  const updateCommentsState = (newState: Partial<CommentsState>) => {
    setCommentsState(prev => ({
      ...prev,
      ...newState,
    }));
  };

  useEffect(() => {
    const fetchComments = async () => {
      updateCommentsState({ isFormOpened: false });

      if (!post) {
        return;
      }

      updateCommentsState({ isLoading: true, isCommentsLoadingError: false });

      try {
        const fetchedComments = await getPostCommentsRequest(post.id);

        updateCommentsState({ comments: fetchedComments });
      } catch (error) {
        updateCommentsState({ isCommentsLoadingError: true });
        updateCommentsState({ comments: [] });
      } finally {
        updateCommentsState({ isLoading: false });
      }
    };

    fetchComments();
  }, [post]);

  const handleWriteComment = () => {
    updateCommentsState({ isFormOpened: true });
  };

  const handleDeleteComment = async (commentId: number) => {
    setDeleteError(null);
    setCommentsState(previousState => {
      const commentToRemove: Comment | undefined = previousState.comments.find(
        (comment: Comment) => comment.id === commentId,
      );
      const index = previousState.comments.findIndex(
        (comment: Comment) => comment.id === commentId,
      );

      if (!commentToRemove || index < 0) {
        return previousState;
      }

      setLastRemoved({ comment: commentToRemove, index });

      return {
        ...previousState,
        comments: previousState.comments.filter(
          comment => comment.id !== commentId,
        ),
      };
    });

    try {
      await deleteCommentRequest(commentId);
      setLastRemoved({ comment: null, index: null });
    } catch (error) {
      setCommentsState(previousState => {
        if (!lastRemoved.comment || lastRemoved.index === null) {
          return previousState;
        }

        const next = [...previousState.comments];

        next.splice(lastRemoved.index, 0, lastRemoved.comment);

        return { ...previousState, comments: next };
      });
      setDeleteError('Failed to delete comment. Please try again.');
      setLastRemoved({ comment: null, index: null });
    }
  };

  return (
    <div className="content" data-cy="PostDetails">
      <div className="content" data-cy="PostDetails">
        <div className="block">
          {deleteError && (
            <div
              className="notification is-danger is-light"
              style={{ marginBottom: '1rem', padding: '0.5rem' }}
            >
              {deleteError}
            </div>
          )}
          <h2 data-cy="PostTitle">{`#${post.id}: ${post.title}`}</h2>

          <p data-cy="PostBody">{post.body}</p>
        </div>

        <div className="block">
          {commentsState.isLoading ? (
            <Loader />
          ) : commentsState.isCommentsLoadingError ? (
            <div className="notification is-danger" data-cy="CommentsError">
              Something went wrong
            </div>
          ) : commentsState.comments.length > 0 ? (
            <>
              <p className="title is-4">Comments:</p>

              {commentsState.comments.map((comment: Comment) => {
                return (
                  <article
                    key={comment.id}
                    className="message is-small"
                    data-cy="Comment"
                  >
                    <div className="message-header">
                      <a
                        href={`mailto:${comment.email}`}
                        data-cy="CommentAuthor"
                      >
                        {comment.name}
                      </a>
                      <button
                        data-cy="CommentDelete"
                        type="button"
                        className="delete is-small"
                        aria-label="delete"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        delete button
                      </button>
                    </div>

                    <div className="message-body" data-cy="CommentBody">
                      {comment.body}
                    </div>
                  </article>
                );
              })}
            </>
          ) : (
            <p className="title is-4" data-cy="NoCommentsMessage">
              No comments yet
            </p>
          )}

          {!commentsState.isFormOpened &&
            !commentsState.isLoading &&
            !commentsState.isCommentsLoadingError && (
              <button
                data-cy="WriteCommentButton"
                type="button"
                className="button is-link"
                onClick={() => handleWriteComment()}
              >
                Write a comment
              </button>
            )}
        </div>

        {commentsState.isFormOpened && (
          <NewCommentForm
            postId={post.id}
            onAddComment={comment =>
              setCommentsState(prev => ({
                ...prev,
                comments: [...prev.comments, comment],
              }))
            }
          />
        )}
      </div>
    </div>
  );
};
