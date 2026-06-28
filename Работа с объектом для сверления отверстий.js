// Пример определения отверстий, которые сверлятся в выделенную панель.

/**Объект, использующийся для сверления отверстий в объектах */
const holeDrilling = fastenerOperations.NewHoleDrilling();

/**
 * Вывести сообщения об отверстиях, сверлящихся в тело
 * Каждое сообщение содержит наименование фурнитуры и 
 * параметры сверлящегося отверстия фурнитуры
 * @param {TBodyDrillInfo} info Информация о сверлении тела
 */
function OutputDrilledHoles(info) {
    for (let i = 0; i < info.Holes.Count; i++) {
        currentFileData.model.UnPickAll();
        const hole = info.Holes.Items[i];
        const fastener = hole.Fastener;
        fastener.Selected = true;
        UI.dialogs.MessageBox(`Фурнитура: "${materialData.FormatMaterialName(fastener.Name)}"\r\nОтверстие:${hole.Diameter.toFixed(3)}x${hole.Depth.toFixed(3)}`);
    }

}

/**
 * Вывести сообщения о фурнитуре, сверлящейся в тело
 * Каждое сообщение содержит наименование фурнитуры и 
 * набор параметров сверлящихся отверстий, принадлежащих фурнитуре
 * @param {TBodyDrillInfo} info Информация о сверлении тела
 */
function OutputDrilledHoles_GroupByFastener(info) {
    /** Коллекция "фурнитура - список отверстий" @type {Map<TFastener, TDrilledHole[]>} */
    const fastenerMap = new Map();
    for (let i = 0; i < info.Holes.Count; i++) {
        const hole = info.Holes.Items[i];
        const fastener = hole.Fastener;
        const holes = fastenerMap.get(fastener);
        if (holes)
            fastenerMap.set(fastener, holes.concat([hole]));
        else
            fastenerMap.set(fastener, [hole]);
    }
    // Вывод сообщений
    fastenerMap.forEach((holes, fastener) => {
        currentFileData.model.UnPickAll();
        fastener.Selected = true;
        const holeData = [];
        holes.forEach(hole => holeData.push(`  ${hole.Diameter.toFixed(3)}x${hole.Depth.toFixed(3)}`))
        UI.dialogs.MessageBox(`Фурнитура: "${materialData.FormatMaterialName(fastener.Name)}"\r\nОтверстия:\r\n${holeData.join('\r\n')}`);
    })
}

const selectedObject = currentFileData.model.Selected;
if (selectedObject) {
    currentFileData.model.UnPickAll();
    // Добавление панели, как тела, для которого будет рассчитываться сверление
    holeDrilling.AddBody(selectedObject);
    // Добавление всей фурнитуры из модели, т.к. заранее не известно, 
    // какая фурнитура сверлится в выделенную панель
    holeDrilling.AddFasteners(currentFileData.model);
    // Выполнение расчёта сверления отверстий
    holeDrilling.DrillHoles();
    const info = holeDrilling.Bodies.FindBodyInfo(selectedObject);

    // Вывод сообщения для каждого сверлящегося отверстия
    // OutputDrilledHoles(info);

    // Вывод сообщения для каждой сверлящейся фурнитуры 
    // (в одном сообщение могут быть параметры нескольких отверстий)
    OutputDrilledHoles_GroupByFastener(info);


    // Возвращение выделения панели
    currentFileData.model.UnPickAll();
    selectedObject.Selected = true;
}
else
    UI.dialogs.ErrorBox('Не выделен объект!')