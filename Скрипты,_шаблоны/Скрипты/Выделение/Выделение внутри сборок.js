Prop = Action.Properties;
Select = false;
Log = false;

var namesBlocks = [];
var value = '';

Prop.OnChange = function() {
    value = SpNameBlocks.Value;
    for (var i = 0; i < Model.Count; i++) {
        obj = Model.Objects[i];
        if ((obj instanceof TFurnAsm) && (ExtractMatName(obj.Name) == value)) {
            obj[i1].Selected = true;
        }
        else
            if (obj.List) BlockToListOrSelect(obj);
    }
    if (Log) Action.Finish();
};

function BlockToListOrSelect(obj) {
    sign = ExtractMatName(obj.Name);
    if (obj instanceof TFurnAsm) {
        if (namesBlocks.indexOf(sign) < 0)
            namesBlocks.push(sign);
            if ((Select) && (sign == value)) {
                for (var i = 0; i < obj.Count; i++) {
                    obj[i].Selected = true;
                }
            }
        }
        else
        {
            for (var i = 0; i < obj.Count; i++) {
                obj1 = obj.Objects[i];
                if (obj1.List) BlockToListOrSelect(obj1);
            }
        }
}

for (var i = 0; i < Model.Count; i++) {
    obj = Model.Objects[i];
    if (obj.List)
        BlockToListOrSelect(obj);
}

///////////////////////////////////
//Создание выпадающего списка и добавление туда имен блоков
SpNameBlocks = Prop.NewCombo('Имена сборок', '');
namesBlocks.sort();
SpNameBlocks.AddItem('');
for (var i = 0; i < namesBlocks.length; i++) {
    SpNameBlocks.AddItem(namesBlocks[i]);
}
Select = true;
Log = true;

Action.Continue();