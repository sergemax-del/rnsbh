function AddNamePanel(panel) {
        objOwner = panel.Owner; // Родитель панели
        alert(objOwner);
        if ((objOwner instanceof TFurnAsm) || (objOwner instanceof TFurnBlock)) {
            if (objOwner.ArtPos != '') {
                panel.Name = panel.ArtPos + '.' + objOwner.ArtPos;
//        + ' ' + panel.Contour.Width.toFixed(1) + 'x' + panel.Contour.Height.toFixed(1) //Добавление размера панели
                }
        }
}

function InToList(obj) {
    for (var i = 0; i < obj.Count; i++) {
        objChild = obj.Objects[i];
        if ((objChild instanceof TFurnBlock) || (objChild instanceof TLayer3D)) {
            InToList(objChild);
        }
        if (obj[i] instanceof TFurnPanel) {
            AddNamePanel(obj[i].AsPanel);
        }
    }
}

for (var i = 0; i < Model.Count; i++) {
    obj = Model.Objects[i];
    if ((obj instanceof TFurnBlock) || (obj instanceof TLayer3D)) {
        InToList(obj);
    }
    if (obj instanceof TFurnPanel) {
        AddNamePanel(obj.AsPanel);
    }
}
