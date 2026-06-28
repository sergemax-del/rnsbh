UnSelectAll();

Model.forEachPanel(function(obj) {
    var panel = obj.AsPanel;
    for (var i = panel.Butts.Count - 1; i > -1; i--) {
        var butt = panel.Butts.Butts[i];
        if (butt.CutIndex > -1)
        {
        panel.Selected = true;
        }
    }
})