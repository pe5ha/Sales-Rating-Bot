
let tSales = {
  sheetName: "Продажи",
  date_Title: "дата",
  saleId_Title: "id продажи",
  id_Title: "id польз",
  name_Title: "имя",
  giv_Title: "гив",
  buyer_Title: "покупатель",
  amount_Title: "сумма",
  amountPercent_Title: "процент",
  phone_Title: "телефон",
  check_Title: "чек",
  status_Title: "статус",
  allRange: "A:I",
  ids_Range: "B:B",
  getColumnsOrder(){
    return [
      this.date_Title,	
      this.saleId_Title,
      this.id_Title,	
      this.name_Title,	
      this.giv_Title,	
      this.buyer_Title,
      this.phone_Title,
      this.amount_Title, 
      this.amountPercent_Title,
      this.check_Title,
      this.status_Title
    ];
  },
  getCol(columnTitle){
    return this.getColumnsOrder().indexOf(columnTitle);
  },
  use(){
    let sheet = table.getSheetByName(this.sheetName);
    if(sheet == null) { // если такого листа нет
      table.insertSheet(this.sheetName); // то такой лист создаётся
      let style = SpreadsheetApp.newTextStyle().setBold(true).setItalic(true).build();
      this.use().getRange(1,1,1,this.getColumnsOrder().length).setValues([this.getColumnsOrder()]).setTextStyle(style).setHorizontalAlignment("center");
      try {
        this.use().deleteRows(3,995);
      } catch (error) {}
      sheet = table.getSheetByName(this.sheetName);
    }
    return sheet;
  }
}
