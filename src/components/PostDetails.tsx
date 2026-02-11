import React, { useEffect, useState } from 'react';
import { deleteCommentRequest, getPostCommentsRequest } from '../api/comments';
import { Comment } from '../types/Comment';
import { Post } from '../types/Post';
import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';

type Props = {
  post: Post;
};

export const PostDetails: React.FC<Props> = ({ post }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchCommentsError, setIsFetchCommentsError] =
    useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isNewCommentFormOpened, setIsNewCommentFormOpened] =
    useState<boolean>(false);

  useEffect(() => {
    setIsNewCommentFormOpened(false);

    if (!post) {
      return;
    }

    setIsLoading(true);

    getPostCommentsRequest(post.id)
      .then((fetchedComments: Comment[]) => {
        setComments(fetchedComments);
      })
      .catch(() => {
        setIsFetchCommentsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [post]);

  const handleWriteComment = () => {
    setIsNewCommentFormOpened(true);
  };

  const handleDeleteComment = (commentId: number) => {
    deleteCommentRequest(commentId)
      .then(() => {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
      })
      .catch(() => {
        setIsFetchCommentsError(true);
      });
  };

  return (
    <div className="content" data-cy="PostDetails">
      <div className="content" data-cy="PostDetails">
        <div className="block">
          <h2 data-cy="PostTitle">{`#${post.id}: ${post.title}`}</h2>

          <p data-cy="PostBody">{post.body}</p>
        </div>

        <div className="block">
          {isLoading ? (
            <Loader />
          ) : isFetchCommentsError ? (
            <div className="notification is-danger" data-cy="CommentsError">
              Something went wrong
            </div>
          ) : comments.length > 0 ? (
            <>
              <p className="title is-4">Comments:</p>

              {comments.map((comment: Comment) => {
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

          {!isNewCommentFormOpened && !isLoading && !isFetchCommentsError && (
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

        {isNewCommentFormOpened && (
          <NewCommentForm
            postId={post.id}
            onAddComment={comment => setComments(prev => [...prev, comment])}
          />
        )}
      </div>
    </div>
  );
};
