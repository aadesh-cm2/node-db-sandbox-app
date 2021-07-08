import React, {useState} from 'react';
import {Button} from '@material-ui/core';

export default function MultipleUploadButton(props) {

    const handleFiles = event => {

        const files = event.target.files
        const images = []
        console.log(files.length);
        for (let i = 0; i < files.length; i++) 
            images.push(files[i])

        props.setFiles(images);

        const imageBlobs = [];

        // ::::Images color pallete and hex to be configured later::::

        images.map(image => {
            imageBlobs.push(URL.createObjectURL(image))
        })

        //     Vibrant.from(URL.createObjectURL(image)).getPalette((err, palette) => {
        //         if (err)
        //             console.log(err)


        //         palletes.map(pallete => {

        //             const red = Math.round(palette[pallete]._rgb[0])
        //             const green = Math.round(palette[pallete]._rgb[1])
        //             const blue = Math.round(palette[pallete]._rgb[2])
        //             const hex = rgbToHex(red, green, blue);

        //             hexCodes.push({name: image.name, hex});
        //         })
        //     })


        // console.log("Hex codes::", hexCodes)
        props.setFileBlobs(imageBlobs)
        // setColors(hexCodes)

        // for(let j=0; j<hexCodes.length; j++){
        //     for(let k=j; )
        // }


    }

    return (
        <>
            <Button variant="contained" color="primary" component="label">
                <input type="file"
                    onChange={handleFiles}
                    required
                    multiple
                    hidden/>
                Select Images
            </Button>
            {
            props.images && props.images.length ? <Button variant="contained" color="secondary" style={{marginLeft:"5px"}} onClick={
                () => {
                    props.setFiles([]);
                    props.setFileBlobs([])
                }
            }>Change images</Button> : null
        } </>
    )
}
