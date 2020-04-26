import React, { useEffect, useState } from 'react';
import flatten from 'lodash.flatten';
import 'masonry-layout';
import Masonry from 'react-masonry-css';
 
import config from '../config.json';

const COLUMNS = {
    0: 1,
    680: 2,
    960: 3
};

const Gallerie = (props) => {
    const apiKey = config.tumblr.key;
    const sites = config.tumblr.profiles;
    const urls = sites.map(site => `https://api.tumblr.com/v2/blog/${site}.tumblr.com/posts/photo?api_key=${apiKey}&limit=100`);
    const getPhotos = post => {
        return post.photos && post.photos.map(photo => photo.original_size.url);
    };
    const [ pics, setPics ] = useState([]);
    const [ columns, setColumns ] = useState(3);

    useEffect(() => {
        const requests = urls.map(url => fetch(url).then(res => res.json()));
        Promise.all(requests)
            .then(data => {
                const pics = data.reduce((acc, profile) => {
                    console.log(profile)
                    const photos = profile.response.posts.map(getPhotos);
                    return [...acc, ...flatten(photos)];
                }, []);

                setPics(pics);
            });

        const width = window.innerWidth;

        if (width < 960 && width > 680) setColumns(2);
        if (width < 680) setColumns(1);
    }, []);

    return(
        <div className="gallerie">
            <Masonry
                breakpointCols={columns}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column">
                {pics.map(pic => 
                    <img
                        className='pic'
                        data-caman='brightness(10) contrast(30) sepia(60) saturation(-30)'
                        key={pic}
                        src={pic} />
                )}
            </Masonry>
        </div>
    )
}

export default Gallerie;