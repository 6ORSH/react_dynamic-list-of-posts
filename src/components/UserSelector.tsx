import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { User, USER_PROP_TYPES } from '../types/User';

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

  const handleSelect = (
    user: User,
  ) => {
    setIsActive(false);
    onUserSelect(user);
  };

  return (
    <div
      data-cy="UserSelector"
      ref={dropdownRef}
      className={classNames('dropdown', {
        'is-active': isActive,
      })}
      tabIndex={-1}
    >
      <div className="dropdown-trigger">
        <button
          type="button"
          className="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={handleToggleSelect}
        >
          <span>{selectedUser ? selectedUser.name : 'Choose a user'}</span>
          <span className="icon is-small">
            <i className="fas fa-angle-down" aria-hidden="true" />
          </span>
        </button>
      </div>

      {isActive && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10,
            background: 'transparent',
          }}
          onClick={() => setIsActive(false)}
          aria-label="Close dropdown overlay"
        />
      )}

      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {users.map((user: User) => {
              return (
                <button
                  type="button"
                  key={user.id}
                  className={classNames('dropdown-item', {
                    'is-active': selectedUser?.id === user.id,
                  })}
                  onClick={() => handleSelect(user)}
                  style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: 0 }}
                >
                  {user.name}
                </button>
              );
          })}
        </div>
      </div>
    </div>
  );
};

// Runtime propTypes for checklist compliance
UserSelector.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape(USER_PROP_TYPES).isRequired)
    .isRequired,
  onUserSelect: PropTypes.func.isRequired,
  selectedUser: PropTypes.oneOfType([
    PropTypes.shape(USER_PROP_TYPES),
    PropTypes.oneOf([null]),
  ]),
};
