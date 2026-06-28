LocGMin = new Object;
LocGMax = new Object;

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
            GMin = objChild.ToGlobal(obj.GMin);
            GMax = objChild.ToGlobal(obj.GMax);

            if (GMin.x < LocGMin.x) LocGMin.x = GMin.x;
            if (GMin.y < LocGMin.y) LocGMin.y = GMin.y;
            if (GMin.z < LocGMin.z) LocGMin.z = GMin.z;
            if (GMax.x > LocGMax.x) LocGMax.x = GMax.x;
            if (GMax.y > LocGMax.y) LocGMax.y = GMax.y;
            if (GMax.z > LocGMax.z) LocGMax.z = GMax.z;
        }
    }
}

function MakeSize(obj) {
    for (var i = 0; i < obj.Count; i++) {
        objChild = obj[i];
        if (objChild instanceof TModelLimits) {
            GetGabLoc(objChild);
        }
    }

    GMin = obj.ToGlobal(obj.GMin);
    GMax = obj.ToGlobal(obj.GMax);

    p1 = new Vector(GMin.x, GMax.y, GMax.z); //Ширина
    p2 = new Vector(GMax.x, GMax.y, GMax.z);
    p3 = new Vector(GMin.x - 100,  GMax.y, GMax.z);
    Size = AddSize(p1, p2, p3, 'Длина ' + obj.Name);

    p1 = new Vector(GMin.x, GMin.y, GMax.z); //Высота
    p2 = new Vector(GMin.x, GMax.y, GMax.z);
    p3 = new Vector(GMin.x, GMin.y - 100, GMax.z);
    Size = AddSize(p1, p2, p3, 'Высота ' + obj.Name);

    p1 = new Vector(GMin.x, GMax.y, GMin.z); //Глубина
    p2 = new Vector(GMin.x, GMax.y, GMax.z);
    p3 = new Vector(GMin.x, GMax.y, GMin.z - 100);
    Size = AddSize(p1, p2, p3, 'Глубина ' + obj.Name);
}

for (var i = 0; i < Model.Count; i++) {
    obj = Model.Objects[i];
    if (obj instanceof TFurnBlock) {
         MakeSize(obj);
    }
}