var dModel;
var courseIds = "";
var specialityIds = "";
var groupIds = "";
var deleteTimer = false;

var extendedSearchVisible = false;
function extendedSearchHandle() {
    extendedSearchVisible = !extendedSearchVisible;
    if (extendedSearchVisible == true)
        $("#extendedSearchSelect").removeClass("hide");
    else
        $("#extendedSearchSelect").addClass("hide");
}

//Отображаемая информация в элементе клетки расписания
var ScheduleDisplay = function (id, lecturer, tutorial, tutorialType, groups, auditorium, weekType, time, minutes,
                                lecturerFullName, tutorialFullName, tutorialTypeFullName, weekTypeFullName, buildingFullName, startDate, endDate) {
    var self = this;
    self.Id = ko.observable(id);
    self.Lecturer = ko.observable(lecturer);
    self.Tutorial = ko.observable(tutorial);
    self.TutorialType = ko.observable(tutorialType);
    self.Groups = ko.observable(groups);
    self.Auditorium = ko.observable(auditorium);
    self.WeekType = ko.observable(weekType);
    self.Time = ko.observable(time);
    self.Minutes = ko.observable(minutes);
    self.LecturerFullName = ko.observable(lecturerFullName);
    self.TutorialFullName = ko.observable(tutorialFullName);
    self.TutorialTypeFullName = ko.observable(tutorialTypeFullName);
    self.WeekTypeFullName = ko.observable(weekTypeFullName);
    self.BuildingFullName = ko.observable(buildingFullName);
    self.StartDate = ko.observable(startDate);
    self.EndDate = ko.observable(endDate);
};

var ScheduleTableCell = function (everydaySchedule, numeratorSchedule, denominatorSchedule) {
    var self = this;
    self.EverydaySchedule = ko.observable(everydaySchedule);
    self.NumeratorSchedule = ko.observable(numeratorSchedule);
    self.DenominatorSchedule = ko.observable(denominatorSchedule);
};


