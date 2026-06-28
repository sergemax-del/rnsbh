Poz = 1;
Undo.RecursiveChanging(Model);//Отмена в историю
function MakeObj(obj) {
    if (obj.List) {
        for (var i = 0; i < obj.Count; i++) {
            objv = obj.Objects[i];
            if (obj.List) MakeObj(objv);
        }
    }
    if (obj instanceof TFurnPanel) {
		if (Poz <= 9) {
		obj.ArtPos = '00' + Poz;
        Poz++;
		}
		if (Poz >= 10 && Poz <= 99) {
		obj.ArtPos = '0' + Poz;
        Poz++;
		}
		if (Poz >= 100) {
		obj.ArtPos = Poz;
        Poz++;
		}
    }
}

for (var i = 0; i < Model.Count; i++) {
    obj = Model.Objects[i];
    MakeObj(obj);
}