//Модель данных
var dModel;

//Обработка ошибок
var showError = function (msg) {
    $.jGrowl("<b><span style='color: #f00;'>" + msg + "</span></b>", { header: "<b><span style='color: #f00;'>Ошибка</span></b>", position: "center" });
};

var pair = function (first, second) {
    this.first = first;
    this.second = second;
}

//Отображаемая информация в элементе клетки расписания
var ScheduleDisplay = function (lecturer, tutorial, tutorialType, groups, auditorium, weekType) {
    var self = this;
    self.Lecturer = ko.observable(lecturer);
    self.Tutorial = ko.observable(tutorial);
    self.TutorialType = ko.observable(tutorialType);
    self.Groups = ko.observable(groups);
    self.Auditorium = ko.observable(auditorium);
    self.WeekType = ko.observable(weekType);
};

//Служебная информация в элементе клетки расписания
var ScheduleData = function (scheduleId, scheduleInfoId, tutorialId, tutorialTypeId, groupsIds, auditoriumId, weekTypeId, dayOfWeek, periodId, lecturerId) {
    var self = this;

    self.ScheduleId = ko.observable(scheduleId);
    self.ScheduleInfoId = ko.observable(scheduleInfoId);
    self.TutorialId = ko.observable(tutorialId);
    self.TutorialTypeId = ko.observable(tutorialTypeId);
    self.GroupsIds = ko.observable(groupsIds);
    self.AuditoriumId = ko.observable(auditoriumId);
    self.WeekTypeId = ko.observable(weekTypeId);
    self.DayOfWeek = ko.observable(dayOfWeek);
    self.PeriodId = ko.observable(periodId);
    self.LecturerId = ko.observable(lecturerId);
};


//Элемент клетки расписания
var ScheduleTicket = function (ScheduleDisplay, ScheduleData, isSelected, isDragged, isDropped, currentCss, isForLecturer, isForAuditorium, isForGroup) {
    var self = this;
    self.Display = ScheduleDisplay;
    self.Data = ScheduleData;
    self.IsSelected = ko.observable(isSelected);
    self.IsDragged = ko.observable(isDragged);
    self.IsDropped = ko.observable(isDropped);

    self.UnselectCssClass = ko.observable(currentCss);
    self.CssClass = ko.observable(currentCss);

    self.IsForLecturer = ko.observable(isForLecturer);
    self.IsForAuditorium = ko.observable(isForAuditorium);
    self.IsForGroup = ko.observable(isForGroup);
};

//Клетка расписания (массив элементов scheduleBacket)
var ScheduleBacket = function (scheduleTickets, isSelected, isDropped) {
    var self = this;

    self.Tickets = ko.observableArray([]);
    self.IsSelected = ko.observable(isSelected);
    self.IsDropped = ko.observable(isDropped);

    //Класс стиля для установки положения занятия в клетке расписания
    self.PaddingCss = ko.observable();
    self.CssClass = ko.observable();

    //Заполнение ScheduleBacket в зависимости от типа недели занятия. Занятия по числителю
    //отображаются вверху, по знаменателю - внизу, еженедеьные - вцентре.
    self.Tickets.subscribe(function (newValue) {

        //Костыыыль
        if (newValue.length == 2) {
            if (newValue[0].Data.WeekTypeId() == 3 && newValue[1].Data.WeekTypeId() == 2) {
                var t = newValue[0];
                newValue[0] = newValue[1];
                newValue[1] = t;
            }
        }

        if (newValue !== undefined) {
            var sum = 0;
            for (var i = 0; i < newValue.length; ++i) {
                sum += newValue[i].Data.WeekTypeId() * newValue[i].Data.WeekTypeId();
            }
            //id = 1, id = 2, id = 3;
            self.PaddingCss("onScheduleBacketPaddingUsual");
            if (sum == 9)
                self.PaddingCss("onScheduleBacketPaddingOnlyZnam");
            if (sum == 1)
                self.PaddingCss("onScheduleBacketPaddingOnlyEveryDay");
        }
    });
};


//Отображаемая на странице информация в каждом сведении к расписанию
var ScheduleInfoDisplay = function (tutorial, lecturer, tutorialtype, maxhours, curhours, courses, groups, cssClass) {
    var self = this;
    self.Tutorial = ko.observable(tutorial);
    self.Lecturer = ko.observable(lecturer);
    self.TutorialType = ko.observable(tutorialtype);
    self.Courses = ko.observable(courses);
    self.Groups = ko.observable(groups);

    self.CssClass = ko.observable(cssClass);
    self.UnselectCssClass = ko.observable(cssClass);

    self.maxHours = ko.observable(maxhours);
    self.curHours = ko.observable(curhours);

    //изначально ставим значение переменной isLimited
    self.isLimited = ko.observable();
    self.isPlanned = ko.observable();

    if (self.maxHours() <= self.curHours())
        self.isLimited(true);

    if (self.curHours() > 0)
        self.isPlanned(true);

    //обновления - сюда надо функцию обновления в БД
    self.curHours.subscribe(function (newValue) {

        if (newValue !== undefined) {
            if (newValue >= self.maxHours())
                self.isLimited(true);
            else {
                self.isLimited(false);

                if (newValue <= 0) {
                    if (self.CssClass() !== "onScheduleInfoClick")
                        self.CssClass("simpleScheduleInfo");
                    self.UnselectCssClass("simpleScheduleInfo");
                } else {
                    if (self.CssClass() !== "onScheduleInfoClick")
                        self.CssClass("plannedScheduleInfo");
                    self.UnselectCssClass("plannedScheduleInfo");
                }
            }
        }
    });

    self.maxHours.subscribe(function (newValue) {
        if (newValue !== undefined)
            if (newValue <= self.curHours())
                self.isLimited(true);
            else
                self.isLimited(false);
    });

    self.isPlanned.subscribe(function (newValue) {
        if (newValue !== undefined) {
            if (newValue == true) {
                if (self.CssClass() !== "onScheduleInfoClick")
                    self.CssClass("plannedScheduleInfo");

                self.UnselectCssClass("plannedScheduleInfo");
            } else {
                if (self.CssClass() !== "onScheduleInfoClick")
                    self.CssClass("simpleScheduleInfo");

                self.UnselectCssClass("simpleScheduleInfo");
            }
        }
    });


    self.isLimited.subscribe(function (newValue) {
        if (newValue !== undefined) {
            if (newValue == true) {
                if (self.CssClass() !== "onScheduleInfoClick")
                    self.CssClass("limitedScheduleInfo");
                self.UnselectCssClass("limitedScheduleInfo");
            } else {
                if (self.CssClass() !== "onScheduleInfoClick")
                    self.CssClass("plannedScheduleInfo");
                self.UnselectCssClass("plannedScheduleInfo");
            }
        }
    });

};

//Служебная информация в каждом сведении к расписанию
var ScheduleInfoData = function (tutorialId, scheduleInfoId, lecturerId, tutorialTypeId, groupsIds, coursesIds) {
    this.TutorialId = ko.observable(tutorialId);
    this.ScheduleInfoId = ko.observable(scheduleInfoId);
    this.LecturerId = ko.observable(lecturerId);
    this.TutorialTypeId = ko.observable(tutorialTypeId);
    this.GroupsIds = ko.observable(groupsIds);
    this.CoursesIds = ko.observable(coursesIds);

};

//Сведение к расписанию
var ScheduleInfo = function (scheduleInfoDisplay, scheduleInfoData, isSelected, isDragged) {
    this.Display = scheduleInfoDisplay;
    this.Data = scheduleInfoData;
    this.IsSelected = ko.observable(isSelected);
    this.IsDragged = ko.observable(isDragged);
};


