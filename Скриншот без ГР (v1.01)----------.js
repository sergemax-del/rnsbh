//Скрыть Габаритные рамки
let flag = 0;
Arr = [
    "Габаритная",
    "Линия стыка",
    "Параллельная линия",
    "Биссектриса",
    "Перпендикулярная линия",
    "Линия под углом",
    "Линия пересечения",
]
Model.forEach(function (obj){
    for(let name of Arr){
        let regexp = new RegExp(name,'i');
        if(regexp.test(obj.Name) && obj.Visible){
            flag = 1;
        }
    }
});

clickGab=()=>{Action.Control.Owner.Owner.Owner.FindComponent("FormMain").FindComponent('a3Limits').Execute("Click");}
(flag)?clickGab():false;

//Фото
var modelPath = Action.ModelFilename.substring (0, Action.ModelFilename.lastIndexOf("\\")+1);
var modelName = system.getFileNameWithoutExtension(Action.ModelFilename);
var curDate = new Date();
var dateStamp = (curDate.getDate() < 10 ? "0" + curDate.getDate() : curDate.getDate()) + "-" + (curDate.getMonth() < 10 ? "0" + curDate.getMonth() : curDate.getMonth()) + "-" + curDate.getFullYear();
var timeStamp = (curDate.getHours() < 10 ? "0" + curDate.getHours() : curDate.getHours()) + "-" + (curDate.getMinutes() < 10 ? "0" + curDate.getMinutes() : curDate.getMinutes()) + "-" + (curDate.getSeconds() < 10 ? "0" + curDate.getSeconds() : curDate.getSeconds()) + "." + curDate.getMilliseconds();
Action.Control.SavePicture (modelPath + "Pic " + modelName + " " + dateStamp + " " + timeStamp + ".jpg");

//Типа рефреш
var mainForm = Action.Control.Owner.Owner;
var est = mainForm.FindComponent('a3ViewShadeAndLines');
est.Execute();

(flag)?clickGab():false;