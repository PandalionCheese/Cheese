'use strict';
import React, {Component} from 'react';
import {
    Alert,
    Animated,
    AsyncStorage,
    BackHandler,
    CameraRoll,
    Dimensions,
    Image,
    ImageEditor,
    Linking,
    PermissionsAndroid,
    Platform,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Counter from "./Counter";
import CONSTANTS from "./Constants";
import MESSAGES from "./Messages";
import STYLES from "./App.styles"
import PermissionsService from "./PermissionsService";
import ImageRotate from 'react-native-image-rotate';


export default class App extends Component {

    // Reference to components
    cameraRef;
    counterRef;

    constructor(props) {
        super(props);
        console.disableYellowBox = true;
        this.state = {
            cameraPermission: false,
            cameraType: CONSTANTS.cameraType.front,
            counting: false,
            theme: null,
            questionnairePopupTopPosition: new Animated.Value(-60), // off-screen
            cameraOverlayOpacity: new Animated.Value(0),
        };
    }

    async componentDidMount() {
        // Check camera access permission
        const hasCameraPermission = await PermissionsService.askForAndroidPermission(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            MESSAGES.permissions.camera.title,
            MESSAGES.permissions.camera.message);
        const hasStorageWritePermission = await PermissionsService.askForAndroidPermission(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            MESSAGES.permissions.storage.title,
            MESSAGES.permissions.storage.message);
        if (!hasCameraPermission || !hasStorageWritePermission) {
            Alert.alert(
                MESSAGES.errors.permissionRefused.title,
                MESSAGES.errors.permissionRefused.message,
                [{text: 'OK', onPress: this.closeApplication}],
                {cancelable: false}
            );
        } else {
            this.setState({
                cameraPermission: true
            });
        }
        // Find if the questionnaire popup should be displayed
        const usageCount = await this.getUsageCount();
        if (usageCount >= CONSTANTS.maxUsagesBeforeQuestionnairePopup) {
            Animated.timing(
                this.state.questionnairePopupTopPosition,
                {toValue: 0, duration: 1000}
            ).start();
            await this.setUsageCount(0);
        }
    }

    render() {
        const {height: screenHeight, width: screenWidth} = Dimensions.get('window');
        return (
            <View style={STYLES.container}>

                {/* ========== Background camera & flash fx overlay========== */}
                {this.state.cameraPermission &&
                <RNCamera
                    ref={ref => {this.cameraRef = ref;}}
                    style={STYLES.camera}
                    type={this.state.cameraType}
                    flashMode={RNCamera.Constants.FlashMode.auto}
                    autoFocus={true}/>
                }
                <Animated.View style={{...STYLES.cameraOverlay, opacity: this.state.cameraOverlayOpacity}}/>

                {/* ========== Top area : Theme ========== */}
                <View style={{...STYLES.topContainer, height: CONSTANTS.ui.topAreaHeight}}>
                    <Text style={STYLES.themeText}>{this.state.theme || ''}</Text>
                </View>

                {/* ========== Questionnaire button & message overlay ========== */}
                {!this.state.counting && <>
                    <TouchableOpacity onPress={this.openBrowser} style={STYLES.openBrowserButton}>
                        <Image style={STYLES.openBrowserButtonIcon}
                               source={require('../assets/icon-questionnaire.png')}
                               resizeMode={'cover'}/>
                    </TouchableOpacity>
                    <Animated.View style={{...STYLES.questionnairePopupContainer, top: this.state.questionnairePopupTopPosition}}>
                        <Text style={STYLES.questionnairePopupText}>{"Votre avis pour affiner Cheese! 😀"}</Text>
                        <Image style={STYLES.questionnairePopupArrow}
                               source={require('../assets/arrow.png')}
                               resizeMode={'cover'}/>
                    </Animated.View>
                </>}

                {/* ========== Bottom area : Counter & Buttons ========== */}
                <View style={{...STYLES.bottomContainer, height: screenHeight - screenWidth - CONSTANTS.ui.topAreaHeight}}>
                    <View style={STYLES.counterContainer}>
                        <Counter
                            ref={ref => {
                                this.counterRef = ref;
                            }}
                            initialValue={3}
                            onCounterExpired={this.takePicture}/>
                    </View>
                    <View style={STYLES.buttonsContainer}>
                        {!this.state.counting &&
                        <TouchableOpacity onPress={this.openGallery} disabled={this.state.counting}>
                            <Image style={STYLES.openGalleryButtonIcon}
                                   source={require('../assets/icon-gallery.png')}
                                   resizeMode={'cover'}/>
                        </TouchableOpacity>
                        }
                        <TouchableOpacity onPress={this.startGame} disabled={this.state.counting}>
                            <Image style={STYLES.captureButtonIcon}
                                   source={require('../assets/icon-take-picture.png')}
                                   resizeMode={'cover'}/>
                        </TouchableOpacity>
                        {!this.state.counting &&
                        <TouchableOpacity onPress={this.changeCameraType} disabled={this.state.counting}>
                            <Image style={STYLES.changeCameraTypeButtonIcon}
                                   source={require('../assets/icon-rotate-camera.png')}
                                   resizeMode={'cover'}/>
                        </TouchableOpacity>
                        }
                    </View>
                </View>

            </View>
        );
    }

    // ==================== Usage counter management ====================

    getUsageCount = async () => {
        let usageCount = 0;
        try {
            usageCount = await AsyncStorage.getItem(CONSTANTS.usageCounterKey);
            if (usageCount === null) {
                usageCount = 0;
            } else {
                usageCount = parseInt(usageCount, 10);
            }
        } catch (error) {
            // Nothing - just let the current count be 0
        }
        usageCount++;
        await this.setUsageCount(usageCount);
        return usageCount;
    };

    setUsageCount = async (count) => {
        try {
            await AsyncStorage.setItem(CONSTANTS.usageCounterKey, count.toString());
        } catch (error) {
            // Ignore
        }
    };

    // ==================== Button handlers ====================

    openGallery = () => {
        const galleryUrl = CONSTANTS.galleryUrl[Platform.OS];
        Linking.canOpenURL(galleryUrl).then(supported => {
            if (supported) {
                Linking.openURL(galleryUrl);
            } else {
                Alert.alert(MESSAGES.errors.cannotOpenGallery.title, MESSAGES.errors.cannotOpenGallery.message);
            }
        });
    };

    changeCameraType = () => {
        this.setState((state) => {
            return {
                cameraType: state.cameraType === CONSTANTS.cameraType.front ? CONSTANTS.cameraType.back : CONSTANTS.cameraType.front
            };
        })
    };

    startGame = () => {
        let randomTheme = CONSTANTS.themes[Math.floor(Math.random() * CONSTANTS.themes.length)];
        this.setState({
            counting: true,
            theme: randomTheme
        });
        this.counterRef.startCounter();
    };

    openBrowser = () => {
        Linking.canOpenURL(CONSTANTS.questionnaireUrl).then(supported => {
            if (supported) {
                Linking.openURL(CONSTANTS.questionnaireUrl);
            } else {
                Alert.alert(MESSAGES.errors.cannotOpenQuestionnaire.title, MESSAGES.errors.cannotOpenQuestionnaire.message);
            }
        });
    };

    // ==================== Other handlers ====================

    takePicture = async () => {
        if (this.cameraRef) {
            const options = {quality: 0.8, exif: false, skipProcessing: true};
            const data = await this.cameraRef.takePictureAsync(...options);

            // Flash animation
            this.state.cameraOverlayOpacity.setValue(1);
            Animated.timing(
                this.state.cameraOverlayOpacity,
                {toValue: 0, duration: 500}
            ).start();

            // Rotate & crop
            let imageUri = data.uri;
            if (data.width && data.height && data.width > data.height) {
                const angle = this.state.cameraType === CONSTANTS.cameraType.front ? 270 : 90;
                imageUri = await new Promise((resolve, reject) => {
                    ImageRotate.rotateImage(data.uri, angle, resolve, reject);
                });
            }
            imageUri = await new Promise((resolve, reject) => {
                const cropData = {
                    offset: {x: 0, y: CONSTANTS.ui.topAreaHeight},
                    size: {width: data.height, height: data.height}
                };
                ImageEditor.cropImage(imageUri, cropData, resolve, reject)
            });

            // Save to Gallery
            CameraRoll.saveToCameraRoll(imageUri)
                .catch((e) => {
                    console.error(MESSAGES.errors.cannotSaveToGallery.title, e);
                    Alert.alert(MESSAGES.errors.cannotSaveToGallery.title, MESSAGES.errors.cannotSaveToGallery.message);
                });
        }

        this.resetGame();
    };

    resetGame = () => {
        this.setState({
            counting: false,
            theme: null
        });
    };

    closeApplication = () => {
        BackHandler.exitApp();
    };

}