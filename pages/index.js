import { useEffect } from 'react'
const api = require('../lib/api')
import axios from 'axios'

function Index() {
    useEffect(() => {
        axios.post('/github/test', { test: 123 })
    })

    return <span>Index</span>;
}

Index.getInitialProps = async ({ ctx }) => {
    const result = await api.request({
        url: '/search/repositories?q=react'
    }, ctx.req, ctx.res);

    return {
        data: result.data
    };
};

export default Index
