Model.forEachPanel(function(obj) {
    obj.UserProperty['Покрытие']=null
    let name = '';
    for (let i = 0; i<obj.AsPanel.Plastics.Count; i++){
        //let name1 = ExtractMatCode(obj.AsPanel.Plastics.Plastics[0].Material);
        let name1 = (obj.AsPanel.Plastics.Plastics[0].Material);
        //let name2 = (i==1)?'/ ' + ExtractMatCode(obj.AsPanel.Plastics.Plastics[1].Material):'';
        let name2 = (i==1)?'/ ' + (obj.AsPanel.Plastics.Plastics[1].Material):'';
        name = name1 + name2;
    }
    obj.UserProperty['Покрытие']=name
});