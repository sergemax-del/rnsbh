//Функция перекраски
function PaintBlock(block, color){
    for (var i = 0; i < block.Count; i++){
        block[i].Color = color;
        if (block.List)
            PaintBlock(block[i], color);
    }
}

Model.forEach(function(obj){
    if (obj.List){
      for (var i = 0; i< obj.UserPropCount; i++){
        // В расстановке у модели, которую редактировали, устанавливается
        // пользовательское свойство -EditModelInSALON
        if (obj.UserPropertyName[i] == 'EditModelInSALON'){
        // '000000FF' -красный
            var color = parseInt('000000FF', 16);
            obj.Color = color;
            PaintBlock(obj, color);

        }
      }
    }
})