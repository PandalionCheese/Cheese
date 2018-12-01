import {StyleSheet} from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black'
    },
    cameraOverlay: {
        position: 'absolute',
        top:0, bottom: 0, left: 0, right: 0,
        backgroundColor: '#FFF'
    },
    camera: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    buttonsContainer: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
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
    openBrowserButton: {
        position: 'absolute',
        top: 10, right: 10,
    },
    openBrowserButtonIcon: {
        width: 40,
        height: 40,
    },
    counterContainer: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    themeContainer: {
        position: 'absolute',
        top: 0, left: 0, right: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 60
    },
    themeText: {
        fontSize: 48,
        color: '#FFF',
        fontFamily: 'Myriad Pro Bold',
        textShadowColor: 'rgba(240,118,41,0.9)',
        textShadowOffset: {width: 0, height: 0},
        textShadowRadius: 20,
        textAlign: 'center'
    },
    questionnairePopupContainer: {
        position: 'absolute',
        top: 0, left: 0, right: 0
    },
    questionnairePopupText: {
        fontSize: 16,
        color: '#FFF',
        fontFamily: 'Roboto',
        margin: 16,
        marginRight: 60,
    },
    questionnairePopupArrow: {
        position: 'absolute',
        bottom: -16, right: 60,
        width: 40,
        height: 40,
    }
});
