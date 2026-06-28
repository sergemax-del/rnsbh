Color = 0xe6f2ff   // зелёный   - заменить цвет можно так - 0x - неизменно, а дальше код по политре, например cefeff
MaterialName = 'ДСП 18 мм (Осн.)'

for (var i = 0; i < Model.Count; ++i) {
    recurse(Model.Objects[i])
};

function recurse(obj) {
    if (obj.AsPanel) {
        if (obj.Material.MaterialName == MaterialName) {
            obj.Material.ColorUse = 1
            obj.Material.DiffuseColor = Color
        }
    } else if (obj.List) {
        for (var i = 0; i < obj.Count; i++) {
            recurse(obj[i])
        }
    }
} 