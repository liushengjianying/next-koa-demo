import { useState, useCallback, useRef } from "react";
import { Select, Spin } from "antd";
import debounce from "lodash/debounce";

import api from "../lib/api";

const Option = Select.Option;

function searchUser() {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const lastFetchRef = useRef(0);

  const fetchUser = useCallback(
    debounce(value => {
      console.log("fetching user:", value);

      lastFetchRef.current += 1;
      const fetchId = lastFetchRef.current;

      setFetching(true);
      setOptions([]);

      // 这里一定是浏览器环境，不需要req res这些服务端的数据
      api
        .request({
          url: `/search/users?q=${value}`
        })
        .then(res => {
          console.log("user", res);
          const data = res.data.items.map(user => ({
            text: user.login,
            value: user.login
          }));
          setFetching(false);
          setOptions(data);
        });
    }, 500),
    []
  );

  return (
    <Select
      style={{ width: 200 }}
      disabled={fetching}
      showSearch={true}
      notFoundContent={fetching ? <Spin size="small" /> : <span>nothing</span>}
      filterOption={false}
      placeholder="创建者"
      onSearch={fetchUser}
      allowClear={true}
    >
      {options.map(item => (
        <Option value={item.value} key={item.value}>
          {item.text}
        </Option>
      ))}
    </Select>
  );
}

export default searchUser;
