import { useState, useCallback } from "react";
import { Button, Layout, Icon, Input, Avatar, Tooltip, Dropdown, Menu } from "antd";
import Container from './Container'
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const { Header, Content, Footer } = Layout;

import { connect } from 'react-redux'

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

function MyLayout({ children, user }) {
  const [search, setSearch] = useState("");

  const handleSearchChange = useCallback(event => {
    setSearch(event.target.value);
  }, []);

  const handleOnSearch = useCallback(() => { }, []);

  const userDropDown = (
    <Menu>
      <Menu.Item>
        <a href="javascript:void(0)" onClick={handleLogout}>
          登 出
        </a>
      </Menu.Item>
    </Menu>
  )

  const handleLogout = useCallback(() => {

  }, [])

  return (
    <Layout>
      <Header>
        <Container renderer={<div className="header-inner" />}>
          <div className="header-left">
            <div className="log">
              <Icon type="github" style={githubIconStyle} />
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
              {
                user && user.id ? (
                  <Dropdown overlay={userDropDown}>
                    <a href='/'>
                      <Avatar size={40} src={user.avatar_url} />
                    </a>
                  </Dropdown>
                ) : (
                    <Tooltip title="点击进行登陆">
                      <a href={publicRuntimeConfig.OAUTH_URL}>
                        <Avatar size={40} icon="user" />
                      </a>
                    </Tooltip>
                  )
              }
            </div>
          </div>
        </Container>
      </Header>
      <Content>
        <Container>
          {children}
        </Container>
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
          height: 100%;
        }
        .ant-layout-header {
          padding-left: 0;
          padding-right: 0
        }
      `}</style>
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}
export default connect(mapStateToProps)(MyLayout)