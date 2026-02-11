import React, { useState } from 'react';
import { Comment } from '../types/Comment';
import { client } from '../utils/fetchClient';

type Props = {
  postId: number;
  onAddComment: (comment: Comment) => void;
};

export const NewCommentForm: React.FC<Props> = ({ postId, onAddComment }) => {
  const [form, setForm] = useState({ name: '', email: '', body: '' });
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>(
    {},
  );
  const [touched, setTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = (values: typeof form) => {
    const newErrors: { [key: string]: string } = {};

    if (!values.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!values.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!values.body.trim()) {
      newErrors.body = 'Enter some text';
    }

    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setForm(f => ({ ...f, [name]: value }));
    setErrors(errs => (touched ? { ...errs, [name]: undefined } : errs));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const validationErrors = validate(form);

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      const newComment = await client.post<Comment>(`/comments`, {
        ...form,
        postId,
      });

      onAddComment(newComment);
      setForm(f => ({ ...f, body: '' }));
      setErrors({});
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setForm(f => ({ ...f, body: '' }));
    setErrors({});
    setTouched(false);
  };

  return (
    <form
      data-cy="NewCommentForm"
      onSubmit={handleSubmit}
      onReset={handleReset}
    >
      <div className="field" data-cy="NameField">
        <label className="label" htmlFor="comment-author-name">
          Author Name
        </label>
        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="name"
            id="comment-author-name"
            placeholder="Name Surname"
            className={`input${errors.name && touched ? ' is-danger' : ''}`}
            value={form.name}
            onChange={handleChange}
            autoComplete="off"
          />
          <span className="icon is-small is-left">
            <i className="fas fa-user" />
          </span>
          {errors.name && touched && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>
        {errors.name && touched && (
          <p className="help is-danger" data-cy="ErrorMessage">
            {errors.name}
          </p>
        )}
      </div>

      <div className="field" data-cy="EmailField">
        <label className="label" htmlFor="comment-author-email">
          Author Email
        </label>
        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="email"
            id="comment-author-email"
            placeholder="email@test.com"
            className={`input${errors.email && touched ? ' is-danger' : ''}`}
            value={form.email}
            onChange={handleChange}
            autoComplete="off"
          />
          <span className="icon is-small is-left">
            <i className="fas fa-envelope" />
          </span>
          {errors.email && touched && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>
        {errors.email && touched && (
          <p className="help is-danger" data-cy="ErrorMessage">
            {errors.email}
          </p>
        )}
      </div>

      <div className="field" data-cy="BodyField">
        <label className="label" htmlFor="comment-body">
          Comment Text
        </label>
        <div className="control">
          <textarea
            id="comment-body"
            name="body"
            placeholder="Type comment here"
            className={`textarea${errors.body && touched ? ' is-danger' : ''}`}
            value={form.body}
            onChange={handleChange}
          />
        </div>
        {errors.body && touched && (
          <p className="help is-danger" data-cy="ErrorMessage">
            {errors.body}
          </p>
        )}
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className={`button is-link${isLoading ? ' is-loading' : ''}`}
            disabled={isLoading}
          >
            Add
          </button>
        </div>
        <div className="control">
          {/* eslint-disable-next-line react/button-has-type */}
          <button
            type="reset"
            className="button is-link is-light"
            disabled={isLoading}
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};
