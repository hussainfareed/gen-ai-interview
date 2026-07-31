import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

// Har request ke sath, agar localStorage mein token hai to Authorization header mein bhej do
// (Safari / iOS cross-site cookie block hone ki surat mein ye backup ka kaam karega)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function register({username, email, password}){
    try{
        const response = await api.post("/api/auth/register", {
            username, email, password
         });

        if(response.data?.token){
            localStorage.setItem("token", response.data.token);
        }

        return response.data
    }catch(err){
        console.log(err);
        throw err;
    }
};

export async function login({email, password}){
    try{
        const response = await api.post("/api/auth/login", {
            email, password
        });

        if(response.data?.token){
            localStorage.setItem("token", response.data.token);
        }

        return response.data

    }catch(err){
        console.log(err);
        throw err;
    }
};

export async function logout(){
    try{
        const response = await api.get("/api/auth/logout");

        localStorage.removeItem("token");

        return response.data
    }catch(err){
        console.log(err)
        localStorage.removeItem("token");
        throw err;
    }
};

export async function getMe(){
    try{
        const response = await api.get("/api/auth/get-me");

        return response.data;
        
    }catch(err){
        console.log(err)
        throw err;
    }
};
