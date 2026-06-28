/**
 * Установить активный слой
 * Горячая клавиша <Ctrl + L>
 */

let str = "Введите номер слоя: <ESC - показать все слои>\n";
let count = 1;
let layers = new Map();
for (let i = 0; i < Model.Count; i++) {
	if (Model[i].constructor.name === "TLayer3D") {
		str = str + count + ". " + Model[i].Name + "\n";
		layers.set(count++, Model[i]);

	}
}

let out = prompt(str);
let layer;

if (layers.has(Number.parseInt(out))) {
	layer = layers.get(Number.parseInt(out));
	layer.Active = true;
	HideLayers(layers);//Закомментировать если не надо скрывать другие слои
}

if (out === "") {
	layers.forEach((layer) => {
		layer.Visible = true;
	});
}


/**
 * Скрыть остальные
 */
function HideLayers(map) {
	map.forEach((layer) => {
		if (layer.Active === false) layer.Visible = false;
	});

}