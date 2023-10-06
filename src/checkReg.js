function checkReg(){
  if(user.role == ""){
    
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
      // user.setUserBio("-");
      // user.setRating(1000);
      // botSendMessage(chat_id, needBio);
      if(user.role != "менеджер"){
        user.setUserRole("менеджер");
      }
      botSendMessage(chat_id, texts.regDone);
      sendMenu();
      return;
    }


    if(user.currentAction == UserActions.input_phone){
      if(contents.message.contact) {
        user.setUserPhone(contents.message.contact.phone_number);
        user.setUserCurrentAction(UserActions.input_name);
        botSendMessage(chat_id, texts.needName);
        return;
      }
    }

    let keyboard = {
      keyboard: [
        [
          {text: "Отправить свой номер", request_contact: true},
        ]
      ],
      one_time_keyboard: true,
      is_persistent: true,
      resize_keyboard: true,
    };
    user.setUserCurrentAction(UserActions.input_phone);
    botSendMessage(chat_id, texts.greet, keyboard);
    return false;
  }

  return true;
}
