import {StyleSheet} from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black'
    },

    cameraOverlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: '#FFF'
    },
    camera: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },

    questionnaireContainer: {
        position: 'absolute',
        top: 0, left: 0, right: 0
    },
    openBrowserButton: {
        position: 'absolute',
        top: 10, right: 10,
    },
    openBrowserButtonIcon: {
        width: 40,
        height: 40,
    },
    questionnairePopupContainer: {
        position: 'absolute',
        top: 0, left: 0, right: 0
    },
    questionnairePopupText: {
        fontSize: 16,
        color: '#FFF',
        fontFamily: 'Roboto',
        textShadowColor: 'rgba(0,0,0,0.9)',
        textShadowOffset: {width: 0, height: 2},
        textShadowRadius: 8,
        margin: 16,
        marginRight: 60,
    },
    questionnairePopupArrow: {
        position: 'absolute',
        bottom: -16, right: 60,
        width: 40,
        height: 40,
    },

    topContainer: {
        position: 'absolute',
        top: 0, left: 0, right: 0,
        backgroundColor: 'rgba(255,255,255,0.6)',
        justifyContent: 'center'
    },
    themeText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FFF',
        fontFamily: 'Roboto',
        textShadowColor: 'rgba(0,0,0,0.9)',
        textShadowOffset: {width: 0, height: 4},
        textShadowRadius: 12,
        textAlign: 'center'
    },

    bottomContainer: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(255,255,255,0.6)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    counterContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    openGalleryButtonIcon: {
        width: 40,
        height: 40,
    },
    captureButtonIcon: {
        width: 80,
        height: 80,
        marginLeft: 40,
        marginRight: 40
    },
    changeCameraTypeButtonIcon: {
        width: 40,
        height: 40,
    },
});
