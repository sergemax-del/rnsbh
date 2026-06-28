Texture = 'G:\\09.01.2021\\#_Текструры материалов\\Дерево\\Гервас_lac_acril 0.jpg'
MaterialName = 'ДСП 18 мм (Осн.)'

for (var i = 0; i < Model.Count; ++i) {
    recurse(Model.Objects[i])
};

function recurse(obj) {
    if (obj.AsPanel) {
        if (obj.Material.MaterialName == MaterialName) {
            obj.Material.ColorUse = 0
            obj.Material.Path = Texture
        }
    } else if (obj.List) {
        for (var i = 0; i < obj.Count; i++) {
            recurse(obj[i])
        }
    }
} 