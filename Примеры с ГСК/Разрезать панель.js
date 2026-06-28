UnSelectAll();

var panel = null;
if (Model.SelectionCount > 0 && Model.Selections[0] instanceof TFurnPanel) {
	panel = Model.Selections[0];
} else {
	panel = GetPanel('Укажите панель для разреза');
}

var validPanel = (panel instanceof TFurnPanel);
if (!validPanel) {
    Action.Hint = 'Не найдена панель для разреза';
    Action.Finish();
}

// Интерфейс
if (validPanel) {
    var props = Action.Properties;
    var direction = props.NewCombo('Направление разреза:', 'Вдоль\nПоперёк');
    direction.Store = false;
    var mode = props.NewCombo('Способ выбора места реза:', 'Середина панели\nПо двум линиям');
    mode.Store = false;
    var kerf = props.NewNumber('Толщина пропила (мм):', 0);
    kerf.MinValue = 0;
    
    // При выборе "По двум линиям" сразу запускаем выбор линий в уже заданном направлении
    mode.OnValueChange = function() {
        if (mode.Value == 'По двум линиям') {
            Action.AsyncExec(function(){
                Action.ShowEdges = true;
                // Выбор линий в плоскости панели: используем локальные оси панели, преобразованные в ГСК
                var axis = (direction.Value == 'Поперёк') ? panel.NToGlobal(AxisX) : panel.NToGlobal(AxisY);
                var e1 = GetEdge('Укажите первую линию/границу', axis);
                var e2 = GetEdge('Укажите вторую линию/границу', axis);
                Action.ShowEdges = false;
                var cutInfo = calcCutFromEdges(e1, e2, kerf.Value, direction.Value);
                if (cutInfo) {
                    performSplitWithCutInfo(cutInfo);
                }
                Action.Finish();
            });
        }
    };

    props.NewButton('Выполнить').OnClick = function() {
        // Кнопка выполняет только рез по середине, направление берём из выпадающего списка
        var cutInfo = calcCutMidOfPanel(kerf.Value, direction.Value);
        if (cutInfo) {
            performSplitWithCutInfo(cutInfo);
        }
        Action.Finish();
    };

    Action.OnFinish = function() {
        // нет сохранения настроек пока
    };

    Action.Continue();
}

function calcCutMidOfPanel(kerfVal, dirText) {
    var b = getContourBounds(panel);
    var x1 = b.minX;
    var y1 = b.minY;
    var x2 = b.maxX;
    var y2 = b.maxY;
    var midX = (x1 + x2) / 2.0;
    var midY = (y1 + y2) / 2.0;
    if (dirText == 'Поперёк') {
        return { type: 'h', x: null, y: midY, kerf: kerfVal };
    } else {
        return { type: 'v', x: midX, y: null, kerf: kerfVal };
    }
}

function calcCutFromEdges(e1, e2, kerfVal, dirText) {
    if (!e1 || !e2) { return null; }
    if (dirText == 'Поперёк') {
        // Преобразуем выбранные точки из глобальных в ЛСК панели
        var p1 = panel.ToObject(e1.GFirst);
        var p2 = panel.ToObject(e2.GFirst);
        var cy = (p1.y + p2.y) / 2.0;
        return { type: 'h', x: null, y: cy, kerf: kerfVal };
    } else {
        var p1 = panel.ToObject(e1.GFirst);
        var p2 = panel.ToObject(e2.GFirst);
        var cx = (p1.x + p2.x) / 2.0;
        return { type: 'v', x: cx, y: null, kerf: kerfVal };
    }
}

