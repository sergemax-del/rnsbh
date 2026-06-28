Distance = 2; //Расстояние от торца панели с кромкой до другой панели, которая закрывает этот торец
var SpNameMat = [];
var PanelCount;

Prop = Action.Properties;
PropPanCount = Prop.NewNumber('Панелей с откр. кромкой', 0);
PropSpNameMat = Prop.NewCombo('Имена материалов', '');

Model.forEachPanel(function(panel) {
    var sign = ExtractMatName(panel.MaterialName);
    if (SpNameMat.indexOf(sign) < 0) {
        SpNameMat.push(sign);
    }
}
);

SpNameMat.sort();
if (SpNameMat.length > 0) {
    for (var i = 0; i < SpNameMat.length; i++) {
        PropSpNameMat.AddItem(SpNameMat[i]);
    }
    PropSpNameMat.AddItem('Все');
    PropSpNameMat.ItemIndex = -1;
}

PropSpNameMat.OnChange = function() {
    Model.UnSelectAll();
    PanelCount = 0;
    Model.forEachPanel(function(panel) {
        ButtsCount = panel.Butts.Count;
        AddButt = false;
        for (var i = 0; i < panel.Contour.Count; i++) {
            //По умолчанию облицовок на элементе нет
            YesButt = false;
            //Перебираем все облицовки на панели
            for (var i1 = 0; i1 < ButtsCount; i1++) {
                //Берем облицовку на панели
                ButtInCont = panel.Butts.Butts[i1];
                //Если на i элементе контура есть облицовка с номером элемента ButtInCont.ElemIndex
                //присваиваем YesButt, что облицовка есть и выходим из цикла по break
                if (ButtInCont.ElemIndex == i) {
                    YesButt = true;
                    break;
                }
            }
            //Если облицовки нет и ближайшие панели находятся на расстоянии 5 мм и более. (panel.IsButtVisible(i, 5))
            if ((!YesButt) && (panel.IsButtVisible(i, Distance)) &&
               ((ExtractMatName(panel.MaterialName) == PropSpNameMat.Value) || ('Все' == PropSpNameMat.Value))) {
                AddButt = true;
            }
        }
        if (AddButt) {
            panel.Selected = true; //Подсвечиваем панель. Признак того, что хоть на одном открытом элементе нет облицовки.
            PanelCount = PanelCount + 1;
        }
    });
    PropPanCount.Value = PanelCount;
};

Action.Continue();