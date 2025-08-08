import axios from "axios"

export const baseUrl = `http://localhost:2525/api/hijab` 
// export const baseUrl = `https://final-hackathon-server-ten.vercel.app/api/auth` 

export const apiReviewHandle = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
})