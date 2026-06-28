               /*
Расчёт площади, веса, объёма и периметра панелей, метража кромки, погонажа и профилей,
а также количества фурнитуры.

http://promebelclub.ru/forum/showthread.php?p=505390#post505390

v2.20
    + AddCount
v2.19
    + fMyRules
v2.18
    + NBIF
v2.17
    + PlasticsCheck
    + IsFastener() && fix obj.IsFastener()
v2.16
    + obj.IsFastener()
*/

var AddHidden = 0 // нужно ли добавлять скрытые объекты в результаты
var AddArticul = 0 // нужно ли добавлять артикул к имени материала
var NBIF = 0 // отключение расчёта блоков составной фурнитуры, как позиции фурнитуры
var AddCount = 1 // Добавлять (кроме фурнитуры) в именах позиций количество объектов

var Q_MDF = 1111111.111111 // name.match(/^МДФ/i)
var Q_STEKLO = 400000 // name.match(/стекло/i)
var Q_LDSP = 1333333.333333 // иначе

var fMyRules = (typeof MyRules == 'function') ? MyRules : 0 // указание обработчика своих исключений функцией с именем "MyRules" принимающая один аргумент

// -------------------------------------------------

var Res = {Panels: [], Linears: [], Extrusions: [], Edges: [], Fasteners: [], Plastics: []
 , Total: {Panels: 0, Linears: 0, Extrusions: 0, Edges: 0, Fasteners: 0, Plastics: 0}
 , Count: {Panels: 0, Linears: 0, Extrusions: 0, Edges: 0, Fasteners: 0, Plastics: 0}
 , Weight: 0, Volume: 0, PanelsContour: 0};
var ItemsCount = {Panels: [], Linears: [], Extrusions: [], Edges: [], Fasteners: [], Plastics: []}
var Buffer = [];
var Selected = Model.SelectionCount;

for (var i = 0; i < Model.Count; ++i) {
    recurse(Model.Objects[i])
};

for (var key in Buffer) {
    CheckObj(Buffer[key])
};

function CheckObj(obj) {
    if (fMyRules && fMyRules.call(0, obj))
        return
    var objtype = obj.toString()
    if (obj.AsPanel) {
        MtName = MaterialName(obj.MaterialName)
        Contour = obj.Contour;
        if (obj.MaterialWidth > 0) {                                            // погонный
            Add('Linears', MtName, Math.max(Contour.Height, Contour.Width))
        } else {                                                                // панели
            Add('Panels', MtName, (Contour.Height * Contour.Width))
            WeightAndVolumeCalc(Contour.Height * Contour.Width * obj.Thickness, MtName)
            Res.PanelsContour += GetContourLength(Contour)
        }
        Butts = obj.Butts;                                                      // кромка
        for (var i = 0; i < Butts.Count; ++i) {
            Add('Edges', MaterialName(Butts[i].Material), GetButtLength(Butts[i], Contour))
        };
    } else if (objtype == '[object TFastener]' || IsFastener(obj)) {           // фурнитура
        Add('Fasteners', MaterialName(obj.Name), 1)
    } else if (objtype == '[object TExtrusionBody]') {                          // профиль
        Add('Extrusions', MaterialName(obj.MaterialName), Math.abs(obj.Thickness))
    } else if (objtype == '[object T2DRotationBody]') {                         // погонный
        Add('Linears', MaterialName(obj.MaterialName), Math.max(obj.Contour2D.Height, obj.Contour2D.Width))
    }
}

