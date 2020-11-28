import React, { useState, useContext } from "react";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";

const Login = (props) => {
  const context = useContext(AuthContext);

  const initialState = {
    username: "",
    password: "",
  };

  const { onChangeHandler, onSubmitHandler, values } = useForm(
    loginUserCallback,
    initialState
  );

  const [errors, setErrors] = useState({});

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    // if mutation successful
    update(proxy, result) {
      context.login(result.data.login); // pass in logged in user data
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function loginUserCallback() {
    loginUser();
  }

  return (
    <div className="form-container">
      <Form
        onSubmit={onSubmitHandler}
        noValidate
        className={loading ? "loading" : ""}
      >
        <h1>Login</h1>
        <Form.Input
          label="username"
          placeholder="Enter username.."
          name="username"
          type="text"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChangeHandler}
        />

        <Form.Input
          label="password"
          placeholder="Enter password.."
          name="password"
          type="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChangeHandler}
        />

        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
