// Пример вызова функций для запроса элементов из окна модели и обработки полученного результата
let vector = interaction.getRequest.GetVector('Укажите точку');
console.log(`Указана точка с координатами ${JSON.stringify(vector)}`);
let object = interaction.getRequest.GetObject('Укажите объект');
console.log(`Указан объект с именем "${object.Name}"`);
let panel = interaction.getRequest.GetObject('Укажите панель', objectTypeChecker.ObjectTypeValue.panel);
console.log(`Указана панель с именем "${panel.Name}"`);