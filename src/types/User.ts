import PropTypes from 'prop-types';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export const USER_PROP_TYPES = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
};
