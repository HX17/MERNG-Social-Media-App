import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Label } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

const LikeButton = ({ user, post: { id, likes, likeCount } }) => {
  const [liked, setLiked] = useState(false);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
  });

  useEffect(() => {
    // check if user logged in and liked already
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);

  // if not logged in, redirect to login page
  const likeButton = user ? (
    liked ? (
      <Button color="teal">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button color="teal" basic as={Link} to="/login">
      <Icon name="heart" />
    </Button>
  );

  return (
    <Button as="div" labelPosition="right" onClick={likePost}>
      {likeButton}
      <Label basic color="teal" pointing="left">
        {likeCount}
      </Label>
    </Button>
  );
};

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;
