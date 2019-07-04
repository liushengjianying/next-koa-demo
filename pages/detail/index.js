import withRepoBasic from "../../components/with-repo-basic";
import api from "../../lib/api";
import dynamic from "next/dynamic";

// 异步调用组件，该组件中引入的包会在打包时候额外放进一个新的容器，当其他组件也调用该组件时候，就等于节省了空间
const MDRender = dynamic(() => import("../../components/markDownRender"), {
  loading: () => <span>Loading</span>
});

function Detail({ readme }) {
  return <MDRender content={readme.content} isBase64={true} />;
}

Detail.getInitialProps = async ({
  ctx: {
    query: { owner, name },
    req,
    res
  }
}) => {
  const readResp = await api.request(
    {
      url: `/repos/${owner}/${name}/readme`
    },
    req,
    res
  );

  return {
    readme: readResp.data
  };
};

export default withRepoBasic(Detail, "index");
