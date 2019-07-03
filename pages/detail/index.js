import withRepoBasic from "../../components/with-repo-basic";
import api from "../../lib/api";
import dynamic from "next/dynamic";

// loading加载js的时候显示
const MDRender = dynamic(() => import("../../components/markDownRender"), {
  loading: () => <p>Loading</p>
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
