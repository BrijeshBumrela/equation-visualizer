import axios from 'axios';

export default (port) => {
    const url = `https://btpheq.herokuapp.com/main/detectI`;

    const getEquationsFromImage = async (image) => {
        const formData = new FormData();

        formData.append("myFile", image)
        return await axios.post(url, formData)
    }

    return getEquationsFromImage
}
