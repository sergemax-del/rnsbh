Action.Continue();
var name = Action.Properties.NewString('Наименование паза');
var cont_fr = Action.Properties.NewSelector('Профиль фрезы (выберите)');
var face = Action.Properties.NewBool('С лицевой стороны');
var face_th = Action.Properties.NewNumber('    Глубина в мм');
var back = Action.Properties.NewBool('С обратной стороны');
var back_th = Action.Properties.NewNumber('    Глубина в мм');
var ugl = Action.Properties.NewBool('Обработка углов');
var ugl_th = Action.Properties.NewNumber('    Радиус в мм');
var obr_torec = Action.Properties.NewBool('Подрезать торцы на 0,01мм');
var ok_bt = Action.Properties.NewButton('Построить');
var canc_bt = Action.Properties.NewButton('Отмена');
name.Value = 'Фаска';
face.Value = true;
face_th.Value = 2;
back.Value = true;
back_th.Value = 2;
obr_torec.Value = true;
ugl.Value = true;
ugl_th.Value = 2;
cont_fr.Value = '2 mm.frw';

Action.Properties.Load('settingfaska.xml');
ChangeEnabled();
cont_fr.OnClick = function() {
    cont_fr.Value = system.askFileName('frw');
}
Action.Properties.OnChange = function() {
    ChangeEnabled();
}
canc_bt.OnClick = function() {
    Action.Finish();
}
ok_bt.OnClick = function() {
///////////////////////////////////////////////////////////////
if (Model.SelectionCount > 0) {
  for (let i = 0; i < Model.SelectionCount; i++) {
    if (Model.Selections[i] instanceof TFurnPanel) toPanel(Model.Selections[i])
    else if (Model.Selections[i].AsList) { searchPanel(Model.Selections[i]) }
  }
  function searchPanel(obj) {
    for (let i = 0; i < obj.Count; i++) {
      if (obj[i] instanceof TFurnPanel) toPanel(obj[i])
      else if (obj[i].AsList) { searchPanel(obj[i]) }
    }
  }
} else alert('Выделите панели или блок')
function toPanel(elem) {
  StartEditing(elem); // начинаем редактировать
  Min = elem.GMin; // запомним габариты панели
  Max = elem.GMax;
  Cut = elem.AddCut('Скругление углов'); // добавим паз
  // траектория паза
  Traj = Cut.Trajectory;
  var podrezka = 0.01*obr_torec.Value;
  Traj.AddRoundRect(Min.x+podrezka, Min.y+podrezka, Max.x-podrezka, Max.y-podrezka, ugl_th.Value*ugl.Value);
  // профиль паза
  Cont = Cut.Contour;
  Cont.AddRectangle(0, 100, -100, 0);
}
///////////////////////////////////////////////////////////////
    for (var i = 0; i < Model.SelectionCount; ++i) {
        if (Model.Selections[i] instanceof TFurnPanel) {
            var Panel = Model.Selections[i];
            Undo.Changing(Panel);
            var p1 = Panel.GMin.x;
            var p2 = Panel.GMin.y;
            var p3 = Panel.GMax.x;
            var p4 = Panel.GMax.y;

            if (face.Value) {
                var cut = Panel.AddCut(name.Value);
                cut.Contour.Load(cont_fr.Value);
                cut.Trajectory.AddRoundRect(p1, p2, p3, p4, face_th.Value);
                cut.Contour.Move(0, -cut.Contour.Min.y + Panel.Thickness - face_th.Value);
            }
            if (back.Value) {
                var cut = Panel.AddCut(name.Value);
                cut.Contour.Load(cont_fr.Value);
                cut.Contour.Symmetry(0, 0, 1, 0, false);
                cut.Trajectory.AddRoundRect(p1, p2, p3, p4, back_th.Value);
                cut.Contour.Move(0, -cut.Contour.Max.y + back_th.Value);
            }

			Panel.Build();

        }
    }
    Action.Properties.Save('settingfaska.xml');
	Action.Finish();
}

function ChangeEnabled() {
    face.Enabled = (cont_fr.Value != '');
    face_th.Enabled = (cont_fr.Value != '') * face.Value;
    back.Enabled = (cont_fr.Value != '');
    back_th.Enabled = (cont_fr.Value != '') * back.Value;
    ok_bt.Enabled = (cont_fr.Value != '');
}
