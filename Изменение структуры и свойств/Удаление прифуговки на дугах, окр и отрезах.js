UnSelectAll();

Model.forEachPanel(function(obj) {
    var panel = obj.AsPanel;
    for (var i = 0; i < panel.Butts.Count; i++) {
        var butt = panel.Butts.Butts[i];
        if (butt.CutIndex > -1) {
            butt.Allowance = 0;
        }
        var El = panel.Contour[butt.ElemIndex];
        if ((El.IsArc()) || (El.IsCircle())) butt.Allowance = 0;
    }
})