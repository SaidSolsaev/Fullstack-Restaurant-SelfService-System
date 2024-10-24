import axios from "axios";
import {loginRequest, loginSuccess, loginFailure, logout} from "../slices/authSlice";
import {jwtDecode} from "jwt-decode";

export const loginUser = (email, password) => async (dispatch) => {
    dispatch(loginRequest());

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, {
            email,
            password
        })

        const {access_token} = response.data;

        const decodedToken = jwtDecode(access_token);
        const restaurantId = decodedToken.restaurantId;

        dispatch(loginSuccess({access_token, restaurantId}));
        localStorage.setItem('token', access_token);
        localStorage.setItem('restaurantId', restaurantId);
    } catch (error) {
        console.log(error)
        dispatch(loginFailure(error.response?.data?.error || 'Login failed'))
    }
}

export const logoutUser = () => (dispatch) => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('restaurantId');
}