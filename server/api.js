import axios from '../util/axios'

export async function logOut() {
    return await axios.post('/logout')
}
