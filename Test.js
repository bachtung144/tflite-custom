import React,{useState} from 'react'
import {View,Button} from 'react-native'
import ImagePicker from 'react-native-image-crop-picker';
import Tflite from 'tflite-react-native';
let tflite = new Tflite();

export const App = () => {
    const [source,setSource] = useState('')

    const loadModel = () => {
        let modelFile = 'models/ssd_mobilenet.tflite';
        let labelsFile = 'models/ssd_mobilenet.txt';
        tflite.loadModel({
                model: modelFile,
                labels: labelsFile,
            },
            (err, res) => {
                if (err)
                    console.warn(err);
                else
                    console.warn(res);
            });
    }
    const pickImage = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            let tmp = image.path.replace(image.path.charAt(5),'')
            console.warn('image',tmp);
            setSource(image.path)
        })
    }

    const detect = () => {
        tflite.detectObjectOnImage({
                path: source,
                model: 'SSDMobileNet',
                imageMean: 127.5,
                imageStd: 127.5,
                threshold: 0.3,       // defaults to 0.1
                numResultsPerClass: 2,// defaults to 5
            },
            (err, res) => {
                if(err)
                    console.warn(err);
                else
                    console.warn('res',res);
            });
    }

    return(
        <View>
            <Button title={'load model'} onPress={() => loadModel()}/>
            <Button title={'Test'} onPress={() => pickImage()}/>
            <Button title={'detect'} onPress={() => detect()}/>
        </View>
    )
}
