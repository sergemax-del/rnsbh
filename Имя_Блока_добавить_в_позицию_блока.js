//Имя блока в позицию
if (Model.SelectionCount < 1) {
alert('Нет выделенных блоков!');
Action.Finish();
}
function MakeName(obj) {
var BlockPos = obj.Name;
return BlockPos
}
function CheckObject(obj) {
if (obj instanceof TFurnBlock) {
Undo.Changing(obj);
obj.ArtPos = MakeName(obj);
}else if (obj.List){
var list = obj.AsList();
for (var i = 0; i < list.Count; i ++){
CheckObject(list[i]);
}}}
for (var i = 0; i < Model.SelectionCount; i++) {
CheckObject(Model.Selections[i]);
}