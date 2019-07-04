import { memo, useMemo } from "react";
import markDownIt from "markdown-it";
import "github-markdown-css";

const md = new markDownIt({
  html: true,
  linkify: true
});

function b64_to_utf8(str) {
  return decodeURIComponent(escape(atob(str)));
}

export default memo(function markdownRender({ content, isBase64 }) {
  const markdwon = isBase64 ? b64_to_utf8(content) : content;
  const html = useMemo(() => md.render(markdwon), [markdwon]);
  return (
    // 插入字符串
    <div className="markdown-body">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
});
