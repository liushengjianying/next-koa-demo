import { useEffect } from "react";
import { connect } from "react-redux";
import Lru from 'lru-cache'
import Router, { withRouter } from 'next/router'

import getConfig from 'next/config'

import Repo from '../components/Repo'

import { Button, Icon, Tabs } from 'antd'

import { cacheArray } from '../lib/repo-basic-cache'

const cache = new Lru({
  maxAge: 1000 * 10
})

const api = require("../lib/api");

const { publicRuntimeConfig } = getConfig()

const TabPane = Tabs.TabPane

let cachedUserRep, cachedUserStaredRep;

const isServer = typeof window === 'undefined';

function Index({ userResponse, userStaredResponse, user, router }) {
  console.log(userResponse, userStaredResponse, user);

  const tabKey = router.query.key || '1'

  const handleTabChange = (activeKey) => {
    Router.push(`/?key=${activeKey}`)
  }

  // useEffect(() => {
  //   if (!isServer) {
  //     // if (userResponse) {
  //     //   cache.set('userRep', userResponse)
  //     // }
  //     // if (userStaredResponse) {
  //     //   cache.set('userStaredRep', userStaredResponse)
  //     // }
  //     cachedUserRep = userResponse
  //     cachedUserStaredRep = userStaredResponse

  //     const timeout = setTimeout(() => {
  //       cachedUserRep = null
  //       cachedUserStaredRep = null
  //     }, 1000 * 10)
  //   }
  // }, [userResponse, userStaredResponse])

  useEffect(() => {
    if (!isServer) {
      cacheArray(userResponse);
      cacheArray(userStaredResponse);
    }
  });

  if (!user || !user.id) {
    return (
      <div className="root">
        <span>您还未登陆</span>
        <Button type="primary" href={publicRuntimeConfig.OAUTH_URL}>点击登陆</Button>
        <style jsx>{`
        .root {
          height: 400px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>
      </div>
    )
  }
  return (
    <div className="root">
      <div className="user-info">
        <img src={user.avatar_url} alt="user avatar" className="avatar" />
        <span className="login">{user.login}</span>
        <span className="name">{user.name}</span>
        <span className="bio">{user.bio}</span>
        <p className="email">
          <Icon type="mail" style={{ marginRight: 10 }} />
          <a href={`mailto:${user.email}`}>{user.email}</a>
        </p>
      </div>
      <div className="user-response">
        <div className="user-repos">
          {/* {
            userResponse.map(item => (
              <Repo repo={item} />
            ))
          } */}
          <Tabs activeKey={tabKey} onChange={handleTabChange} animated={false}>
            <TabPane tab="你的仓库" key="1">
              {
                userResponse.map(item => (
                  <Repo key={item.id} repo={item} />
                ))
              }
            </TabPane>
            <TabPane tab="你关注的仓库" key="2">
              {
                userStaredResponse.map(item => (
                  <Repo key={item.id} repo={item} />
                ))
              }
            </TabPane>
          </Tabs>
        </div>
      </div>
      <style jsx>{`
        .root {
          display: flex;
          align-items: flex-start;
          padding: 20px 0;
          max-width: 1200px;
        }
        .user-info {
          width: 200px;
          margin-right: 40px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
        }
        .login {
          font-weight: 800;
          font-size: 20px;
          margin-top: 20px;
        }
        .name {
          font-size: 16px;
          color: #777;
        }
        .bio {
          margin-top: 20px;
          color: #333;
        }
        .avatar {
          width: 100%;
          border-radius: 5px;
        }
        .user-response {
          flex-grow: 1;
        } 
      `}</style>
    </div>
  )
}

Index.getInitialProps = async ({ ctx }) => {

  console.log('3333333333333', ctx.store)

  const user = ctx.store.getState().user;

  if (!user || !user.id) {
    return {
      isLogin: false
    };
  }

  if (!isServer) {
    // if (cache.get('userRep') && cache.get('userStaredRep')) {
    //   return {
    //     userResponse: cache.get('userRep'),
    //     userStaredResponse: cache.get('userStaredRep')
    //   }
    // }

    if (cachedUserRep && cachedUserStaredRep) {
      return {
        userResponse: cachedUserRep,
        userStaredResponse: cachedUserStaredRep
      }
    }
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

export default withRouter(connect(mapStateToProps)((Index)));
