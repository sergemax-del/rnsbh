// Если файл подключается как модуль - в возвращаемый объект добавляются 
// необходимые функции
if (exports) {
    exports.ElasticBlockParams = ElasticBlockParams;
    exports.SaveElasticParams = SaveElasticParams;
    exports.ElasticPlaneParams = ElasticPlaneParams
}
/**
 * Параметры плоскости эластичности
 * @param {*} planeNode Секция параметров плоскости эластичности
 */
function ElasticPlaneParams(planeNode) {
    var axisNode = planeNode.FindNode('Axis');
    var posNode = planeNode.FindNode('Pos');
    /**
     * Ось, перпендекулярная плоскости эластичности.
     * 0 = X;
     * 1 = Y;
     * 2 = Z;
     */
    this.axis = axisNode ? axisNode.Value : 0;
    /**
     * Положение плоскости на оси
     */
    this.pos = posNode ? posNode.Value : 0;
    /**
     * Вес плоскости
     */
    this.weight = planeNode.FindNode('Weight').Value;
}

/**
 * Параметры эластичного блока
 * @param {Block} block Эластичный блок
 */
function ElasticBlockParams(block) {
    if (block) {
        /**
         * Блок, которому принадлежат параметры эластичности
         */
        this.block = block;
        var elastic = block.ParamSectionNode('Elastic');
        /**
         * Секция в параметрах блока, хранящая параметры эластичности
         */
        this.node = elastic;
        /**
         * Ограничения эластичности
         */
        this.constraints = {
            /**
             * Минимальный размер
             */
            min: {
                x: elastic.FindOrCreate('AreaMin').FindOrCreate('x').Value || 0,
                y: elastic.FindOrCreate('AreaMin').FindOrCreate('y').Value || 0,
                z: elastic.FindOrCreate('AreaMin').FindOrCreate('z').Value || 0
            },
            /**
             * Максимальный размер
             */
            max: {
                x: elastic.FindOrCreate('AreaMax').FindOrCreate('x').Value || 0,
                y: elastic.FindOrCreate('AreaMax').FindOrCreate('y').Value || 0,
                z: elastic.FindOrCreate('AreaMax').FindOrCreate('z').Value || 0
            },
            /**
             * Шаг размера
             */
            step: {
                x: elastic.FindOrCreate('AreaStep').FindOrCreate('x').Value || 0,
                y: elastic.FindOrCreate('AreaStep').FindOrCreate('y').Value || 0,
                z: elastic.FindOrCreate('AreaStep').FindOrCreate('z').Value || 0
            }
        }
        /**
         * Список плоскостей эластичности
         * @type {ElasticPlaneParams[]}
         */
        this.planes = [];
        var planesNode = elastic.FindOrCreate('Planes');
        if (planesNode) {
            for (var i = 0; i < planesNode.Count; i++) {
                var planeNode = planesNode[i];
                var plane = new ElasticPlaneParams(planeNode);
                this.planes.push(plane);
            }
        }
    }
}

function ConstraintsIsEmpty(con) {    
    return !!con.x && !!con.y && !!con.z;
}

function WriteConstraints(con, node) {
    node.WriteFloat('x', con.x);
    node.WriteFloat('y', con.y);
    node.WriteFloat('z', con.z);
}

/**
 * 
 * @param {ElasticPlaneParams} plane 
 * @param {*} planeNode 
 */
function WritePlane(plane, planeNode) {
    planeNode.WriteInteger('Axis', plane.axis);
    planeNode.WriteFloat('Pos', plane.pos);
    planeNode.WriteFloat('Weight', plane.weight);
}

/**
 * Записать новые параметры эластичности
 * @param {ElasticBlockParams} params 
 */
function SaveElasticParams(params) {
    Undo.Changing(params.block);
    var paramNode = params.node;
    paramNode.Clear();
    if (!ConstraintsIsEmpty(params.constraints.max))
        WriteConstraints(params.constraints.max, paramNode.NodeNew('AreaMax'));
    if (!ConstraintsIsEmpty(params.constraints.min))
        WriteConstraints(params.constraints.min, paramNode.NodeNew('AreaMin'));
    if (!ConstraintsIsEmpty(params.constraints.step))
        WriteConstraints(params.constraints.step, paramNode.NodeNew('AreaStep'));
    var planesNode = paramNode.NodeNew('Planes');
    for (var i = 0; i < params.planes.length; i++) {
        WritePlane(params.planes[i], planesNode.NodeNew('Plane'));
    }
}