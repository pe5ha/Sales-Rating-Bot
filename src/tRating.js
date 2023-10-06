
let tRating = {
  sheetName: "Лидеры",
  id_Title: "id",
  name_Title: "имя",
  count_Title: "число продаж",
  totalSum_Title: "общая сумма продаж",
  allRange: "A:D",
  getColumnsOrder(){
    return [
      this.id_Title,	
      this.name_Title,	
      this.count_Title,	
      this.totalSum_Title,
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
