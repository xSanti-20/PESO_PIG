import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5059/',
    headers: {
       'accept': '*/*',
       'Content-Type': 'application/json'
        
   }
});

export default axiosInstance;