import App, { Container } from "next/app";
import Layout from "../components/Layout";
import "antd/dist/antd.css";

import { Provider } from "react-redux";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";

import createStore from "../store/store";
import { updateUser } from "../actions/actions";
// import wrapperRedux from '../lib/withRedux'

class MyApp extends App {
  state = {
    context: "value"
  };

  static async getInitialProps(ctx) {
    const { Component } = ctx;
    const { store, isServer, req } = ctx.ctx;
    console.log("app init");

    const session = req.session;
    if (isServer) {
      if (session && session.userInfo) {
        console.log("服务端xxxxxxx");
        let userInfo = session.userInfo;
        store.dispatch(updateUser(userInfo));
      }
    }

    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return {
      pageProps
    };
  }

  render() {
    const { Component, pageProps, store } = this.props;

    // console.log("3333333333", store);

    return (
      <Container>
        <Provider store={store}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </Container>
    );
  }
}

// export default withRedux(createStore)(withReduxSaga(wrapperRedux(MyApp)));
export default withRedux(createStore)(withReduxSaga(MyApp));
