import { useState, useCallback } from "react";
import {
  Button,
  Layout,
  Icon,
  Input,
  Avatar,
  Tooltip,
  Dropdown,
  Menu
} from "antd";
import Link from "next/link";
import Container from "./Container";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const { Header, Content, Footer } = Layout;

import { connect } from "react-redux";
import { withRouter } from "next/router";

import { logout } from "../actions/actions";

const githubIconStyle = {
  display: "block",
  color: "white",
  fontSize: 40,
  paddingTop: 10,
  marginRight: 20
};

const footStyle = {
  textAlign: "center"
};

function MyLayout({ children, user, toLogout, router }) {
  const urlQuery = router.query && router.query.query;

  const [search, setSearch] = useState(urlQuery || "");

  const handleSearchChange = useCallback(event => {
    setSearch(event.target.value);
  }, []);

  const handleOnSearch = useCallback(() => {
    router.push(`/search?query=${search}`)
  }, [search]);

  const handleLogout = useCallback(() => {
    toLogout();
  }, [toLogout]);

  const userDropDown = (
    <Menu>
      <Menu.Item>
        <a href="javascript:void(0)" onClick={handleLogout}>
          登 出
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      <Header>
        <Container renderer={<div className="header-inner" />}>
          <div className="header-left">
            <div className="log">
              <Link href='/'>
                <Icon type="github" style={githubIconStyle} />
              </Link>
            </div>
            <div>
              <Input.Search
                placeholder="搜索仓库"
                value={search}
                onChange={handleSearchChange}
                onSearch={handleOnSearch}
              />
            </div>
          </div>
          <div className="header-right">
            <div className="user">
              {user && user.id ? (
                <Dropdown overlay={userDropDown}>
                  <a href="/">
                    <Avatar size={40} src={user.avatar_url} />
                  </a>
                </Dropdown>
              ) : (
                  <Tooltip title="点击进行登陆">
                    <a href={`/prepare-auth?url=${router.asPath}`}>
                      <Avatar size={40} icon="user" />
                    </a>
                  </Tooltip>
                )}
            </div>
          </div>
        </Container>
      </Header>
      <Content>
        <Container>{children}</Container>
      </Content>
      <Footer style={footStyle}>
        Develop by Aoch @
        <a href="mailto:aochwang@gmail.com">aochwang@gmail.com</a>
      </Footer>
      <style jsx>{`
        .header-inner {
          display: flex;
          justify-content: space-between;
        }
        .header-left {
          display: flex;
          justify-content: flex-start;
        }
      `}</style>
      <style jsx global>{`
        #__next {
          height: 100%;
        }
        .ant-layout {
          min-height: 100%;
        }
        .ant-layout-header {
          padding-left: 0;
          padding-right: 0;
        }
        .ant-layout-content {
          background: #fff;
        }
      `}</style>
    </Layout>
  );
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};
const mapStateToDispatch = dispatch => {
  return {
    toLogout: () => dispatch(logout())
  };
};

export default connect(
  mapStateToProps,
  mapStateToDispatch
)(withRouter(MyLayout));
