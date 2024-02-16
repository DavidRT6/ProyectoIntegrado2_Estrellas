/**
 * Asynchronously fetches data from the specified URL.
 * 
 * @param {string} url - The URL from which to fetch the data.
 * @returns {Promise} - A Promise that resolves to the fetched data or rejects with an error.
 */
const getData = async (url) => {
    try {
        const response = await fetch(url);
        if (response.ok) return await response.json();
    } catch (error) {
        return console.log(error);
    }
};

export default getData;