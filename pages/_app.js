import App, { Container } from "next/app";
import Layout from "../components/Layout";
import "antd/dist/antd.css";

import { Provider } from "react-redux";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";

import createStore from "../store/store";
// import wrapperRedux from '../lib/withRedux'

class MyApp extends App {
  state = {
    context: "value"
  };

  static async getInitialProps(ctx) {
    const { Component } = ctx;
    console.log("app init");

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

    console.log("3333333333", store);

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
