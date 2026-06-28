/*
- ****материалу,
- ****артикулу материала,
- ****имя панели
- ****имя панели по маске
- ****позиции,
- ****обозначению панели
- ****толщина панели
- ****наличию облицовки пласти,
- ****пользовательским свойствам,
- ****материалу кромки,
- ****обозначению кромки,
- ****толщине кромки,
- ****типу паза,
- ****непрямоугольности,
- ****наличие дуг или окружностей в контуре панели
- выделять профили, сборки и блоки по свойствам, имени, типу (пример Тип такой то, Сборочная единица - да/нет и тп.)
- наличию/отсутствию отверстий в панели,
- по диаметру отверстий,
- размерам панели.
*/

UnSelectAll();
Prop = Action.Properties;

var namesMaterialPanel = [];
var namesArticleMaterialPanel = [];
var namesPanel = [];
var namesPanelPos = [];
var namesPanelDesignation = [];
var SpPanelThickness = [];
var SpPanelPlastic = [];
var SpUserProperty = [];
var namesButtMaterials = [];
var namesButts = [];
var ThicknessButts = [];
var namesCuts = [];

GroupPanel = Prop.NewGroup('Панель');
GroupPanel.Expanded = false;
GroupButt = Prop.NewGroup('Кромка');
GroupButt.Expanded = false;
TipCuts = Prop.NewCombo('Тип пазов', '');

//Заполнение списков
Model.forEachPanel(function (panel) {
        var sign = ExtractMatName(panel.MaterialName);
        if (namesMaterialPanel.indexOf(sign) < 0) {
            namesMaterialPanel.push(sign);
        }

        sign = ExtractMatCode(panel.MaterialName);
        if (namesArticleMaterialPanel.indexOf(sign) < 0) {
            namesArticleMaterialPanel.push(sign);
        }

        sign = panel.ArtPos;
        if (namesPanelPos.indexOf(sign) < 0) {
            namesPanelPos.push(sign);
        }

        sign = panel.Designation;
        if (namesPanelDesignation.indexOf(sign) < 0) {
            namesPanelDesignation.push(sign);
        }

        sign = panel.Thickness;
        if (SpPanelThickness.indexOf(sign) < 0) {
            SpPanelThickness.push(sign);
        }

        sign = panel.Name;
        if (namesPanel.indexOf(sign) < 0) {
            namesPanel.push(sign);
        }

        for (var i = 0; i < panel.Plastics.Count; i++) {
        var sign =  ExtractMatName(panel.Plastics[i].Material);
        if (SpPanelPlastic.indexOf(sign) < 0) {
            SpPanelPlastic.push(sign);
            }
        }

        for (var i = 0; i < panel.UserPropCount; i++) {
        var sign = panel.UserPropertyName[i] + ' = "' + panel.UserProperty[i] + '"';
        if (SpUserProperty.indexOf(sign) < 0) {
            SpUserProperty.push(sign);
            }
        }

        for (var i = 0; i < panel.Butts.Count; i++) {
        var sign = ExtractMatName(panel.Butts.Butts[i].Material);
        if (namesButtMaterials.indexOf(sign) < 0) {
            namesButtMaterials.push(sign);
            }
        }

        for (var i = 0; i < panel.Butts.Count; i++) {
        var sign = panel.Butts.Butts[i].Sign;
        if (namesButts.indexOf(sign) < 0) {
            namesButts.push(sign);
            }
        }

        for (var i = 0; i < panel.Butts.Count; i++) {
        var sign = panel.Butts.Butts[i].Thickness;
        if (ThicknessButts.indexOf(sign) < 0) {
            ThicknessButts.push(sign);
            }
        }

        for (var i = 0; i < panel.Cuts.Count; i++) {
        var sign = panel.Cuts[i].Sign;
        if (namesCuts.indexOf(sign) < 0) {
            namesCuts.push(sign);
            }
        }
})
///////////////////////////////////
//Выделение панелей по материалу
function SelectMaterialPanel(c) {
    var value = c.Value;
    Model.forEachPanel((panel) => {
            var sign = ExtractMatName(panel.MaterialName);
            if (value == sign) {
                panel.Selected = true;
            }
    })
}

//Создание выпадающего списка и добавление туда имен материалов панелей
MaterialPanel = GroupPanel.NewCombo('Имя материала', '');
MaterialPanel.AddItem('');
namesMaterialPanel.sort();
for (var i = 0; i < namesMaterialPanel.length; i++) {
    MaterialPanel.AddItem(namesMaterialPanel[i]);
}
///////////////////////////////////

///////////////////////////////////
//Выделение панелей по артикулу материала
function SelectArticleMaterialPanel(c) {
    var value = c.Value;
    Model.forEachPanel((panel) => {
            var sign = ExtractMatCode(panel.MaterialName);
            if (!(value == '')) {
                if (value == sign) {
                    panel.Selected = true;
                }
            }
    })
}

