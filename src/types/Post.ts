import PropTypes from 'prop-types';

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export const POST_PROP_TYPES = {
  id: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};
