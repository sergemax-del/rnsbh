// Список наименований для удаления:
let arrGarbage = [
    'мусор',
    'екло',
]




Undo.RecursiveChanging(Model); 
let arr = [];
Model.forEach(obj=>{
	if(obj instanceof TFurnPanel || obj.toString() == '[object TExtrusionBody]'){
		obj.Selected = true;
	}
})
function AddUserProperty(obj) {
	obj.ReTransform(obj.Owner, Model);
	obj.Owner = Model;
	obj.Selected = false;
}
function InToList(obj) {
	for (var i = obj.Count - 1; i > -1; i--) {
		objChild = obj.Objects[i];
		if (objChild.Selected) AddUserProperty(objChild);
		if ((objChild instanceof TFurnBlock) || (objChild instanceof TFurnAsm) || (objChild instanceof TLayer3D)  || (objChild instanceof TDraftBlock)) 
			InToList(objChild);

	}
}
for (var i = Model.Count - 1; i > -1; i--) {
	obj = Model.Objects[i];
	if (obj.Selected)
		AddUserProperty(obj);
	if ((obj instanceof TFurnBlock) || (obj instanceof TFurnAsm) || (obj instanceof TLayer3D) || (obj instanceof TDraftBlock))
		InToList(obj);
		arr.push(obj.UID);
}
for(let i of arr){
    DeleteObject(Model.DS.UIDGen.FindObject(i));
}

for (var i = Model.Count - 1; i > -1; i--) {
	obj = Model.Objects[i];
    for(let g of arrGarbage){
        let regexp = new RegExp(g,'i');
        if(regexp.test(obj.Name)){
            DeleteObject(obj);
        }
    }
}