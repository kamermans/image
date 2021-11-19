import { joinURL } from 'ufo'
import type { ProviderGetImage } from 'src'
import { createOperationsGenerator } from '~image'

export const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'w',
    height: 'h',
    quality: 'cmpr',
    format: 'f',
    fit: 'm',
    passThrough: 'pass',
    sharpen: 's',
    rotate: 'r',
    screenPercent: 'pc',
    crop: 'cr',
    inline: 'in',
    metadata: 'meta'
  },
  valueMap: {
    fit: {
      cover: 'cropbox',
      contain: 'letterbox',
      fill: 'stretch',
      inside: 'box',
      outside: 'box'
    },
    format: {
      jpeg: 'jpg'
    },
    quality (value: string) {
      // ImageEngine uses compression, which is the opposite of quality,
      // so quality 90 == compression 10.  Convert using: compression = 100 - quality
      return (100 - parseInt(value, 10)).toString()
    }
  },
  joinWith: '/',
  formatter: (key, value) => `${key}_${value}`
})

export const getImage: ProviderGetImage = (src, { modifiers = {}, baseURL = '/' } = {}) => {
  const operations = operationsGenerator(modifiers)
  return {
    url: joinURL(baseURL, src + (operations ? ('?imgeng=/' + operations) : ''))
  }
}
