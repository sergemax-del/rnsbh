
var obrazec = Model.Selected.MaterialName;
UnSelectAll();
function update(){
var formatka = GetPanel('Выберите панель, материал которой надо заменить');
formatka.MaterialName = obrazec;
Model.Build();
};

while(true){update()};

