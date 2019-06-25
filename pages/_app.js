import App, { Container } from "next/app";
import Layout from "../components/Layout";
import myContext from "../lib/my-context";
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
            <myContext.Provider value={this.state.context}>
              <Component {...pageProps} />
              <button
                onClick={() =>
                  this.setState({ context: `${this.state.context}1111` })
                }
              >
                update context
              </button>
            </myContext.Provider>
          </Layout>
        </Provider>
      </Container>
    );
  }
}

// export default withRedux(createStore)(withReduxSaga(wrapperRedux(MyApp)));
export default withRedux(createStore)(withReduxSaga(MyApp));
