function GetThickness(){
    var result = 16;
    for (var i = 0; i < Model.SelectionCount; i++){
        if (typeof Model.Selections[i].Thickness === 'number'){
            result = Model.Selections[i].Thickness;
            break;
        }
    }
    return result;
}

Action.Continue();
var newT = Action.Properties.NewNumber('Новая толщина', GetThickness());
Action.Properties.NewSeparator();
Action.Properties.NewButton('Изменить').OnClick = function (){
    for (var i = 0; i < Model.SelectionCount; i++){
        var obj = Model.Selections[i];
        Undo.Changing(obj);
        obj.Thickness = newT.Value;
        obj.Build();
    }
    Action.Finish();
}