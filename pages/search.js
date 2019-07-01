import { withRouter } from "next/router"
import api from '../lib/api'
import { Row, Col, List, Pagination } from 'antd'
import Link from 'next/link'
import { memo, isValidElement } from 'react'
import Repo from '../components/Repo'

const LANGUAGE = ['Javascript', 'HTML', 'CSS', 'Typescript', 'Java', 'Go']
// desc 倒叙 asc 正序
const SORT_TYPES = [
  {
    name: 'Best Match'
  },
  {
    name: 'Most Stars',
    value: 'stars',
    order: 'desc'
  },
  {
    name: 'Fewest Stars',
    value: 'stars',
    order: 'asc'
  },
  {
    name: 'Most Forks',
    value: 'forks',
    order: 'desc'
  },
  {
    name: 'Fewest Stars',
    value: 'forks',
    order: 'asc'
  }
]


/**
 * q: 查询内容
 * sort: 排序方式
 * order: 排序顺序
 * lang: 仓库主语言
 * page: 分页
 */

const selectedItemStyle = {
  borderLeft: '2px solid #e36209',
  fontWeight: 100
}

const FilterLink = memo(({ name, query, lang, sort, order, page }) => {

  let query_string = `?query=${query}`
  if (lang) {
    query_string += `&lang=${lang}`
  }
  if (sort) {
    query_string += `&sort=${sort}&order=${order || 'desc'}`
  }
  if (page) {
    query_string += `&page=${page}`
  }

  query_string += `&per_page=${per_page}`

  return (
    <Link href={`/search${query_string}`}>
      {isValidElement(name) ? name : <a>{name}</a>}
    </Link>
  )
})

const per_page = 20;

function noop() { }

function Search({ router, repos }) {
  console.log(repos)

  const { ...querys } = router.query;
  const { lang, sort, order, page } = router.query;

  return (
    <div className="root">
      <Row gutter={20}>
        <Col span={6}>
          <List
            bordered
            header={<span className="list-header">语言</span>}
            style={{ marginBottom: 20 }}
            dataSource={LANGUAGE}
            renderItem={item => {
              const selected = lang === item;
              return (
                <List.Item style={selected ? selectedItemStyle : null}>
                  {selected ? <span>{item}</span> :
                    <FilterLink
                      {...querys}
                      lang={item}
                      name={item}
                    />}
                </List.Item>
              )
            }}
          />
          <List
            bordered
            header={<span className="list-header">排序</span>}
            dataSource={SORT_TYPES}
            renderItem={item => {
              let selected = false;
              if (item.name === 'Best Match' && !sort) {
                selected = true
              } else if (item.value === sort && item.order === order) {
                selected = true
              }
              return (
                <List.Item style={selected ? selectedItemStyle : null}>
                  {selected ? <span>{item.name}</span> :
                    <FilterLink
                      {...querys}
                      sort={item.value}
                      order={item.order}
                      name={item.name}
                    />}
                </List.Item>
              )
            }}
          />
        </Col>
        <Col span={18}>
          <h3 className="repos-title">{repos.total_count} 个仓库</h3>
          {
            repos.items.map(item => (
              <Repo repo={item} key={item.id} />
            ))
          }
          <div className="pagination">
            <Pagination
              pageSize={per_page}
              current={Number(page) || 1}
              total={1000}
              onChange={noop}
              itemRender={(page, type, ol) => {
                const p = type === 'page' ? page :
                  type === 'prev' ? page - 1 : page + 1
                const name = type === 'page' ? page : ol
                return <FilterLink {...querys} page={p} name={name} />
              }}
            />
          </div>
        </Col>
      </Row>
      <style jsx>{`
        .root {
          padding: 20px 0;
        }
        .list-header {
          font-weight: 800;
          font-size: 16px;
        }
        .repos-title {
          border-bottom: 1px solid #eee;
          font-size: 24px;
          line-height: 50px;
        }
        .pagination {
          padding: 20px;
          text-align: center;
        }
        `}</style>
    </div>
  )
}

Search.getInitialProps = async ({ ctx }) => {
  const { query, sort, lang, order, page } = ctx.query

  if (!query) {
    return {
      repos: {
        total_count: 0
      }
    }
  }

  let query_string = `?q=${query}`
  if (lang) {
    query_string += `+language:${lang}`
  }
  if (sort) {
    query_string += `&sort=${sort}&order=${order || 'desc'}`
  }
  if (page) {
    query_string += `&page=${page}`
  }

  query_string += `&per_page=${per_page}`

  const result = await api.request({
    url: `/search/repositories${query_string}`,
  }, ctx.req, ctx.res)

  return {
    repos: result.data
  }
}

export default withRouter(Search);
