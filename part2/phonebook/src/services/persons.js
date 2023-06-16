import axios from "axios";
const baseURL = "/api/persons"

const getAll = () => {
    const request = axios.get(baseURL)
    return request.then(response => response.data)
}

const add = (newPerson) => {
    const request = axios.post(baseURL, newPerson)
    return request.then(response => response.data)
}

const update = (id, updateData) => {
    const request = axios.put(`${baseURL}/${id}`, updateData)
    return request.then(response => response.data)
}

const deletePerson = (id) => {
    const request = axios.delete(`${baseURL}/${id}`)
    return request.then(response => response)
}

export default { getAll, add, update, deletePerson }