function baseViewModel() {
    var self = this;

    self.daysOfweek = ko.observableArray([{ Id: 1, Name: "Понедельник" }, { Id: 2, Name: "Вторник" }, { Id: 3, Name: "Среда" }, { Id: 4, Name: "Четверг" }, { Id: 5, Name: "Пятница" }, { Id: 6, Name: "Суббота" }]);
    self.semesters = ko.observableArray([{ Id: 0, Name: "0" }, { Id: 1, Name: "1" },
                                         { Id: 2, Name: "2" }, { Id: 3, Name: "3" }, { Id: 4, Name: "4" }, { Id: 5, Name: "5" }, { Id: 6, Name: "6" },
                                         { Id: 7, Name: "7" }, { Id: 8, Name: "8" }, { Id: 9, Name: "9" }, { Id: 10, Name: "10" }, { Id: 11, Name: "11" },
                                         { Id: 12, Name: "12" }, { Id: 13, Name: "13" }]);

    self.buildings = ko.observableArray([]);
    self.auditoriums = ko.observableArray([]);
    self.auditroiumsLiveSearch = ko.observableArray([]);

    self.schedules = ko.observableArray([ko.observableArray([]),
                      ko.observableArray([]),
                      ko.observableArray([]),
                      ko.observableArray([]),
                      ko.observableArray([]),
                      ko.observableArray([]),
                      ko.observableArray([])]);

    self.scheduleTable = ko.observableArray([]);
    self.differentTimes = ko.observableArray([]);

    //self.schedules=ko.observableArray([]);

    self.timetables = ko.observableArray([{ Id: 1, Name: "Расписание 1" }, { Id: 2, Name: "Расписание 2" }, { Id: 3, Name: "Расписание 3" }]);

    self.currentBuilding = ko.observable();
    self.currentStudyYear = ko.observable();
    self.currentSemester = ko.observable();
    self.currentAuditorium = ko.observable();
    self.currentLiveSearchAuditorium = ko.observable({ Id: -1 });
    self.currentTimetable = ko.observable();
    self.searchText = ko.observable();
    self.selectedLiveSearchAuditoriumIndex = ko.observable();

    //Границы для отображения таблицы расписания
    self.getScheduleStartDate = ko.observable();
    self.getScheduleEndDate = ko.observable();
    self.closerPairs = ko.observableArray([]);
    self.closerPairsNext = ko.observableArray([]);
    self.closerPairTimer = ko.observable();
    self.closerPairNextTimer = ko.observable();

    self.quickNowPair = ko.observable("");
    self.quickNextPair = ko.observable("");
    self.isTableView = ko.observable(false);
    self.isSchedulesLoaded = ko.observable(false);

    self.clickedSchedule = ko.observable();

    self.init = function () {
        self.currentTimetable(self.timetables()[0]);
        self.currentSemester(self.semesters()[0]);

        var start = new Date();
        start.setDate(start.getDate() - (start.getDay() - 1));
        var day = ("0" + start.getDate()).slice(-2);
        var month = ("0" + (start.getMonth() + 1)).slice(-2);
        start = start.getFullYear() + "-" + (month) + "-" + (day);

        var end = new Date();
        console.log("*** " + end.getDay());

        end.setDate(end.getDate() + 7 - end.getDay());
        var day = ("0" + end.getDate()).slice(-2);
        var month = ("0" + (end.getMonth() + 1)).slice(-2);
        end = end.getFullYear() + "-" + (month) + "-" + (day);

        self.getScheduleStartDate(start);
        self.getScheduleEndDate(end);
    };


    self.fillScheduleTable = function (data) {


        console.log(data);
        console.log(":::::");

        self.scheduleTable([]);
        self.differentTimes([]);


        self.closerPairsNext([]);
        self.closerPairs([]);
        self.quickNowPair("");
        self.quickNextPair("");

        if (data.length == 0)
            $("#nullSchedules").removeClass("hide");
        else
            $("#nullSchedules").addClass("hide");


        self.schedules(
            [ko.observableArray([]),
            ko.observableArray([]),
            ko.observableArray([]),
            ko.observableArray([]),
            ko.observableArray([]),
            ko.observableArray([]),
            ko.observableArray([])]);

        var today = new Date();
        console.log("abacaba " + today.getDay() - 1);
        var closerDay = today.getDay() - 1;
        var closerTime = today.getHours() * 60 + today.getMinutes();
        var minDiff = 24 * 60;

        var closerPairTime;
        var closerPairNextTime;

        var differentTimesMarks = [];
        var differentTimesIndexMap = [];

        for (var i = 0; i < data.length; ++i) {
            var sh = data[i];
            var startPairDt = toDate(sh.StartTime, "h:m");
            var st = startPairDt.getHours() * 60 + startPairDt.getMinutes();
            var endPairDt = toDate(sh.EndTime, "h:m");
            var et = endPairDt.getHours() * 60 + endPairDt.getMinutes();

            //self.schedules.push(data[i].DayOfWeek);

            self.schedules()[data[i].DayOfWeek - 1].push(new ScheduleDisplay(
                data[i].Id,
                data[i].LecturerName,
                data[i].TutorialName,
                data[i].TutorialTypeName,
                data[i].GroupNames,
                data[i].AuditoriumNumber,
                data[i].WeekTypeName,
                data[i].StartTime + "-" + data[i].EndTime,
                st,
                data[i].LecturerFullName,
                data[i].TutorialFullName,
                data[i].TutorialTypeFullName,
                data[i].WeekTypeFullName,
                data[i].BuildingFullName,
                data[i].StartDate,
                data[i].EndDate
            ));


            var time = {
                Time: data[i].StartTime + "-" + data[i].EndTime,
                StartMark: st
            };

            if (differentTimesMarks[time.Time] !== true) {
                self.differentTimes.push(time);
                differentTimesMarks[time.Time] = true;
            }

            if (data[i].DayOfWeek - 1 == closerDay) {
                if (closerTime >= st && closerTime <= et) {
                    self.closerPairs.push(sh.Id);
                    self.quickNowPair(self.quickNowPair() + sh.AuditoriumNumber + " " + sh.TutorialName + "(" + sh.TutorialTypeName + ") ");
                    closerPairTime = (et - closerTime) * 60 - today.getSeconds();
                }


                var diff = st - closerTime;
                console.log(diff);
                if (diff > 0 && diff < minDiff) {
                    minDiff = diff;
                }
            }
        }

        for (var i = 0; i < data.length; ++i) {
            if (data[i].DayOfWeek - 1 == closerDay) {
                var sh = data[i];
                var startPairDt = toDate(sh.StartTime, "h:m");
                var st = startPairDt.getHours() * 60 + startPairDt.getMinutes();
                var diff = st - closerTime;
                if (diff == minDiff) {
                    self.closerPairsNext.push(sh.Id);
                    self.quickNextPair(self.quickNextPair() + sh.AuditoriumNumber + " " + sh.TutorialName + "(" + sh.TutorialTypeName + ") ");
                    closerPairNextTime = diff * 60 - today.getSeconds();
                }
            }
        }

        deleteTimer = false;
        setTimeout(function () {
            deleteTimer = true;
            self.start_countdown(closerPairTime, self.closerPairTimer);
            self.start_countdown(closerPairNextTime, self.closerPairNextTimer);
        }, 1500);

        for (var i = 0; i < self.schedules().length; ++i) {
            //console.log("^^^^^^^^^^^^^^^^^^^^^^");
            self.schedules()[i].sort(function (left, right) {
                return left.Minutes() == right.Minutes() ? 0 : (left.Minutes() < right.Minutes() ? -1 : 1);
            });
        }


        self.differentTimes().sort(function (left, right) {
            return left.StartMark == right.StartMark ? 0 : (left.StartMark < right.StartMark ? -1 : 1);
        });
        for (var i = 0; i < self.differentTimes().length; ++i)
            differentTimesIndexMap[self.differentTimes()[i].StartMark] = i;


        //fictive column for times
        self.scheduleTableCol = ko.observableArray([]);
        for (var j = 0; j < self.differentTimes().length; ++j) {
            var cell = new ScheduleTableCell(undefined, undefined, undefined);
            self.scheduleTableCol.push(cell);
        }
        self.scheduleTable.push(self.scheduleTableCol());

        for (var i = 0; i < self.schedules().length - 1; ++i) {
            self.scheduleTableCol = ko.observableArray([]);
            for (var j = 0; j < self.differentTimes().length; ++j) {
                var cell = new ScheduleTableCell(undefined, undefined, undefined);
                self.scheduleTableCol.push(cell);
            }
            for (var j = 0; j < self.schedules()[i]().length; ++j) {
                var schedule = self.schedules()[i]()[j];
                if (schedule.WeekType() == "Л") {
                    self.scheduleTableCol()[differentTimesIndexMap[schedule.Minutes()]].EverydaySchedule(schedule);
                }
                if (self.schedules()[i]()[j].WeekType() == "Ч") {
                    self.scheduleTableCol()[differentTimesIndexMap[schedule.Minutes()]].NumeratorSchedule(schedule);
                }
                if (self.schedules()[i]()[j].WeekType() == "З") {
                    self.scheduleTableCol()[differentTimesIndexMap[schedule.Minutes()]].DenominatorSchedule(schedule);
                }
            }
            self.scheduleTable.push(self.scheduleTableCol());
        }


        console.log("%%%");
        console.log(self.scheduleTable());
    };


    self.datainit = function () {
        //Загрузка годов
        dModel.loadData({
            address: "studyyear/getall",
            obj: self.studyyears,
            onsuccess: function () {
                //TODO
                self.currentStudyYear(self.studyyears()[11]);
            }
        });
        //Загрузка зданий
        dModel.loadData({
            address: "building/getall",
            obj: self.courses,
            onsuccess: function () {
                //Загрузка подразделений
                courseIds = "";
                courseIds += self.currentCourse().Id + ", ";
            }
        });
    };

  



    //Загрузить аудитории
    self.loadAuditoriums = function (buildingId, auditoriumTypeId) {
        dModel.loadData({
            address: "auditorium/GetByBuilding",
            params: {
                buildingid: buildingId,
                auditoriumtypeid: auditoriumTypeId,
            },
            obj: self.auditoriums,
            onsuccess: function () {

            }
        });
    };

    //Загрузить аудитории по номеру
    self.loadAuditoriumsByNumber = function (Number) {
        dModel.loadData({
            address: "auditorium/GetByNumber",
            params: {
                number: Number,
            },
            obj: self.auditoriumsLiveSearch,
            onsuccess: function () {
            }
        });
    };

    //Загрузить расписание
    self.loadSchedulesByAuditorium = function (auditroiumId, studyYearId, semesterId, timetableId, startTime, endTime) {
        if (startTime == undefined)
            startTime = "";
        if (endTime == undefined)
            endTime = "";
        self.isSchedulesLoaded(false);
        dModel.loadData({
            address: "schedule/GetScheduleByAll",
            params: {
                lecturerId: null,
                auditoriumId: auditoriumId,
                groupIds: "",
                weekTypeId: null,
                subGroup: "",
                startTime: startTime,
                endTime: endTime
            },
            onsuccess: function (data) {
                console.log("onsuccess");
                if (data.length > 0)
                    self.isSchedulesLoaded(true);
                self.fillScheduleTable(data);
            }
        });
    };


    self.searchText.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadAuditoriumsByNumber(newValue);
        }
    });

   

  

   

    

    self.auditoriumsLiveSearch.subscribe(function (newValue) {
        if (newValue != undefined) {
            if (newValue.length > 0 && extendedSearchVisible == true) {
                $("#extendedSearchSelect").addClass("hide");
            }
        }
    });

    //Действия при выборе группы
    self.currentGroup.subscribe(function (newValue) {
        if (newValue !== undefined) {
            if (self.currentFaculty() !== undefined) {
                groupIds = "";
                groupIds += newValue.Id + ", ";
            }
        }
    });

    self.getScheduleStartDate.subscribe(function (newValue) {
        if (newValue != undefined) {
            console.log("========++++============");
            console.log(newValue);
            if (self.currentStudyYear() !== undefined && self.currentSemester() !== undefined && self.currentTimetable() !== undefined) {
                self.loadSchedulesByGroups(self.currentLiveSearchGroup().Id + ", ", self.currentStudyYear().Id, self.currentSemester().Id, self.currentTimetable().Id, newValue, self.getScheduleEndDate());
            }
        }
    });

    self.getScheduleEndDate.subscribe(function (newValue) {
        if (newValue != undefined) {
            if (self.currentStudyYear() !== undefined && self.currentSemester() !== undefined && self.currentTimetable() !== undefined) {
                self.loadSchedulesByGroups(self.currentLiveSearchGroup().Id + ", ", self.currentStudyYear().Id, self.currentSemester().Id, self.currentTimetable().Id, self.getScheduleStartDate(), newValue);
            }
        }
    });

    self.findButtonHandle = function () {
        self.searchText(self.currentGroup().Code);
    };


    self.clickGroupTagHandle = function (index) {
        if (self.currentStudyYear() !== undefined && self.currentSemester() !== undefined && self.currentTimetable() !== undefined) {
            console.log("clickGroupTagHandle");
            self.currentLiveSearchGroup(self.groupsLiveSearch()[index]);


            console.log("==========");
            console.log(self.currentLiveSearchGroup().Id);
            console.log(self.groupsLiveSearch()[index].Id);

            self.loadSchedulesByGroups(self.currentLiveSearchGroup().Id + ", ", self.currentStudyYear().Id, self.currentSemester().Id, self.currentTimetable().Id, self.getScheduleStartDate(), self.getScheduleEndDate());
        }
    };


    self.selectGroupTagHandle = function (index) {
        self.selectedLiveSearchGroupIndex(index);
    };

    self.tableViewClickHandle = function () {
        self.isTableView(!self.isTableView());
    };

    self.simple_timer = function (sec, variable, direction) {
        console.log("************2");
        if (deleteTimer == true) {
            console.log("************3");
            var time = sec;
            direction = direction || false;

            var hour = parseInt(time / 3600);
            if (hour < 1) hour = 0;
            time = parseInt(time - hour * 3600);
            if (hour < 10) hour = '0' + hour;

            var minutes = parseInt(time / 60);
            if (minutes < 1) minutes = 0;
            time = parseInt(time - minutes * 60);
            if (minutes < 10) minutes = '0' + minutes;

            var seconds = time;
            if (seconds < 10) seconds = '0' + seconds;

            variable(hour + ':' + minutes + ':' + seconds);

            if (direction) {
                sec++;

                setTimeout(function () { self.simple_timer(sec, variable, direction); }, 1000);
            } else {
                sec--;

                if (sec > 0) {
                    setTimeout(function () { self.simple_timer(sec, variable, direction); }, 1000);
                } else {
                    //if(self.currentLiveSearchGroup()!==undefined&&self.currentStudyYear()!==undefined&&self.currentSemester()!==undefined&&self.currentTimetable()!==undefined) {
                    //self.loadSchedulesByGroups(self.currentLiveSearchGroup().Id+", ",self.currentStudyYear().Id,self.currentSemester().Id,self.currentTimetable().Id,self.getScheduleStartDate(),self.getScheduleEndDate());
                    //}
                }
            }
        }
    };

    self.scheduleClickHandle = function (dayIndex, scheduleIndex) {
        self.clickedSchedule(self.schedules()[dayIndex]()[scheduleIndex]);

        $(".schedule").popover('destroy');
        var elem = $('.extendInfo').html();
        $('.schedule').popover({ animation: true, content: elem, html: true, placement: "bottom", delay: { show: 1000 } }); //({ delay: { show: 1000, hide: 0 } });
    };

    self.scheduleTableClickHandle = function (firstIndex, secondIndex, type) {
        if (type == 1) {
            self.clickedSchedule(self.scheduleTable()[firstIndex][secondIndex].EverydaySchedule());
        }
        if (type == 2) {
            self.clickedSchedule(self.scheduleTable()[firstIndex][secondIndex].NumeratorSchedule());
        }
        if (type == 3) {
            self.clickedSchedule(self.scheduleTable()[firstIndex][secondIndex].DenominatorSchedule());
        }


        var elem = $('.extendInfo').html();
        $(".schedule").popover('destroy');
        $('.schedule').popover({ animation: true, content: elem, html: true, placement: "bottom", delay: { show: 1000 } }); //({ delay: { show: 1000, hide: 0 } });
    };

    self.simple_timer2 = function (sec, variable, direction) {
        var time = sec;
        direction = direction || false;

        var hour = parseInt(time / 3600);
        if (hour < 1) hour = 0;
        time = parseInt(time - hour * 3600);
        if (hour < 10) hour = '0' + hour;

        var minutes = parseInt(time / 60);
        if (minutes < 1) minutes = 0;
        time = parseInt(time - minutes * 60);
        if (minutes < 10) minutes = '0' + minutes;

        var seconds = time;
        if (seconds < 10) seconds = '0' + seconds;

        variable(hour + ':' + minutes + ':' + seconds);

        if (direction) {
            sec++;

            setTimeout(function () { self.simple_timer2(sec, variable, direction); }, 1000);
        } else {
            sec--;

            if (sec > 0) {
                setTimeout(function () { self.simple_timer2(sec, variable, direction); }, 1000);
            } else {
                if (self.currentLiveSearchGroup() !== undefined && self.currentStudyYear() !== undefined && self.currentSemester() !== undefined && self.currentTimetable() !== undefined) {
                    self.loadSchedulesByGroups(self.currentLiveSearchGroup().Id + ", ", self.currentStudyYear().Id, self.currentSemester().Id, self.currentTimetable().Id, self.getScheduleStartDate(), self.getScheduleEndDate());
                }
            }
        }
    };

    self.start_countdown = function (t, variable) {
        console.log("************1");
        self.simple_timer(t, variable);
    };

    self.start_countdown2 = function (t, variable) {
        self.simple_timer2(t, variable);
    };
}


function toDate(dStr, format) {
    var now = new Date();
    if (format == "h:m") {
        now.setHours(dStr.substr(0, dStr.indexOf(":")));
        now.setMinutes(dStr.substr(dStr.indexOf(":") + 1));
        now.setSeconds(0);
        return now;
    } else
        return null;
}


$(function () {

    //bind selectable first
    var viewModel = new baseViewModel();
    dModel = new dataModel();

    viewModel.init();
    viewModel.datainit();

    // Activates knockout.js
    ko.applyBindings(viewModel);

});




