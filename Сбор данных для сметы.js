function CheckHole(hole, fast, panel) {
    let holeCenter = fast.ToGlobal({
        x: hole.Position.x + hole.Direction.x * (hole.Depth / 2),
        y: hole.Position.y + hole.Direction.y * (hole.Depth / 2),
        z: hole.Position.z + hole.Direction.z * (hole.Depth / 2),
    })
    holeCenter = panel.ToObject(holeCenter)
    return (holeCenter.x > panel.GMin.x) && (holeCenter.x < panel.GMax.x) &&
        (holeCenter.y > panel.GMin.y) && (holeCenter.y < panel.GMax.y) &&
        (holeCenter.z > panel.GMin.z) && (holeCenter.z < panel.GMax.z)
}

function isHoleInPlane(hole, fast, panel) {
    let panelN = panel.NToGlobal(AxisZ)
    let holeN = fast.NToGlobal(hole.Direction)
    let sp = vectorGeometry.VectorDot(panelN, holeN)
    return Math.abs(sp) < ACCURACY ? false : true
}

function TDraftSearch(obj) {
    if (obj instanceof TModel3D || obj instanceof TLayer3D) {
        return false
    } else if (obj instanceof TDraftBlock) {
        return true
    } else {
        return TDraftSearch(obj.Owner)
    }
}

function GetAngle(Lin1, Lin2) {
    vect1 = new Object
    vect2 = new Object
    Dx1 = Lin1.Pos2.x - Lin1.Pos1.x
    Dy1 = Lin1.Pos2.y - Lin1.Pos1.y
    Dx2 = Lin2.Pos2.x - Lin2.Pos1.x
    Dy2 = Lin2.Pos2.y - Lin2.Pos1.y
    vect1 = NormVect(Dx1, Dy1)
    vect2 = NormVect(Dx2, Dy2)
    Angle = vect1.x * vect2.y - vect1.y * vect2.x
    if (Math.abs(Angle) < ACCURACY) {
        if ((Math.abs(vect1.x + vect2.x) < ACCURACY) &&
            (Math.abs(vect1.y + vect2.y) < ACCURACY)) {
            Angle = -Math.PI
        } else {Angle = 0}
    } else {Angle = Math.asin(Angle)}
    return Angle
}

function NormVect(x, y) {
    vect = new Object
    vect.x = x / Math.sqrt(x * x + y * y)
    vect.y = y / Math.sqrt(x * x + y * y)
    return vect
}

function Connect(elemFirst, elemSecond) {
    if (Math.sqrt(Math.pow((elemSecond.Pos1.x - elemFirst.Pos2.x), 2) +
        Math.pow((elemSecond.Pos1.y - elemFirst.Pos2.y), 2)) < ACCURACY) {
        Log = true} else {Log = false}
    return Log
}

function ArcConcave(arc, contour) { // проверка дуги на вогнутость в контур, 
    // не корректно работает когда есть еще дуга, вложенная по эквидистанте, P(x, y) может попасть в контур.. 
    // на производстве маловероятно увидеть такую деталь.. но подумать над улучшением функции можно.. 
    let P = new Object
    P.x = 0.5 * (arc.Pos1.x + arc.Pos2.x)
    P.y = 0.5 * (arc.Pos1.y + arc.Pos2.y)
    if (!contour.IsPointInside(P.x, P.y)) {
        return true        
    }
}

function TangentLine(point, pointCenter, arcDir) {
    Line = new Object
    Pos1 = new Object
    Pos2 = new Object
    Dx = pointCenter.x - point.x
    Dy = pointCenter.y - point.y
    Line.Pos1 = Pos1
    Line.Pos2 = Pos2
    Line.Pos1 = point
    if (arcDir) {
        Line.Pos2.x = point.x + Dy
        Line.Pos2.y = point.y - Dx
    } else {
        Line.Pos2.x = point.x - Dy
        Line.Pos2.y = point.y + Dx
    }
    return Line
}

