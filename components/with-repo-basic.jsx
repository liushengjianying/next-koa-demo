import Repo from "./Repo";
import api from "../lib/api";
import Link from "next/link";
import { getCache, setCache } from "../lib/repo-basic-cache";
import { withRouter } from "next/router";
import { useEffect } from "react";

function makeQuery(queryObject) {
  const query = Object.entries(queryObject)
    .reduce((result, entry) => {
      result.push(entry.join("="));
      return result;
    }, [])
    .join("&");
  return `?${query}`;
}

const isServer = typeof window === "undefined";

export default (Comp, type = "index") => {
  function withDetail({ repoBasic, router, ...rest }) {
    console.log(repoBasic, router);

    const query = makeQuery(router.query);

    useEffect(() => {
      if (!isServer) {
        setCache(repoBasic);
      }
    });

    return (
      <div className="root">
        <div className="repo-basic">
          <Repo repo={repoBasic} />
          <div className="tabs">
            {type === "index" ? (
              <span className="tab">Readme</span>
            ) : (
              <Link href={`/detail${query}`}>
                <a className="tab index">Readme</a>
              </Link>
            )}

            {type === "issues" ? (
              <span className="tab">issues</span>
            ) : (
              <Link href={`/detail/issues${query}`}>
                <a className="tab issues">Issues</a>
              </Link>
            )}
          </div>
        </div>
        <div>
          <Comp {...rest} />
        </div>
        <style jsx>{`
          .root {
            padding-top: 20px;
          }
          .repo-basic {
            padding: 20px;
            border: 1px solid #eee;
            margin-bottom: 20px;
            border-radius: 5px;
          }
          .tab + .tab {
            margin-left: 20px;
          }
        `}</style>
      </div>
    );
  }

  withDetail.getInitialProps = async context => {
    const { ctx } = context;
    const { owner, name } = ctx.query;
    const full_name = `${owner}/${name}`;
    const cacheResult = getCache(full_name);

    let pageData = {};

    if (Comp.getInitialProps) {
      pageData = await Comp.getInitialProps(context);
    }

    if (cacheResult) {
      return {
        repoBasic: cacheResult,
        ...pageData
      };
    }

    const repoBasic = await api.request(
      {
        url: `/repos/${owner}/${name}`
      },
      ctx.req,
      ctx.res
    );

    // if (!isServer) {
    //   setCache(repoBasic.data);
    // }

    return {
      repoBasic: repoBasic.data,
      ...pageData
    };
  };

  return withRouter(withDetail);
};
