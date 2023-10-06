function beginInputSale(){


  
  user.setUserCurrentAction(UserActions.input_giv);
  let givsKeyboard = buildGivsKeyboard();
  botSendMessage(chat_id, texts.saleStep1, givsKeyboard);

}
let backKeyboard = {
  keyboard: [[{text: "🔙 Назад"}]],
  resize_keyboard: true,
  one_time_keyboard: true,
};

function inputSale(){
  if(user.currentAction == UserActions.input_giv){
    if(!chechGivName()){
      let givsKeyboard = buildGivsKeyboard();
      botSendMessage(chat_id,texts.givNameErr,givsKeyboard);
      return true;
    };
    // 1. найти первую пустую строку 2. вписать в нее данные
    let row = getFirstEmptyRow(tSales.use().getRange("A:A"));
    tSales.use().getRange(row,1,1,5).setValues([[stringDate(),message_id,user_id,name,text]]);
    tSales.use().insertRowAfter(tSales.use().getLastRow());
    user.setUserCurrentAction(UserActions.input_buyer + "="+message_id);
    botSendMessage(chat_id,texts.saleStep2,backKeyboard);
    return true;
  }
  if(String(user.currentAction).startsWith(UserActions.input_buyer)){
    

    let sale_id = String(user.currentAction).split("=")[1];
    let row = getSaleRow(sale_id);
    if(row == -1) {
      // botSendMessage(chat_id,"Ошибка: продажа не найдена");
      return true;
    }
    if(text == "🔙 Назад"){
      tSales.use().deleteRow(row);
      beginInputSale();
      return true;
    }


    tSales.use().getRange(row, tSales.getCol(tSales.buyer_Title)+1).setValue(text);
    user.setUserCurrentAction(UserActions.input_buyerphone + "="+sale_id);
    botSendMessage(chat_id,texts.saleStep2b,backKeyboard);
    return true;
  }
  if(String(user.currentAction).startsWith(UserActions.input_buyerphone)){
    let sale_id = String(user.currentAction).split("=")[1];
    let row = getSaleRow(sale_id);
    if(row == -1) {
      // botSendMessage(chat_id,"Ошибка: продажа не найдена");
      return true;
    }
    
    if(text == "🔙 Назад"){
      tSales.use().getRange(row, tSales.getCol(tSales.buyer_Title)+1).setValue("");
      user.setUserCurrentAction(UserActions.input_buyer + "="+sale_id);
      botSendMessage(chat_id,texts.saleStep2,backKeyboard);
      return true;
    }
    tSales.use().getRange(row, tSales.getCol(tSales.phone_Title)+1).setValue(text);
    user.setUserCurrentAction(UserActions.input_amount + "="+sale_id);
    botSendMessage(chat_id,texts.saleStep3,backKeyboard);
    return true;
  }
  if(String(user.currentAction).startsWith(UserActions.input_amount)){
    // проверка на положительное число без лишних символов
    
    let sale_id = String(user.currentAction).split("=")[1];
    let row = getSaleRow(sale_id);
    if(row == -1) {
      // botSendMessage(chat_id,"Ошибка: продажа не найдена");
      return true;
    }
    
    if(text == "🔙 Назад"){
      tSales.use().getRange(row, tSales.getCol(tSales.phone_Title)+1).setValue("");
      user.setUserCurrentAction(UserActions.input_buyerphone + "="+sale_id);
      botSendMessage(chat_id,texts.saleStep2b,backKeyboard);
      return true;
    }
    if(!/^\d+$/.test(text)){
      botSendMessage(chat_id,texts.saleStep3b,backKeyboard);
      return true;
    }

    tSales.use().getRange(row, tSales.getCol(tSales.amount_Title)+1,1,2).setValues([[text, parseInt(text)*0.1]]);
    user.setUserCurrentAction(UserActions.input_check + "="+sale_id);
    botSendMessage(chat_id, texts.saleStep4,backKeyboard);
    return true;
  }
  if(String(user.currentAction).startsWith(UserActions.input_check)){
    let sale_id = String(user.currentAction).split("=")[1];
    let row = getSaleRow(sale_id);
    if(row == -1) {
      // botSendMessage(chat_id,"Ошибка: продажа не найдена");
      return true;
    }
    
    if(text == "🔙 Назад"){
      tSales.use().getRange(row, tSales.getCol(tSales.amount_Title)+1).setValue("");
      user.setUserCurrentAction(UserActions.input_amount + "="+sale_id);
      botSendMessage(chat_id,texts.saleStep3,backKeyboard);
      return true;
    }

    if(contents.message.document != null){
      

      TelegramAPI.sendChatAction(token,chat_id,"typing");
      let mime_type = contents.message.document.mime_type;
      let file_id = contents.message.document.file_id;
      let fileLink = saveFile(file_id, texts.folderName,user.name,mime_type);

      let checkMesId = message_id;
      tSales.use().getRange(row, tSales.getCol(tSales.check_Title)+1).setValue(fileLink);
      tSales.use().getRange(row, tSales.getCol(tSales.saleId_Title)+1).setValue(checkMesId);
      // tSales.use().getRange(row, tSales.getCol(tSales.checkMesId_Title)+1).setValue(message_id);
      botSendMessage(chat_id, texts.saleStep5);
      sendCard(checkMesId, row);
      user.setUserCurrentAction(UserActions.without_action);
    }
    else{
      botSendMessage(chat_id, texts.saleStep4b);
    }

    return true;
  }
  

  return false;
}

