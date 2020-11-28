import React from "react";
import { Form, Button, Message } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

import { useForm } from "../util/hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";

const PostForm = () => {
  const { onChangeHandler, onSubmitHandler, values } = useForm(
    createPostCallback,
    {
      body: "",
    }
  );

  const [createPost, { error }] = useMutation(CREATE_POST, {
    variables: values,
    // fetch ROOT_QUERY data from cache instead of server
    update: (proxy, result) => {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts], // create a new obj to write in
        },
      });
      values.body = ""; //reset once submitted
    },
  });

  function createPostCallback() {
    createPost();
  }

  const errorHandler = (error) => {
    return (
      <div className="ui error message" style={{ marginBottom: 20 }}>
        <ul className="list">
          <li>{error.graphQLErrors[0].message}</li>
        </ul>
      </div>
    );
  };

  return (
    <>
      <Form onSubmit={onSubmitHandler}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            name="body"
            value={values.body}
            placeholder="Hello world!"
            type="text"
            onChange={onChangeHandler}
            error={error ? true : false}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && errorHandler(error)}
    </>
  );
};

const CREATE_POST = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
