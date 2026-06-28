var modelPath = Action.ModelFilename.substring (0, Action.ModelFilename.lastIndexOf("\\")+1));
var modelName = system.getFileNameWithoutExtension(Action.ModelFilename);
var curDate = new Date();
var dateStamp = (curDate.getDate() < 10 ? "0" + curDate.getDate() : curDate.getDate()) + "-" + (curDate.getMonth() < 10 ? "0" + curDate.getMonth() : curDate.getMonth()) + "-" + curDate.getFullYear();
var timeStamp = (curDate.getHours() < 10 ? "0" + curDate.getHours() : curDate.getHours()) + "-" + (curDate.getMinutes() < 10 ? "0" + curDate.getMinutes() : curDate.getMinutes()) + "-" + (curDate.getSeconds() < 10 ? "0" + curDate.getSeconds() : curDate.getSeconds()) + "." + curDate.getMilliseconds();
Action.Control.SavePicture (modelPath + "Скриншот " + modelName + " " + dateStamp + " " + timeStamp + ".jpg");