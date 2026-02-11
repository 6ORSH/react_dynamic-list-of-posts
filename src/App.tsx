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

interface AppState {
  selectedUser: User | null;
  selectedPost: Post | null;
  isLoadingPosts: boolean;
  postsError: boolean;
}

export const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [ui, setUi] = useState<AppState>({
    selectedUser: null,
    selectedPost: null,
    isLoadingPosts: false,
    postsError: false,
  });

  const getUsers = async () => {
    try {
      const fetchedUsers = await getUsersRequest();

      setUsers(fetchedUsers);
    } catch {
      setUsers([]);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const updateUi = useCallback((newState: Partial<AppState>) => {
    setUi(prev => ({
      ...prev,
      ...newState,
    }));
  }, []);

  const getUserPosts = useCallback(
    async (userId: number): Promise<void> => {
      updateUi({
        postsError: false,
        isLoadingPosts: true,
      });

      try {
        const fetchedPosts = await getUserPostsRequest(userId);

        setPosts(fetchedPosts);
      } catch {
        updateUi({
          postsError: true,
        });
        setPosts([]);
      } finally {
        updateUi({
          isLoadingPosts: false,
        });
      }
    },
    [setPosts, updateUi],
  );

  const openUserPosts = useCallback(
    async (user: User) => {
      if (user.id === ui.selectedUser?.id) {
        return;
      }

      updateUi({
        selectedUser: user,
        selectedPost: null,
      });
      await getUserPosts(user.id);
    },
    [ui.selectedUser, getUserPosts, updateUi],
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
                  selectedUser={ui.selectedUser}
                />
              </div>

              <div className="block" data-cy="MainContent">
                {ui.selectedUser ? (
                  ui.isLoadingPosts ? (
                    <Loader />
                  ) : ui.postsError ? (
                    <div
                      className="notification is-danger"
                      data-cy="PostsLoadingError"
                    >
                      Something went wrong!
                    </div>
                  ) : posts.length > 0 ? (
                    <PostsList
                      posts={posts}
                      onPostSelect={post => updateUi({ selectedPost: post })}
                      selectedPost={ui.selectedPost}
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
                'Sidebar--open': ui.selectedPost,
              },
            )}
          >
            {ui.selectedPost && (
              <div className="tile is-child box is-success ">
                <PostDetails post={ui.selectedPost} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
