var namesHole = [];
var CountHole = [];
var SumHole = [];

function CheckHole(hole, fast, panel) {
    var holeCenter = fast.ToGlobal({
        x: hole.Position.x + hole.Direction.x * (hole.Depth / 2),
        y: hole.Position.y + hole.Direction.y * (hole.Depth / 2),
        z: hole.Position.z + hole.Direction.z * (hole.Depth / 2),
    })
    holeCenter = panel.ToObject(holeCenter);
    return (holeCenter.x > panel.GMin.x) && (holeCenter.x < panel.GMax.x) &&
        (holeCenter.y > panel.GMin.y) && (holeCenter.y < panel.GMax.y) &&
        (holeCenter.z > panel.GMin.z) && (holeCenter.z < panel.GMax.z);
}

Model.forEachPanel(function(panel) {
    var fasts = panel.FindConnectedFasteners();
    for (var i = 0; i < fasts.length; i++) {
        var fast = fasts[i];
    /*
        var sign = ExtractMatName(fast.Name);
        if (namesFurn.indexOf(sign) < 0)
            namesFurn.push(sign);
    */
        var holes = fast.Holes;
        if (holes && holes.Count > 0) {
            for (var j = 0; j < holes.Count; j++) {
                var hole = holes[j];
                if (CheckHole(hole, fast, panel)) {
                    sign1 = 'D ' + hole.Diameter.toFixed(1) + ' x ' + hole.Depth.toFixed(1);
                    k = namesHole.indexOf(sign1);
                    if (k < 0) {
                        namesHole.push(sign1);
                        CountHole.push('1');
                    }
                    else
                    {
                        n = CountHole[k];
                        n++;
                        CountHole[k] = n;
                    }
                }
            }
        }
    }
});


for (var i = 0; i < namesHole.length; i++) {
    SumHole.push(namesHole[i] + ' ' + CountHole[i] + ' шт.');
}

k = 0;
for (var i = 0; i < SumHole.length; i++) {
    k = k + CountHole[i];
}

SumHole.sort();
SumHole.push('Итого ' + k + ' шт.');
alert(SumHole.join('\n'));

if (SumHole.length == 0) alert('Отверстий нет.')
    else system.askWriteTextFile('txt', SumHole.join('\r\n'));