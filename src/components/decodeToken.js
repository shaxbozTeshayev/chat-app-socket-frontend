import jwtDecode from 'jwt-decode';

export const DecodeToken = (token) => {
    return jwtDecode(token);
}