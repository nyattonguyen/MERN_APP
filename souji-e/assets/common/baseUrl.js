import { Platform } from "react-native";

let baseURL = '';
{
    Platform.OS='android'
    ? baseURL = 'http://192.168.1.9:3333/api/v1/'
    : baseURL = 'http://localhost:3333/api/v1/' 
}
export default baseURL;