function ArcRadius(arc) {
    let R = Math.sqrt((arc.Pos1.x - arc.Center.x) * (arc.Pos1.x - arc.Center.x) + 
    (arc.Pos1.y - arc.Center.y) * (arc.Pos1.y - arc.Center.y))
    return R
}

function LineX(contour) {
    Line = new Object
    Pos1 = new Object
    Pos2 = new Object
    Line.Pos1 = Pos1
    Line.Pos2 = Pos2
    Line.Pos1.x = contour.Min.x
    Line.Pos1.y = contour.Min.y
    Line.Pos2.x = contour.Max.x
    Line.Pos2.y = contour.Min.y
    return Line
}

function PointsOnGabContour(point1, point2, contour) {
    if ((point1.x.toFixed(3) == contour.Min.x.toFixed(3) ||
        point1.x.toFixed(3) == contour.Max.x.toFixed(3) ||
        point1.y.toFixed(3) == contour.Min.y.toFixed(3) ||
        point1.y.toFixed(3) == contour.Max.y.toFixed(3)) &&
        (point2.x.toFixed(3) == contour.Min.x.toFixed(3) ||
        point2.x.toFixed(3) == contour.Max.x.toFixed(3) ||
        point2.y.toFixed(3) == contour.Min.y.toFixed(3) ||
        point2.y.toFixed(3) == contour.Max.y.toFixed(3))) {
        return true
    }
}


Undo.RecursiveChanging(Model)
UnSelectAll()

const ACCURACY        = 0.001 // точность вычислений
const DRILLXMIN       = 40 // минимальный размер детали для сверлильного станка по оси X
const DRILLXMAX       = 1200 // максимальный размер детали для сверлильного станка по оси X
const DRILLYMIN       = 200 // минимальный размер детали для сверлильного станка по оси Y
const DRILLYMAX       = 2800 // максимальный размер детали для сверлильного станка по оси Y
const DRILLPLANE      = [3, 4, 5, 6, 7, 8, 10, 15, 18, 20, 25, 30, 35] // сверла в пласть на станке
const DRILLBUTT       = [5, 8] // сверла в торец на станке
const BEVELBUTTANGLE  = 30 // допустимый угол скоса для накатки на станке
const BEVELBUTTLENGHT = 160 // минимальная длина скоса для накатки на станке
const RADIUSBOUND     = 20 // минимальный радиус для криволинейной накатки кромки на станке
const PROCSMALL       = 200 // размер для определения малогаборитных деталей

// Пользовательские свойства записываемые в создаваемую панель из материала 'Пользовательские свойства\rПС':
let holeOrderMat  = 0 // Операция: Сверление отверстий в заказных материалах
// считываются с отверстий внутри полуфабрикатов
let packOrderMat  = 0 // Операция: Упаковка фасадов заказных
// считается если панель установлена внутри полуфабриката
let asmAlDoor     = 0 // Операция: Сборка дверей из алюминиевого профиля
let asmAlCase     = 0 // Операция: Сборка витрин из алюминиевого профиля
let millEvro      = 0 // Операция: Фрезерование еврозапила
let millAlProfile = 0 // Операция: Фрезерование алюминиевого профиля под петлю
let saveTexture   = 0 // Операция: Детали с сохранением перехода текстуры

Model.forEachPanel(function(panel) {
    if (panel.MaterialName == 'Пользовательские свойства\rПС') {
        DeleteObject(panel)
    }
})

