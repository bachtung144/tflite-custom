import React, {useState, useEffect} from 'react';
import {View, Text, Image, Button, StyleSheet} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Tflite from 'tflite-react-native';
let tflite = new Tflite();

export const App = () => {
  const [source, setSource] = useState('');
  const [showImg, setShowImg] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const [widthImg, setWidthImg] = useState(0);
  const [heightImg, setHeightImg] = useState(0);
  const [recognitions, setRecognitions] = useState([]);

  const loadModel = () => {
    let modelFile = 'models/ssd_mobilenet.tflite';
    let labelsFile = 'models/ssd_mobilenet.txt';
    tflite.loadModel(
      {
        model: modelFile,
        labels: labelsFile,
      },
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
        }
      },
    );
  };

  useEffect(() => {
    loadModel();
  }, []);

  const pickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      setSource(image.path);
      setHeightImg(image.height);
      setWidthImg(image.width);
      setShowImg(true);
      setShowBox(false);
    });
  };

  const detect = () => {
    tflite.detectObjectOnImage(
      {
        path: source,
        model: 'SSDMobileNet',
        imageMean: 127.5,
        imageStd: 127.5,
        threshold: 0.3, // defaults to 0.1
        numResultsPerClass: 2, // defaults to 5
      },
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          // console.warn('res', res);
          setRecognitions(res);
          setShowBox(true);
        }
      },
    );
  };

  const renderResult = () => {
    return recognitions.map((res, id) => {
      let left = res.rect.x * widthImg;
      let top = res.rect.y * heightImg;
      let width = res.rect.w * widthImg;
      let height = res.rect.h * heightImg;
      return (
        <View key={id} style={[styles.box, {top, left, width, height}]}>
          <Text style={{color: 'white', backgroundColor: 'blue'}}>
            {res.detectedClass +
              ' ' +
              (res.confidenceInClass * 100).toFixed(0) +
              '%'}
          </Text>
        </View>
      );
    });
  };

  return (
    <View style={styles.ctn}>
      {showImg ? (
        <View>
          <Image
            style={{width: widthImg, height: heightImg, marginBottom: 50}}
            resizeMode={'contain'}
            source={{uri: source}}
          />
          {showBox ? <View style={styles.boxes}>{renderResult()}</View> : null}
        </View>
      ) : null}
      <View style={{marginBottom: 20, width: 150}}>
        <Button title={'pick Image'} onPress={() => pickImage()} />
      </View>
      <View style={{width: 150}}>
        <Button title={'Detect'} onPress={() => detect()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    borderColor: 'blue',
    borderWidth: 2,
  },
  boxes: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  ctn: {flex: 1, alignItems: 'center', justifyContent: 'center'},
});
