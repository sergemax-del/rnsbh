//Скриншотер
var curDate = new Date();
path = "d:/Скрин" + curDate.getHours() + curDate.getMinutes() + curDate.getSeconds() + ".jpg";
Action.Control.SavePicture(path);
Action.Finish();