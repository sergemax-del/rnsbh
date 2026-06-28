// Пример создания формы с использованием устаревшей функции "CreateForm"
// Если закомментировать строку с назначением нового значения версии API,
// то скрипт вернёт ошибку при доступе к глобальному свойству "CreateForm",
// т.к. в функционале версий от 1 и выше такой функции нет.

console.log(`Текущее значение версии API скриптов = ${apiVersion.GetScriptApiVersion()}`);
console.log(`Назначение нового значения версии API = 0`);
apiVersion.SetScriptApiVersion(0);
console.log(`Текущее значение версии API скриптов = ${apiVersion.GetScriptApiVersion()}`);
console.log(`Настоящее значение версии API скриптов = ${apiVersion.GetRealScriptApiVersion()}`);

//-- UserForm1 #def_starts
let UserForm1 = CreateForm(FileControl.Owner);
UserForm1.Width = 328;
UserForm1.Height = 289;
UserForm1.Caption = 'Форма-пример';
UserForm1.Show();
//-- UserForm1 #def_ends
