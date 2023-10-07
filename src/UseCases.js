/**
 *   Bot use cases detecting (User Roles and Current actions)
 */
function useCases(){
  
  if(!checkReg()) return;

  // start
  if (text.startsWith("/start ")) { 
    let payload = text.split(" ")[1];
    startCommand(payload);
  }
  else if (text == "/start") {
    startCommand();
  } // start - пустой


  else if(inputSale()) return;
  
  else if(inputRefundSale()) return;
  
  else if(checkTextCommand()) return;

  else sendMenu();

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
    // botSendMessage(chat_id,"Старт");
    botSendMessage(chat_id,"Привет!");

  }
  // anyway
  sendMenu();
}

//User Current Actions (use cases)
let UserActions = {
  without_action: "",
  input_phone: "input_phone",
  input_bio: "input_bio",
  input_name: "input_name",
  input_giv: "input_giv",
  input_buyer: "input_buyer",
  input_buyerphone: "input_clientphone",
  input_amount: "input_amount",
  input_check: "input_check",
  input_refund_giv: "input_refund_giv",
  input_refund_buyer: "input_refund_buyer",
  input_refund_buyerphone: "input_refund_clientphone",
  input_refund_amount: "input_refund_amount",
  input_refund_check: "input_refund_check",
  getInputOrder(){
    return [
      this.input_giv,
      this.input_buyer,
      this.input_buyerphone,
      this.input_amount,
      this.input_check,
    ]
  },
  getPreviousAction(action){
    let actionInd = this.getInputOrder().indexOf(action);
    return actionInd-1;
  }
}
