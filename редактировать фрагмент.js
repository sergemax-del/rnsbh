const fs = require('fs');
const path = require('path');
let testDir = "c:\\#Bazis\\#_Фрагменты";//вписать тут пусть свой к папке фрагменты
let result = [];
var frNameInModel = Model.Selected.Name;   //название выделенного блока
frNameInModel = frNameInModel + '.fr3d';
console.log(frNameInModel);
ProcessFiles(testDir);
function ProcessFiles(dirName) {
    let tempNames = fs.readdirSync(dirName);
    for (let i = 0; i < tempNames.length; i++) {
        tempNames[i] = dirName + "\\" + tempNames[i];
    }
    if (tempNames.length > 0) {
        for (let i = 0; i < tempNames.length; i++) {
            if (fs.lstatSync(tempNames[i]).isFile()) {
                let ext = path.extname(tempNames[i]);
                if (ext == ".fr3d") {
                    result.push(tempNames[i])
                    continue;
                }
            }
            if (fs.lstatSync(tempNames[i]).isDirectory()) {
                ProcessFiles(tempNames[i])
                kk = tempNames[i];
                www = fs.readdirSync(tempNames[i]);
                for (let i = 0; i < www.length; i++) {
                    if(www[i] === frNameInModel) {
                        frPath = kk+"\\"+frNameInModel;
                        console.log(frPath);
                        Action.LoadModel(frPath);
                    }
                }
            }
        }
    }
}
//console.log(result);
//alert(result.length);