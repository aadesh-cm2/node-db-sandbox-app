export const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
}).join('')

export const palletes = [
    "Vibrant",
    "Muted",
    "LightVibrant",
    "LightMuted",
    "DarkVibrant",
    "DarkMuted"
]

export function cleanObj(obj) {
    console.log(obj)
    for (var propName in obj) {
      if (obj[propName] === '' || obj[propName] === undefined) {
        delete obj[propName];
      }
      else if (typeof obj[propName] === "object"){
        if(Object.keys(obj[propName]).length==0)
            delete obj[propName]
        else
        cleanObj(obj[propName])

      }
    }
    return obj
  }