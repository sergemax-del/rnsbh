var FileOptions = 'Schemes.xml';

var SchemeL, SchemeR;
var strL, strR;

MakeProperties();
LoadOptions();

Action.OnFinish = function () {
    SaveOptions();
    Action.Finish();
};

Action.Properties.OnChange = function () {
    if (SchemeL && strL) strL.Value = SchemeL.Value.EncodeToString();
    if (SchemeR && strR) strR.Value = SchemeR.Value.EncodeToString();
    return true;
};

function MakeProperties() {
    var Prop = Action.Properties;

    var label = Prop.NewLabel("Выбор схемы крепежа");
    label.Expanded = true;


    SchemeL = label.NewFurniture("Слева");

    strL = label.NewString("Код L");
    strL.Visible = false;

    SchemeR = label.NewFurniture("Справа");

    strR = label.NewString("Код R");
    strR.Visible = false;

    var btn = Prop.NewButton("Закончить");
    btn.OnClick = function () {
        SaveOptions();
        Action.Finish();
    };
}

function LoadOptions() {
    Action.Properties.Load(FileOptions);

    if (strL.Value !== "") SchemeL.Value.DecodeFromString(strL.Value);
    if (strR.Value !== "") SchemeR.Value.DecodeFromString(strR.Value);
}

function SaveOptions() {
    if (SchemeL && strL) strL.Value = SchemeL.Value.EncodeToString();
    if (SchemeR && strR) strR.Value = SchemeR.Value.EncodeToString();
    Action.Properties.Save(FileOptions);
}

Action.Continue();
