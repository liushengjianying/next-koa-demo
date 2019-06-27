import axios from '../util/axios'

export async function logOut() {
    return await axios.post('/logout')
}

// 代理github
export async function githubUrl(url, headers) {
    return await axios({
        method: 'GET',
        url,
        headers
    })
}