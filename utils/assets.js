const getColors = require('get-image-colors')
var Vibrant = require('node-vibrant')

const resolveMetaData = (make, image) => {
    let cleanMake;
    cleanMake = make.toLowerCase().replace('chev', 'Chevrolet')
    cleanMake = make.toLowerCase().replace('biuck', 'Buick')
    cleanMake = make.toLowerCase().replace('cmc', 'GMC')
    cleanMake = make.toLowerCase().replace('cadilac', 'Cadillac')
    cleanMake = make.toLowerCase().replace('cadillacc', 'Cadillac')
    cleanMake = make.toLowerCase().replace('cadilacc', 'Cadillac')
    
    // getColors(image.buffer, image.mimetype).then(colors => {
    //     // `colors` is an array of color objects
    //     //console.log(colors);
    //     colors.map(color => console.log(color.hex()))
    //   })

    Vibrant.from(image.buffer).getPalette((err, palette) => {

        console.log("Pallette:::", palette);

        console.log("RGB:::",palette.DarkVibrant._rgb);

        const red =  palette.DarkVibrant._rgb[0]
        const green =  palette.DarkVibrant._rgb[1]
        const blue =  palette.DarkVibrant._rgb[2]
        const hex = rgbToHex(red, green, blue);
        console.log("Hex:::",hex);
    })


}

const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')

module.exports = {
    resolveMetaData
}