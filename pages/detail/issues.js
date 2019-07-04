import { useState, useCallback } from "react";
import { Avatar, Button } from "antd";
import SearchUser from "../../components/searchUser";
import dynamic from "next/dynamic";
import { getLastUpdated } from "../../lib/util";
import withRepoBasic from "../../components/with-repo-basic";
import api from "../../lib/api";

const MDRender = dynamic(() => import("../../components/markDownRender"));

function IssuesDetail({ issue }) {
  return (
    <div className="root">
      <MDRender content={issue.body} />
      <div className="actions">
        <Button href={issue.html_url} target="_blank">
          打开Issue讨论页面
        </Button>
      </div>
      <style jsx>{`
        .root {
          background: #fefefe;
          padding: 20px;
        }
        .actions {
          text-align: right;
        }
      `}</style>
    </div>
  );
}

function IssuesItem({ issue }) {
  const [showDetail, setShowDetail] = useState(false);

  const toggleShowDetail = useCallback(() => {
    setShowDetail(detail => !detail);
  }, []);

  return (
    <>
      <div className="issue">
        <Button
          type="primary"
          size="small"
          style={{ position: "absolute", right: 10, top: 10 }}
          onClick={toggleShowDetail}
        >
          {showDetail ? "隐藏" : "查看"}
        </Button>
        <div className="avatar">
          <Avatar src={issue.user.avatar_url} shape="square" size={50} />
        </div>
        <div className="main-info">
          <h6>
            <span>{issue.title}</span>
          </h6>
          <p className="sub-info">
            <span>Updated at {getLastUpdated(issue.updated_at)}</span>
          </p>
        </div>
        <style jsx>{`
          .issue {
            display: flex;
            position: relative;
            padding: 10px;
          }
          .issue:hover {
            background: #fafafa;
          }
          .issue + .issue {
            border-top: 1px solid #eee;
          }
          .main-info > h6 {
            max-width: 600px;
            font-size: 16px;
            padding-right: 40px;
          }
          .avatar {
            margin-right: 20px;
          }
          .sub-info {
            margin-bottom: 0;
          }
          .sub-info > span + span {
            display: inline-block;
            margin-left: 20px;
            font-size: 12px;
          }
        `}</style>
      </div>
      {showDetail ? <IssuesDetail issue={issue} /> : null}
    </>
  );
}

function Issues({ issues }) {
  console.log(issues);
  return (
    <div className="root">
      <SearchUser />
      <div className="issues">
        {issues.map(issue => (
          <IssuesItem issue={issue} key={issue.id} />
        ))}
      </div>
      <style jsx>{`
        .issues {
          border: 1px solid #eee;
          border-radius: 5px;
          margin: 20px 0;
        }
      `}</style>
    </div>
  );
}

Issues.getInitialProps = async ({
  ctx: {
    query: { owner, name },
    req,
    res
  }
}) => {
  const issuesResp = await api.request(
    {
      url: `/repos/${owner}/${name}/issues`
    },
    req,
    res
  );

  return {
    issues: issuesResp.data
  };
};

export default withRepoBasic(Issues, "issues");
