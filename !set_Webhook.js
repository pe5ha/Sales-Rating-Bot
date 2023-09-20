function setWebhook() {
  // 1. Вставить токен бота из BotFather в свойства скрипта с именем BOT_TOKEN
  let token = PropertiesService.getScriptProperties().getProperty('BOT_TOKEN'); 

  // 2. Вставить в кавычки полученный после развертывания URL
  let webAppUrl = "https://script.google.com/macros/s/AKfycbysKFMIZ92d___S9LMKhwVOHBJEgXO1Npm2oGb-s-WEaHyMZwcgV0Yd7smBgfb3iRiXcg/exec";

  // 3. Выполнить эту функцию setWebhook() 

  let response = UrlFetchApp.fetch("https://api.telegram.org/bot"+token+"/setWebhook?url="+webAppUrl);
  console.log(response.getContentText());
}
