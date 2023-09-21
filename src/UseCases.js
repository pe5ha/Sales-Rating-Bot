/**
 *   Bot use cases detecting (User Roles and Current actions)
 */
function useCases(){


  // start

  // if(user.currentAction == UserActions.input_phone){
  //   if(contents.message.contact) {
  //     user.setUserPhone(contents.message.contact.phone_number);
  //     user.setUserCurrentAction(UserActions.input_name);
  //     botSendMessage(chat_id, needName);
  //     return;
  //   }
  // }
  

  // Новый код без вызова биографии
  if(user.currentAction == UserActions.input_name){
    if(text == "/start") user.setUserName(name);
    else {
      text = text
         .replace(/&/g, "")
         .replace(/</g, "")
         .replace(/>/g, "")
         .replace(/"/g, "");
      if(!text) text = name;
      user.setUserName(text);
    }
    //user.setUserCurrentAction(UserActions.input_bio);
    user.setUserCurrentAction(UserActions.without_action);
    user.setUserBio("-");
    user.setRating(1000);
    //botSendMessage(chat_id, needBio);
    if(user.role != "участник"){
      user.setUserRole("участник");
    }
    botSendMessage(chat_id, regDone);
    sendPlayerCard();
    return;
  }



  /* Старый код обязательного вызова биографии
  if(user.currentAction == UserActions.input_name){
    if(text == "/start") user.setUserName(name);
    else {
      text = text
         .replace(/&/g, "")
         .replace(/</g, "")
         .replace(/>/g, "")
         .replace(/"/g, "");
      if(!text) text = name;
      user.setUserName(text);
    }
    user.setUserCurrentAction(UserActions.input_bio);
    user.setRating(1000);
    botSendMessage(chat_id, needBio);
    return;
  }

*/


  // start
  if (text.startsWith("/start ")) { 
    let payload = text.split(" ")[1];
    startCommand(payload);
  }
  else if (text == "/start") {
    startCommand();
  }
  
  botSendMessage(chat_id, text); // eho

}

function startCommand(payload=null){
  if(user.isNewUser){ // если новый юзер
    // TODO новый юзер
    if(payload){ // реферал
      
    }
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! eудалить потом
    // if(payload=="giveadmin234324"){
    //   setUserRole(user,UserRoles.admin);
    // }
  }

  // deep link
  if(payload){ 

  }
  // просто /start
  else{
    botSendMessage(chat_id,"Привет!");

  }
}