import axios from "axios";
import config from "../config/config.json";
import {
ADMIN
} from "./types";




export const loginRes=(d,spinnerRender,navigation)=>async(dispatch)=>{
const res=await axios.post(config.api,{
        UserName:d.userName,
        Password:d.password,
        Token:config.Token
});
dispatch({
    type:ADMIN,
    payload:res.data
});
if(res.data.Error){
    spinnerRender();
    return null
}else{
    navigation.navigate('home')
    spinnerRender();
}
}
export const sendNotification=(data,nav,renderSpinner)=>async(dispatch)=>{
    delete data.isLoading
    renderSpinner()
    const getTokens= await axios.post('http://thenextschool-001-site1.gtempurl.com/api/AppLogin/GetNotificationToken',
    {CampusId:data.CampusId,grade_Id:data.grade_Id}
    );


    if(getTokens.data.NotificationTokenList[0]){
        const tokens=getTokens.data.NotificationTokenList.map((collection)=>{
            if(collection.NotificationToken){
                return {
                    to:collection.NotificationToken,
                    body:data.notice,
                    title:data.title
                }
            }
        })

        const sendNot= await axios.post('https://exp.host/--/api/v2/push/send',tokens);
        console.log("data",data)
        const res= await axios.post(config.sendNotificationApi,data);
        console.log("res",res.data)
        renderSpinner();
        nav.navigate('campus');
        

    }else{
        renderSpinner();
        alert("There is no device available to send notification")
    }
}