//Создание выпадающего списка и добавление туда артикулов материалов панелей
ArticleMaterialPanel = GroupPanel.NewCombo('Артикул материала', '');
ArticleMaterialPanel.AddItem('');
namesArticleMaterialPanel.sort();
for (var i = 0; i < namesArticleMaterialPanel.length; i++) {
    ArticleMaterialPanel.AddItem(namesArticleMaterialPanel[i]);
}
///////////////////////////////////

///////////////////////////////////
//Выделение панелей по имени
function SelectNames(c) {
    var value = c.Value;
    Model.forEachPanel((panel) => {
        var sign = panel.Name;
        if (!(value == '')) {
            if (value == sign) {
                panel.Selected = true;
            }
        }
    })
}

//Создание выпадающего списка и добавление туда имен панелей
TipNames = GroupPanel.NewCombo('Имена панелей', '');
TipNames.AddItem('');
namesPanel.sort();
for (var i = 0; i < namesPanel.length; i++) {
    TipNames.AddItem(namesPanel[i]);
}
///////////////////////////////////

///////////////////////////////////
TipСontains = GroupPanel.NewString('Имя панели содержит', '');

function SelectСontains(c) {
    var value = c.Value;
    Model.forEachPanel((panel) => {
        var sign = panel.Name;
        if ((value != '') && (sign.indexOf(value) > -1)) {
            panel.Selected = true;
        }
    })
}
///////////////////////////////////

///////////////////////////////////
//Выделение панелей по позиции
function SelectPanelPos(c) {
    var value = c.Value;
    Model.forEachPanel((panel) => {
        var sign = panel.ArtPos;
        if (!(sign == '')) {
            if (value == sign) {
                panel.Selected = true;
            }
        }
    })
}

//Создание выпадающего списка и добавление туда позиций панелей
TipPanelPos = GroupPanel.NewCombo('Позиции панелей', '');
TipPanelPos.AddItem('');
namesPanelPos.sort();
for (var i = 0; i < namesPanelPos.length; i++) {
    TipPanelPos.AddItem(namesPanelPos[i]);
}
///////////////////////////////////

///////////////////////////////////
//Выделение панелей по обозначению
function SelectPanelDesignation(c) {
    var value = c.Value;
    Model.forEachPanel((panel) => {
        var sign = panel.Designation;
        if (!(sign == '')) {
            if (value == sign) {
                panel.Selected = true;
            }
        }
    })
}

//Создание выпадающего списка и добавление туда позиций панелей
TipPanelDesignation = GroupPanel.NewCombo('Обозначение панелей', '');
TipPanelDesignation.AddItem('');
namesPanelDesignation.sort();
for (var i = 0; i < namesPanelDesignation.length; i++) {
    TipPanelDesignation.AddItem(namesPanelDesignation[i]);
}
///////////////////////////////////

///////////////////////////////////
//Создание выпадающего списка и добавление туда толщин панелей
TipPanelThickness = GroupPanel.NewCombo('Толщина панели', '');
TipPanelThickness.AddItem('');
SpPanelThickness.sort();
for (var i = 0; i < SpPanelThickness.length; i++) {
    TipPanelThickness.AddItem(SpPanelThickness[i]);
}

//Выделение панелей по толщине
function SelectPanelThickness(c) {
    var value = c.Value;
    Model.forEachPanel((panel) => {
        var sign = panel.Thickness;
        if (value == sign) {
            panel.Selected = true;
        }
    })
}
///////////////////////////////////

///////////////////////////////////
//Создание выпадающего списка и добавление туда пластиков панелей
TipPanelPlastic = GroupPanel.NewCombo('Пластик на панели', '');
TipPanelPlastic.AddItem('');
SpPanelPlastic.sort();
for (var i = 0; i < SpPanelPlastic.length; i++) {
    TipPanelPlastic.AddItem(SpPanelPlastic[i]);
}

//Выделение панелей по пластику
function SelectPanelPlastic(c) {
    var value = c.Value;
    Model.forEachPanel((panel) => {
        for (var i = 0; i < panel.Plastics.Count; i++) {
            var sign = ExtractMatName(panel.Plastics[i].Material);
            if (value == sign) {
                panel.Selected = true;
                break;
            }
        }
    })
}

///////////////////////////////////

///////////////////////////////////
//Создание выпадающего списка и добавление туда пользоательских свойств панелей
TipPanelUsrProperty = GroupPanel.NewCombo('Пользовательские свойства', '');
TipPanelUsrProperty.AddItem('');
SpUserProperty.sort();
for (var i = 0; i < SpUserProperty.length; i++) {
    TipPanelUsrProperty.AddItem(SpUserProperty[i]);
}

//Выделение панелей по пользовательским свойствам
function SelectPanelUserProperty(c) {
    var value = c.Value;
    Model.forEachPanel((panel) => {
        for (var i = 0; i < panel.UserPropCount; i++) {
            var sign = panel.UserPropertyName[i] + ' = "' + panel.UserProperty[i] + '"';
            if (value == sign) {
                panel.Selected = true;
            }
        }
    })
}
///////////////////////////////////

