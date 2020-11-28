import React, { useState, useContext } from "react";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";

const Register = (props) => {
  const context = useContext(AuthContext);

  const initialState = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  // custom hooks to handle input and submit
  const { onChangeHandler, onSubmitHandler, values } = useForm(
    registerUser,
    initialState
  );

  const [errors, setErrors] = useState({});

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    // if mutation successful
    update(proxy, result) {
      console.log(result.data);
      context.login(result.data.register);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  // helper fn to hoist addUser fn
  function registerUser() {
    addUser();
  }

  return (
    <div className="form-container">
      <Form
        onSubmit={onSubmitHandler}
        noValidate
        className={loading ? "loading" : ""}
      >
        <h1>Register</h1>
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
          label="email"
          placeholder="Enter email.."
          name="email"
          type="email"
          value={values.email}
          error={errors.email ? true : false}
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

        <Form.Input
          label="confirmPassword"
          placeholder="Enter confirmPassword.."
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          error={errors.confirmPassword ? true : false}
          onChange={onChangeHandler}
        />

        <Button type="submit" primary>
          Register
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

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;
