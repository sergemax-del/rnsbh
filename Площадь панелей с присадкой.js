Model.forEachPanel(function(obj) {
    if (obj.FindConnectedFasteners().length>0)
        obj.Selected = true;
//var fasts = obj.FindConnectedFasteners();
//for (var i = 0; i < fasts.length; i++){
//    var fast = fasts[i];
//    alert(fast.Name);
//}

});

Prop = Action.Properties;
var SSurfacePan = 0;
    
Model.forEachPanel(function (panel){
    if ((panel.AsPanel) && (panel.Selected)) {
        LCont = 0;
        for (var i = 0; i < panel.Contour.Count; i++) {
            ElCont = panel.Contour[i];
        }
        SSurfacePan = SSurfacePan + panel.Contour.Width * panel.Contour.Height;
        }
})


SSurfacePan = SSurfacePan / 1000 / 1000;

SSurfacePan = Prop.NewString('Площадь панелей с присадкой', SSurfacePan.toFixed(6));

UnSelectAll();   //снять выделение

Action.Continue();
