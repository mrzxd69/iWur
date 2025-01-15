export default class ConvertTeacherInGroup {
    public convert(data: any) {
        const output: any = {};

        // Преобразование преподав в группы для saveGroup
        Object.entries(data).forEach(([teacher, subjects]: any) => {
            Object.entries(subjects).forEach(([key, subject]: any) => {
                const subjectNames = subject.split(' ')[0].split(',').map((s: any) => s.trim()); // Название группы
                const additionalInfo = subject.split(' ').slice(1).join(''); // остатки информации без группы

                subjectNames.forEach((subjectName: any) => {
                    // создаем если нет ключа с таким названием
                    if (!output[subjectName]) {
                        output[subjectName] = {};
                    }

                    // добавляем информацию
                    if (output[subjectName][key]) {
                        output[subjectName][key] += `; ${teacher}${additionalInfo}`;
                    } else {
                        output[subjectName][key] = `${teacher}${additionalInfo}`;
                    }
                });
            });
        });

        return output;
    }
}