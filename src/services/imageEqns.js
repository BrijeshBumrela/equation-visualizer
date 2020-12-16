import axios from 'axios';

export default (port) => {
    const url = `http://localhost:${port}`;

    const getEquationsFromImage = async (image) => {
        const formData = new FormData();

        formData.append("myFile", image)
        return await axios.post(url, image)
    }

    return getEquationsFromImage
}
