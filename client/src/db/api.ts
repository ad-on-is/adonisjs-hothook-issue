const backend = 'http://localhost:3333/api/v1';



const api = async (path : string , options : any = {}) => {
    const response = await fetch(`${backend}${path}` , options)
    return await response.json();
}

export default api;