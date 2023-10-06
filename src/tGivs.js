
let tGivs = {
  sheetName: "Активные гивы",
  name_Title: "название гива",
  desc_Title: "описание",
  getColumnsOrder(){
    return [
      this.name_Title,	
      this.desc_Title,
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
        this.use().deleteRows(3,980);
      } catch (error) {}
      sheet = table.getSheetByName(this.sheetName);
    }
    return sheet;
  }
}
