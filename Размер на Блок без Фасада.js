FileOptions = 'Создание размеров.xml';

Prop = Action.Properties;
DlDim = Prop.NewBool('Длина', true);
VisDim = Prop.NewBool('Высота', true);
GlDim = Prop.NewBool('Глубина', true);
TFas = Prop.NewNumber('Толщина фасада', 19);
OkBtn = Prop.NewButton('Построить');

Action.Properties.Load(FileOptions);

Action.OnFinish = function() {
  Action.Properties.Save(FileOptions);
}

OkBtn.OnClick = function() {
    Make()();
    Action.Finish();
}

LocGMin = new Object;
LocGMax = new Object;
Log = false;
Log1 = false;

function InitGab() {
    LocGMin.x = 1e10;
    LocGMin.y = 1e10;
    LocGMin.z = 1e10;
    LocGMax.x = -1e10;
    LocGMax.y = -1e10;
    LocGMax.z = -1e10;
}

function GetGabLoc(obj) {
    for (var i = 0; i < obj.Count; i++) {
        objChild = obj[i];
        if (objChild instanceof TFurnBlock) {
            GetGabLoc(objChild);
        }
        if (objChild instanceof TFurnPanel) {
            GMin = objChild.ToGlobal(objChild.GMin);
            GMax = objChild.ToGlobal(objChild.GMax);

            if (GMin.x < LocGMin.x) LocGMin.x = GMin.x;
            if (GMin.y < LocGMin.y) LocGMin.y = GMin.y;
            if (GMin.z < LocGMin.z) LocGMin.z = GMin.z;
            if (GMax.x > LocGMax.x) LocGMax.x = GMax.x;
            if (GMax.y > LocGMax.y) LocGMax.y = GMax.y;
            if (GMax.z > LocGMax.z) LocGMax.z = GMax.z;

            if (GMax.x < LocGMin.x) LocGMin.x = GMax.x;
            if (GMax.y < LocGMin.y) LocGMin.y = GMax.y;
            if (GMax.z < LocGMin.z) LocGMin.z = GMax.z;
            if (GMin.x > LocGMax.x) LocGMax.x = GMin.x;
            if (GMin.y > LocGMax.y) LocGMax.y = GMin.y;
            if (GMin.z > LocGMax.z) LocGMax.z = GMin.z;
            Log = true;
        }
    }
}

function MakeSize(obj) {
    Log = false;
    GetGabLoc(obj);
    if (Log) {
        if (DlDim.Value) {
            p1 = new Vector(LocGMin.x, LocGMax.y, LocGMin.z); //Ширина //LocGMax.z
            p2 = new Vector(LocGMax.x, LocGMax.y, LocGMin.z);//LocGMax.z
            p3 = new Vector(LocGMin.x - 100, LocGMax.y, LocGMin.z); //LocGMax.z
            Size = AddSize(p1, p2, p3, 'Длина ' + obj.Name);
            Size.Color = 255;
        }

        if (VisDim.Value) {
            p1 = new Vector(LocGMin.x, LocGMin.y, LocGMax.z - TFas.Value); //Высота
            p2 = new Vector(LocGMin.x, LocGMax.y, LocGMax.z - TFas.Value);
            p3 = new Vector(LocGMin.x, LocGMin.y - 100, LocGMax.z - TFas.Value);
            Size = AddSize(p1, p2, p3, 'Высота ' + obj.Name);
            Size.Color = 255;
        }

        if (GlDim.Value) {
            p1 = new Vector(LocGMin.x, LocGMax.y, LocGMin.z); //Глубина
            p2 = new Vector(LocGMin.x, LocGMax.y, LocGMax.z - TFas.Value);
            p3 = new Vector(LocGMin.x, LocGMax.y, LocGMin.z - 100);
            Size = AddSize(p1, p2, p3, 'Глубина ' + obj.Name);
            Size.Color = 255;
        }
    }
}

function Make() {
    for (var i = 0; i < Model.Count; i++) {
        obj = Model.Objects[i];
        if (obj.Visible) {
            Sel = (Model.SelectionCount > 0);
            InitGab();
            if (obj instanceof TFurnBlock) {
                if (Sel) {
                    if (obj.Selected) MakeSize(obj);
                } else MakeSize(obj);
            }
        }
    }
    Action.Finish();
}

Action.Continue();