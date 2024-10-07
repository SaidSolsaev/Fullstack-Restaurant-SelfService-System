

export const getRestaurantInfo = async () => {
    try {
        const response = await fetch('http://192.168.0.170:3000/api/restaurants/1');
        const json = await response.json();
        
        return json;
    } catch (error) {
        console.error('Failed to fetch restaurant info:', error);
    }
};

export const getMenuItems = async () => {
    try {
        const response = await fetch('http://192.168.0.170:3000/api/menu-items');
        const json = await response.json();
        
        return json;
    } catch (error) {
        console.error('Failed to fetch menu-items: ', error);
    }
}

export const getCategories = async () => {
    try {
        const response = await fetch('http://192.168.0.170:3000/api/categories');
        const json = await response.json();
        
        return json;
    } catch (error) {
        console.error('Failed to fetch categories: ', error);
    }
}