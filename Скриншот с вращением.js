var modelPath = Action.ModelFilename.substring (0, Action.ModelFilename.lastIndexOf("\\")+1));
var modelName = system.getFileNameWithoutExtension(Action.ModelFilename);
var scrPath = system.askFolder("Выберите папку для сохранения изображений", modelPath);

if  (scrPath.length > 0) {
    for (var i = 0; i < 360; i += 10){ //угол поворота
        SetCamera(p3dLeft);
        Action.DS.AngleX = 30;
        Action.DS.AngleY = i;
        Action.Control.SavePicture (scrPath + "Скриншот " + modelName + " " + i + ".jpg");
    };
};