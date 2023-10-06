function beginRefundSale(){


  
  user.setUserCurrentAction(UserActions.input_refund_giv);
  let givsKeyboard = buildGivsKeyboard();
  botSendMessage(chat_id, texts.saleStep1_refund, givsKeyboard);

}

function inputRefundSale(){
  if(user.currentAction == UserActions.input_refund_giv){
    if(!chechGivName()){
      let givsKeyboard = buildGivsKeyboard();
      botSendMessage(chat_id,texts.givNameErr,givsKeyboard);
      return true;
    };
    // 1. найти первую пустую строку 2. вписать в нее данные
    let row = getFirstEmptyRow(tRefunds.use().getRange("A:A"));
    tRefunds.use().getRange(row,1,1,5).setValues([[stringDate(),message_id,user_id,name,text]]);
    tRefunds.use().insertRowAfter(tRefunds.use().getLastRow());
    user.setUserCurrentAction(UserActions.input_refund_buyer + "="+message_id);
    botSendMessage(chat_id,texts.saleStep2_refund);
    return true;
  }
  if(String(user.currentAction).startsWith(UserActions.input_refund_buyer)){
    let sale_id = String(user.currentAction).split("=")[1];
    let row = getRefundSaleRow(sale_id);
    if(row == -1) {
      // botSendMessage(chat_id,"Ошибка: продажа не найдена");
      return true;
    }
    tRefunds.use().getRange(row, tRefunds.getCol(tRefunds.buyer_Title)+1).setValue(text);
    user.setUserCurrentAction(UserActions.input_refund_buyerphone + "="+sale_id);
    botSendMessage(chat_id,texts.saleStep2b_refund);
    return true;
  }
  if(String(user.currentAction).startsWith(UserActions.input_refund_buyerphone)){
    let sale_id = String(user.currentAction).split("=")[1];
    let row = getRefundSaleRow(sale_id);
    if(row == -1) {
      // botSendMessage(chat_id,"Ошибка: продажа не найдена");
      return true;
    }
    tRefunds.use().getRange(row, tRefunds.getCol(tRefunds.phone_Title)+1).setValue(text);
    user.setUserCurrentAction(UserActions.input_refund_amount + "="+sale_id);
    botSendMessage(chat_id,texts.saleStep3_refund);
    return true;
  }
  if(String(user.currentAction).startsWith(UserActions.input_refund_amount)){
    // проверка на положительное число без лишних символов
    if(!/^\d+$/.test(text)){
      botSendMessage(chat_id,texts.saleStep3b_refund);
      return true;
    }
    let sale_id = String(user.currentAction).split("=")[1];
    let row = getRefundSaleRow(sale_id);
    if(row == -1) {
      // botSendMessage(chat_id,"Ошибка: продажа не найдена");
      return true;
    }
    tRefunds.use().getRange(row, tRefunds.getCol(tRefunds.amount_Title)+1).setValue(text);
    let sentMesId = botSendMessage(chat_id, texts.saleStep5_refund);
    sendRefundCard(sentMesId, row);
    tRefunds.use().getRange(row, tRefunds.getCol(tRefunds.saleId_Title)+1).setValue(sentMesId);
    user.setUserCurrentAction(UserActions.without_action);
    return true;
  }

  return false;
}

function buildRefundCardText(row){
  let saleData = tRefunds.use().getRange(row, 1,1, tSales.getColumnsOrder().length).getValues();
  let cardText = "\n<i>---Возврат---</i>\n<b>Гив</b>: "+saleData[0][tSales.getCol(tSales.giv_Title)];
  cardText += "\n<b>Получатель места в гиве</b>: "+saleData[0][tSales.getCol(tSales.buyer_Title)];
  cardText += "\n<b>Сумма возврата</b>: "+saleData[0][tSales.getCol(tSales.amount_Title)] + "₽";
  return cardText;
}

function sendRefundCard(sale_id, row){
  let keyboard = {
    inline_keyboard: [
      [
        {text: "🗑 Заполнить заново",callback_data: "refund_delete="+sale_id},
        {text: "✅ Всё верно", callback_data: "refund_approve="+sale_id},
      ],
    ]
  }
  return botSendMessage(chat_id, buildRefundCardText(row), keyboard);
}


function getRefundSaleRow(id){
  let salesArr = tRefunds.use().getRange(tRefunds.ids_Range).getValues();
  let row = -1;
  let i;
  for(i=1; i<salesArr.length;i++){
    if(String(salesArr[i][0]) == String(id)){
      row = i+1;
      break;
    }
  }
  return row;
}