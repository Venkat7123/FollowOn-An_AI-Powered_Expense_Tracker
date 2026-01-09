import axios from 'axios';

const api = axios.create({
    baseURL: 'https://followon-backend.onrender.com',
})

export default api;