function GetSelectionArea(precision){
    let selectionArea = 0;
    for(let i = 0; i < Model.SelectionCount; i++){
        if(Model.Selections[i].AsPanel){
            let panel = Model.Selections[i].AsPanel;
            let width = panel.ContourWidth;
            let height = panel.ContourHeight;
            let area = width * height;
            selectionArea += + area.toPrecision(precision);
        }
    }
    return selectionArea / 1000000;
}

alert(GetSelectionArea(3));