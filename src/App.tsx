import '@fortawesome/fontawesome-free/css/all.css';
import 'bulma/css/bulma.css';
import './App.scss';

import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { getUserPostsRequest } from './api/posts';
import { getUsersRequest } from './api/users';
import { Loader } from './components/Loader';
import { PostDetails } from './components/PostDetails';
import { PostsList } from './components/PostsList';
import { UserSelector } from './components/UserSelector';
import { Post } from './types/Post';
import { User } from './types/User';

export const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFetchPostsError, setIsFetchPostsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const getUsers = () => {
    getUsersRequest().then((fetchedUsers: User[]) => {
      setUsers(fetchedUsers);
    });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getUserPosts = useCallback(
    (userId: number): void => {
      setIsLoading(true);
      getUserPostsRequest(userId)
        .then((fetchedPosts: Post[]) => {
          setPosts(fetchedPosts);
        })
        .catch(() => {
          setIsFetchPostsError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [setPosts, setIsLoading, setIsFetchPostsError],
  );

  const openUserPosts = useCallback(
    (user: User) => {
      if (user.id === selectedUser?.id) {
        return;
      }

      setSelectedUser(user);
      setSelectedPost(null);
      getUserPosts(user.id);
    },
    [selectedUser, getUserPosts],
  );

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector
                  users={users}
                  onUserSelect={openUserPosts}
                  selectedUser={selectedUser}
                />
              </div>

              <div className="block" data-cy="MainContent">
                {selectedUser ? (
                  isLoading ? (
                    <Loader />
                  ) : isFetchPostsError ? (
                    <div
                      className="notification is-danger"
                      data-cy="PostsLoadingError"
                    >
                      Something went wrong!
                    </div>
                  ) : posts.length > 0 ? (
                    <PostsList
                      posts={posts}
                      onPostSelect={setSelectedPost}
                      selectedPost={selectedPost}
                    />
                  ) : (
                    <div
                      className="notification is-warning"
                      data-cy="NoPostsYet"
                    >
                      No posts yet
                    </div>
                  )
                ) : (
                  <p data-cy="NoSelectedUser">No user selected</p>
                )}
              </div>
            </div>
          </div>
          <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              {
                'Sidebar--open': selectedPost,
              },
            )}
          >
            {selectedPost && (
              <div className="tile is-child box is-success ">
                <PostDetails post={selectedPost} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
