import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newBlog) => {
  // const config = {
  //   headers: { Auhtorization: token }
  // }

  const response = await axios.post(baseUrl, newBlog, { headers: { Authorization: token } })
  return response.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, create, setToken }