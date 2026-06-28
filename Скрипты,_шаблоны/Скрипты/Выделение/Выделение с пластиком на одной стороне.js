var Side0Thickness = 0;
var Side1Thickness = 0;

function GetSidePlastic(panel) {
    Plastiks = panel.Plastics;
    for (var i = 0; i < Plastiks.Count; i++) {
        Plastik = Plastiks[i];
        if (Plastik.Side == 0) {
            if (Plastik.Thickness == 0)
                Side0Thickness = Side0Thickness + 0.001
            else
                Side0Thickness = Side0Thickness + Plastik.Thickness;
        }
        if (Plastik.Side == 1) {
            if (Plastik.Thickness == 0)
                Side1Thickness = Side1Thickness + 0.001
            else
                Side1Thickness = Side1Thickness + Plastik.Thickness;
        }
    }
    return 0;
}

UnSelectAll();
Model.forEachPanel(function (panel) {
    Side0Thickness = 0;
    Side1Thickness = 0;
    GetSidePlastic(panel);
    if (((Side0Thickness == 0) && (Side1Thickness != 0)) ||
        ((Side0Thickness != 0) && (Side1Thickness == 0))) panel.Selected = true;
});