function InToList(obj) {
    for (var i = 0; i < obj.Count; i++) {
        objChild = obj.Objects[i];
        if (objChild instanceof TModelLimits) objChild.Visible = !objChild.Visible;
        if (objChild instanceof TFurnBlock) InToList(objChild); //Если это блок, заходим в блок
    }
}

for (var i = 0; i < Model.Count; i++) {
    obj = Model.Objects[i];
	var modelName = system.getFileNameWithoutExtension(Action.ModelFilename);
    if (obj instanceof TFurnBlock)  obj.Visible = !obj.Visible;
	ViewAll();
	SetCamera(p3dIsometric);
	path = "C:/Users/ezTone/Dropbox/picturesfordet/"+modelName+"."+obj.Designation +".jpg";
	Action.Control.SavePicture(path);
	obj.Visible = !obj.Visible;
    if (obj instanceof TFurnBlock) InToList(obj); //Если это блок, заходим в блок
}
