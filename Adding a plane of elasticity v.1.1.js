/*
--------------------------------------------------------------------------------
 - file         Adding a plane of elasticity v.1.1.js
 - author       Novytskyi Serhii
 - telegram     https://t.me/no_s_v
 - email        s.v.novitsky@gmail.com
 - version      1.1
 - date         2022/06/15
 - brief        Скрипт добавления плоскости эластичности для Базис-Мебельщик 2022
--------------------------------------------------------------------------------

 ВНИМАНИМЕ! ДЛЯ КОРРЕКТНОЙ РАБОТЫ СКРИПТА НЕОБХОДИМО, ЧТОБЫ ОБЪЕКТ, КОТОРОМУ
 НЕОБХОДИМО ДОБАВИТЬ ПЛОСКОСТЬ ЭЛАСТИЧНОСТИ, УЖЕ ИМЕЛ ХОТЯ БЫ ОДНУ ПЛОСКОСТЬ!

*/

// -----------------------------------------------------------------------------

obj = Model.Selected; // Объект, которому необходимо добавленить плоскость эластичности
var ElasticPlanesArr = [[0, 100], [1, 100]]; // Массив с набором параметров плоскости эластичности (первый элемент массива - ось, перпендекулярная плоскости эластичности (0 = X, 1 = Y, 2 = Z), второй - положение плоскости эластичности на оси)

// Функция добавления плоскости эластичности
function AddElasticPlane_Func(obj, ElasticPlanesArr) {
    // Функция определения параметров эластичного блока
    function ElasticBlockParams(block) {
        if (block) { // Блок, которому принадлежат параметры эластичности
            this.block = block;
            var elastic = block.ParamSectionNode('Elastic');
            this.node = elastic; // Секция в параметрах блока, хранящая параметры эластичности
            var planesNode = elastic.FindOrCreate('Planes');
        };
    };

    // Функция присвоения значений параметрам плоскости эластичности
    function WritePlane(ElasticPlaneAxis, ElasticPlanePos, planeNode) {
        planeNode.WriteInteger('Axis', ElasticPlaneAxis); // Ось, перпендекулярная плоскости эластичности (0 = X, 1 = Y, 2 = Z)
        planeNode.WriteFloat('Pos', ElasticPlanePos); // Положение плоскости эластичности на оси
        planeNode.WriteFloat('Weight', 1); // Вес плоскости эластичности
    };

    var curElastic = new ElasticBlockParams(obj);
    Undo.Changing(curElastic.block); // Возможность отмены изменений в истории модели
    curElastic.node.Clear(); // Удаление плоскости эластичности
    var planesNode = curElastic.node.NodeNew('Planes');
    var ElasticPlanesArr; // Массив с набором параметров плоскости эластичности

    for (var i = 0; i < ElasticPlanesArr.length; i++) { // Перебор элементов массива с набором параметров плоскости эластичности
        ElasticPlaneAxis = ElasticPlanesArr[i][0]; // Ось, перпендекулярная плоскости эластичности
        ElasticPlanePos = ElasticPlanesArr[i][1]; // Положение плоскости эластичности на оси
        WritePlane(ElasticPlaneAxis, ElasticPlanePos, planesNode.NodeNew('Plane')); // Вызов ф-и присвоения значений параметрам плоскости эластичности
    };
};

AddElasticPlane_Func(obj, ElasticPlanesArr); // Вызов ф-и добавления плоскости эластичности