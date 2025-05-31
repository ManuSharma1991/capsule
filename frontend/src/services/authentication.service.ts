
const getAuthHeader = () => {
    return { headers: { Authorization: 'Bearer ' + localStorage.getItem("token") } };
}

const login = () => {
    localStorage.setItem("token", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6IjlMbEhrTmY3QW9nSkJzYlE5MFpCIn0.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGFwaTIua25vd2xlbnMuY29tIiwiYXVkIjoiaHR0cDpcL1wvbG9jYWwua25vd2xlbnMuY29tIiwianRpIjoiOUxsSGtOZjdBb2dKQnNiUTkwWkIiLCJpYXQiOjE2NDM3MTY0MTIsImV4cCI6MTY0Mzc1OTYxMiwidWlkIjoiVVNSLTYxODExZGE5NTY4YmY4LjI4MzQ4MDA1In0.wMXOzWrtKRFC5n6vcNB7kiL04ev6f_BQssbWPmgNPrc");
}

export const authenticationService = {
    getAuthHeader,
    login
}