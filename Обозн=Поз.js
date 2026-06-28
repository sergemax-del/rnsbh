Model.forEachPanel(function (panel) {
    if (panel.ArtPos.indexOf('(') < 0)
        panel.ArtPos =panel.Designation;
        })
Model.forEach(function (obj) {
if (obj instanceof TExtrusionBody){
    obj.ArtPos =obj.Designation;
    };
})
Model.forEach(function (obj) {
if (obj instanceof TFurnBlock){
obj.ArtPos =obj.Designation;
};
})
Model.forEach(function (obj) {
if (obj instanceof T2DTrajectoryBody){
obj.ArtPos =obj.Designation;
};
})