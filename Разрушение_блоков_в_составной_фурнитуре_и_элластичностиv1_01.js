UnSelectAll();
var massFrag = [];
Model.forEach(function(Obj) {
Undo.RecursiveChanging(Model);  
if ((Obj instanceof TFurnBlock) && (Obj.IsFastener())) {
Obj.Selected = true;
massFrag.push(Obj);
}
});
for (var i = 0; i< massFrag.length; ++i) {
var massObj = [];
for (var r=0; r < massFrag[i].Count; ++r){
massObj.push(massFrag[i].Objects[r])
}
for (var r=0; r < massObj.length; ++r){
massObj[r].ReTransform(massObj[r].Owner, massFrag[i].Owner);
massObj[r].Owner=massFrag[i].Owner;
}
}
Model.DeleteSelection();