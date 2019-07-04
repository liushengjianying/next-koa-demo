import { useState, useCallback, useEffect } from "react";
import { Avatar, Button, Select, Spin } from "antd";
import SearchUser from "../../components/searchUser";
import dynamic from "next/dynamic";
import { getLastUpdated } from "../../lib/util";
import withRepoBasic from "../../components/with-repo-basic";
import api from "../../lib/api";

const MDRender = dynamic(() => import("../../components/markDownRender"));

const CACHE = {};

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
            {issue.labels.map(item => (
              <Label label={item} key={item.id} />
            ))}
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

function makeQuery(creator, state, label) {
  let creatorStr = creator ? `creator=${creator}` : "";
  let stateStr = state ? `state=${state}` : "";
  let labelStr = "";
  if (label && label.length > 0) {
    labelStr = `labels=${label.join(",")}`;
  }

  const arr = [];
  if (creatorStr) arr.push(creatorStr);
  if (stateStr) arr.push(stateStr);
  if (labelStr) arr.push(labelStr);

  return `?${arr.join("&")}`;
}

function Label({ label }) {
  return (
    <>
      <span className="label" style={{ backgroundColor: `#${label.color}` }}>
        {label.name}
      </span>
      <style jsx>{`
        .label {
          display: inline-block;
          line-height: 20px;
          margin-left: 15px;
          padding: 3px 10px;
          border-radius: 3px;
          font-size: 14px;
        }
      `}</style>
    </>
  );
}

const isServer = typeof window === "undefined";
const Option = Select.Option;
function Issues({ InitialIssues, labels, owner, name }) {
  console.log(InitialIssues, labels);

  const [creator, setCreator] = useState();
  const [state, setState] = useState();
  const [label, setLabel] = useState([]);
  const [issues, setIssues] = useState(InitialIssues);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!isServer) {
      CACHE[`${owner}/${name}`] = labels;
    }
  }, [labels, owner, name]);

  const handleCreatorChange = useCallback(value => {
    setCreator(value);
  }, []);

  const handleStateChange = useCallback(value => {
    setState(value);
  }, []);

  const handleLabelChange = useCallback(value => {
    setLabel(value);
  }, []);

  const queryStr = makeQuery(creator, state, label);

  const handleSearch = useCallback(() => {
    setFetching(true);
    api
      .request({
        url: `/repos/${owner}/${name}/issues${queryStr}`
      })
      .then(res => {
        setIssues(res.data);
        setFetching(false);
      })
      .catch(err => {
        console.log(err);
        setFetching(false);
      });
  }, [owner, name, creator, state, label]);

  return (
    <div className="root">
      <div className="search">
        <SearchUser onChange={handleCreatorChange} value={creator} />
        <Select
          placeholder="状态"
          onChange={handleStateChange}
          value={state}
          style={{ width: 200, marginLeft: 20 }}
        >
          <Option value="all">all</Option>
          <Option value="open">open</Option>
          <Option value="closed">closed</Option>
        </Select>
        <Select
          mode="multiple"
          placeholder="label"
          onChange={handleLabelChange}
          value={label}
          style={{ flexGrow: 1, marginLeft: 20, marginRight: 20 }}
        >
          {labels.map(item => (
            <Option value={item.name} key={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
        <Button disabled={fetching} type="primary" onClick={handleSearch}>
          搜索
        </Button>
      </div>
      {fetching ? (
        <div className="loading">
          <Spin />
        </div>
      ) : (
        <div className="issues">
          {issues.map(item => (
            <IssuesItem issue={item} key={item.id} />
          ))}
        </div>
      )}
      <style jsx>{`
        .issues {
          border: 1px solid #eee;
          border-radius: 5px;
          margin: 20px 0;
        }
        .search {
          display: flex;
        }
        .loading {
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
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
  const full_name = `${owner}/${name}`;
  const fetches = await Promise.all([
    await api.request(
      {
        url: `/repos/${owner}/${name}/issues`
      },
      req,
      res
    ),
    CACHE[full_name]
      ? Promise.resolve({data: CACHE[full_name]})
      : await api.request(
          {
            url: `/repos/${owner}/${name}/labels`
          },
          req,
          res
        )
  ]);

  return {
    owner,
    name,
    InitialIssues: fetches[0].data,
    labels: fetches[1].data
  };
};

export default withRepoBasic(Issues, "issues");
