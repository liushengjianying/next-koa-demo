import { withRouter } from 'next/router'
import getConfig from 'next/config'
// 异步加载组件
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Head from 'next/head'
import styled from 'styled-components'

const Title = styled.h1`
  color: yellow;
  font-size: 40px;
`

const Comp = dynamic(import('../components/comp'))

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig

const color = '#113366'

const A = ({ router, name, time }) => {
  console.log(serverRuntimeConfig, publicRuntimeConfig)
  
  return (
    <>
      <Title>This is title {time}</Title>
      <Comp />
      <Link href="#aaa">
        <a className='link'>
          A {router.query.id} {name} {process.env.customKey}
        </a>
      </Link>
      <style jsx>
        {`
        a {
          color: blue;
        }
        .link {
          color: ${color};
        }
      `}
      </style>
    </>
  )
}

A.getInitialProps = async ctx => {
  const moment = await import('moment')

  const promise = new Promise(resolve => {
    setTimeout(() => {
      resolve({
        name: 'jokcy',
        time: moment.default(Date.now() - 60 * 1000).fromNow(),
      })
    }, 1000)
  })

  return await promise
}

export default withRouter(A)