function performSplitWithCutInfo(cut) {
	// Только прямоугольные панели поддерживаем в первой версии
	if (!panel.IsContourRectangle) {
		Action.Hint = 'Контур панели не прямоугольный — разрез невозможен';
		return;
	}

	Undo.RecursiveChanging(panel);

	// Дублируем панель
	var panel2 = AddCopy(panel);

    // Границы текущего контура в локальных координатах контура
    var b = getContourBounds(panel);
    var x1 = b.minX;
    var y1 = b.minY;
    var x2 = b.maxX;
    var y2 = b.maxY;

    var midX = cut.x != null ? cut.x : (x1 + x2) / 2.0;
    var midY = cut.y != null ? cut.y : (y1 + y2) / 2.0;
    var halfKerf = (cut.kerf || 0) / 2.0;

    // Защита от неверного выбора: ограничим линию реза внутри габарита панели (в локальных координатах контура)
    var eps = 0.0001;
    if (cut.type == 'h') {
        var low = Math.min(y1, y2);
        var high = Math.max(y1, y2);
        if (midY <= low + eps) midY = low + eps;
        if (midY >= high - eps) midY = high - eps;
        if (halfKerf * 2 >= (high - low)) halfKerf = 0;
    } else {
        var lowx = Math.min(x1, x2);
        var highx = Math.max(x1, x2);
        if (midX <= lowx + eps) midX = lowx + eps;
        if (midX >= highx - eps) midX = highx - eps;
        if (halfKerf * 2 >= (highx - lowx)) halfKerf = 0;
    }

	// Подготовим первую половину
	panel.Contour.Clear();
    if (cut.type == 'h') {
		// Нижняя половина
        panel.Contour.AddRectangle(x1, y1, x2, midY - halfKerf);
	} else {
		// Вертикально по умолчанию — левая половина
        panel.Contour.AddRectangle(x1, y1, midX - halfKerf, y2);
	}
	panel.Build();

	// Подготовим вторую половину
	panel2.Contour.Clear();
    if (cut.type == 'h') {
		// Верхняя половина
        panel2.Contour.AddRectangle(x1, midY + halfKerf, x2, y2);
	} else {
		// Правая половина
        panel2.Contour.AddRectangle(midX + halfKerf, y1, x2, y2);
	}
	panel2.Build();

    // Очистить кромку только на новой линии реза, чтобы исключить влияние настроек
    if (cut.type == 'v') {
        zeroButtOnVerticalX(panel, midX - halfKerf);
        zeroButtOnVerticalX(panel2, midX + halfKerf);
    } else {
        zeroButtOnHorizontalY(panel, midY - halfKerf);
        zeroButtOnHorizontalY(panel2, midY + halfKerf);
    }
}

function zeroButtOnVerticalX(pn, xConst) {
    for (var i = 0; i < pn.Contour.Count; ++i) {
        var obj = pn.Contour.Objects[i];
        if (obj instanceof T2DLine) {
            var isVert = (obj.Pos1.x == obj.Pos2.x) && (Math.abs(obj.Pos1.x - xConst) < 0.0001);
            if (isVert) {
                for (var b = 0; b < pn.Butts.Count; ++b) {
                    if (pn.Butts[b].ElemIndex == i) {
                        pn.Butts[b].ClipPanel = false;
                        pn.Butts[b].Allowance = 0;
                        pn.Butts[b].Thickness = 0;
                    }
                }
            }
        }
    }
    pn.Build();
}

function zeroButtOnHorizontalY(pn, yConst) {
    for (var i = 0; i < pn.Contour.Count; ++i) {
        var obj = pn.Contour.Objects[i];
        if (obj instanceof T2DLine) {
            var isHor = (obj.Pos1.y == obj.Pos2.y) && (Math.abs(obj.Pos1.y - yConst) < 0.0001);
            if (isHor) {
                for (var b = 0; b < pn.Butts.Count; ++b) {
                    if (pn.Butts[b].ElemIndex == i) {
                        pn.Butts[b].ClipPanel = false;
                        pn.Butts[b].Allowance = 0;
                        pn.Butts[b].Thickness = 0;
                    }
                }
            }
        }
    }
    pn.Build();
}

function getContourBounds(pn) {
    var minX =  2000000000;
    var maxX = -2000000000;
    var minY =  2000000000;
    var maxY = -2000000000;
    for (var i = 0; i < pn.Contour.Count; ++i) {
        var obj = pn.Contour.Objects[i];
        if (obj instanceof T2DLine) {
            minX = Math.min(minX, obj.Pos1.x, obj.Pos2.x);
            maxX = Math.max(maxX, obj.Pos1.x, obj.Pos2.x);
            minY = Math.min(minY, obj.Pos1.y, obj.Pos2.y);
            maxY = Math.max(maxY, obj.Pos1.y, obj.Pos2.y);
        }
    }
    return { minX: minX, maxX: maxX, minY: minY, maxY: maxY };
}


