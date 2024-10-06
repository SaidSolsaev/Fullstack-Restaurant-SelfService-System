

export const getRestaurantInfo = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/restaurants/1');
        const json = await response.json();
        
        return json;
    } catch (error) {
        console.error('Failed to fetch restaurant info:', error);
    }
  };