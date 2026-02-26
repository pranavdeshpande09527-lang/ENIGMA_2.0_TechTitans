/**
 * API Service — Axios instance with dynamic BACKEND_URL from .env
 */
import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

/** GET /aqi/{city} */
export const getAQI = (city) => API.get(`/aqi/${city}`).then((r) => r.data);

/** POST /calculate-risk */
export const calculateRisk = (payload) =>
    API.post('/calculate-risk', payload).then((r) => r.data);

/** GET /user/{id} */
export const getUser = (userId) =>
    API.get(`/user/${userId}`).then((r) => r.data);

/** GET /public-analytics */
export const getAnalytics = () =>
    API.get('/public-analytics').then((r) => r.data);

export default API;
