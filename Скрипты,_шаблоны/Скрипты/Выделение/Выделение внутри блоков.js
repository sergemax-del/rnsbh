Log = false;
Prop = Action.Properties;

var namesBlocks = [];
var value = '';
var Select = true;

Prop.OnChange = function() {
    Select = true;
    value = SpNameBlocks.Value;
    for (var i = 0; i < Model.Count; i++) {
        obj = Model.Objects[i];
        if (obj instanceof TFurnBlock) BlockToListOrSelect(obj);
    }
    if (Log) Action.Finish();
};

function BlockToListOrSelect(obj) {
    sign = ExtractMatName(obj.Name);
    if (!Select) {
        if (namesBlocks.indexOf(sign) < 0) {
            namesBlocks.push(sign);
            }
        }
         else {
            if (sign == value) {
                for (var i = 0; i < obj.Count; i++) {
                    obj[i].Selected = true;
                }
            }
        }
        for (var i = 0; i < obj.Count; i++) {
            obj1 = obj.Objects[i];
            if (obj1 instanceof TFurnBlock) BlockToListOrSelect(obj1);
        }
}

for (var i = 0; i < Model.Count; i++) {
    obj = Model.Objects[i];
    if (obj instanceof TFurnBlock) {
        Select = false;
        BlockToListOrSelect(obj);
    }
}

///////////////////////////////////
//Создание выпадающего списка и добавление туда имен блоков
SpNameBlocks = Prop.NewCombo('Имена блоков', '');
//SpNameBlocks.AddItem('');
namesBlocks.sort();
for (var i = 0; i < namesBlocks.length; i++) {
    SpNameBlocks.AddItem(namesBlocks[i]);

}
Log = true;

Action.Continue();