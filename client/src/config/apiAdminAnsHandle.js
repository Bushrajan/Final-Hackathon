import axios from "axios"

// export const baseUrl = `http://localhost:2525/api/user-questions`
export const baseUrl = `https://final-hackathon-server-ten.vercel.app/api/admin-questions`


const apiAdminAnsHandle = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
})

export default apiAdminAnsHandle