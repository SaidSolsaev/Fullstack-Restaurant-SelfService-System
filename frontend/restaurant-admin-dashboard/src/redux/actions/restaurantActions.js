import api from '../../utils/api.js';

import { 
  restaurantDataRequest, 
  restaurantDataSuccess, 
  restaurantDataFailure 
} from '../slices/restaurantSlice';

export const fetchRestaurantData = () => async (dispatch) => {
    dispatch(restaurantDataRequest());

    try {
        const response = await api.get('/api/restaurants-me');
        dispatch(restaurantDataSuccess(response.data));
    } catch (error) {
        dispatch(restaurantDataFailure('Failed to fetch restaurant data'))
    }
}