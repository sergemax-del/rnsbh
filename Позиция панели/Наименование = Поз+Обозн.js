function AddNamePanel(panel) {
        if (panel.Designation != '')
            panel.Name = panel.ArtPos + ' (' + panel.Designation + ')'
        else
            panel.Name = panel.ArtPos;
//        ' ' + panel.Contour.Width.toFixed(1) + 'x' + panel.Contour.Height.toFixed(1) + //Добавление размера панели
}

function AddNameBlock(block) {
         if (block.Designation != '')
             block.Name = block.ArtPos + ' (' + block.Designation + ')'
         else
             block.Name = block.ArtPos;
//        ' ' + block.GSize.x.toFixed(1) + ' x ' + block.GSize.y.toFixed(1) + ' x ' + block.GSize.z.toFixed(1) + //Добавление размера блока
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
