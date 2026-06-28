//Ищет детали с дробными размерами
Model.forEachPanel(function(panel){
    height = panel.ContourHeight.toFixed(2);
    width = panel.ContourWidth.toFixed(2);
    if(height % 1 > 0 || width % 1 > 0){
    /*
    alert('Поз. ' + panel.ArtPos + ' '
    + panel.Name + ' ' + height + '*' + width);
    */
    panel.Selected = true;
    }
});