var string = '';
if (Object.keys(Res.Panels).length) {
    string += '\n              Панели (квадратные метры): ' + (Res.Total.Panels / 1000000).toFixed(2) + ', объектов: ' + Res.Count.Panels + '\n\n';
    for (var key in Res.Panels) {
        AddString('Panels', key, (Res.Panels[key] / 1000000).toFixed(2))
    };
}
if (Object.keys(Res.Plastics).length) {
    string += '\n              Облицовка пласти (квадратные метры): ' + (Res.Total.Plastics / 1000000).toFixed(2) + ', объектов: ' + Res.Count.Plastics + '\n\n';
    for (var key in Res.Plastics) {
        AddString('Plastics', key, (Res.Plastics[key] / 1000000).toFixed(2))
    };
}
if (Object.keys(Res.Edges).length) {
    string += '\n              Кромка (метры): ' + (Res.Total.Edges / 1000).toFixed(2) + ', объектов: ' + Res.Count.Edges + '\n\n';
    for (var key in Res.Edges) {
        AddString('Edges', key, (Res.Edges[key] / 1000).toFixed(2))
    };
}
if (Object.keys(Res.Linears).length) {
    string += '\n              Погонные материалы (метры): ' + (Res.Total.Linears / 1000).toFixed(2) + ', объектов: ' + Res.Count.Linears + '\n\n';
    for (var key in Res.Linears) {
        AddString('Linears', key, (Res.Linears[key] / 1000).toFixed(2))
    };
}
if (Object.keys(Res.Extrusions).length) {
    string += '\n              Профили (метры): ' + (Res.Total.Extrusions / 1000).toFixed(2) + ', объектов: ' + Res.Count.Extrusions + '\n\n';
    for (var key in Res.Extrusions) {
        AddString('Extrusions', key, (Res.Extrusions[key] / 1000).toFixed(2))
    };
}
if (Object.keys(Res.Fasteners).length) {
    string += '\n              Фурнитура (штуки): ' + Res.Total.Fasteners + '\n\n';
    for (var key in Res.Fasteners) {
        string += key + '   =   ' + Res.Fasteners[key] + '    \n'
    };
}
if (Res.Volume > 0) {
    string += '\n              Вес, объём и периметр (только панели):\n\n'
    + (Res.Weight).toFixed(1) + ' килограмм\n'
    + (Res.Volume / 1000000000).toFixed(3) + ' кубических метров\n'
    + (Res.PanelsContour / 1000).toFixed(2) + ' метров периметра\n'
}

if (string == '') {
    alert('Объекты не обнаружены!')
} else {
    var captionstring = ''
    + (Selected ? 'ИНФО ТОЛЬКО О ВЫДЕЛЕННЫХ И ПОДСВЕЧЕННЫХ!!!\n' : '')
    + (!AddHidden ? 'СКРЫТЫЕ НЕ УЧИТЫВАЮТСЯ!!!\n' : '')

    if (!confirm(captionstring + string + '\n\n\n              Чтобы вывести в файл нажмите "Нет"'))
        ButtonExport()
}
Action.Finish()

// -------------------------------------------------

function recurse(obj, sel) {
    if (!obj.Visible && !AddHidden)
        return
    if (!obj.List) {
        if (!sel)
            sel = !!((Selected) && (obj.Selected || obj.Highlighted))
        if (Selected && !sel)
            return
        PlasticsCheck(obj)
        Buffer.push(obj)
    } else {
        if (IsFastener(obj) && ((Selected && obj.Selected) || !Selected))
            return Buffer.push(obj)
        var blocksel = !!((Selected) && (sel || obj.Selected || obj.Highlighted))
        for (var i = 0; i < obj.Count; i++) {
            recurse(obj[i], blocksel)
        }
    }
}

function PlasticsCheck(obj) {
    if (obj.toString() !== '[object TFurnPanel]')
		return
	for (var i = 0; i < obj.Plastics.Count; i++) {
		MtName = MaterialName(obj.Plastics[i].Material)
		if (MtName == '')
			continue
		Add('Plastics', MtName, (obj.Contour.Height * obj.Contour.Width))
    }
}

function IsFastener(obj) {
    return ((obj.toString() == '[object TFastener]') || (!NBIF && (typeof obj.IsFastener == 'function') && obj.IsFastener()))
}

function Add(name, key, value) {
    if (value <= 0)
        return
    if (!Res[name].hasOwnProperty(key))
        Res[name][key] = 0, ItemsCount[name][key] = 0
    Res[name][key] += value
    Res.Total[name] += value
    Res.Count[name] += 1
    ItemsCount[name][key] += 1
}

function AddString(type, key, value) {
    if (AddCount)
        CountStr = ' (объектов: ' + ItemsCount[type][key] + ')';
    else
        CountStr = ''
    if (value > 0)
        string += key + CountStr + '   =   ' + value + '    \n'
}

function GetButtLength(butt, contour) {
    return contour.Objects[butt.ElemIndex].ObjLength()
}

function GetContourLength(contour) {
    var len = 0
    for (var i = 0; i < contour.Count; ++i) {
        len += contour.Objects[i].ObjLength()
    };
    return len
}

function MaterialName(str) {
    if (AddArticul)
        return str.replace("\r", ". Артикул ")
    return str.replace(/\r.*/, '')
}

function ButtonExport() {
    system.writeTextFile('export.txt', string);
    Path = '"' + Action.Properties.AbsolutePath() + 'export.txt"'
    NewCOMObject('WScript.Shell').run(Path);
}

// -------------------------------------------------

function WeightAndVolumeCalc(vol, name) {
    if (name.match(/^МДФ/i))
        Q = Q_MDF
    else if (name.match(/стекло/i))
        Q = Q_STEKLO
    else
        Q = Q_LDSP
    Res.Weight += vol / Q
    Res.Volume += vol
}

// -------------------------------------------------