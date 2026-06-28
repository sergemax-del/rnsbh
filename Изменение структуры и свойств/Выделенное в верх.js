function AddUserProperty(obj) {
    obj.ReTransform(obj.Owner, Model);
    obj.Owner = Model;
    obj.Selected = false;
}

function InToList(obj) {
    for (var i = obj.Count - 1; i > -1; i--) {
        objChild = obj.Objects[i];
        if (objChild.Selected) AddUserProperty(objChild);
        if ((objChild instanceof TFurnBlock) || (objChild instanceof TLayer3D))
            InToList(objChild);
    }
}

Undo.RecursiveChanging(Model);
for (var i = Model.Count - 1; i > -1; i--) {
    obj = Model.Objects[i];
    if (obj.Selected)
        AddUserProperty(obj);
    if ((obj instanceof TFurnBlock) || (obj instanceof TLayer3D))
        InToList(obj);
}
