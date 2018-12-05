'use strict';
import React, {Component} from 'react';
import {
    Alert,
    Animated,
    AsyncStorage,
    BackHandler,
    CameraRoll,
    Image,
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
            buttonsContainerBottomPosition: new Animated.Value(0),
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
        return (
            <View style={STYLES.container}>

                {/* ========== Background camera ========== */}
                {this.state.cameraPermission &&
                <RNCamera
                    ref={ref => {
                        this.cameraRef = ref;
                    }}
                    style={STYLES.camera}
                    type={this.state.cameraType}
                    flashMode={RNCamera.Constants.FlashMode.auto}
                    autoFocus={true}/>
                }
                {/* Overlay for the "flash" effect feedback when a photo is taken */}
                <Animated.View style={{...STYLES.cameraOverlay, opacity: this.state.cameraOverlayOpacity}}/>

                {/* ========== "Open questionnaire in browser" button & Message========== */}
                <TouchableOpacity onPress={this.openBrowser} style={STYLES.openBrowserButton}>
                    <Image style={STYLES.openBrowserButtonIcon}
                           source={require('../assets/icon-questionnaire.png')}
                           resizeMode={'cover'}/>
                </TouchableOpacity>
                <Animated.View
                    style={{...STYLES.questionnairePopupContainer, top: this.state.questionnairePopupTopPosition}}>
                    <Text style={STYLES.questionnairePopupText}>{"Votre avis pour affiner Cheese! 😀"}</Text>
                    <Image style={STYLES.questionnairePopupArrow}
                           source={require('../assets/arrow.png')}
                           resizeMode={'cover'}/>
                </Animated.View>

                {/* ========== Theme ========== */}
                <View style={STYLES.themeContainer}>
                    {this.state.theme &&
                    <Text style={STYLES.themeText}>{this.state.theme}</Text>
                    }
                </View>

                {/* ========== Counter ========== */}
                <View style={STYLES.counterContainer}>
                    <Counter
                        ref={ref => {
                            this.counterRef = ref;
                        }}
                        initialValue={3}
                        onCounterExpired={this.takePicture}/>
                </View>

                {/* ========== Action buttons at the bottom ========== */}
                <Animated.View style={{...STYLES.buttonsContainer, bottom: this.state.buttonsContainerBottomPosition}}>
                    <TouchableOpacity onPress={this.openGallery} disabled={this.state.counting}>
                        <Image style={STYLES.openGalleryButtonIcon}
                               source={require('../assets/icon-gallery.png')}
                               resizeMode={'cover'}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.startGame} disabled={this.state.counting}>
                        <Image style={STYLES.captureButtonIcon}
                               source={require('../assets/icon-take-picture.png')}
                               resizeMode={'cover'}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.changeCameraType} disabled={this.state.counting}>
                        <Image style={STYLES.changeCameraTypeButtonIcon}
                               source={require('../assets/icon-rotate-camera.png')}
                               resizeMode={'cover'}/>
                    </TouchableOpacity>
                </Animated.View>

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
        Animated.timing(
            this.state.buttonsContainerBottomPosition,
            {toValue: -100, duration: 200,}
        ).start();
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
            const options = {quality: 0.8, exif: true, skipProcessing: false};
            let data = await this.cameraRef.takePictureAsync(options);
            this.state.cameraOverlayOpacity.setValue(1);
            Animated.timing(
                this.state.cameraOverlayOpacity,
                {toValue: 0, duration: 500}
            ).start();
            CameraRoll.saveToCameraRoll(data.uri)
                .catch((e) => {
                    console.error(MESSAGES.errors.cannotSaveToGallery.title, e);
                    Alert.alert(MESSAGES.errors.cannotSaveToGallery.title, MESSAGES.errors.cannotSaveToGallery.message);
                });
        }
        Animated.timing(
            this.state.buttonsContainerBottomPosition,
            {toValue: 0, duration: 300}
        ).start();
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