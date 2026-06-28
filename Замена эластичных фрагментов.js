Prop = Action.Properties;
Furniture = Prop.NewFurniture('Эластичный фрагмент: ');
DeleteFlag = Prop.NewBool('Удалять оригиналы', true);

if (!Model.Selected)
Model.Selected = GetObject("Укажите объект для замены");

Selection = [];
Replacement = [];
for (var k = 0; k < Model.SelectionCount; k++)
Selection.push(Model.Selections[k]);

function SetSelectionVisible(Visible) {
for (var k = 0; k < Selection.length; k++) {
Selection[k].Visible = Visible;
Selection[k].Selected = Visible;
}
}

function DeleteSelection() {
for (var k = 0; k < Selection.length; k++)
DeleteObject(Selection[k]);
Selection = [];
}

Prop.NewButton('Завершить').OnClick = function() {
var bazis9 = system.apiVersion >= 90;
for (var k = 0; k < Selection.length; k++)
{
Replacement[k].Owner = Selection[k].Owner;
var index = 0;
if (bazis9) index = Selection[k].OwnerIndex;
Replacement[k].ReTransform(Model, Selection[k].Owner);
Selection[k].Visible = true;
if (DeleteFlag.Value)
DeleteObject(Selection[k]);
if (bazis9) Replacement[k].OwnerIndex = index;
Undo.Added(Replacement[k]);
}
Selection = [];
Action.Finish();
}

Action.OnFinish = function() {
SetSelectionVisible(true);
}

Prop.OnChange = function() {
DeleteNewObjects();
Replacement = [];
SetSelectionVisible(false);
Panel = AddPanel(100, 100);
for (var k = 0; k < Selection.length; k++) {
obj = Selection[k];
obj.Visible = false;
Fasad = Furniture.Value.Mount1(Panel, NewVector(0, 0, 0), 0);
Fasad.Position = obj.ToGlobal(obj.GMin);
if (obj.List == true) {
Fasad.Rotation = obj.Rotation;
} else {
if (obj.Rotation.RealPart == 1) {
Fasad.Rotation = obj.Owner.Rotation;
} else {
Fasad.Rotation = obj.Rotation;
}
}
Fasad.ElasticResize(obj.GSize);
Replacement.push(Fasad);
}
DeleteObject(Panel);
}
Action.Continue();





//https://promebelclub.ru/forum/showpost.php?p=328804&postcount=718
//https://promebelclub.ru/forum/showthread.php?p=313422
