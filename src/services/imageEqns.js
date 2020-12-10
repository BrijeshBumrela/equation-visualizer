import axios from 'axios';

export default (port) => {
    const url = `http://localhost:${port}`;

    const getEquationsFromImage = async (image) => {
        return await axios.post(url, image)
    }

    return getEquationsFromImage
}
