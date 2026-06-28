// если толщина панели по какому-либо габаритному размеру меньше 0.1мм
// - присвоит название кромки этой панели
Model.forEachPanel(obj => {
    if(obj.GSize.x < 0.1 || obj.GSize.y < 0.1 || obj.GSize.z < 0.1 ){
        obj.Name = ExtractMatName(obj.Butts[0].Material);
    }
})