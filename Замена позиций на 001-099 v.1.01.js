//Замена позиций на формат 001, 010
Undo.RecursiveChanging(Model);//Отмена в историю
Model.forEachPanel(
function(Obj) {
var obj = Obj.AsPanel
    if (obj instanceof TFurnPanel) {
		if (obj.ArtPos <= 9) {
var owner = obj.ArtPos;
return obj.ArtPos = owner.replace (obj.ArtPos, '00' + obj.ArtPos);
		}
		if (obj.ArtPos >= 10 && obj.ArtPos <= 99) {
var owner = obj.ArtPos;
return obj.ArtPos = owner.replace (obj.ArtPos, '0' + obj.ArtPos);
		}
	}
});