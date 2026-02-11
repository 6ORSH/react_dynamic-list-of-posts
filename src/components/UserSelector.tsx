import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { User } from '../types/User';

type Props = {
  users: User[];
  onUserSelect: (user: User) => void;
  selectedUser: User | null;
};

export const UserSelector: React.FC<Props> = ({
  users,
  onUserSelect,
  selectedUser,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleToggleSelect = () => {
    setIsActive(!isActive);
  };

  const handleSelect = (user: User) => {
    setIsActive(false);
    onUserSelect(user);
  };

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsActive(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isActive]);

  return (
    <div
      data-cy="UserSelector"
      ref={dropdownRef}
      className={classNames('dropdown', {
        'is-active': isActive,
      })}
    >
      <div className="dropdown-trigger">
        <button
          type="button"
          className="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={() => handleToggleSelect()}
        >
          <span>{selectedUser ? selectedUser.name : 'Choose a user'}</span>

          <span className="icon is-small">
            <i className="fas fa-angle-down" aria-hidden="true" />
          </span>
        </button>
      </div>

      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {users.map((user: User) => {
            return (
              <a
                key={user.id}
                href={`#user-${user.id}`}
                className={classNames('dropdown-item', {
                  'is-active': selectedUser?.id === user.id,
                })}
                onClick={() => handleSelect(user)}
              >
                {user.name}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
