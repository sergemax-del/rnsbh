                                   for (var i = 0; i < 360; i += 10){
    SetCamera(p3dLeft);
    Action.DS.AngleX = 30;
    Action.DS.AngleY = i;
    var modelName = Action.Control.Owner.FileName; // Action.ModelFilename //для 10
    f = modelName + i + '.jpg';
    Action.Control.SavePicture(f);
}