var Pripusk = 0; //Припуск на выход паза
var Delta = 0.000001; //Точность сравнения
var CutCount = 0;
var PanelCount = 0;

function EQNumber(a, b, Delta) {
    if (Math.abs(a - b) < Delta) {return true}
    else {return false};
}

function GetPointPerpLin(Sm, P, L) {
    let dx = L.Pos2.x - L.Pos1.x;
    let dy = L.Pos2.y - L.Pos1.y;
    let dl = Math.sqrt(dx * dx + dy *dy);
    let PP = new Object();
    PP.x = P.x - Sm * dy/dl;
    PP.y = P.y + Sm * dx/dl;
    return PP; 
}

function CheckPointInLine(p, L) {
    let x = L.Pos2.x - L.Pos1.x;
    let y = L.Pos2.y - L.Pos1.y;
    let dx = p.x - L.Pos1.x;
    let dy = p.y - L.Pos1.y;
    if ((y == 0) && (dy == 0)) {  //Линия вертикальна
        if (x > 0) {
            if ((dx >= 0) && (dx <= x)) {return true}
            else {return false};
        } else {
            if ((dx <= 0) && (dx >= x)) {return true}
            else {return false};
        }
    }
    if ((x == 0) && (dx == 0)) {  //Линия горизонтальна
        if (y > 0) {
            if ((dy >= 0) && (dy <= y)) {return true}
            else {return false};
        } else {
            if ((dy <= 0) && (dy >= y)) {return true}
            else {return false};
        }
    }
    if (((x == 0) && (dx != 0)) || 
        ((x != 0) && (dx == 0))) {return false}
        else
        {     
            if (EQNumber(y/x, dy/dx, Delta)) {return true} 
            else {return false};
        }
}

function IncreaseLengthLine(L, p, dl) {
    let x = L.Pos2.x - L.Pos1.x;
    let y = L.Pos2.y - L.Pos1.y;
    let z = Math.sqrt(x*x + y*y);
    let pNew = new Object;
    if (EQNumber(p.x, L.Pos2.x, Delta) && EQNumber(p.y, L.Pos2.y, Delta)) {
        pNew.x = L.Pos2.x + dl * x/z;
        pNew.y = L.Pos2.y + dl * y/z;
    }
    else {
        pNew.x = L.Pos1.x - dl * x/z;
        pNew.y = L.Pos1.y - dl * y/z;
    }
    return pNew;
}

Model.forEachPanel(function(panel) { 
    ContourPanel = panel.Contour;
    Cuts = panel.Cuts;
    let LogPanel = false;
    for (var i = 0; i < Cuts.Count; i++) {
        Cut = Cuts[i];
        ContourCut = Cut.Contour;
        Trajectory = Cut.Trajectory;
        if ((Trajectory.Count > 1) || (Trajectory.Count == 0)) continue;
        CutTrajLine = Trajectory[0];
        if (!CutTrajLine.IsLine) continue;

        let LogCut = false;
        Sm = ContourCut.Min.x + (ContourCut.Max.x - ContourCut.Min.x) * 0.5;
        let p1Perp = GetPointPerpLin(Sm, CutTrajLine.Pos1, CutTrajLine);
        let p2Perp = GetPointPerpLin(Sm, CutTrajLine.Pos2, CutTrajLine);
        let T1OnCountur = false;
        let T2OnCountur = false;
        for (var i1 = 0; i1 < ContourPanel.Count; i1++) {
            Line = ContourPanel[i1];
            Butts = panel.Butts;
            if ((!(T1OnCountur)) && (CheckPointInLine(p1Perp, Line))) {
                T1OnCountur = true;
                continue;
            }
            if ((!(T2OnCountur)) && (CheckPointInLine(p2Perp, Line))) {
                T2OnCountur = true;
            }
            if (T1OnCountur && T2OnCountur) {
                Line = ContourPanel[i1];
                Butts = panel.Butts;
                for (var i2 = 0; i2 < Butts.Count; i2++) {
                    Butt = Butts[i2];
                    if (i1 == Butt.ElemIndex) {
                        Udl = 0;
                        if (Butt.ClipPanel) Udl = -Butt.Thickness;
                        Udl = Pripusk + Udl + Butt.Allowance;
                        CutTrajLine.Pos1 = IncreaseLengthLine(CutTrajLine, CutTrajLine.Pos1, Udl);
                        LogCut = true;
                        break;
                    }
                }
                for (var i2 = 0; i2 < Butts.Count; i2++) {
                    Butt = Butts[i2];
                    if (i1 == Butt.ElemIndex) {
                        Udl = 0;
                        if (Butt.ClipPanel) Udl = -Butt.Thickness;
                        Udl = Pripusk + Udl + Butt.Allowance;
                        CutTrajLine.Pos2 = IncreaseLengthLine(CutTrajLine, CutTrajLine.Pos2, Udl);
                        LogCut = true;
                        break;
                    }
                }
            }
        }
        if (LogCut) {
            CutCount++;
            LogPanel = true;
        }
    }
    if (LogPanel) {
        PanelCount++;
        panel.Selected = true;
    }
});

Model.Build();
alert('На ' + PanelCount + ' панелях увеличено ' + CutCount + ' пазов');
