var delimiter = '.'
function MakeName(obj) {
    var owner = obj.Owner;
    return owner.Name + "_" + obj.Name
}
function CheckObject(obj) {
    if (obj.AsPanel) {
        Undo.Changing(obj);
        obj.Name = MakeName(obj);
    }else if (obj.List){
        var list = obj.AsList();
        for (var i = 0; i < list.Count; i ++){
            CheckObject(list[i]);
        }
    }
}

for (var i = 0; i < Model.SelectionCount; i++) {
    CheckObject(Model.Selections[i]);
}