import { useState, useCallback } from "react";
import { Button, Layout, Icon, Input, Avatar } from "antd";
import Container from './Container'

const { Header, Content, Footer } = Layout;

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

const Comp = ({ color, children, style }) => <div style={{ color, ...style }}>{children}</div>

export default ({ children }) => {
  const [search, setSearch] = useState("");

  const handleSearchChange = useCallback(event => {
    setSearch(event.target.value);
  }, []);

  const handleOnSearch = useCallback(() => { }, []);

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
              <Avatar size={40} icon="user" />
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
