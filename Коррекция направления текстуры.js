res = confirm("Хотите в автоматическом режиме менять направление текстуры?\n1) Выделенные панели, если есть, поменяют направление текстуры на противоположное;\n2) Будут выделены панели, в которых текстура идет вдоль короткой стороны панели\n\nВ противном случае вы сможете менять направление текстуры на противоположное в ручном режиме указанием панели");

if (!res) {
    UnSelectAll();
    Undo.RecursiveChanging(Model);
    do {
        obj = GetPanel('Укажите панель');
        if (obj){
            obj.TextureOrientation = (obj.TextureOrientation == 1) ? 2 : 1;
        }
    } while (obj);

} else {
    if (Model.SelectionCount > 0) {
        Undo.RecursiveChanging(Model);
        for (var i = 0; i < Model.SelectionCount; i++) {
            try {
                Model.Selections[i].AsPanel.TextureOrientation = (Model.Selections[i].AsPanel.TextureOrientation == 1) ? 2 : 1;
            } catch (err) {
                continue;
            }
	   }
    } else {
	   Model.forEachPanel(function(p) {
	       if (((p.TextureOrientation == 0 || p.TextureOrientation == 2) && p.ContourWidth > p.ContourHeight) || (p.TextureOrientation == 1 && p.ContourWidth < p.ContourHeight)) {
	           p.Selected = true;
	       }
	   });
    }
}
Action.Commit();