function baseViewModel() {
    var self = this;


    self.hints = ko.observableArray([]);

    self.addDialogValidationSummary = ko.observableArray([]);
    self.addHoursValidationSummary = ko.observableArray([]);

    self.IsPrint = ko.observable(false);
    self.PrintHandler = function () {
        //self.IsPrint(!self.IsPrint());
    }

    //Отображается или нет ссылка для автоматического выбора клетки
    self.helperLink = ko.observable(false);
    self.addHoursLink = ko.observable(false);

    self.currentDayOfweek = ko.observable();

    self.timetables = ko.observableArray([{ Id: 1, Name: "Расписание 1" }, { Id: 2, Name: "Расписание 2" }, { Id: 3, Name: "Расписание 3" }]);
    self.currentTimetable = ko.observable();

    //Массивы которые хранят подмножество выбранных объектов #SelectedItemsArrays
    self.ScheduleSelectedArray = ko.observableArray([]);
    self.ScheduleInfoSelectedArray = ko.observableArray([]);
    self.ScheduleBacketSelectedArray = ko.observableArray([]);
    self.ScheduleBacketSelectedArray.subscribe(function (newValue) {
        if (newValue !== undefined) {
        }
    });


    self.ScheduleInfoes = ko.observableArray([]);
    self.ScheduleTicketSelectedArray = ko.observableArray([]);

    //Массив открытых контекстных меню
    self.ContextMenuArray = ko.observableArray([]);

    //Массив открытых downdrop меню
    self.DownDropMenuArray = ko.observableArray([]);

    self.weekTypes = ko.observableArray([]);
    self.currentWeekType = ko.observable();

    //Динамически привязываемые css классы
    self.ScheduleInfoContextMenuCss = [new ko.observable(""), new ko.observable("")];
    self.ScheduleContextMenuCss = [new ko.observable(""), new ko.observable(""), new ko.observable("")];
    self.ScheduleBacketContextMenuCss = [new ko.observable(""), new ko.observable("")];

    self.ScheduleArray = ko.observableArray([]);
    self.ScheduleInfoArray = ko.observableArray([]);


    self.cells = ko.observableArray([]);

    self.daysOfweek = ko.observableArray([{ Id: 1, Name: "Понедельник" }, { Id: 2, Name: "Вторник" }, { Id: 3, Name: "Среда" }, { Id: 4, Name: "Четверг" }, { Id: 5, Name: "Пятница" }, { Id: 6, Name: "Суббота" }]);


    self.tutorialtypes = ko.observableArray([]);
    self.currentSiTutorialType = ko.observable();



    //Установка заголовка таблицы
    self.timeTableTitle = ko.observable("");
    self.fillTimeTableTitle = function (faculty, building, groups) {
        var title = "";
        if (faculty !== undefined)
            title += faculty + ' > ';
        if (building !== undefined)
            title += building + ' > ';;
        if (groups !== undefined)
            title += groups;

        self.timeTableTitle(title);
    }


    self.auditoriumTypes = ko.observableArray([{ Id: 1, Name: "аудитории" }, { Id: 2, Name: "кабинеты" }, { Id: 3, Name: "дисплейные" },
         { Id: 4, Name: "лабораторные" }, { Id: 5, Name: "комнаты" }, { Id: 6, Name: "залы" }, { Id: 7, Name: "отделы" }, { Id: 8, Name: "лингафонные" },
         { Id: 9, Name: "разные" }]);

    self.currentAuditoriumType = ko.observable();

    self.studyyears = ko.observableArray([{ Id: 1, Name: "2011/2012" }, { Id: 2, Name: "2012/2013" }]);
    self.currentStudyYear = ko.observable();
    self.semesters = ko.observableArray([{ Id: 0, Name: "0" }, { Id: 1, Name: "1" },
                                         { Id: 2, Name: "2" }, { Id: 3, Name: "3" }, { Id: 4, Name: "4" }, { Id: 5, Name: "5" }, { Id: 6, Name: "6" },
                                         { Id: 7, Name: "7" }, { Id: 8, Name: "8" }, { Id: 9, Name: "9" }, { Id: 10, Name: "10" }, { Id: 11, Name: "11" },
                                         { Id: 12, Name: "12" }, { Id: 13, Name: "13" }]);
    self.currentSemester = ko.observable();

    self.dayTimes = ko.observableArray(["", "", "", "", "", "", "", "", "", "", "", "", ""]);
    self.currentDayTimes = ko.observableArray([]);

    self.faculties = ko.observableArray([]);
    self.currentFaculties = ko.observable();
    self.displayFaculties = ko.observable();

    self.departments = ko.observableArray([]);
    self.currentDepartment = ko.observable();

    self.lecturers = ko.observableArray([]);
    self.currentLecturer = ko.observable();

    self.courses = ko.observableArray([]);
    self.currentCourses = ko.observableArray([]);
    self.displayCourses = ko.observable();


    self.specialities = ko.observableArray([]);
    self.currentSpecialities = ko.observableArray([]);
    self.displaySpecialities = ko.observable();


    self.groups = ko.observableArray([]);
    self.currentGroups = ko.observableArray([]);
    self.displayGroups = ko.observable();


    self.auditoriums = ko.observableArray([]);
    self.currentAuditorium = ko.observable();
    self.currentChangeAuditorium = ko.observable();

    self.buildings = ko.observableArray([]);
    self.currentBuilding = ko.observable();

    self.branches = ko.observableArray([]);
    self.currentBranches = ko.observable();
    self.displayBranches = ko.observable();


    self.toRealIndex = function (index) {
        return index - (self.daysOfweek().length + 1) - (index / (self.daysOfweek().length + 1) >> 0);
    };

    self.Div = function (a, b) {
        return (a / b) >> 0;
    }

    //загрузка свободных аудиторий
    self.loadFreeAuditoriumsT1 = function () {
        if (self.currentBuilding() !== undefined && self.currentWeekType() !== undefined && self.currentSiTutorialType() !== undefined && self.currentDayTimes()[0] !== undefined && self.currentAuditoriumType() !== undefined) {
            self.loadFreeAuditoriums(self.currentBuilding().Id, self.currentWeekType().Id,
             self.currentDayOfweek().Id, self.currentDayTimes()[0].Id, self.currentSiTutorialType().Id, self.currentAuditoriumType().Id);
        }
    }


    self.checkCurrentScheduleInfoHours = function (currentSiIndex) {
        if (self.ScheduleInfoArray()[currentSiIndex] !== undefined) {
            var prevHours = self.ScheduleInfoArray()[currentSiIndex].Display.curHours();
            var maxHours = self.ScheduleInfoArray()[currentSiIndex].Display.maxHours();
            //Проверка на количество свободных часов.
            if (maxHours <= prevHours) {
                //Если часов недостаточно отобразить форму добавления часов
                self.ShowAddHoursMenu(data, event);
            }
        }
    }

    //Выделить ScheduleBacket
    self.selectScheduleBacket = function (index) {
        self.ScheduleBacketSelectedArray.push(self.toRealIndex(index));
        if (self.ScheduleArray()[self.toRealIndex(index)] !== undefined) {
            self.ScheduleArray()[self.toRealIndex(index)].IsSelected(true);
            self.ScheduleArray()[self.toRealIndex(index)].CssClass("onScheduleBacketClick");
        }
    }

    //Выделить ScheduleTicket
    self.selectScheduleTicket = function (parentIndex, index) {
        self.ScheduleTicketSelectedArray.push(new pair(self.toRealIndex(parentIndex), index));

        if (self.ScheduleArray()[self.toRealIndex(parentIndex)].Tickets()[index] !== undefined) {
            self.ScheduleArray()[self.toRealIndex(parentIndex)].Tickets()[index].IsSelected(true);
            self.ScheduleArray()[self.toRealIndex(parentIndex)].Tickets()[index].CssClass("onScheduleTicketClick");
        }
    }

    //Выделить ScheduleInfo
    self.selectScheduleInfo = function (index) {
        self.ScheduleInfoSelectedArray.push(index);
        self.ScheduleInfoArray()[index].IsSelected(true);
        self.ScheduleInfoArray()[index].Display.CssClass("onScheduleInfoClick");
    }

    //Очистить выделенные ScheduleBackets
    self.clearSelectedScheduleBackets = function () {
        this.t = ko.observableArray([]);
        t = self.ScheduleBacketSelectedArray.removeAll();
        for (var i = 0; i < t.length; ++i) {
            if (self.ScheduleArray()[t[i]] !== undefined) {
                self.ScheduleArray()[t[i]].IsSelected(false);
                self.ScheduleArray()[t[i]].CssClass("onScheduleBacketUnclick");
            }
        }
    }

    //Очистить выделенные ScheduleTickets
    self.clearSelectedScheduleTickets = function () {
        this.t = ko.observableArray([]);
        t = self.ScheduleTicketSelectedArray.removeAll();

        for (var i = 0; i < t.length; ++i) {
            if (self.ScheduleArray()[t[i].first].Tickets()[t[i].second] !== undefined) {
                self.ScheduleArray()[t[i].first].Tickets()[t[i].second].IsSelected(false);
                self.ScheduleArray()[t[i].first].Tickets()[t[i].second].CssClass(self.ScheduleArray()[t[i].first].Tickets()[t[i].second].UnselectCssClass());
            }
        }
        return t;
    }

    //Очистить выделенные ScheduleInfoes
    self.clearSelectedScheduleInfoes = function () {
        this.t = ko.observableArray([]);
        t = self.ScheduleInfoSelectedArray.removeAll();
        for (var i = 0; i < t.length; ++i) {
            if (self.ScheduleInfoArray()[t[i]] !== undefined) {
                self.ScheduleInfoArray()[t[i]].IsSelected(false);
                self.ScheduleInfoArray()[t[i]].Display.CssClass(self.ScheduleInfoArray()[t[i]].Display.UnselectCssClass());
            }
        }
    }






    //Действия при обновлении ScheduleBacket
    self.UpdateCurrentScheduleBacket = function (index) {
        console.log("UpdateCurrentScheduleBacket");

        self.currentDayOfweek(self.daysOfweek()[index % self.daysOfweek().length]);
        self.currentDayTimes([self.dayTimes()[self.Div(index, self.daysOfweek().length)]]);

        /*
        if (self.currentBuilding() !== undefined && self.currentWeekType() !== undefined && self.currentSiTutorialType() !== undefined && self.currentDayTimes()[0] !== undefined && self.currentAuditoriumType() !== undefined) {
           self.loadFreeAuditoriums(self.currentBuilding().Id, self.currentWeekType().Id,
            self.currentDayOfweek().Id, self.currentDayTimes()[0].Id, self.currentSiTutorialType().Id, self.currentAuditoriumType().Id);
        }*/

        self.SchedulePlanValidation("back");
    };

    //Pop Up меню под курсором
    self.toDownDrop = function (data, event) {
        console.log(event);
        eid = event.toElement.id;

        var x = event.pageX - $(document).scrollLeft();
        var y = event.pageY - $(document).scrollTop();

        $("#" + eid + "DownDrop").dialog({
            position: [x, y + 15],
            dialogClass: "noTitleStuff",

            open: function (event, ui) {
                $(event.target).dialog('widget')
                    .css({ position: 'fixed' })
            },

            autoOpen: false,
            height: "auto",
            width: "auto",//event.toElement.clientWidth,
            modal: false,
            resizable: false,
        });

        self.hideAllContextMenu();
        self.hideAllDownDropMenu();

        $("#" + eid + "DownDrop").dialog("open");

        self.DownDropMenuArray.push("#" + eid + "DownDrop");
    }

    //ContextMenu
    self.toContextMenu = function (data, event, selector) {
        var x = event.pageX - $(document).scrollLeft();
        var y = event.pageY - $(document).scrollTop();

        $(selector).dialog({
            position: [x, y + 15],
            dialogClass: "noTitleStuff",
            autoOpen: false,

            open: function (event, ui) {
                $(event.target).dialog('widget')
                    .css({ position: 'fixed' })
            },

            height: "auto",
            width: "auto",//event.toElement.clientWidth,
            modal: false,
            resizable: false,
        });

        self.hideAllContextMenu();
        self.hideAllDownDropMenu();

        $(selector).dialog("open");
        self.ContextMenuArray.push(selector);
    }


    //Закрыть downdrop меню
    self.hideDownDropMenu = function (selector) {
        console.log("Colose dialog " + selector);
        $(selector).dialog("close");
        self.DownDropMenuArray.remove(selector);
    }

    //Закрыть все downdrop меню на экране
    self.hideAllDownDropMenu = function () {
        console.log("hideAllDownDropMenu");
        this.t = ko.observableArray([]);
        t = self.DownDropMenuArray.removeAll();
        for (var i = 0; i < t.length; ++i) {
            $(t[i]).dialog("close");
        }
    }

    //Закрыть контекстное меню
    self.hideContextMenu = function (selector) {
        console.log("Colose dialog " + selector);
        $(selector).dialog("close");
        self.ContextMenuArray.remove(selector);
    }

    //Закрыть все контекстные меню на экране
    self.hideAllContextMenu = function () {
        console.log("hideAllContextMenu");
        this.t = ko.observableArray([]);
        t = self.ContextMenuArray.removeAll();
        for (var i = 0; i < t.length; ++i) {
            $(t[i]).dialog("close");
        }
    }

    //Клик по форме
    self.SomeFormClick = function (data, event) {
        console.log("SomeFormClick");
        console.log(event);

        //self.hideAllContextMenu();
    }


    //Поместить выбраное сведение к расписанию в выбраную клетку при двойном щелчке
    self.TransferScheduleInfoToScheduleBacket = function (data, event, prevformstate) {

        if (self.addDialogValidationSummary().length > 0)
            return -1;

        var s1 = self.ScheduleBacketSelectedArray().length;
        var s2 = self.ScheduleInfoSelectedArray().length;
        var currentSiIndex = self.ScheduleInfoSelectedArray()[s2 - 1];

        //Планируется во все выбранные ScheduleBacket
        for (var i = 0; i < s1; ++i) {
            var currentSbIndex = self.ScheduleBacketSelectedArray()[i];

            //Если клетка занята показать диалог с настройками

            //Обновить количество текущих часов в сведении к расписанию
            self.ScheduleInfoArray()[currentSiIndex].Display.curHours(self.ScheduleInfoArray()[currentSiIndex].Display.curHours() + 1);

            var scheduleTicket = new ScheduleTicket(
                        new ScheduleDisplay(
                                self.ScheduleInfoArray()[currentSiIndex].Display.Lecturer(),
                                self.ScheduleInfoArray()[currentSiIndex].Display.Tutorial(),
                                self.ScheduleInfoArray()[currentSiIndex].Display.TutorialType(),
                                self.ScheduleInfoArray()[currentSiIndex].Display.Groups(),
                                self.currentAuditorium().Number,
                                self.currentWeekType().Name
                                ),
                        new ScheduleData(
                                1,
                                self.ScheduleInfoArray()[currentSiIndex].Data.ScheduleInfoId(),
                                self.ScheduleInfoArray()[currentSiIndex].Data.TutorialId(),
                                self.ScheduleInfoArray()[currentSiIndex].Data.TutorialTypeId(),
                                self.ScheduleInfoArray()[currentSiIndex].Data.GroupsIds(),
                                self.currentAuditorium().Id,
                                self.currentWeekType().Id,
                                self.currentDayOfweek().Id,
                                self.currentDayTimes()[0].Id,
                                self.ScheduleInfoArray()[currentSiIndex].Data.LecturerId()),
                        false,
                        false,
                        false,
                        "onScheduleTicketUnselectForGroup",
                        false,
                        false,
                        true);


            self.AddSchedule(scheduleTicket);
            self.ScheduleArray()[currentSbIndex].Tickets.push(scheduleTicket);

        }
        return 0;
    }


    //Удалить выбранный предмет из клетки расписания
    self.DeleteScheduleTicket = function () {
        console.log("DeleteScheduleTicket");

        //Удаляются все выбранные ScheduleTicket
        for (var i = 0; i < self.ScheduleTicketSelectedArray().length; ++i) {

            var SiId = self.ScheduleArray()[self.ScheduleTicketSelectedArray()[i].first].Tickets()[self.ScheduleTicketSelectedArray()[i].second].Data.ScheduleInfoId();
            //console.log(":::SiId: " + SiId);
            var currentSiIndex = undefined;

            for (var j = 0; j < self.ScheduleInfoArray().length; ++j) {
                //console.log(":::currentSiId: " + self.ScheduleInfoArray()[j].Data.ScheduleInfoId());
                if (self.ScheduleInfoArray()[j].Data.ScheduleInfoId() == SiId) {
                    currentSiIndex = j;
                    break;
                }
            }
            //console.log(":::currentSiIndex: " + SiId);

            //Текущие часы в сведении к расписанию уменьшаются
            if (currentSiIndex !== undefined) {
                if (self.ScheduleInfoArray()[currentSiIndex] !== undefined) {
                    var prevHours = self.ScheduleInfoArray()[currentSiIndex].Display.curHours();
                    self.ScheduleInfoArray()[currentSiIndex].Display.curHours(prevHours - 1);
                    console.log(":::: self.ScheduleInfoArray()[currentSiIndex].Display.curHours(prevHours - 1);");
                }

                console.log(":::curHours: " + self.ScheduleInfoArray()[currentSiIndex].Display.curHours());

                //Удалить из БД
                self.DelSchedule(self.ScheduleArray()[self.ScheduleTicketSelectedArray()[i].first].Tickets()[self.ScheduleTicketSelectedArray()[i].second]);


                //for (var i = 0; i < t.length; ++i) {
                //self.ScheduleArray()[t[i].first].Tickets()[t[i].second].CssClass(self.ScheduleArray()[t[i].first].Tickets()[t[i].second].UnselectCssClass());
                //}

                //Удалить из View
                self.ScheduleArray()[self.ScheduleTicketSelectedArray()[i].first].Tickets.remove(self.ScheduleArray()[self.ScheduleTicketSelectedArray()[i].first].Tickets()[self.ScheduleTicketSelectedArray()[i].second]);

                //Удалить из списка выделенных
                this.t = ko.observableArray([]);
                t = self.ScheduleTicketSelectedArray.removeAll();
            } else {
                self.DelSchedule(self.ScheduleArray()[self.ScheduleTicketSelectedArray()[i].first].Tickets()[self.ScheduleTicketSelectedArray()[i].second]);
                self.ScheduleArray()[self.ScheduleTicketSelectedArray()[i].first].Tickets.remove(self.ScheduleArray()[self.ScheduleTicketSelectedArray()[i].first].Tickets()[self.ScheduleTicketSelectedArray()[i].second]);
                //alert("Индекс занятия не найден в текущих сведениях к расписанию!");
                //return -1;
            }
        }



        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
        $("#del").removeClass("enabled");
        $("#del").addClass("disabled");

        $("#changeAuditorium").removeClass("enabled");
        $("#changeAuditorium").addClass("disabled");

        return 0;
    }

    //Показать меню выбора свободных аудиторий
    self.ShowFreeAuditoriumsMenu = function (data, event) {

        self.loadFreeAuditoriumsT1();

        var x = event.pageX - $(document).scrollLeft();
        var y = event.pageY - $(document).scrollTop();

        console.log("ShowFreeAuditoriumsMenu");

        $("#auditoriumdialog").dialog({
            position: [x, y],
            autoOpen: false,
            height: 350,
            width: 280,
            modal: true,
        });

        $("#auditoriumdialog").dialog("open");
    }

    //Показать меню замены аудитории
    self.ShowChangeAuditoriumsMenu = function (data, event) {
        self.loadFreeAuditoriumsT1();

        var x = event.pageX - $(document).scrollLeft();
        var y = event.pageY - $(document).scrollTop();

        console.log("ShowChangeAuditoriumsMenu");

        $("#changeauditoriumdialog").dialog({
            position: [x, y],
            autoOpen: false,
            height: 250,
            width: 280,
            modal: true,

        });

        $("#changeauditoriumdialog").dialog("open");
    }

    //Показать меню замены занятия
    self.ShowChangeScheduleMenu = function (data, event) {
        var x = event.pageX - $(document).scrollLeft();
        var y = event.pageY - $(document).scrollTop();

        console.log("ShowChangeScheduleMenu");

        $("#changescheduledialog").dialog({
            position: [x, y],
            autoOpen: false,
            height: 280,
            width: 400,
            modal: true,
        });

        $("#changescheduledialog").dialog("open");
    }


    self.addDialogValidationSummary.subscribe(function (newValue) {
        if (newValue !== undefined) {
            if (newValue.length > 0) {
                $("#addScheduleOkButton").removeClass("enabled");
                $("#addScheduleOkButton").addClass("disabled")
            } else {
                $("#addScheduleOkButton").removeClass("disabled");
                $("#addScheduleOkButton").addClass("enabled")
            }
        }
    });


    self.SchedulePlanValidation = function (param) {
        self.addDialogValidationSummary([]);

        self.addHoursLink(false);
        self.helperLink(false);

        var currentSiIndex = self.ScheduleInfoSelectedArray()[self.ScheduleInfoSelectedArray().length - 1];
        if (self.ScheduleInfoArray()[currentSiIndex] !== undefined) {
            var prevHours = self.ScheduleInfoArray()[currentSiIndex].Display.curHours();
            var maxHours = self.ScheduleInfoArray()[currentSiIndex].Display.maxHours()

            if (self.currentWeekType() == undefined) {
                self.addDialogValidationSummary.push({ Id: 1, Name: "Не выбран тип недели" });
                return -1;
            }

            if (self.currentDayTimes() == undefined) {
                self.addDialogValidationSummary.push({ Id: 2, Name: "Не выбрано время" });
                return -1;
            }

            if (self.currentDayOfweek() == undefined) {
                self.addDialogValidationSummary.push({ Id: 3, Name: "Не выбран день" });
                return -1;
            }

            for (var i = 0; i < self.currentDayTimes().length; ++i) {
                var add = true;
                var currentSb = self.ScheduleArray()[self.gi(self.currentDayTimes()[i].ViewId - 1, self.currentDayOfweek().Id - 1)];
                var len = currentSb.Tickets().length;
                for (var i = 0; i < len; ++i) {
                    if (currentSb.Tickets()[i].Data.WeekTypeId() == self.currentWeekType().Id ||
                        currentSb.Tickets()[i].Data.WeekTypeId() == 1)
                        add = false;
                }
                if (currentSb.Tickets().length > 0 && self.currentWeekType().Id == 1)
                    add = false;
                if (!add) {
                    self.addDialogValidationSummary.push({ Id: 4, Name: "Выбраная позиция занята!" });
                    self.helperLink(true);
                }
            }

            if (maxHours <= prevHours) {
                self.addDialogValidationSummary.push({ Id: 5, Name: "Недостаточно часов" });
                self.addHoursLink(true);
                return -1;
            }

            if (self.currentAuditorium() == undefined) {
                self.addDialogValidationSummary.push({ Id: 6, Name: "Не выбрана аудитория" });
                return -1;
            }

            return 0;
        } else {
            if (param !== "back") {
                alert("Выберите сведение к расписанию!");
            }
            return -2;
        }
    }

    //Показать меню планирования занятия
    self.ShowSchedulePlanMenu = function (data, event) {

        self.loadFreeAuditoriumsT1();

        var state = self.SchedulePlanValidation("to");

        if (state !== -2) {
            var x = event.pageX - $(document).scrollLeft();
            var y = event.pageY - $(document).scrollTop();

            console.log("ShowSchedulePlanMenu");

            $("#adddialog").dialog({
                position: [x, y + 8],
                autoOpen: false,
                height: 530,
                width: 350,
                modal: true,
            });
            $("#adddialog").dialog("open");

            if (state == -3) {
                self.ShowAddHoursMenu(data, event);
            }
        }
    }


    //Обработка выбора дней в меню планирования занятия
    self.currentDayOfweek.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.clearSelectedScheduleBackets();

            var currentDayIndex = newValue.Id - 1;

            for (var i = 0; i < self.currentDayTimes().length; ++i) {
                var currentTimeIndex = self.currentDayTimes()[i].ViewId - 1;
                self.ScheduleBacketSelectedArray.push(self.gi(currentTimeIndex, currentDayIndex));
                if (self.ScheduleArray()[self.gi(currentTimeIndex, currentDayIndex)] !== undefined) {
                    self.ScheduleArray()[self.gi(currentTimeIndex, currentDayIndex)].IsSelected(true);
                    self.ScheduleArray()[self.gi(currentTimeIndex, currentDayIndex)].CssClass("onScheduleBacketClick");
                }
            }

            self.SchedulePlanValidation("back");
        }
    });

    //Обработка выбора типа недели
    self.currentWeekType.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.SchedulePlanValidation("back");
        }
    });
    //Обработка выбора времени в меню планирования занятия
    self.currentDayTimes.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.clearSelectedScheduleBackets();

            var currentDayIndex = self.currentDayOfweek().Id - 1;


            for (var i = 0; i < newValue.length; ++i) {
                var currentTimeIndex = newValue[i].ViewId - 1;
                self.ScheduleBacketSelectedArray.push(self.gi(currentTimeIndex, currentDayIndex));
                if (self.ScheduleArray()[self.gi(currentTimeIndex, currentDayIndex)] !== undefined) {
                    self.ScheduleArray()[self.gi(currentTimeIndex, currentDayIndex)].IsSelected(true);
                    self.ScheduleArray()[self.gi(currentTimeIndex, currentDayIndex)].CssClass("onScheduleBacketClick");
                }



            }

            self.SchedulePlanValidation("back");
        }
    });

    //Обработка нажатия на ссылку подсказки
    self.helperLinkClick = function (data, event) {
        var s2 = self.ScheduleInfoSelectedArray().length;
        var currentSiIndex = self.ScheduleInfoSelectedArray()[s2 - 1];

        if (self.currentFaculties() !== undefined && self.currentBuilding() !== undefined &&
               self.currentStudyYear() !== undefined && self.currentSemester() !== undefined && self.currentTimetable() !== undefined &&
               self.currentWeekType() !== undefined && self.currentSiTutorialType() !== undefined && self.currentAuditoriumType() !== undefined) {

            self.loadHint(self.currentFaculties().Id, self.currentBuilding().Id, self.ScheduleInfoArray()[currentSiIndex].Data.LecturerId(),
                          courseIds, groupIds, self.currentStudyYear().Id, self.currentSemester().Id, self.currentTimetable().Id,
                          self.currentWeekType().Id, self.currentSiTutorialType().Id, self.currentAuditoriumType().Id);
        }
    }

    self.addHoursLinkClick = function (data, event) {
        self.ShowAddHoursMenu(data, event);
    }

    self.gi = function (i, j) {
        return i * self.daysOfweek().length + j;
    };

    self.gf = function (index) {
        return index - (self.daysOfweek().length + 1) - (index / (self.daysOfweek().length + 1) >> 0);
    }


    self.addHoursValidationSummary.subscribe(function (newValue) {
        if (newValue !== undefined) {
            if (newValue.length > 0) {

                $("#AddHoursFormOkButton").removeClass("enabled");
                $("#AddHoursFormOkButton").addClass("disabled");
            } else {

                $("#AddHoursFormOkButton").removeClass("disabled");
                $("#AddHoursFormOkButton").addClass("enabled");
            }
        } else {

        }
    });



    self.AddHoursValidation = function () {
        self.addHoursValidationSummary([]);
        if (self.newScheduleInfoMaxHours() == undefined || self.newScheduleInfoMaxHours() == 0 || self.newScheduleInfoMaxHours() == "") {
            self.addHoursValidationSummary.push({ Id: 1, Name: "Часы не введены" });
            return -1;
        }
        return 0;
    }


    //Показать меню добавления времени к сведению о расписании
    self.ShowAddHoursMenu = function (data, event) {

        self.AddHoursValidation();

        var x = event.pageX - $(document).scrollLeft();
        var y = event.pageY - $(document).scrollTop();

        console.log("ShowAddHoursMenu");

        $("#addhoursdialog").dialog({
            position: [x, y],
            autoOpen: false,
            height: 200,
            width: 280,
            modal: true,
        });

        $("#addhoursdialog").dialog("open");
    }


    //Заполнение таблицы с расписанием
    self.fillScheduleTable = function (data) {

        self.cells.removeAll();

        for (var i = 0; i < 1 + self.daysOfweek().length * self.dayTimes().length + self.daysOfweek().length + self.dayTimes().length; ++i) {
            self.cells.push(1);
        }

        for (var i = 0; i < self.dayTimes().length; ++i) {
            for (var j = 0; j < self.daysOfweek().length; ++j) {
                //2x
                var scheduleTickets = [];
                self.ScheduleArray.push(new ScheduleBacket(scheduleTickets, false, false));
            }
        }
    }

    self.fillScheduleTable2 = function (data) {

        var tt = self.clearSelectedScheduleTickets();

        for (var i = 0; i < self.ScheduleArray().length; ++i) {
            self.ScheduleArray()[i].Tickets.removeAll();
        }

        for (var i = 0; i < data.length; ++i) {

            //Получение реального периода (неоптимально)
            var realPeriod = 0;
            for (var j = 0; j < self.dayTimes().length; ++j) {
                if (self.dayTimes()[j].Id == data[i].PeriodId) {
                    realPeriod = self.dayTimes()[j].ViewId - 1;
                    break;
                }
            }

            var currentSbIndex = self.gi(realPeriod, data[i].DayOfWeek - 1);

            var currentCss = "";
            if (data[i].IsForLecturer == true)
                currentCss = "onScheduleTicketUnselectForLecturer";
            if (data[i].IsForAuditorium == true)
                currentCss = "onScheduleTicketUnselectForAuditorium";
            if (data[i].IsForGroup == true)
                currentCss = "onScheduleTicketUnselectForGroup";

            self.ScheduleArray()[currentSbIndex].Tickets.push(new ScheduleTicket(
                                new ScheduleDisplay(
                                        data[i].LecturerName,
                                        data[i].TutorialName,
                                        data[i].TutorialTypeName,
                                        data[i].GroupNames,
                                        data[i].AuditoriumNumber,
                                        data[i].WeekTypeName
                                        ),
                                new ScheduleData(
                                        data[i].Id,
                                        data[i].ScheduleInfoId,
                                        data[i].TutorialId,
                                        data[i].TutorialTypeId,
                                        data[i].GroupIds,
                                        data[i].AuditoriumId,
                                        data[i].WeekTypeId,
                                        data[i].DayOfWeek,
                                        data[i].PeriodId,
                                        data[i].LecturerId),
                                false,
                                false,
                                false,
                                currentCss,
                                data[i].IsForLecturer,
                                data[i].IsForAuditorium,
                                data[i].IsForGroup));
        }

        for (var i = 0; i < tt.length; ++i) {
            self.ScheduleTicketSelectedArray.push(new pair(tt[i].first, tt[i].second));

            if (self.ScheduleArray()[tt[i].first].Tickets()[tt[i].second] !== undefined) {
                self.ScheduleArray()[tt[i].first].Tickets()[tt[i].second].IsSelected(true);
                self.ScheduleArray()[tt[i].first].Tickets()[tt[i].second].CssClass("onScheduleTicketClick");
            }
        }
    }






    //Заполнение списка сведений к расписанию
    self.fillScheduleInfoTable = function (data) {

        self.ScheduleInfoArray.removeAll();

        for (var i = 0; i < data.length; ++i) {
            var t = setTimeout(function (data) {
                var startedCss = "simpleScheduleInfo";
                if (data.CurrentHours > 0)
                    startedCss = "plannedScheduleInfo";
                if (data.CurrentHours >= data.HoursPerWeek)
                    startedCss = "limitedScheduleInfo";

                self.ScheduleInfoArray.push(new ScheduleInfo(
                    new ScheduleInfoDisplay(
                          data.TutorialName,
                          data.LecturerName,
                          data.TutorialTypeName,
                          data.HoursPerWeek,
                          data.CurrentHours,
                          data.CourseNames,
                          data.GroupNames,
                          startedCss),
                     new ScheduleInfoData(
                          data.TutorialId,
                          data.Id,
                          data.LecturerId,
                          data.TutorialTypeId,
                          data.GroupIds,
                          data.CourseIds),
                    false,
                    false));
            }, 10 * (i + 1), data[i]);
        }
    }

    //Очистка таблицы расписания от предметов по группе
    self.clearScheduleForGroup = function () {
        for (var i = 0; i < self.ScheduleArray().length; ++i) {
            self.ScheduleArray()[i].Tickets.remove(function (item) {
                return item.IsForGroup() == true;
            });
        }
    }

    //Очистка таблицы расписания от предметов по аудитории
    self.clearScheduleForAuditorium = function () {
        for (var i = 0; i < self.ScheduleArray().length; ++i) {
            self.ScheduleArray()[i].Tickets.remove(function (item) {
                return item.IsForAuditorium() == true;
            });
        }
    }

    //Очистка таблицы расписания от предметов по преподавателю
    self.clearScheduleForLecturer = function () {
        for (var i = 0; i < self.ScheduleArray().length; ++i) {
            self.ScheduleArray()[i].Tickets.remove(function (item) {
                return item.IsForLecturer() == true;
            });
        }
    }

    self.clearScheduleForAll = function () {
        self.clearScheduleForAuditorium();
        self.clearScheduleForLecturer();
        self.clearScheduleForGroup();
    }


    //#init function
    self.init = function () {
        self.currentTimetable(self.timetables()[0]);
        self.fillScheduleTable();
    }

    //Обработчики щелчков #ClickEventHandlers
    self.currentScheduleClicked = ko.observable();
    self.currentScheduleInfoClicked = ko.observable();

    self.ScheduleSingleLeftClick = function (parentIndex, index, data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();

        self.clearSelectedScheduleTickets();

        self.selectScheduleTicket(parentIndex, index);

        $("#changeAuditorium").removeClass("disabled");
        $("#changeAuditorium").addClass("enabled");


        $("#del").removeClass("disabled");
        $("#del").addClass("enabled");
    }

    self.ScheduleSingleRightClick = function (parentIndex, index, data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
        self.toContextMenu(data, event, "#ScheduleContextMenuDialog");

        self.clearSelectedScheduleTickets();

        self.selectScheduleTicket(parentIndex, index);

        $("#changeAuditorium").removeClass("disabled");
        $("#changeAuditorium").addClass("enabled");


        $("#del").removeClass("disabled");
        $("#del").addClass("enabled");
    }

    self.ScheduleDoubleClick = function (data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
    }

    self.ScheduleBacketSingleLeftClick = function (index, data, event) {
        //!!!!!!
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();


        console.log("WTF");
        self.UpdateCurrentScheduleBacket(self.toRealIndex(index));


        self.clearSelectedScheduleBackets();

        self.selectScheduleBacket(index);

        $("#freeAuditorium").removeClass("disabled");
        $("#freeAuditorium").addClass("enabled");

    }

    self.ScheduleBacketSingleRightClick = function (index, data, event) {
        //!!!!!!

        self.UpdateCurrentScheduleBacket(self.toRealIndex(index));

        self.clearSelectedScheduleBackets();

        self.selectScheduleBacket(index);

        $("#freeAuditorium").removeClass("disabled");
        $("#freeAuditorium").addClass("enabled");


        if (event.target.classList[0] == "ScheduleBacket" || event.target.classList[0] == "onScheduleBacketSelect" || event.target.classList[0] == "onScheduleBacketClick") {
            self.hideAllContextMenu();
            self.hideAllDownDropMenu();
            self.toContextMenu(data, event, "#ScheduleBacketContextMenuDialog");
        }
    }

    self.ScheduleBacketDoubleClick = function (data, event) {
        //!!!!!!

        if (event.target.classList[0] == "ScheduleBacket" || event.target.classList[0] == "onScheduleBacketSelect" || event.target.classList[0] == "onScheduleBacketClick") {
            self.hideContextMenu("#ScheduleBacketContextMenuDialog");
        }
    }

    self.ScheduleInfoSingleLeftClick = function (index, data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();


        self.clearSelectedScheduleInfoes();

        //Загрузка расписания для преподавателя

        self.selectScheduleInfo(index);
        self.loadScheduleByAll("lecturer,group,auditorium");



        //Переключение кнопки добавления занятия при выборе сведения к расписанию
        $("#add").removeClass("disabled");
        $("#add").addClass("enabled");
    }

    self.ScheduleInfoSingleRightClick = function (index, data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
        self.toContextMenu(data, event, "#ScheduleInfoContextMenuDialog");

        self.clearSelectedScheduleInfoes();

        self.selectScheduleInfo(index);

        //Переключение кнопки добавления занятия при выборе сведения к расписанию
        $("#add").removeClass("disabled");
        $("#add").addClass("enabled");
    }

    self.ScheduleInfoDoubleClick = function (data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();

        //self.ShowAddHoursMenu(data, event);
        self.TransferScheduleInfoToScheduleBacket(data, event, 0);
    }

    //Drag обработчики #DragEventHandlers
    self.currentScheduleDrag = ko.observable();
    self.currentScheduleInfoDrag = ko.observable();

    self.ScheduleStartDrag = function (data, event) {

    }

    //Начало перетаскивания сведения к расписанию
    self.ScheduleInfoStartDrag = function (index, data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();

        self.clearSelectedScheduleInfoes();

        //Загрузка расписания для преподавателя

        self.selectScheduleInfo(index);

        self.loadScheduleByAll("lecturer,group,auditorium");

        //Переключение кнопки добавления занятия при выборе сведения к расписанию
        $("#add").removeClass("disabled");
        $("#add").addClass("enabled");

        self.ScheduleInfoArray()[index].IsDragged(true);
        self.ScheduleInfoArray()[index].Display.CssClass("onScheduleInfoDrag");
    }

    self.ScheduleInfoEndDrag = function (index, data, event) {
        self.ScheduleInfoArray()[index].IsDragged(false);
        if (self.ScheduleInfoArray()[index].IsSelected()) {
            self.ScheduleInfoArray()[index].Display.CssClass("onScheduleInfoClick");
        } else {
            self.ScheduleInfoArray()[index].Display.CssClass("onScheduleInfoUndrag");
        }
    }

    //Drop обработчики #DropEventHandlers
    self.lastScheduleDropped = ko.observable();
    self.lastScheduleInfoDropped = ko.observable();

    //Drop Для ScheduleBacket
    self.ScheduleBacketDrop = function (index, data, event) {

        self.UpdateCurrentScheduleBacket(self.toRealIndex(index));

        self.hideAllContextMenu();
        self.hideAllDownDropMenu();


        self.ShowSchedulePlanMenu(data, event);


        self.ScheduleArray()[self.toRealIndex(index)].IsDropped(false);
        if (!self.ScheduleArray()[self.toRealIndex(index)].IsSelected()) {
            self.ScheduleArray()[self.toRealIndex(index)].CssClass("onScheduleBacketDropUnselect");
        } else {
            self.ScheduleArray()[self.toRealIndex(index)].CssClass("onScheduleBacketClick");
        }
    }
    self.ScheduleBacketOverDrop = function (index, data, event) {

        //Дублирование кода!!!
        self.clearSelectedScheduleBackets();

        self.selectScheduleBacket(index);

        self.ScheduleArray()[self.toRealIndex(index)].IsDropped(true);
        self.ScheduleArray()[self.toRealIndex(index)].CssClass("onScheduleBacketDropSelect");
    }

    self.ScheduleBacketOutDrop = function (index, data, event) {

        self.ScheduleArray()[self.toRealIndex(index)].IsDropped(false);
        if (!self.ScheduleArray()[self.toRealIndex(index)].IsSelected()) {
            self.ScheduleArray()[self.toRealIndex(index)].CssClass("onScheduleBacketDropUnselect");
        } else {
            self.ScheduleArray()[self.toRealIndex(index)].CssClass("onScheduleBacketClick");
        }

    }

    //Drop Для ScheduleTicket
    self.ScheduleTicketDrop = function (parentIndex, index, data, event) {

        self.hideAllContextMenu();
        self.hideAllDownDropMenu();

        self.ShowSchedulePlanMenu(data, event);

        self.ScheduleArray()[self.toRealIndex(parentIndex)].Tickets()[index].IsDropped(false);
        if (!self.ScheduleArray()[self.toRealIndex(parentIndex)].Tickets()[index].IsSelected()) {
            self.ScheduleArray()[self.toRealIndex(parentIndex)].Tickets()[index].CssClass("onScheduleTicketDropUnselect");
        } else {
            self.ScheduleArray()[self.toRealIndex(parentIndex)].Tickets()[index].CssClass("onScheduleTicketClick");
        }

    }

    self.ScheduleTicketOverDrop = function (parentIndex, index, data, event) {

        //Дублирование кода!!!
        self.clearSelectedScheduleTickets();

        self.selectScheduleTicket(parentIndex, index);

        self.ScheduleArray()[self.toRealIndex(parentIndex)].Tickets()[index].IsDropped(true);
        self.ScheduleArray()[self.toRealIndex(parentIndex)].Tickets()[index].CssClass("onScheduleTicketDropSelect");
    }

    self.ScheduleTicketOutDrop = function (parentIndex, index, data, event) {

        self.ScheduleArray()[self.toRealIndex(parentIndex)].Tickets()[index].IsDropped(false);

        if (!self.ScheduleArray()[self.toRealIndex(parentIndex)].Tickets()[index].IsSelected()) {
            self.ScheduleArray()[self.toRealIndex(parentIndex)].Tickets()[index].CssClass("onScheduleTicketDropUnselect");
        } else {
            self.ScheduleArray()[self.toRealIndex(parentIndex)].Tickets()[index].CssClass("onScheduleTicketClick");
        }
    }



    //Обработчики наведения курсора мыши #OnMouseEventHandlers
    self.ScheduleInfoOnMouseIn = function (data, event) {

    }

    self.ScheduleInfoOnMouseOut = function (data, event) {

    }

    self.ScheduleOnMouseIn = function (data, event) {

    }

    self.ScheduleOnMouseOut = function (data, event) {

    }


    //Обработчики кнопок в header меню #HeaderMenuButtons

    //Обработка кнопки 'разрешить публикацию в Веб'
    self.TimetableEnableWebButton = function (data, event) {

    }

    //Обработка кнопки 'запретить публикацию в Веб'
    self.TimetableDisableWebButton = function (data, event) {

    }

    //Обработка нажатия кнопки 'Запланировать' в Header menu
    self.SchedulePlanButton = function (data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();

        self.ShowSchedulePlanMenu(data, event);
    }

    self.ScheduleDeleteButton = function (data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
        self.DeleteScheduleTicket();
    }

    self.ScheduleChangeButton = function (data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
    }

    self.AuditoriumChangeButton = function (data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
        self.ShowChangeAuditoriumsMenu(data, event);
    }

    self.FreeAuditoriumsButton = function (data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
        self.ShowFreeAuditoriumsMenu(data, event);
    }

    //Обработчики кнопок всплывающих форм #PopUpFormButtonHandlers
    //Кнопки на форме добавления занятия #SchedulePlanFormButtons

    self.SchedulePlanFormOkButton = function (data, event) {
        console.log("Ok");
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
        if (!self.TransferScheduleInfoToScheduleBacket(data, event, 1)) {
            $("#adddialog").dialog("close");
        }
    }

    self.SchedulePlanFormCancelButton = function (data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
        console.log("Cancel");
        $("#adddialog").dialog("close");
    }

    //Кнопки на форме списка свободных аудиторий
    self.FreeAuditoriumFormOkButton = function (data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();

        console.log("AOk");
        $("#auditoriumdialog").dialog("close");
    }

    self.FreeAuditoriumFormCancelButton = function (data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
        console.log("ACancel");
        $("#auditoriumdialog").dialog("close");
    }

    //Кнопки на форме замены аудитории
    self.ChangeAuditoriumFormOkButton = function (data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();

        //Поменять аудиторию
        if (self.currentChangeAuditorium() !== undefined) {
            for (var i = 0; i < self.ScheduleTicketSelectedArray().length; ++i) {
                self.ScheduleArray()[self.ScheduleTicketSelectedArray()[i].first].Tickets()[self.ScheduleTicketSelectedArray()[i].second].Display.Auditorium(self.currentChangeAuditorium().Number);
                self.ScheduleArray()[self.ScheduleTicketSelectedArray()[i].first].Tickets()[self.ScheduleTicketSelectedArray()[i].second].Data.AuditoriumId(self.currentChangeAuditorium().Id);
                self.UpdateSchedule(self.ScheduleArray()[self.ScheduleTicketSelectedArray()[i].first].Tickets()[self.ScheduleTicketSelectedArray()[i].second]);
            }
            $("#changeauditoriumdialog").dialog("close");
        } else {
            alert("Аудитория не выбрана!");
        }
    }

    self.ChangeAuditoriumFormCancelButton = function (data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
        console.log("CACancel");
        $("#changeauditoriumdialog").dialog("close");
    }

    //Кнопки на форме добавления часов
    self.newScheduleInfoMaxHours = ko.observable();

    self.newScheduleInfoMaxHours.subscribe(function (newValue) {
        self.AddHoursValidation();
    });


    self.AddHoursFormOkButton = function (data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();

        if (self.newScheduleInfoMaxHours() !== undefined) {
            for (var i = 0; i < self.ScheduleInfoSelectedArray().length; ++i) {
                self.ScheduleInfoArray()[self.ScheduleInfoSelectedArray()[i]].Display.maxHours(self.newScheduleInfoMaxHours());
                self.UpdateScheduleInfo(self.ScheduleInfoArray()[self.ScheduleInfoSelectedArray()[i]]);
            }
            self.SchedulePlanValidation("to");
            $("#addhoursdialog").dialog("close");
        }
    }

    self.AddHoursFormCancelButton = function (data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
        console.log("Add Hours Cancel Button");
        $("#addhoursdialog").dialog("close");
    }


    //Кнопки на форме контекстного меню #ScheduleContextMenuFormButtons
    self.ScheduleInfoContextMenuElementClick_Plan = function (data, event) {
        // self.hideContextMenu("#ScheduleInfoContextMenuDialog");
        self.hideAllDownDropMenu();
        self.hideAllContextMenu();

        self.ShowSchedulePlanMenu(data, event);
    }

    self.ScheduleInfoContextMenuElementClick_AddHours = function (data, event) {
        // self.hideContextMenu("#ScheduleInfoContextMenuDialog");
        self.hideAllDownDropMenu();
        self.hideAllContextMenu();
        self.ShowAddHoursMenu(data, event);
    }

    self.ScheduleContextMenuElementClick_DeleteSchedule = function (data, event) {
        //self.hideContextMenu("#ScheduleContextMenuDialog");
        self.hideAllDownDropMenu();
        self.hideAllContextMenu();
        self.DeleteScheduleTicket();
    }

    self.ScheduleContextMenuElementClick_ChangeSchedule = function (data, event) {
        //self.hideContextMenu("#ScheduleContextMenuDialog");
        self.ShowChangeScheduleMenu(data, event);
        self.hideAllDownDropMenu();
        self.hideAllContextMenu();
    }

    self.ScheduleContextMenuElementClick_ChangeAuditorium = function (data, event) {
        // self.hideContextMenu("#ScheduleContextMenuDialog");
        self.ShowChangeAuditoriumsMenu(data, event);
        self.hideAllDownDropMenu();
        self.hideAllContextMenu();
    }


    self.ScheduleBacketContextMenuElementClick_PlanSchedule = function (data, event) {
        // self.hideContextMenu("#ScheduleBacketContextMenuDialog");
        self.hideAllDownDropMenu();
        self.hideAllContextMenu();
        self.ShowSchedulePlanMenu(data, event);
    }

    self.ScheduleBacketContextMenuElementClick_FreeAuditoriums = function (data, event) {
        //self.hideContextMenu("#ScheduleBacketContextMenuDialog");
        self.ShowFreeAuditoriumsMenu(data, event);
        self.hideAllDownDropMenu();
        self.hideAllContextMenu();
    }


    self.test = function (e) {
    }

    self.test1 = function (index) {
    }

    self.getColumn = function (value) {
        return value % 7;
    }

    self.ScheduleInfoContextMenuCssState = function (index, classCss) {
        self.ScheduleInfoContextMenuCss[index](classCss);
    }

    self.ScheduleContextMenuCssState = function (index, classCss) {
        self.ScheduleContextMenuCss[index](classCss);
    }

    self.ScheduleBacketContextMenuCssState = function (index, classCss) {
        self.ScheduleBacketContextMenuCss[index](classCss);
    }

    self.ScheduleInfoCssState = function (index, classCss) {
        if (!(self.ScheduleInfoArray()[index].IsSelected() || self.ScheduleInfoArray()[index].IsDragged())) {
            self.ScheduleInfoArray()[index].Display.CssClass(classCss);
        }
    }

    self.ScheduleBacketCssState = function (index, classCss) {
        if (!(self.ScheduleArray()[self.toRealIndex(index)].IsDropped() || self.ScheduleArray()[self.toRealIndex(index)].IsSelected())) {
            self.ScheduleArray()[self.toRealIndex(index)].CssClass(classCss);
        }
    }

    self.ScheduleTicketCssState = function (parentIndex, index, classCss) {
        if (!self.ScheduleArray()[self.toRealIndex(parentIndex)].Tickets()[index].IsSelected()) {
            self.ScheduleArray()[self.toRealIndex(parentIndex)].Tickets()[index].CssClass(classCss);
        }
    }

    var groupIds = "";
    var groupNames = "";
    var specialityIds = "";
    var courseIds = "";


    self.loadScheduleByAll = function (sequence) {

        var currentSiIndex = self.ScheduleInfoSelectedArray()[self.ScheduleInfoSelectedArray().length - 1];
        if (self.ScheduleInfoArray()[currentSiIndex] !== undefined) {
            //Выбрано сведение к расписанию
            if (self.currentAuditorium() !== undefined && self.currentFaculties() !== undefined && self.currentStudyYear() !== undefined && self.currentSemester() !== undefined && self.currentTimetable() !== undefined) {
                self.loadScheduleByAll2(self.ScheduleInfoArray()[currentSiIndex].Data.LecturerId(), self.currentAuditorium().Id, self.currentFaculties().Id, self.ScheduleInfoArray()[currentSiIndex].Data.CoursesIds(), self.ScheduleInfoArray()[currentSiIndex].Data.GroupsIds(), self.currentStudyYear().Id, self.currentSemester().Id, self.currentTimetable().Id, sequence);
            }
        } else {
            //Не выбрано сведение к расписанию
            if (self.currentAuditorium() !== undefined && self.currentFaculties() !== undefined && self.currentStudyYear() !== undefined && self.currentSemester() !== undefined && self.currentTimetable() !== undefined) {
                self.loadScheduleByAll2(undefined, self.currentAuditorium().Id, self.currentFaculties().Id, courseIds, groupIds, self.currentStudyYear().Id, self.currentSemester().Id, self.currentTimetable().Id, sequence);
            }
        }

    }



    self.datainit = function () {

        /*Тест
         dModel.loadData({
             address: "lecturer/getbymask",
             obj: self.lecturers,
             params: {
                 mask: "Кузнецов"
             },
             onsuccess: function () {
                
             }
         });*/


        //Загрузка зданий
        dModel.loadData({
            address: "building/getall",
            obj: self.buildings,
            onsuccess: function () {
                //Загрузка звонков
                if (self.buildings()[0] !== undefined) {
                    self.loadTimes(self.buildings()[0]);
                }
            }
        });

        //Загрузка годов
        dModel.loadData({
            address: "studyyear/getall",
            obj: self.studyyears,
            onsuccess: function () {
                self.currentStudyYear(self.studyyears()[11]);
            }
        });



        //Загрузка типов предметов
        dModel.loadData({
            address: "tutorialtype/getall",
            obj: self.tutorialtypes,
            onsuccess: function () {
            }
        });

        //Загрузка подразделений
        dModel.loadData({
            address: "branch/getall",
            obj: self.branches,
            onsuccess: function () {
            }
        });

        //Загрузка курсов
        dModel.loadData({
            address: "course/getall",
            obj: self.courses,
            onsuccess: function () {
            }
        });

        //Загрузка типов недели
        dModel.loadData({
            address: "weektype/getall",
            obj: self.weekTypes,
            onsuccess: function () {
            }
        });


    }

    self.loadTimes = function (buildingId) {
        dModel.loadData({
            address: "time/getall",
            obj: self.dayTimes,
            params: {
                buildingId: buildingId
            },
            onsuccess: function () {
                self.fillScheduleTable();
            }
        });
    }


    //Загрузка типов аудиторий
    self.loadAuditoriumTypes = function () {
        dModel.loadData({
            address: "auditoriumtype/getall",
            obj: self.auditoriumTypes,
            onsuccess: function () {
            }
        });
    }

    //Загрузить свободные аудитории
    self.loadFreeAuditoriums = function (buildingId, weekTypeId, day, timeId, tutorialTypeId, auditoriumTypeId) {
        if (buildingId !== undefined && weekTypeId !== undefined && day !== undefined && timeId !== undefined) {
            dModel.loadData({
                address: "auditorium/GetFree",
                obj: self.auditoriums,
                params: {
                    buildingId: buildingId,
                    weekTypeId: weekTypeId,
                    day: day,
                    timeId: timeId,
                    tutorialtypeid: tutorialTypeId,
                    auditoriumtypeid: auditoriumTypeId
                },
                onsuccess: function () {
                }
            });
        }
    }

    //Загрузить факультеты
    self.loadFaculties = function (branchId) {
        dModel.loadData({
            address: "faculty/getall",
            obj: self.faculties,
            params: {
                branchid: branchId,
            },
            onsuccess: function () {
            }
        });
    }

    //Загрузить специальности
    self.loadSpecialities = function (facultyId) {
        dModel.loadData({
            address: "speciality/getall",
            params: {
                facultyid: facultyId,
            },
            obj: self.specialities,
            onsuccess: function () {
                //console.log(self.specialities());
            }
        });
    }

    //Загрузить группы
    self.loadGroups = function (facultyId, courseIds, specialityIds) {
        dModel.loadData({
            address: "group/GetAll",
            params: {
                facultyid: facultyId,
                courseids: courseIds,
                specialityids: specialityIds
            },
            obj: self.groups,
            onsuccess: function () {
                //console.log(self.groups());
            }
        });
    }

    //Загрузка сведений к расисанию для группы
    self.loadScheduleInfoes = function (facultyId, courseIds, groupIds, tutorialTypeId, studyYearId, semesterId) {
        dModel.loadData({
            address: "scheduleinfo/GetByGroups",
            params: {
                facultyid: facultyId,
                courseids: courseIds,
                groupids: groupIds,
                tutorialtypeid: tutorialTypeId,
                studyyearid: studyYearId,
                semesterid: semesterId
            },
            onsuccess: function (data) {
                console.log("self.loadScheduleInfoes");
                self.fillScheduleInfoTable(data);
            }
        });
    }

    self.loadScheduleByAll2 = function (lecturerId, auditoriumId, facultyId, courseIds, groupIds, studyYearId, semesterId, timetableId, sequence) {
        if (lecturerId == undefined)
            lecturerId = 0;
        if (auditoriumId == undefined)
            auditoriumId = 0;
        if (facultyId == undefined)
            facultyId = 0;
        if (courseIds == undefined)
            courseIds = "";
        if (groupIds == undefined)
            groupIds = "";

        dModel.loadData({
            address: "schedule/GetByAll",
            params: {
                lecturerid: lecturerId,
                auditoriumid: auditoriumId,
                facultyid: facultyId,
                courseids: courseIds,
                groupids: groupIds,
                studyyearid: studyYearId,
                semesterid: semesterId,
                timetableid: timetableId,
                sequence: sequence
            },
            onsuccess: function (data) {
                self.fillScheduleTable2(data);
            }
        });
    }

    //Загрузка расписания для группы
    self.loadScheduleByGroup = function (facultyId, courseIds, groupIds, studyYearId, semesterId, timetableId) {
        dModel.loadData({
            address: "schedule/GetByGroups",
            params: {
                facultyid: facultyId,
                courseids: courseIds,
                groupids: groupIds,
                studyyearid: studyYearId,
                semesterid: semesterId,
                timetableid: timetableId
            },
            onsuccess: function (data) {
                console.log("self.loadScheduleByGroup");
                self.fillScheduleTable2(data);
            }
        });
    }

    //Загрузка расписания для преподавателя
    self.loadScheduleByLecturer = function (lecturerId, studyYearId, semesterId, timetableId) {
        dModel.loadData({
            address: "schedule/GetByLecturer",
            params: {
                lecturerid: lecturerId,
                studyyearid: studyYearId,
                semesterid: semesterId,
                timetableid: timetableId
            },
            onsuccess: function (data) {
                console.log("self.loadScheduleByLecturer");
                self.fillScheduleTable2(data);
            }
        });
    }

    //Загрузка расписания для аудитории
    self.loadScheduleByAuditorium = function (auditoriumId, studyYearId, semesterId, timetableId) {
        dModel.loadData({
            address: "schedule/GetByAuditorium",
            params: {
                auditoriumid: auditoriumId,
                studyyearid: studyYearId,
                semesterid: semesterId,
                timetableid: timetableId
            },
            onsuccess: function (data) {
                console.log("self.loadScheduleByAuditorium");
                self.fillScheduleTable2(data);
            }
        });
    }


    //Загрузка подсказки
    self.loadHint = function (facultyId, buildingId, lecturerId, courseIds, groupIds, studyYearId, semesterId, timetableId, weekTypeId, tutorialTypeId, auditoriumTypeId) {
        dModel.loadData({
            address: "schedulehelper/GetAll",
            params: {
                facultyid: facultyId,
                buildingid: buildingId,
                lecturerid: lecturerId,
                courseids: courseIds,
                groupids: groupIds,
                studyyearid: studyYearId,
                semesterid: semesterId,
                timetableid: timetableId,
                weektypeid: weekTypeId,
                tutorialtypeid: tutorialTypeId,
                auditoriumtypeid: auditoriumTypeId
            },
            obj: self.hints,
            onsuccess: function () {

                if (self.hints()[0] != undefined) {
                    //День
                    self.currentDayOfweek(self.daysOfweek()[self.hints()[0].Day - 1]);

                    //Время
                    self.currentDayTimes([self.hints()[0].Period]);

                    //Аудитория
                    self.currentAuditorium(self.hints()[0].Auditorium);
                }
            }
        });
    }

    //Сохранение клетки расписания
    self.AddSchedule = function (Schedule) {
        dModel.sendData({
            address: "schedule/add",
            params: {
                'AuditoriumId': Schedule.Data.AuditoriumId(),
                'ScheduleInfoId': Schedule.Data.ScheduleInfoId(),
                'DayOfWeek': Schedule.Data.DayOfWeek(),
                'PeriodId': Schedule.Data.PeriodId(),
                'WeekTypeId': Schedule.Data.WeekTypeId()
            }
        });
    }

    //Удаление клетки расписания
    self.DelSchedule = function (Schedule) {
        dModel.sendData({
            address: "schedule/delete",
            params: {
                'Id': Schedule.Data.ScheduleId()
            }
        });
    }

    //Обновление клетки расписания
    self.UpdateSchedule = function (Schedule) {
        dModel.sendData({
            address: "schedule/update",
            params: {
                'ScheduleId': Schedule.Data.ScheduleId(),
                'AuditoriumId': Schedule.Data.AuditoriumId(),
                'ScheduleInfoId': Schedule.Data.ScheduleInfoId(),
                'DayOfWeek': Schedule.Data.DayOfWeek(),
                'PeriodId': Schedule.Data.PeriodId(),
                'WeekTypeId': Schedule.Data.WeekTypeId()
            }
        });
    }

    //Обновление сведения к расписанию
    self.UpdateScheduleInfo = function (ScheduleInfo) {
        dModel.sendData({
            address: "scheduleinfo/update",
            params: {
                'ScheduleInfoId': ScheduleInfo.Data.ScheduleInfoId(),
                'HoursPerWeek': ScheduleInfo.Display.maxHours()
            }
        });
    }


    //Действия при выборе аудитории
    self.currentAuditorium.subscribe(function (newValue) {
        self.loadScheduleByAll("auditorium,lecturer,group");
    });

    //Действия при выборе подразделения
    self.currentBranches.subscribe(function (newValue) {
        if (newValue !== undefined) {
            console.log("BranchId: " + newValue.Id);
            self.loadFaculties(newValue.Id);
            //self.currentGroups("");
            self.groups("");
        }

    });

    //Действия при выборе факультета
    self.currentFaculties.subscribe(function (newValue) {
        if (newValue !== undefined) {
            console.log("FacultyId: " + newValue.Id);
            self.loadSpecialities(newValue.Id);
            //self.currentGroups("");
            self.groups("");

            if (self.currentBuilding() !== undefined)
                self.fillTimeTableTitle(newValue.Name, self.currentBuilding().Name, groupNames);
        }
    });


    //Действия при выборе специальности
    self.currentSpecialities.subscribe(function (newValue) {
        if (newValue !== undefined) {
            if (self.currentFaculties() !== undefined) {
                specialityIds = "";
                for (var i = 0; i < newValue.length; ++i)
                    specialityIds += newValue[i].Id + ", ";
                //Загрузить группы
                self.loadGroups(self.currentFaculties().Id, courseIds, specialityIds);
            }
        }
    });

    //Действия при выборе курса
    self.currentCourses.subscribe(function (newValue) {
        if (newValue !== undefined) {
            if (self.currentFaculties() !== undefined) {
                courseIds = "";
                for (var i = 0; i < newValue.length; ++i)
                    courseIds += newValue[i].Id + ", ";
                //Загрузить группы
                self.loadGroups(self.currentFaculties().Id, courseIds, specialityIds);
            }
        }
    });

    //Действия при выборе здания
    self.currentBuilding.subscribe(function (newValue) {
        if (newValue !== undefined) {

            if (self.currentFaculties() !== undefined)
                self.fillTimeTableTitle(self.currentFaculties().Name, newValue.Name, groupNames);

            //Загрузить звонки
            self.loadTimes(newValue.Id);
            //Загрузить аудитории (либо все либо только свободные)
            if (self.currentWeekType() !== undefined && self.currentDayOfweek() !== undefined && self.currentDayTimes()[0] !== undefined && self.currentSiTutorialType() !== undefined && self.currentAuditoriumType() !== undefined) {
                self.loadFreeAuditoriums(newValue.Id, self.currentWeekType().Id,
                self.currentDayOfweek().Id, self.currentDayTimes()[0].Id, self.currentSiTutorialType().Id, self.currentAuditoriumType().Id);
            } else {
                if (self.currentAuditoriumType() !== undefined) {
                    dModel.loadData({
                        address: "auditorium/GetByBuilding",
                        params: {
                            buildingid: newValue.Id,
                            auditoriumtypeid: self.currentAuditoriumType().Id
                        },
                        obj: self.auditoriums,
                        onsuccess: function () {
                            //console.log(self.auditoriums());
                        }
                    });
                }
            }
        }
    });


    //Очистка состояния таблицы расписания
    self.clearTimetableState = function () {
        self.clearSelectedScheduleTickets();
        self.clearSelectedScheduleBackets();
        self.clearSelectedScheduleInfoes();

        self.currentDayOfweek("");
        self.currentDayTimes([]);
    }


    //Действия при выборе группы
    self.currentGroups.subscribe(function (newValue) {
        if (newValue !== undefined) {
            if (self.currentFaculties() !== undefined) {
                groupIds = "";
                groupNames = "";
                for (var i = 0; i < newValue.length; ++i) {
                    groupIds += newValue[i].Id + ", ";
                    groupNames += newValue[i].Code + ", ";
                }


                //Очистка состояния таблицы расписания
                self.clearTimetableState();

                //Заполнить заголовок таблицы
                if (self.currentBuilding() !== undefined)
                    self.fillTimeTableTitle(self.currentFaculties().Name, self.currentBuilding().Name, groupNames);

                //Загрузить сведения к расписанию
                if (self.currentStudyYear() !== undefined && self.currentSemester() !== undefined && self.currentSiTutorialType() !== undefined) {
                    self.loadScheduleInfoes(self.currentFaculties().Id, courseIds, groupIds, self.currentSiTutorialType().Id, self.currentStudyYear().Id, self.currentSemester().Id);
                }
                //Загрузить расписание
                self.loadScheduleByAll("group,lecturer,auditorium");
            }
        }
    });


    self.currentAuditoriumType.subscribe(function (newValue) {
        if (newValue !== undefined) {
            if (self.currentBuilding() !== undefined && self.currentWeekType() !== undefined && self.currentDayOfweek() !== undefined && self.currentDayTimes()[0] !== undefined && self.currentSiTutorialType() !== undefined) {
                self.loadFreeAuditoriums(self.currentBuilding().Id, self.currentWeekType().Id,
                self.currentDayOfweek().Id, self.currentDayTimes()[0].Id, self.currentSiTutorialType().Id, newValue.Id);
            } else {
                if (self.currentBuilding() !== undefined) {
                    dModel.loadData({
                        address: "auditorium/GetByBuilding",
                        params: {
                            buildingid: self.currentBuilding().Id,
                            auditoriumtypeid: self.currentAuditoriumType().Id
                        },
                        obj: self.auditoriums,
                        onsuccess: function () {
                            //console.log(self.auditoriums());
                        }
                    });
                }
            }
        }
    });

    //Действия при выборе учебного года
    self.currentStudyYear.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadScheduleByAll("group,lecturer,auditorium");

            if (self.currentFaculties() !== undefined && self.currentSemester() !== undefined && self.currentTimetable() !== undefined) {
                if (self.currentSiTutorialType() !== undefined) {
                    self.loadScheduleInfoes(self.currentFaculties().Id, courseIds, groupIds, self.currentSiTutorialType().Id, newValue.Id, self.currentSemester().Id);
                }
            }
        }
    });

    //Действия при выборе семестра
    self.currentSemester.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadScheduleByAll("group,lecturer,auditorium");

            if (self.currentFaculties() !== undefined && self.currentStudyYear() !== undefined && self.currentTimetable() !== undefined) {
                if (self.currentSiTutorialType() !== undefined) {
                    self.loadScheduleInfoes(self.currentFaculties().Id, courseIds, groupIds, self.currentSiTutorialType().Id, self.currentStudyYear().Id, newValue.Id);
                }
            }
        }
    });

    //Действия при изменении типа предмета для сведений к расписанию
    self.currentSiTutorialType.subscribe(function (newValue) {
        if (newValue !== undefined) {
            if (self.currentFaculties() !== undefined && self.currentStudyYear() !== undefined && self.currentSemester() !== undefined) {
                self.loadScheduleInfoes(self.currentFaculties().Id, courseIds, groupIds, newValue.Id, self.currentStudyYear().Id, self.currentSemester().Id);
            }
        }
    });

};



$(function () {

    //resizable binding
    ko.bindingHandlers.resizable = {
        init: function (element, valueAccessor) {
            var options = valueAccessor();
            $(element).resizable(options);
        }
    };

    //draggable binding
    ko.bindingHandlers.draggable = {
        init: function (element, valueAccessor) {
            var options = valueAccessor();
            $(element).draggable(options);
        }
    };

    //droppable binding
    ko.bindingHandlers.droppable = {
        init: function (element, valueAccessor) {
            var options = valueAccessor();
            $(element).droppable(options);
        }
    };

    //Autocomplete binding
    ko.bindingHandlers.ko_autocomplete = {
        init: function (element, params) {
            $(element).autocomplete(params());
        },
        update: function (element, params) {
            $(element).autocomplete("option", "source", params().source);
        }
    };




    //bind selectable first
    viewModel = new baseViewModel();
    dModel = new dataModel();

    viewModel.init();
    viewModel.datainit();


    // Activates knockout.js
    ko.applyBindings(viewModel);
});
