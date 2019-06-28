import { useEffect } from "react";
import { connect } from "react-redux";
const api = require("../lib/api");

function Index({ userResponse, userStaredResponse, isLogin, user }) {
  console.log(userResponse, userStaredResponse, isLogin, user);
  console.log(isLogin, user);

  return <span>Index</span>;
}

Index.getInitialProps = async ({ ctx }) => {

    console.log('3333333333333', ctx.store)

    const user = ctx.store.getState().user;
    
    if (!user || !user.id) {
      return {
        isLogin: false
      };
    }

  const userResponse = await api.request(
    {
      url: "/user/repos"
    },
    ctx.req,
    ctx.res
  );

  const userStaredResponse = await api.request(
    {
      url: "/user/starred"
    },
    ctx.req,
    ctx.res
  );

  return {
    isLogin: true,
    userResponse: userResponse.data,
    userStaredResponse: userStaredResponse.data
  };
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(Index);
