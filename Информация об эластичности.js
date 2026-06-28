// Импорт функций для работы с параметрами эластичности блока. БМ >= 10
const ElasticBlockParams = require('./elasticWorker').ElasticBlockParams;
const SaveElasticParams = require('./elasticWorker').SaveElasticParams;
const ElasticPlaneParams = require('./elasticWorker').ElasticPlaneParams;
// Импорт функций для работы с параметрами эластичности блока. Любой БМ
// system.include('./elasticWorker')
var props = Action.Properties;
var objName = props.NewString('Имя');
var width = props.NewGroup('Ширина');
var height = props.NewGroup('Высота');
var depth = props.NewGroup('Глубина');
var planes = props.NewGroup('Плоскости');
var vert = planes.NewGroup('Вертикальная');
vert.Tag = 0
var hor = planes.NewGroup('Горизонтальная');
hor.Tag = 1
var front = planes.NewGroup('Фронтальная');
front.Tag = 2
var axisGroups = [
    vert,
    hor,
    front
];

/**
 * @type {ElasticBlockParams}
 */
var curElastic;

/**
 * Добавление информации о плоскости эластичности на панель свойств
 * @param {ElasticPlaneParams} planeParam параметры плоскости эластичности
 */
function AddPlane(planeParam) {
    var planeGroup = axisGroups[planeParam.axis].NewGroup('');
    planeGroup.NewNumber('Положение', planeParam.pos).OnValueChange =
        function (num) {
            planeParam.pos = num.Value;
        };
    planeGroup.NewNumber('Вес', planeParam.weight).OnValueChange =
        function (num) {
            planeParam.weight = num.Value;
        };
}

/**
 * Добавление информации об ограничениях на панель свойств
 * @param {*} con Параметры ограничений
 * @param {*} name Название ограничения (мин, макс, шаг)
 */
function AddConstraints(con, name) {
    var numw = width.NewNumber(name);
    numw.Value = con.x;
    numw.OnValueChange = function () {
        con.x = numw.Value;
    }
    var numh = height.NewNumber(name);
    numh.Value = con.y;
    numh.OnValueChange = function () {
        con.y = numh.Value;
    }
    var numd = depth.NewNumber(name);
    numd.Value = con.z;
    numd.OnValueChange = function () {
        con.z = numd.Value;
    }
}

/**
 * Основная функция - Заполнение параметров эластичности блока.
 * @param {*} obj 
 */
function FillObjectInfo(obj) {
    objName.Value = '';
    width.Clear();
    height.Clear();
    depth.Clear();
    vert.Clear();
    hor.Clear();
    front.Clear();
    if (obj && obj.List) {
        objName.Value = obj.Name;
        curElastic = new ElasticBlockParams(obj);
        AddConstraints(curElastic.constraints.min, 'Min');
        AddConstraints(curElastic.constraints.max, 'Max');
        AddConstraints(curElastic.constraints.step, 'Step');
        for (var i = 0; i < curElastic.planes.length; i++) {
            AddPlane(curElastic.planes[i]);
        }
    }
}

props.NewButton('Исследовать').OnClick = function () {
    FillObjectInfo(Model.Selected);
}

props.NewSeparator();
props.NewButton('Записать новые пареметры').OnClick = function () {
    SaveElasticParams(curElastic);
    Action.Commit();
}

Action.Continue();
Action.Hint = 'Выберите объект в структуре модели и нажмите кнопку "Исследовать"';