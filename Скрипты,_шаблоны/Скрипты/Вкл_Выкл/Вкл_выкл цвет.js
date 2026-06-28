function AddUserProperty(obj) {
    if (obj.UserProperty['Исходный цвет'] == undefined) {
        obj.UserProperty['Исходный цвет'] = obj.Color;
        obj.Color = 536870911; //Это черный цвет
        obj.Selected = false;
    } else {
        obj.Color = obj.UserProperty['Исходный цвет'];
        obj.UserProperty['Исходный цвет'] = undefined;
    }
}

function InToList(obj) {
    for (var i = 0; i < obj.Count; i++) {
        objChild = obj.Objects[i];
        AddUserProperty(objChild);
        if (objChild.List)
            InToList(objChild);
    }
}

for (var i = 0; i < Model.Count; i++) {
    obj = Model.Objects[i];
    AddUserProperty(obj);
    if (obj.List)
        InToList(obj);
}