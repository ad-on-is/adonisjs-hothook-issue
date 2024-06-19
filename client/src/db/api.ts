import { getAuthorization } from "./getMe";

const backend = 'http://localhost:3333/api/v1';



const api = async (path : string , options : any = {}) => {

    const authorization = await getAuthorization();

    const op = {
        ...options,
        headers: {
           ...options?.headers,
            authorization
        }
    }
    // console.log(op)
    const response = await fetch(`${backend}${path}` , op)
    return await response.json();
}

export default api;