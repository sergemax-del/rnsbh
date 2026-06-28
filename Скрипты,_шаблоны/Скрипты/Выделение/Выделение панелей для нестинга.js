

var precision = 0.001;
var SpMessage = [];

function NormVect(x, y) {
    vect = new Object;
    vect.x = x / Math.sqrt(x * x + y * y);
    vect.y = y / Math.sqrt(x * x + y * y);
    return vect;
}

function GetAngle(Lin1, Lin2) {
    vect1 = new Object;
    vect2 = new Object;
    Dx1 = Lin1.Pos2.x - Lin1.Pos1.x;
    Dy1 = Lin1.Pos2.y - Lin1.Pos1.y;
    Dx2 = Lin2.Pos2.x - Lin2.Pos1.x;
    Dy2 = Lin2.Pos2.y - Lin2.Pos1.y;
    vect1 = NormVect(Dx1, Dy1);
    vect2 = NormVect(Dx2, Dy2);
    Angle = vect1.x * vect2.y - vect1.y * vect2.x;
    if (Math.abs(Angle) < precision) {
        if ((Math.abs(vect1.x + vect2.x) < precision) &&
            (Math.abs(vect1.y + vect2.y) < precision)) {
           Angle = -Math.PI;
        }
        else Angle = 0;
    }
    else Angle = Math.asin(Angle);
    return Angle;
}

function Mess(panel) {
    panel.Selected = true;
    sss = '';
    if (panel.ArtPos.length > 0) sss = ' Поз.' + panel.ArtPos + ' ';
    sss1 = 'В панели ' + sss + ' ' +
            panel.ContourWidth.toFixed(1) + 'x' + panel.ContourHeight.toFixed(1) +
            ' есть вогнутость';
//    SpMessage.push(sss1);
}

function MessCountCont(panel) {
    panel.Selected = true;
    sss = '';
    if (panel.ArtPos.length > 0) sss = ' Поз.' + panel.ArtPos + ' ';
    sss1 = 'В панели ' + sss + ' ' +
            panel.ContourWidth.toFixed(1) + 'x' + panel.ContourHeight.toFixed(1) +
           ' есть внутренние контуры';
//    SpMessage.push(sss1);
}

function MessCircleOrArcCont(panel) {
    panel.Selected = true;
    sss = '';
    if (panel.ArtPos.length > 0) sss = ' Поз.' + panel.ArtPos + ' ';
    sss1 = 'В панели ' + sss + ' ' +
            panel.ContourWidth.toFixed(1) + 'x' + panel.ContourHeight.toFixed(1) +
           ' есть окружности или дуги в наружном контуре';
//    SpMessage.push(sss1);
}

function PanelIsConcave(panel) {  //проверка панели на вогнутость
    if (panel.Contours.Count > 1) {
        MessCountCont(panel);
        panel.Selected = true;
//panel.Contours.Count //количество контуров в панели
//Model.Selected.AsPanel.Contours[0]; //наружный контур
    }
    else
    {   panel.Contour.OrderContours(true);
        if (panel.Contour.IsClockOtherWise())
            panel.Contour.InvertDirection();
        El1 = new Object;
        El1 = panel.Contour.Objects[0];
        for (var i1 = 1; i1 < panel.Contour.Count; i1++) {
            var elem = panel.Contour.Objects[i1];
            El2 = elem;
            if (El2.ElType == 1) var Lin = elem.AsLine();
            if (El2.ElType == 2) var Dug = elem.AsArc();

            if (El1.ElType == 1) {
                if (El2.ElType == 1) {
                    Ug = GetAngle(El1.AsLine(), El2.AsLine());
                    if ((Math.abs(Ug) > precision) && (Ug < 0)) {
//                        console.log('Lin-Lin ' +  Ug / Math.PI * 180.0);
                        Mess(panel);
                        panel.Selected = true;
                        break;
                    }
                    El1 = El2;
                }
            }
        }
    }
}

function YesCircleOrArc(panel) {
    for (var i = 0; i < panel.Contour.Count; i++) {
        El = panel.Contour.Objects[i];
        if ((El.ElType == 2) || (El.ElType == 3)) { //Элемент контура окружность или дуга.
            MessCircleOrArcCont(panel);
            panel.Selected = true;
            break;
        }
    }
}

function InToList(obj) {
    for (var i = 0; i < obj.Count; i++) {
        objChild = obj.Objects[i];
        if ((objChild instanceof TFurnBlock) || (objChild instanceof TLayer3D)) InToList(objChild);
        if (obj[i] instanceof TFurnPanel) {
            YesCircleOrArc(obj[i].AsPanel);
            if (!obj[i].Selected) 
                PanelIsConcave(obj[i].AsPanel);
        }
    }
}

UnSelectAll();
for (var i = 0; i < Model.Count; i++) {
    obj = Model.Objects[i];
    if ((obj instanceof TFurnBlock) || (obj instanceof TLayer3D)) InToList(obj);
    if (obj instanceof TFurnPanel) {
        YesCircleOrArc(obj.AsPanel);
        if (!obj.Selected) 
            PanelIsConcave(obj.AsPanel);
    }
}

SpMessage.sort();
if (SpMessage.length > 0) alert(SpMessage.join('\n'));