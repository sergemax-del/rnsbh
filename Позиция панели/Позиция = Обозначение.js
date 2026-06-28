function AddNamePanel(panel) {
    panel.ArtPos = panel.Designation;
}

function AddNameBlock(block) {
        block.ArtPos = block.Designation;
}

function InToList(obj) {
    for (var i = 0; i < obj.Count; i++) {
        objChild = obj.Objects[i];
        if ((objChild instanceof TFurnBlock) || (objChild instanceof TLayer3D)) {
            if (objChild instanceof TFurnBlock) AddNameBlock(objChild);
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
        if (obj instanceof TFurnBlock) AddNameBlock(obj);
        InToList(obj);
    }
    if (obj instanceof TFurnPanel) {
        AddNamePanel(obj.AsPanel);
    }
}
