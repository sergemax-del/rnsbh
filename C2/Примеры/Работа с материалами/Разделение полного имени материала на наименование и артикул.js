// Пример извлечения частей и форматирования полного имени материала
const material = materialData.ChooseActiveFurnMaterial();
const name = materialData.ExtractMaterialName(material.name);
const code = materialData.ExtractMaterialCode(material.name);
const formatted = materialData.FormatMaterialName(material.name);
console.log(`Наименование: "${name}"\nАртикул: "${code}"\nФорматированное имя материала: "${formatted}"`)