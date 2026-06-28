//Скрипт добавить в пользовательское Облицовку

Model.forEachPanel(function(obj) {
obj.UserProperty['Покрытие']=null
var i=0, n=obj.AsPanel.Plastics.Count, name=""
while (i!=n)
{
   if (i==0)
       {name=obj.AsPanel.Plastics.Plastics[i].Material;
       i=i+1;}
   else
       {name=obj.AsPanel.Plastics.Plastics[i].Material+"/"+name;
       i=i+1;}
};
obj.UserProperty['Покрытие']=name
});
