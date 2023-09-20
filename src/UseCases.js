/**
 *   Bot use cases detecting (User Roles and Current actions)
 */
function useCases(){
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
    botSendMessage(chat_id,"Старт");

  }
}