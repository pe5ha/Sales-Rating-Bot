function buttonsUseCases(data){

  if(String(data).startsWith("approve")){
    let sale_id = String(data).split("=")[1];
    let row = getSaleRow(sale_id);
    if(row == -1) {
      // botSendMessage(chat_id,"Ошибка: продажа не найдена");
      return;
    }
    if(tSales.use().getRange(row,tSales.getCol(tSales.status_Title)+1).getValue() == "Продан") return;
    addSaleToStats(row);
    tSales.use().getRange(row, tSales.getCol(tSales.status_Title)+1).setValue("Продан");
    botEditMessage(chat_id,message_id,buildCardText(row));
    // botSendMessage(chat_id, texts.saleApprove);
    sendMenu(true, texts.saleApprove);
  }
  else if(String(data).startsWith("delete")){
    if(user.currentAction == data) return; // avoid double click
    let sale_id = String(data).split("=")[1];
    let row = getSaleRow(sale_id);
    if(row == -1) {
      // botSendMessage(chat_id,"Ошибка: продажа не найдена");
      return;
    }

    user.setUserCurrentAction(data);
    tSales.use().deleteRow(row); 
    
    botEditMessage(chat_id, message_id, texts.saleDelete);
    sendMenu(false);

  }
  else if(String(data).startsWith("refund_approve")){
    let sale_id = String(data).split("=")[1];
    let row = getRefundSaleRow(sale_id);
    if(row == -1) {
      // botSendMessage(chat_id,"Ошибка: продажа не найдена");
      return;
    }
    if(tRefunds.use().getRange(row,tRefunds.getCol(tRefunds.status_Title)+1).getValue() == "Возврат") return;

    tRefunds.use().getRange(row, tRefunds.getCol(tRefunds.status_Title)+1).setValue("Возврат");
    botEditMessage(chat_id,message_id,buildRefundCardText(row));
    // botSendMessage(chat_id, texts.saleApprove);
    sendMenu(true, texts.saleRefund);
  }
  else if(String(data).startsWith("refund_delete")){
    if(user.currentAction == data) return; // avoid double click
    let sale_id = String(data).split("=")[1];
    let row = getRefundSaleRow(sale_id);
    if(row == -1) {
      // botSendMessage(chat_id,"Ошибка: продажа не найдена");
      return;
    }

    user.setUserCurrentAction(data);
    tRefunds.use().deleteRow(row); 
    
    botEditMessage(chat_id, message_id, texts.saleDelete);
    sendMenu(false);

  }
  
  
}

function getSaleRow(id){
  let salesArr = tSales.use().getRange(tSales.ids_Range).getValues();
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

function addSaleToStats(row){
  let saleData = tSales.use().getRange(row, 1,1, tSales.getColumnsOrder().length).getValues();
  let stats = tRating.use().getRange(tRating.allRange).getValues();
  let rowInStat = findRowIn2dRangeString(stats,0,user_id)+1;
  if (rowInStat <= 0){
    rowInStat = getFirstEmptyRowInAA(tRating.use());
    tRating.use().getRange(rowInStat,tRating.getCol(tRating.id_Title)+1,1,2).setValues([[user_id,name]]);
    tRating.use().insertRowAfter(rowInStat);
  }
  let oldCount = parseInt(tRating.use().getRange(rowInStat,tRating.getCol(tRating.count_Title)+1).getValue());
  let oldSum = parseInt(tRating.use().getRange(rowInStat,tRating.getCol(tRating.totalSum_Title)+1).getValue());
  tRating.use().getRange(rowInStat,3,1,2).setValues([[oldCount+1, oldSum + parseInt(saleData[0][tSales.getCol(tSales.amount_Title)])]]);
  // tRating.use().getRange(tRating.allRange).sort();
}