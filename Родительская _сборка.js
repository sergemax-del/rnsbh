var delimiter = '.'
function MakeName(obj) {
    var ownerDes = obj.Owner.Designation;
    var ownerName = obj.Owner.Name;
    return   "("+ownerName  +") "+ownerDes
}
Model.forEach(function(obj) {
if (obj.AsPanel ||obj instanceof TExtrusionBody) {
        obj.UserProperty['Родительская сборка']  = MakeName(obj)

}

});




