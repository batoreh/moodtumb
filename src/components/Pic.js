import React from 'react';
import { MdFileDownload, MdLink } from 'react-icons/md';

const downloadURI = (uri, name) => {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const drawImageOnCanvas = (image, resolve) => (evt) => {
    console.log(evt);
    const loadedImage = evt.srcElement;
    const canvas = document.createElement('canvas');
    console.log(loadedImage);
    canvas.width = loadedImage.width;
    canvas.height = loadedImage.height;
    const context = canvas.getContext('2d');
    context.filter = "saturate(20%) hue-rotate(250deg) contrast(80%)";
    context.drawImage(loadedImage, 0, 0, canvas.width, canvas.height);
    document.body.appendChild(canvas);
    resolve(canvas.toDataURL());
    image.removeEventListener('load', drawImageOnCanvas);
};

const Pic = (url) => {
    const getFilteredUrl = (img) => {
        return new Promise((res) => {
            const image = document.createElement('img');
            image.crossOrigin = "anonymous";
            image.src = img;
            console.log(img)
            image.addEventListener('load', drawImageOnCanvas(image, res));
        });    
    }

    const downloadImage = async (img) => {
        const url = await getFilteredUrl(img);
        downloadURI(url, img.split('/')[4]);
    }

    return (
        <div className="pic-container" key={url}>
            <img
                className='pic'
                data-caman='brightness(10) contrast(30) sepia(60) saturation(-30)'
                key={url}
                src={url} />
            <div className="icon-overlay">
                <MdLink onClick={() => downloadImage(url)}/>
            </div>
        </div>
    )
};

export default Pic;