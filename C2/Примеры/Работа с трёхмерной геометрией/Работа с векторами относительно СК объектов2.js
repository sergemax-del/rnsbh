// Пример математических операций над векторами относительно СК объектов 2
function LogVector(v, prefix) {
    console.log(`${prefix}: ${JSON.stringify(v)}`);
}

/**
 * Вывод направления осей XYZ объектов относительно ГСК и ЛСК друг друга
 * @param {TObject3D[]} objList Список объектов
 */
function LogObjectsAxes(objList) {
    for (let i = 0; i < objList.length; i++) {
        let obj = objList[i];
        LogVector(obj.NToObject(AxisX), `Ось Х ГСК относительно СК объекта ${obj.Name}`);
        LogVector(obj.NToObject(AxisY), `Ось Y ГСК относительно СК объекта ${obj.Name}`);
        LogVector(obj.NToObject(AxisZ), `Ось Z ГСК относительно СК объекта ${obj.Name}`);
        LogVector(obj.NToGlobal(AxisX), `Ось Х СК объекта ${obj.Name} относительно ГСК`);
        LogVector(obj.NToGlobal(AxisY), `Ось Y СК объекта ${obj.Name} относительно ГСК`);
        LogVector(obj.NToGlobal(AxisZ), `Ось Z СК объекта ${obj.Name} относительно ГСК`);
        for (let k = 0; k < objList.length; k++)
            if (k != i) {
                let obj2 = objList[k]
                LogVector(obj2.ObjectToObject(obj, AxisX), `Ось X объекта ${obj.Name} относительно СК объекта ${obj2.Name}`);
                LogVector(obj2.ObjectToObject(obj, AxisY), `Ось Y объекта ${obj.Name} относительно СК объекта ${obj2.Name}`);
                LogVector(obj2.ObjectToObject(obj, AxisZ), `Ось Z объекта ${obj.Name} относительно СК объекта ${obj2.Name}`);
            }
    }
}

let front = objects3d.NewPanel(100, 100, objects3d.PanelOrientation.front);
front.Name = "Фронтальная"
let vertical = objects3d.NewPanel(100, 100, objects3d.PanelOrientation.vertical);
vertical.Name = "Вертикальная"
let horizont = objects3d.NewPanel(100, 100, objects3d.PanelOrientation.horizont);
horizont.Name = "Горизонтальная"

LogObjectsAxes([front, vertical, horizont]);