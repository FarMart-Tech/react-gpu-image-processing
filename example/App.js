import Slider from '@react-native-community/slider';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { changeContrast, resizeImage } from "react-gpu-image-processing"

import exampleImage from './assets/elon.jpeg'
// import exampleImage from './assets/adaptive-icon.png'


export default function GLHeadlessRenderingScreen() {
  let title = 'Headless rendering';
  const [drawing, setDrawing] = useState(false);
  const [state, setState] = useState({ contrast: 1.0, scale: 1.0 });

  console.log("Change Contrast")
  console.log(changeContrast)


  // Load the asset once
  useEffect(() => {
    async function loadAsset() {
      const originalImage = Asset.fromModule(exampleImage);
      await originalImage.downloadAsync();
      setState({ ...state, originalImage: originalImage });
    }

    loadAsset();
  }, [])

  // Redraw the screen when state changes
  useEffect(() => {
    draw()
  }, [state])


  async function draw() {

    if (drawing || state.originalImage === undefined) {
      // if another draw call is already running, we need to skip this one
      return;
    }

    // console.log("Logging the pre draw function")
    // console.log("Draw ", drawing)
    // console.log("Draw ", state)
    setDrawing(true);

    let snapshot = state.originalImage;
    snapshot = await changeContrast(snapshot, state.contrast)

    let outputWidth = Math.floor(state.originalImage.width * state.scale)
    let outputHeight = Math.floor(state.originalImage.height * state.scale)

    // resize the image
    snapshot = await resizeImage(snapshot, outputWidth, outputHeight, 'bicubic')

    // create a new snapshot')

    // delete previous snapshot
    if (state.snapshot) {
      FileSystem.deleteAsync(state.snapshot.uri, { idempotent: true });
    }

    setState({ ...state, snapshot: snapshot });
    setDrawing(false);

    // console.log("Logging the post draw function")
    // console.log("Draw ", drawing)
    // console.log("Draw ", state)
  }

  const onContrastChange = (contrast) => {
    setState({ ...state, contrast: contrast })
  };

  const onScaleChange = (scale) => {
    setState({ ...state, scale: scale })
  };

  const { contrast, scale, snapshot, originalImage } = state;

  return (
    <View style={styles.container}>
      <View style={{ ...styles.flex, borderWidth: 2 }}>
        {snapshot && (
          <Image
            style={{ ...styles.flex, borderWidth: 2 }}
            fadeDuration={0}
            source={{ uri: snapshot.uri }}
            resizeMode="center"
          />
        )}
      </View>
      <Text style={styles.sliderHeader}>{`Scale: ${parseInt(
        String(scale * 100),
        10
      )}%`}</Text>
      <Slider
        value={scale}
        step={0.01}
        minimumValue={0}
        maximumValue={2}
        onValueChange={onScaleChange}
      />


      <Text style={styles.sliderHeader}>{`Contrast: ${parseInt(
        String(contrast * 100),
        10
      )}%`}</Text>
      <Slider
        value={contrast}
        step={0.01}
        minimumValue={0}
        maximumValue={2}
        onValueChange={onContrastChange}
      />


    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  flex: {
    flex: 1,
    width: '100%',
  },
  sliderHeader: {
    paddingHorizontal: 10,
  },
});