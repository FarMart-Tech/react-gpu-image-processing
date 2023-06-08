# glsl-image-processing

## Introduction

This package enables image processing for React-Native on the GPU using the following dependencies: [`expo-gl`](https://www.npmjs.com/package/expo-gl), [`react-native`](https://www.npmjs.com/package/react-native), and [`gl-react`](https://www.npmjs.com/package/gl-react). It provides efficient and performant functions for manipulating images. Currently, two functions are supported:

- changing contrast of the image
- resizing images.

## Installation

To install this package, you can use the following command:

```shell
npm install @opencollabnexus/glsl-image-processing
```

## Usage

To use this package, import it into your project as follows:

```javascript
import {
  changeContrast,
  resizeImage,
} from "@opencollabnexus/glsl-image-processing";
```

### changeContrast

The `changeContrast` function allows you to adjust the contrast of an image. It takes in the following parameters:

```javascript
changeContrast(image: <Asset>, contrast: number)
```

- `image`: expo-asset(refer [here](https://www.npmjs.com/package/expo-asset) for details)
- `contrast`: A number representing the desired contrast level. Positive values increase contrast, while negative values decrease contrast.

The function returns a new array of pixel values representing the modified image with the adjusted contrast.

#### Example

```javascript
import React, { useEffect, useState } from "react";
import { changeContrast } from "@opencollabnexus/glsl-image-processing";
import exampleImage from "./assets/sample.jpeg";

const [state, setState] = useState({ contrast: 1.0, scale: 1.0 });

//load the asset once
useEffect(() => {
  async function loadAsset() {
    const originalImage = Asset.fromModule(exampleImage);
    await originalImage.downloadAsync();
    setState({ ...state, originalImage: originalImage });
  }

  loadAsset();
}, []);

const contrasted = await changeContrast(state.originalImage, state.contrast);
```

### resizeImage

The `resizeImage` function allows you to resize an image to a specified width and height. It takes in the following parameters:

```javascript
resizeImage(image: <Asset>, width: number, height: number,method:string): imageType
```

- `image`: expo-asset(refer [here](https://www.npmjs.com/package/expo-asset) for details)
- `width`: The desired width of the resized image.
- `height`: The desired height of the resized image.
- `method`: Choose from 'bilinear', 'bicubic' or 'lanczos'

The function returns a new array of pixel values representing the resized image.

#### Example

```javascript
import React, { useEffect, useState } from "react";
import { resizeImage } from "@opencollabnexus/glsl-image-processing";
import exampleImage from "./assets/sample.jpeg";

const [state, setState] = useState({ contrast: 1.0, scale: 1.0 });

//load the asset once
useEffect(() => {
  async function loadAsset() {
    const originalImage = Asset.fromModule(exampleImage);
    await originalImage.downloadAsync();
    setState({ ...state, originalImage: originalImage });
  }

  loadAsset();
}, []);

const resized = resizeImage(state.originalImage, 200, 100);
```

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvement, please open an issue on the [repository](https://github.com/FarMart-Tech/react-gpu-image-processing).

## License

This package is provided under the [MIT License](https://opensource.org/licenses/MIT). Feel free to use it in your projects and modify it as needed.

## Acknowledgments

This package was built using the power of `expo-gl`, `react-native`, and `gl-react`. Special thanks to the developers of these libraries for enabling GPU-accelerated image processing.
