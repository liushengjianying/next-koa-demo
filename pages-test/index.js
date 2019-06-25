import Router from "next/router";
import { useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { add, rename } from "../actions/actions";

import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const Index = ({ counter, username, reName, add }) => {
  function gotoTestB() {
    Router.push(
      {
        pathname: "/test/b",
        query: {
          id: 2
        }
      },
      "/test/b/2"
    );
  }

  useEffect(() => {
    axios.get('/api/user/info').then(resp => {
      console.log(resp)
    })
  }, [])

  return (
    <>
      <span>counter: {counter}</span>
      <a>username: {username}</a>
      <input value={username} onChange={e => reName(e.target.value)} />
      <button onClick={() => add(counter)}>do add</button>
      <a href={publicRuntimeConfig.OAUTH_URL}>登录</a>
    </>
  );
};

export default connect(
  function mapStateToProps(state) {
    return {
      counter: state.count.count,
      username: state.user.username
    };
  },
  function mapDispatchToProps(dispatch) {
    return {
      add: num => dispatch(add(num)),
      reName: name => dispatch(rename(name))
    };
  }
)(Index);