function buildCardText(row){
  let saleData = tSales.use().getRange(row, 1,1, tSales.getColumnsOrder().length).getValues();
  let cardText = "<b>Гив</b>: "+saleData[0][tSales.getCol(tSales.giv_Title)];
  cardText += "\n<b>Получатель места в гиве</b>: "+saleData[0][tSales.getCol(tSales.buyer_Title)];
  cardText += "\n<b>Сумма продажи</b>: "+saleData[0][tSales.getCol(tSales.amount_Title)] + "₽";
  cardText += "\n<b>Чек об оплате</b>: проверьте чек 👆";
  return cardText;
}

function sendCard(sale_id, row){
  let keyboard = {
    inline_keyboard: [
      [
        {text: "🗑 Заполнить заново",callback_data: "delete="+sale_id},
        {text: "✅ Всё верно", callback_data: "approve="+sale_id},
      ],
    ]
  }
  botSendMessage(chat_id, buildCardText(row), keyboard,"HTML",false, message_id);
}

function saveFile(file_id, folder_name, user_name, mime_type = 'image/png') {
  const content = getBlob(file_id, mime_type);
  const f = checkFolder(folder_name);
  return f.createFile(content).setName(user_name + d2s(new Date())).getUrl();
}

function checkFolder(folder_name) {
  const folder = DriveApp.getFoldersByName(folder_name)
  return folder.hasNext() ? folder.next() : DriveApp.createFolder(folder_name);
}

function d2s(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd HH-mm-ss")
};

function getBlob(file_id, mime_type) {
  const response = UrlFetchApp.fetch("https://api.telegram.org/bot"+token+"/getFile?file_id=" + file_id);
  const response_parse = JSON.parse(response.getContentText());
  const filePath = response_parse.result.file_path;
  const fileUrl = 'https://api.telegram.org/file/bot' + token + '/' + filePath;
  const linkFile = UrlFetchApp.fetch(fileUrl);
  return linkFile.getBlob().setContentType(mime_type);
}

function chechGivName(){
  let row = getFirstEmptyRowInAA(tGivs.use());
  if(row<3) return false;
  let givs = tGivs.use().getRange(2,1,row-2,1).getValues();
  for(let i=0;i<givs.length;i++){
    if(givs[i][0] == text) return true;
  }
  return false;
}

function buildGivsKeyboard(){
  let row = getFirstEmptyRowInAA(tGivs.use());
  if(row<3) return null;
  let givs = tGivs.use().getRange(2,1,row-2,1).getValues();
  let keyboard = {
    keyboard: [
    ],
    one_time_keyboard: true,
    is_persistent: true,
    resize_keyboard: true,
  };
  for(let i=0;i<givs.length;i++){
    keyboard.keyboard.push([]);
    keyboard.keyboard[i].push({text: givs[i][0]});
  }
  if(keyboard.keyboard.length<1) return null;

  return keyboard;
}