Model.forEachPanel(function(panel) {

    // Пользовательские свойства записываемые в каждую панель:
    let DrillManual = 0 // Операция: Сверление отверстий ручное
    let PanelDrillManual = 0 // Операция: Количество деталей с ручным сверлением
    let holeMill = 0 // Операция: Фрезерование отверстий D8 - D35
    let holeDepth38 = 0 // Операция: Сверление торцевых отверстий глубиной больше 38 мм
    let holeNotCond = 0 // Операция: Отверстие не соответствующее техническим условиям
    // все отверстия в пласть диаметром меньше 8 мм за исключением значений из списка DRILLPLANE
    // и все торцевые отверстия не входящие в список DRILLBUTT
    let cutAngle = 0 // Операция: Подрезание внутренних углов в древесной плите
    let countBevel = 0 // Операция: Количество деталей со скосами
    let countGluWB = 0 // Операция: Количество склеенных деталей
    let countGluHPL = 0 // Операция: Количество деталей с накаткой БСП
    let countGluGlass = 0 // Операция: Количество деталей с приклеиванием стекла
    let countButtHand = 0 // Операция: Детали с криволинейной, ручной накаткой кромки
    // Кромка нанесенная на дуги, окружность и прямые линии контуров помимо габаритных резов за исключением скосов
    // так же кромка накатанная на деталь меньше допустимой для станка длины и ширины заготовки (Не реализован)
    let rMoreBound = 0 // Операция: Накатка кромки на вырез R больше 20 мм
    let rLessBound = 0 // Операция: Накатка кромки на вырез R меньше 20 мм
    let procSmall = 0 // Операция: Обработка малогабаритных деталей
    let countUS = 0 // Операция: Количество деталей со спиливанием торца под углом (УС)
    let countTPaz = 0 // Операция: Количество деталей с торцевым пазом (Т.Паз)

    let holePlane = 0
    let holeButt = 0
    let holeDrillManual = false
    let cornersNot90 = false
    let gluWB = false
    let gluHPL = false
    let GluGlass = false
    let curveButt = false
    let US = false
    let TPaz = false
    
    let panelLenght = panel.ContourHeight.toFixed(3)
    let panelWidth = panel.ContourWidth.toFixed(3)
    if (panelLenght < PROCSMALL && panelWidth < PROCSMALL) {
        procSmall ++ // Операция: Обработка малогабаритных деталей
    }

    let fasts = panel.FindConnectedFasteners()

    for (let f = 0; f < fasts.length; f ++) {
        let fast = fasts[f]
        let holes = fast.Holes
        if (holes && holes.Count > 0) {
            let DrillX = Math.min(panelLenght, panelWidth)
            let DrillY = Math.max(panelLenght, panelWidth)
            if (DrillX < DRILLXMIN || DrillX > DRILLXMAX || 
                DrillY < DRILLYMIN || DrillY > DRILLYMAX) {
                holeDrillManual = true
                DrillManual = DrillManual + holes.Count // Операция: Сверление отверстий ручное
            }
            for (let h = 0; h < holes.Count; h ++) {
                let hole = holes[h]
                let holeDiametr = parseFloat(hole.Diameter.toFixed(1))
                if (CheckHole(hole, fast, panel)) {
                    if (isHoleInPlane(hole, fast, panel)) { // Отверстия в пласть
                        holePlane ++
                        if (DRILLPLANE.indexOf(holeDiametr) < 0) {
                            if (holeDiametr > 8 && holeDiametr < 35) {
                                holeMill ++ // Операция: Фрезерование отверстий D8 - D35
                            }
                            if (holeDiametr < 8) {
                                holeNotCond ++ // Операция: Отверстие не соответствующее техническим условиям
                            }
                        }
                    } else { // Отверстия в торец
                        holeButt ++
                        if (hole.Depth.toFixed(1) > 38) {
                            holeDepth38 ++ // Операция: Сверление торцевых отверстий глубиной больше 38 мм
                        }
                        if (DRILLBUTT.indexOf(holeDiametr) < 0) {
                            holeNotCond ++ // Операция: Отверстие не соответствующее техническим условиям
                        }
                    }
                }
                if (TDraftSearch(fast)) {
                    holeOrderMat += holes.Count // Операция: Сверление отверстий в заказных материалах
                }
            }
        }
    }

    let outerContour = panel.Contours[0]
    for (let c = 0; c < panel.Contours.Count; c ++) { // контур
        let contour = panel.Contours[c]
        let leneX = LineX(contour)
        for (let oc = 0; oc < panel.Contours.Count; oc ++) {
            if (contour != panel.Contours[oc]) {
                if (!panel.Contours[oc].IsInContour(outerContour)) {
                    outerContour = panel.Contours[oc]
                }
            }
        }
        if (contour == outerContour) { // внешний контур            
            let acuteAngle = 0
            let lengthBevel = 0
            for (let i = 0; i < contour.Count; i ++) { // элемент контура
                if (contour.IsClockOtherWise()) {contour.InvertDirection()}
                let elemFirst = contour[i]
                if (elemFirst.ElType == 1) { // проверка на скос
                    let angleX = GetAngle(elemFirst.AsLine(), leneX)
                    let angleSignX = parseFloat((Math.abs(angleX / Math.PI * 180.0)).toFixed(3)) 
                    if (angleSignX == 0 || angleSignX == 90 || angleSignX == 180 || angleSignX == 360) {
                    } else {
                        if (PointsOnGabContour(elemFirst.Pos1, elemFirst.Pos2, contour)) {
                            cornersNot90 = true
                        }
                    }
                }
                // работа с контуром                
                for (let o = 0; o < contour.Count; o ++) {
                    let elemSecond = contour[o]
                    if (elemFirst != elemSecond) {
                        if (Connect(elemFirst, elemSecond)) {
                            if (elemFirst.ElType == 3) { // Circle
                            } else if (elemFirst.ElType == 2) {
                                let arc = elemFirst.AsArc()
                                let lTan = TangentLine(arc.Pos2, arc.Center, arc.ArcDir)
                                if (elemSecond.ElType == 2) {
                                    // Arc-Arc
                                    let arc2 = elemSecond.AsArc()
                                    let lTan2 = TangentLine(arc2.Pos1, arc2.Center, arc2.ArcDir)
                                    let angle = GetAngle(lTan, lTan2)
                                    let angleSign = parseFloat((Math.abs(angle / Math.PI * 180.0)).toFixed(3))
                                    if ((Math.abs(angle) > ACCURACY) && (angle < 0)) {
                                        cutAngle ++ // Операция: Подрезание внутренних углов в древесной плите
                                    }
                                    if (ArcConcave(arc, contour) && ArcConcave(arc2, contour) && angleSign == 180) {
                                        cutAngle --
                                    }                                   
                                } else if (elemSecond.ElType == 1) {
                                    // Arc-Lin                                                                        
                                    let angle = GetAngle(lTan, elemSecond.AsLine())                                                                   
                                    if ((Math.abs(angle) > ACCURACY) && (angle < 0)) {
                                        cutAngle ++ // Операция: Подрезание внутренних углов в древесной плите
                                    }                                
                                }                                
                            } else if (elemFirst.ElType == 1) {                       
                                if (elemSecond.ElType == 2) {
                                    // Lin-Arc
                                    let arc = elemSecond.AsArc()
                                    let lTan = TangentLine(arc.Pos1, arc.Center, arc.ArcDir)                                                                        
                                    let angle = GetAngle(elemFirst.AsLine(), lTan)                                                                                                   
                                    if ((Math.abs(angle) > ACCURACY) && (angle < 0)) {
                                        cutAngle ++ // Операция: Подрезание внутренних углов в древесной плите
                                    }
                                } else if (elemSecond.ElType == 1) {
                                    // Lin-Lin
                                    let angle = GetAngle(elemFirst.AsLine(), elemSecond.AsLine())
                                    let angleSign = parseFloat((Math.abs(angle / Math.PI * 180.0)).toFixed(3))                                                                                                          
                                    if ((Math.abs(angle) > ACCURACY) && (angle < 0)) {
                                        cutAngle ++ // Операция: Подрезание внутренних углов в древесной плите
                                    }                                                                                                                                                                                     
                                }
                            }
                        }
                    }                   
                }
                // работа с кромкой
                for (let b = 0; b < panel.Butts.Count; b ++) { // кромка
                    if (panel.Butts[b].CutIndex >= 0) {curveButt = true}
                    if (panel.Butts[b].ElemIndex == contour[i].Data.ElemIndex) { // кромка на элементе контура                        
                        if (elemFirst.ElType == 3) { // Circle
                            curveButt = true
                        } else if (elemFirst.ElType == 2) {
                            curveButt = true
                            let arc = elemFirst.AsArc()
                            if (ArcConcave(arc, contour)) {
                                let R = ArcRadius(arc)
                                R = R + panel.Butts[b].Thickness - panel.Butts[b].Allowance                          
                                if (R >= RADIUSBOUND) {rMoreBound ++} else {rLessBound ++}
                                // Операция: Накатка кромки на вырез R больше 20 мм
                                // Операция: Накатка кромки на вырез R меньше 20 мм
                            }                                    
                        } else if (elemFirst.ElType == 1) {
                            for (es = 0; es < contour.Count; es ++) {
                                let elemSecond = contour[es]
                                if (Connect(elemFirst, elemSecond)) {
                                    if (elemSecond.ElType == 2) {
                                    } else if (elemSecond.ElType == 1) {
                                        let angle = GetAngle(elemFirst.AsLine(), elemSecond.AsLine())
                                        let angleSign = parseFloat((Math.abs(angle / Math.PI * 180.0)).toFixed(3))
                                        if ((Math.abs(angle) > ACCURACY) && (angle < 0)) {
                                            curveButt = true
                                        }
                                        if (angleSign == 0 || angleSign == 90 || angleSign == 180 || angleSign == 360) {
                                        } else {
                                            if (angleSign < BEVELBUTTANGLE) {acuteAngle ++}
                                            lengthBevel = elemFirst.ObjLength()
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (acuteAngle == 2) {curveButt = true}
            if (lengthBevel != 0 && lengthBevel < BEVELBUTTLENGHT) {curveButt = true}
        } else { // внутренний контур
            for (let i = 0; i < contour.Count; i ++) {
                if (contour.IsClockOtherWise()) {contour.InvertDirection()}
                elemFirst = contour[i]
                // работа с контуром                
                for (let o = 0; o < contour.Count; o ++) {
                    let elemSecond = contour[o]
                    if (elemFirst != elemSecond) {
                        if (Connect(elemFirst, elemSecond)) {
                            if (elemFirst.ElType == 3) { // circle
                            } else if (elemFirst.ElType == 2) {                            
                                let arc = elemFirst.AsArc()
                                let lTan = TangentLine(arc.Pos2, arc.Center, arc.ArcDir)
                                if (elemSecond.ElType == 2) {
                                    // Arc-Arc
                                    let arc2 = elemSecond.AsArc()
                                    let lTan2 = TangentLine(arc2.Pos1, arc2.Center, arc2.ArcDir)
                                    let angle = GetAngle(lTan2, lTan)
                                    let angleSign = parseFloat((Math.abs(angle / Math.PI * 180.0)).toFixed(3))
                                    if ((Math.abs(angle) > ACCURACY) && (angle < 0)) {
                                        cutAngle ++ // Операция: Подрезание внутренних углов в древесной плите
                                    }
                                    if (!ArcConcave(arc, contour) && !ArcConcave(arc2, contour) && angleSign == 180) {
                                        cutAngle --
                                    }                                   
                                } else if (elemSecond.ElType == 1) {
                                    // Arc-Lin                                                                        
                                    let angle = GetAngle(elemSecond.AsLine(), lTan)                                                                   
                                    if ((Math.abs(angle) > ACCURACY) && (angle < 0)) {
                                        cutAngle ++ // Операция: Подрезание внутренних углов в древесной плите
                                    }                                
                                }
                            } else if (elemFirst.ElType == 1) {                                                                
                                if (elemSecond.ElType == 2) {
                                    // Lin-Arc
                                    let arc = elemSecond.AsArc()
                                    let lTan = TangentLine(arc.Pos1, arc.Center, arc.ArcDir)                                                                        
                                    let angle = GetAngle(lTan, elemFirst.AsLine())                                                                                                   
                                    if ((Math.abs(angle) > ACCURACY) && (angle < 0)) {
                                        cutAngle ++ // Операция: Подрезание внутренних углов в древесной плите
                                    }
                                } else if (elemSecond.ElType == 1) {
                                    // Lin-Lin
                                    let angle = GetAngle(elemSecond.AsLine(), elemFirst.AsLine())
                                    let angleSign = parseFloat((Math.abs(angle / Math.PI * 180.0)).toFixed(3))
                                    if ((Math.abs(angle) > ACCURACY) && (angle < 0)) {
                                        cutAngle ++ // Операция: Подрезание внутренних углов в древесной плите
                                    }                                                                        
                                }
                            }
                        }
                    }
                }                
                // работа с кромкой
                for (let b = 0; b < panel.Butts.Count; b ++) {
                    if (panel.Butts[b].ElemIndex == contour[i].Data.ElemIndex) {
                        curveButt = true 
                        if (elemFirst.ElType == 3) {
                            let circle = elemFirst.AsCircle()
                            let R = circle.CirRadius
                            R = R + panel.Butts[b].Thickness - panel.Butts[b].Allowance                          
                            if (R >= RADIUSBOUND) {rMoreBound ++} else {rLessBound ++}
                            // Операция: Накатка кромки на внутренний радиус больше 20 мм
                            // Операция: Накатка кромки на внутренний радиус меньше 20 мм 
                        } else if (elemFirst.ElType == 2) {
                            let arc = elemFirst.AsArc()
                            let R = ArcRadius(arc)
                            R = R + panel.Butts[b].Thickness - panel.Butts[b].Allowance                          
                            if (R >= RADIUSBOUND) {rMoreBound ++} else {rLessBound ++}
                            // Операция: Накатка кромки на внутренний радиус больше 20 мм
                            // Операция: Накатка кромки на внутренний радиус меньше 20 мм 
                        } else if (elemFirst.ElType == 1) {                        
                        }                       
                    }                    
                }
            }
        }
    }

    if (panel.Plastics.Count > 0) { // работа с облицовкой по пласти
        for (let i = 0; i < panel.Plastics.Count; i ++) {
            let name = ExtractMatName(panel.Plastics[i].Material)
            if (name.includes("БСП")) {
                gluHPL = true
            }
            if (name.includes("Древесная плита") ||
                name.includes("ДСП") ||
                name.includes("МДФ") ||
                name.includes("ХДФ") ||
                name.includes("ДВП")) {
                gluWB = true
            }
            if (name.includes("Клей для приклеивания стекла")) {
                GluGlass = true
            }
            if (name.includes("Защитная пленка на стекло")) {
                pass
            }
        }
    }

    if (panel.Cuts.Count > 0) { // работа с пазами
		for (let i = 0; i < panel.Cuts.Count; i ++) {
            // console.log(panel.Cuts[i].CutType)
			if (panel.Cuts[i].CutType == 0) {
				let pazContour = panel.Cuts[i].Contour
				let PanelThickness = panel.GMax.z
				if (pazContour.Count == 3 && // УС
                    panel.Cuts[i].Contour.Objects[0].IsLine() &&
                    panel.Cuts[i].Contour.Objects[1].IsLine() &&
                    panel.Cuts[i].Contour.Objects[2].IsLine()) {
                    US = true
				}		
				if (pazContour.Count == 4 && // Т.Паз
                    Math.abs(pazContour.Max.y) < PanelThickness &&
                    Math.abs(pazContour.Min.y) > 0) {
                    TPaz = true
				} 
			}
		}
	}

    if (TDraftSearch(panel)) {packOrderMat ++} // Операция: Упаковка фасадов заказных
    if (holeDrillManual) {PanelDrillManual ++} // Операция: Количество деталей с ручным сверлением
    if (cornersNot90) {countBevel ++} // Операция: Количество деталей со скосами
    if (gluWB) {countGluWB ++} // Операция: Количество склеенных деталей
    if (gluHPL) {countGluHPL ++} // Операция: Количество деталей с накаткой БСП
    if (GluGlass) {countGluGlass ++} // Операция: Количество деталей с приклеиванием стекла
    if (curveButt) {countButtHand ++} // Операция: Детали с криволинейной, ручной накаткой кромки
    if (US) {countUS ++} // Операция: Количество деталей со спиливанием торца под углом (УС)
    if (TPaz) {countTPaz ++} // Операция: Количество деталей с торцевым пазом (Т.Паз)

    if (holeMill > 0) {panel.UserProperty['Фрезерование отверстий D8 - D35'] = holeMill} else {
        panel.UserProperty['Фрезерование отверстий D8 - D35'] = null
    }
    if (holeDepth38 > 0) {panel.UserProperty['Сверление торцевых отверстий глубиной больше 38 мм'] = holeDepth38} else {
        panel.UserProperty['Сверление торцевых отверстий глубиной больше 38 мм'] = null
    }
    if (holeNotCond > 0) {panel.UserProperty['Отверстие не соответствующее техническим условиям'] = holeNotCond} else {
        panel.UserProperty['Отверстие не соответствующее техническим условиям'] = null
    }
    if (cutAngle > 0) {panel.UserProperty['Подрезание внутренних углов в древесной плите'] = cutAngle} else {
        panel.UserProperty['Подрезание внутренних углов в древесной плите'] = null
    }
    if (countBevel > 0) {panel.UserProperty['Количество деталей со скосами'] = countBevel} else {
        panel.UserProperty['Количество деталей со скосами'] = null
    }
    if (countGluWB > 0) {panel.UserProperty['Количество склеенных деталей'] = countGluWB} else {
        panel.UserProperty['Количество склеенных деталей'] = null
    }
    if (countGluHPL > 0) {panel.UserProperty['Количество деталей с накаткой БСП'] = countGluHPL} else {
        panel.UserProperty['Количество деталей с накаткой БСП'] = null
    }
    if (countGluGlass > 0) {panel.UserProperty['Количество деталей с приклеиванием стекла'] = countGluGlass} else {
        panel.UserProperty['Количество деталей с приклеиванием стекла'] = null
    }
    if (countButtHand > 0) {panel.UserProperty['Детали с криволинейной, ручной накаткой кромки'] = countButtHand} else {
        panel.UserProperty['Детали с криволинейной, ручной накаткой кромки'] = null
    }
    if (rMoreBound > 0) {panel.UserProperty['Накатка кромки на вырез R больше 20 мм'] = rMoreBound} else {
        panel.UserProperty['Накатка кромки на вырез R больше 20 мм'] = null
    }
    if (rLessBound > 0) {panel.UserProperty['Накатка кромки на вырез R меньше 20 мм'] = rLessBound} else {
        panel.UserProperty['Накатка кромки на вырез R меньше 20 мм'] = null
    }
    if (procSmall > 0) {panel.UserProperty['Обработка малогабаритных деталей'] = procSmall} else {
        panel.UserProperty['Обработка малогабаритных деталей'] = null
    }
    if (DrillManual > 0) {panel.UserProperty['Сверление отверстий ручное'] = DrillManual} else {
        panel.UserProperty['Сверление отверстий ручное'] = null
    }
    if (PanelDrillManual > 0) {panel.UserProperty['Количество деталей с ручным сверлением'] = PanelDrillManual} else {
        panel.UserProperty['Количество деталей с ручным сверлением'] = null
    }
    if (countUS > 0) {panel.UserProperty['Количество деталей со спиливанием торца под углом (УС)'] = countUS} else {
        panel.UserProperty['Количество деталей со спиливанием торца под углом (УС)'] = null
    }
    if (countTPaz > 0) {panel.UserProperty['Количество деталей с торцевым пазом (Т.Паз)'] = countTPaz} else {
        panel.UserProperty['Количество деталей с торцевым пазом (Т.Паз)'] = null
    }

    if (panel.UserPropCount > 0) {
        panel.Selected = true
    }

})

Model.forEach(function(obj) {
    if (obj instanceof TFurnBlock) {
        for (i = 0; i < obj.UserPropCount; i ++) {
            if (obj.UserPropertyName[i] == 'Сборка дверей из алюминиевого профиля') {
                asmAlDoor ++ // Операция: Сборка дверей из алюминиевого профиля
            }
            if (obj.UserPropertyName[i] == 'Сборка витрин из алюминиевого профиля') {
                asmAlCase ++ // Операция: Сборка витрин из алюминиевого профиля
            }
            if (obj.UserPropertyName[i] == 'Фрезерование еврозапила') {
                millEvro ++ // Операция: Фрезерование еврозапила
            }
            if (obj.UserPropertyName[i] == 'Детали с сохранением перехода текстуры') {
                saveTexture = obj.UserProperty[i] // Операция: Детали с сохранением перехода текстуры
            }
        }
    }
    if (obj instanceof TFastener ||
        obj instanceof TFurnAsm ||
        obj instanceof TAsmKit ||
        obj instanceof TFurnBlock) {
        for (i = 0; i < obj.UserPropCount; i ++) {
            if (obj.UserPropertyName[i] == 'Фрезерование алюминиевого профиля под петлю') {
                millAlProfile ++ // Операция: Фрезерование алюминиевого профиля под петлю
            }
        }
    }
    if (obj.UserPropCount > 0) {
        obj.Selected = true
    }
})

let panel = AddFrontPanel (0, 0, 10, 10, 0)
panel.Name = 'Пользовательские свойства'
panel.MaterialName = 'Пользовательские свойства\rПС'
panel.Thickness = 10
panel.UseInDocs = false
panel.UseInCNC = false
panel.UseInCutting = false
panel.UseInEstimate = true

if (holeOrderMat > 0) {panel.UserProperty['Сверление отверстий в заказных материалах'] = holeOrderMat} else {
    panel.UserProperty['Сверление отверстий в заказных материалах'] = null
}
if (packOrderMat > 0) {panel.UserProperty['Упаковка фасадов заказных'] = packOrderMat} else {
    panel.UserProperty['Упаковка фасадов заказных'] = null
}
if (asmAlDoor > 0) {panel.UserProperty['Сборка дверей из алюминиевого профиля'] = asmAlDoor} else {
    panel.UserProperty['Сборка дверей из алюминиевого профиля'] = null
}
if (asmAlCase > 0) {panel.UserProperty['Сборка витрин из алюминиевого профиля'] = asmAlCase} else {
    panel.UserProperty['Сборка витрин из алюминиевого профиля'] = null
}
if (millEvro > 0) {panel.UserProperty['Фрезерование еврозапила'] = millEvro} else {
    panel.UserProperty['Фрезерование еврозапила'] = null
}
if (millAlProfile > 0) {panel.UserProperty['Фрезерование алюминиевого профиля под петлю'] = millAlProfile} else {
    panel.UserProperty['Фрезерование алюминиевого профиля под петлю'] = null
}
if (saveTexture > 0) {panel.UserProperty['Детали с сохранением перехода текстуры'] = saveTexture} else {
    panel.UserProperty['Детали с сохранением перехода текстуры'] = null
}

Action.Commit()
Model.forEachPanel(function(panel) {
    if (panel.MaterialName == 'Пользовательские свойства\rПС') {
        panel.Visible = false
    }
})

alert("Сбор данных для сметы выполнен")