///////////////////////////////////
//Выделение кромок по материалу
function SelectButtMaterials(c) {
    var value = c.Value;
    Model.forEachPanel((panel) => {
        for (var i = 0; i < panel.Butts.Count; i++) {
            var sign = ExtractMatName(panel.Butts.Butts[i].Material);
            if (value == sign) {
                panel.Selected = true;
                break;
            }
        }
    })
}

//Создание выпадающего списка и добавление туда имен материалов кромок
TipMaterialKromki = GroupButt.NewCombo('Материал кромки', '');
TipMaterialKromki.AddItem('');
namesButtMaterials.sort();
for (var i = 0; i < namesButts.length; i++) {
    TipMaterialKromki.AddItem(namesButtMaterials[i]);
}
///////////////////////////////////

///////////////////////////////////
//Выделение кромок
function SelectButts(c) {
    var value = c.Value;
    Model.forEachPanel((panel) => {
        for (var i = 0; i < panel.Butts.Count; i++) {
            var sign = panel.Butts.Butts[i].Sign;
            if (value == sign) {
                panel.Selected = true;
                break;
            }
        }
    })
}

//Создание выпадающего списка и добавление туда имен кромок
TipKromki = GroupButt.NewCombo('Тип кромки', '');
TipKromki.AddItem('');
namesButts.sort();
for (var i = 0; i < namesButts.length; i++) {
    TipKromki.AddItem(namesButts[i]);
}
///////////////////////////////////

///////////////////////////////////
//Выделение толщин кромок
function SelectThicknessButts(c) {
    var value = c.Value;
    Model.forEachPanel((panel) => {
        for (var i = 0; i < panel.Butts.Count; i++) {
            var sign = panel.Butts.Butts[i].Thickness;
            if (value == sign) {
                panel.Selected = true;
                break;
            }
        }
    })
}

//Создание выпадающего списка и добавление туда толщин кромок
ThicknessKromki = GroupButt.NewCombo('Толщина кромки', '');
ThicknessKromki.AddItem('');
ThicknessButts.sort();
for (var i = 0; i < ThicknessButts.length; i++) {
    ThicknessKromki.AddItem(ThicknessButts[i]);
}
///////////////////////////////////

///////////////////////////////////
//Выделение пазов
function SelectCuts(c) {
    var value = c.Value;
    Model.forEachPanel((panel) => {
        for (var i = 0; i < panel.Cuts.Count; i++) {
            var sign = panel.Cuts[i].Sign;
            if (value == sign) {
                panel.Selected = true;
                break;
            }
        }
    })
}
//Создание выпадающего списка и добавление туда имен пазов
TipCuts.AddItem('');
namesCuts.sort();
for (var i = 0; i < namesCuts.length; i++) {
    TipCuts.AddItem(namesCuts[i]);
}
///////////////////////////////////

NotRectangleBtn = Prop.NewButton('Контур не прямоугольный');
NotRectangleBtn.OnClick = function () {
    Model.forEachPanel(function (Panel) {
        if (!(Panel.Contour.IsContourRectangle())) Panel.Selected = true;
    }
    )
}

ArcCircleBtn = Prop.NewButton('Контур с дугами или окружностями');
ArcCircleBtn.OnClick = function () {
    Model.forEachPanel(function (Panel) {
        for (var i = 0; i < Panel.Contour.Count; i++) {
            if (Panel.Contour[i].ElType == 2) Panel.Selected = true; //Это дуга
            if (Panel.Contour[i].ElType == 3) Panel.Selected = true; //Это окружность
        }
    }
    )
}

Prop.NewLabel('');

SelectBtn = Prop.NewButton('Выделить');
//Обработка нажатия на кнопку Выделить
SelectBtn.OnClick = function () {
    if (GroupPanel.Expanded) {
        SelectMaterialPanel(MaterialPanel);
        SelectArticleMaterialPanel(ArticleMaterialPanel);
        SelectPanelThickness(TipPanelThickness);
        SelectNames(TipNames);
        SelectСontains(TipСontains);
        SelectPanelPos(TipPanelPos);
        SelectPanelDesignation(TipPanelDesignation);
        SelectPanelPlastic(TipPanelPlastic);
        SelectPanelUserProperty(TipPanelUsrProperty);
    }
    if (GroupButt.Expanded) {
        SelectButtMaterials(TipMaterialKromki);
        SelectButts(TipKromki);
        SelectThicknessButts(ThicknessKromki);
    }

    SelectCuts(TipCuts);
}

UnSelectBtn = Prop.NewButton('Отменить выделение');
UnSelectBtn.OnClick = function () {
    UnSelectAll();
}

InvertSelectBtn = Prop.NewButton('Инвертировать выделение');
InvertSelectBtn.OnClick = function () {
    Model.forEachPanel(function (Panel) {
        Panel.Selected = !Panel.Selected;
    })
}

FileOptions = 'Выделение по маске.xml';
Action.Properties.Load(FileOptions);
Action.OnFinish = function() {
  Action.Properties.Save(FileOptions);
}

Action.Continue();
