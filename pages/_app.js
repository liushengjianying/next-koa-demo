import App, { Container } from "next/app";
import Layout from "../components/Layout";
import PageLoading from "../components/pageLoading.jsx";
import "antd/dist/antd.css";

import Router from "next/router";
import Link from "next/link";

import { Provider } from "react-redux";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";

import createStore from "../store/store";
import { updateUser } from "../actions/actions";

import axios from "axios";
// import wrapperRedux from '../lib/withRedux'

class MyApp extends App {
  state = {
    context: "value",
    loading: false
  };

  startLoading = () => {
    this.setState({
      loading: true
    });
  };

  stopLoading = () => {
    this.setState({
      loading: false
    });
  };

  componentDidMount() {
    Router.events.on("routeChangeStart", this.startLoading);
    Router.events.on("routeChangeComplete", this.stopLoading);
    Router.events.on("routeChangeError", this.stopLoading);
  }

  componentWillUnmount() {
    Router.events.off("routeChangeStart", this.startLoading);
    Router.events.off("routeChangeComplete", this.stopLoading);
    Router.events.off("routeChangeError", this.stopLoading);
  }

  static async getInitialProps(ctx) {
    const { Component } = ctx;
    const { store, isServer, req } = ctx.ctx;
    console.log("app init", ctx);

    if (isServer) {
      const session = req.session ;
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
    const { loading } = this.state;

    return (
      <Container>
        <Provider store={store}>
          {loading ? <PageLoading /> : null}
          <Layout>
            <Link href="/">
              <a>Index</a>
            </Link>
            <Link href="/detail">
              <a>Detail</a>
            </Link>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </Container>
    );
  }
}

// export default withRedux(createStore)(withReduxSaga(wrapperRedux(MyApp)));
export default withRedux(createStore)(withReduxSaga(MyApp));
