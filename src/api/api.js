import axios from 'axios';

const LOCALHOST = 'http://localhost:9999';
const BASE_URL = process.env.NODE_ENV === 'production'
    ? location.origin
    : LOCALHOST;

export const getImage = (canvas, sessionID) => {
    axios.get(`${BASE_URL}/image?sessionID=${sessionID}`)
        .then((res) => {
            const img = new Image();
            img.src = res.data;
            img.onload = () => {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
        })
        .catch(console.error);
}

export const saveImage = (image, sessionID) => {
    axios.post(`${BASE_URL}/image?sessionID=${sessionID}`, { image })
        .catch(console.error);
}
