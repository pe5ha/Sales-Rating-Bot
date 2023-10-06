let textCommands = {
  newSale: "🆕 Новая продажа",
  refund: "↩️ Возврат",
  rating: "🏆 Рейтинг"
}

function sendMenu(setWithoutAction=true,customText=null){
  let menuText;
  if(customText != null){
    menuText = customText;
  }
  else menuText = texts.mainMenu;
  if(setWithoutAction) user.setUserCurrentAction(UserActions.without_action);
  if(user.role == "менеджер"){
   
    let menegerKeyboard = {
      keyboard: [[{text: textCommands.newSale},{text: textCommands.refund}]],
      resize_keyboard: true,
      is_persistent: true,
    };
    botSendMessage(chat_id, menuText, menegerKeyboard);
  }
  if(user.role == "админ"){
    let adminKeyboard = {
      keyboard: [[
          {text: textCommands.newSale},
          {text: textCommands.refund},
          
        ],[{text: textCommands.rating},]],
      resize_keyboard: true,
      is_persistent: true,
    };

    botSendMessage(chat_id, menuText, adminKeyboard);
  }
}

function checkTextCommand(){
  if(text == textCommands.newSale){

    beginInputSale();

    return true;
  }
  else if(text == textCommands.rating && user.role == "админ"){
    sendRatingCard();
    return true;
  }
  else if(text == textCommands.refund){
    beginRefundSale();
    return true;
  }
  return false;
}



function sendRatingCard(){
  let stats = tRating.use().getRange(tRating.allRange).getValues();
  let statMes = "";
  for(let i=1;i<stats.length;i++){
    if(stats[i][0]=="") break;
    statMes+= "<b>"+stats[i][tRating.getCol(tRating.name_Title)]+"</b>: число продаж - "+ stats[i][tRating.getCol(tRating.count_Title)]+"; сумма продаж - "+stats[i][tRating.getCol(tRating.totalSum_Title)]+"\n";

  }
  let adminKeyboard = {
    keyboard: [[
        {text: textCommands.newSale},
        {text: textCommands.rating},
      ]],
    resize_keyboard: true,
    is_persistent: true,
  };
  botSendMessage(chat_id,statMes, adminKeyboard);

}

