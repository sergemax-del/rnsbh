UnSelectAll();

Model.forEachPanel(function(panel) {
    var Side0 = 0;
    var Side1 = 0;
    Plastiks = panel.Plastics;
    for (var i = 0; i < Plastiks.Count; i++) {
        Plastik = Plastiks[i];
        if (Plastik.Side == 0) Side0++;
        if (Plastik.Side == 1) Side1++;
    }
    if (Side0 + Side1 > 0) { // пластик есть
        if (Side0 > Side1) panel.FrontFace = 0
        else {
            if (Side0 < Side1) panel.FrontFace = 1
            else panel.Selected = true;
        }
    }
});

if (Model.SelectionCount > 0) alert('У выделенных панелей одинаковое количество слоев пластика с разных сторон.');
