const precision = 3;// кол-во знаков после запятой в числе
function GetSelectionArea(precision) {
    let selectionArea = 0;
    for (let i = 0; i < Model.SelectionCount; i++) {
        if (Model.Selections[i].AsPanel) {
            let panel = Model.Selections[i].AsPanel;
            let calculateArea = geometry.Area(panel.Contour)
            selectionArea += calculateArea;
        }
    }
    return selectionArea / 1000000;
}

var sqr = Action.Properties.NewNumber('Площадь');
/**@type {Panel} */
var obj = undefined;
do{
    obj = GetPanel('Укажите панель');
    if (obj){
        obj.Selected = !obj.Selected;
        sqr.Value = GetSelectionArea(precision);
    }
}while (obj)