import {PermissionsAndroid} from "react-native";

export default class PermissionsService {

    static async hasAndroidPermission(permission) {
        return PermissionsAndroid.check(permission);
    }

    static async askForAndroidPermission(permission, requestDialogTitle, requestDialogMessage) {
        const hasPermission = await PermissionsAndroid.check(permission);
        if (hasPermission) {
            return true;
        } else {
            let permissionGrant = await PermissionsAndroid.request(
                permission, {
                    title: requestDialogTitle,
                    message: requestDialogMessage,
                },
            );
            return permissionGrant === PermissionsAndroid.RESULTS.GRANTED;
        }
    }

}