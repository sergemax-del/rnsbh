// Пример математических операций над векторами относительно СК объектов 1
function LogVector(v, prefix) {
    console.log(`${prefix}: ${JSON.stringify(v)}`);
}

/**
 * Вывод минимальной и максимальной точек объектов относительно ГСК и ЛСК друг друга
 * @param {TObject3D[]} objList Список объектов
 */
function LogObjectsMinMax(objList) {
    let zero = geometry3d.VectorMake(0, 0, 0);
    for (let i = 0; i < objList.length; i++) {
        let obj = objList[i];
        let min = obj.GMin;
        LogVector(obj.ToObject(zero), `Начало ГСК относительно СК объекта ${obj.Name}`);
        LogVector(min, `Минимальная координата объекта ${obj.Name} относительно её СК`);
        LogVector(panel1.ToGlobal(min), `Минимальная координата объекта ${obj.Name} относительно  ГСК`)
        for (let k = 0; k < objList.length; k++)
            if (k != i) {
                let obj2 = objList[k]
                LogVector(obj2.ObjectToObject(obj, min), `Минимальная координата объекта ${obj.Name} относительно СК объекта ${obj2.Name}`);
            }

        let max = obj.GMax;
        LogVector(max, `Максимальная координата объекта ${obj.Name} относительно её СК`);
        LogVector(panel1.ToGlobal(max), `Максимальная координата объекта ${obj.Name} относительно  ГСК`)
        for (let k = 0; k < objList.length; k++)
            if (k != i) {
                let obj2 = objList[k]
                LogVector(obj2.ObjectToObject(obj, max), `Максимальная координата объекта ${obj.Name} относительно СК объекта ${obj2.Name}`);
            }
    }
}

let block1 = objects3d.NewBlock('Блок 1');
block1.PositionX = 200;
let panel1 = objects3d.NewPanel(100, 100, objects3d.PanelOrientation.front, block1);
panel1.Name = 'Панель 1';
panel1.PositionX = 500;
panel1.Build();


let block2 = objects3d.NewBlock('Блок 2');
block2.PositionY = 300;
let panel2 = objects3d.NewPanel(50, 50, objects3d.PanelOrientation.front, block2);
panel2.Name = 'Панель 2';
panel2.PositionY = 600;
panel2.Build();

LogObjectsMinMax([panel1, panel2, block1, block2]);