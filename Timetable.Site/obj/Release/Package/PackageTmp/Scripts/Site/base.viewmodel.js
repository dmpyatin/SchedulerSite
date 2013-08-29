var daysOfWeek = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
var months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];




days1 = [["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]];


var ind_inv = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
var ind = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];

var currentElement;

/*
document.onclick = function (event) {

    event = event || window.event;
    if (!event.target) {
        event.target = event.srcElement;
    }
    if (event.target.id == "myid") {
        alert(event.target.id);
    }
}*/

function baseViewModel() {
   

    var self = this;

    self.displayTimeSelect = ko.observable(false);
    var isCheckTime_tmp = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
    self.isCheckTime = ko.observableArray([]);
    self.isSelectTime = ko.observable(-1);

    self.changeTimeSelect = function () {
        self.displayTimeSelect(!self.displayTimeSelect());
    }
    self.checkTime = function (index) {
        if (isCheckTime_tmp[index] == true)
            isCheckTime_tmp[index] = false;
        else
            isCheckTime_tmp[index] = true;

        self.isCheckTime(isCheckTime_tmp);
    }
    self.selectTimeSelect = function (index) {
        //alert(index);
        self.isSelectTime(index);
    }


    self.Page = ko.observable(1);

    self.buildings = ko.observableArray([]);

    self.currentFaculty = ko.observable();
    self.currentCourse = ko.observable();
    self.currentTutorial = ko.observable();
    self.currentSpeciality1 = ko.observableArray([]);
    self.currentGroup1 = ko.observableArray([]);
    self.currentTutorialType = ko.observable();
    self.currentLecturer = ko.observable();
    self.displayLecturer = ko.observable();
    self.currentBuilding = ko.observable();
    self.currentAuditorium1 = ko.observable();

    self.currentSchedule = ko.observable();





    self.SelectedOptionValue = ko.observable();

    self.Row = ko.observable(-1);
    self.Col = ko.observable(-1);
    self.preRow = ko.observable(-1);
    self.preCol = ko.observable(-1);

    self.tmpSpeciality = ko.observable();
    self.currentFacultyId1 = ko.observable();
    self.currentCourseId = ko.observable();
    self.currentDepartmentId = ko.observable();

    self.currentUncheduledTutorial = ko.observable();
    self.uncheduledTutorials = ko.observableArray([]);


    self.routingPattern = "{0}\\{1}"; //{ViewModelMethod}\{ParameterObject}
    self.defaultCommand = "page"; //  
    self.faculties = ko.observableArray([]);
    self.courses = ko.observableArray([]);
    self.groups1 = ko.observableArray([]);
    self.auditoriums1 = ko.observableArray([]);
    self.lecturers1 = ko.observableArray([]);
    self.buildings1 = ko.observableArray([]);
    self.specialities1 = ko.observableArray([]);
    self.tutorials = ko.observableArray([]);
    self.tutorialTypes = ko.observableArray([]);
    self.isLoading = ko.observable(false);
    self.currentDay = ko.observable(new Date());
    self.weekDayDates = ko.observable([]);
    self.times = ko.observableArray([]);
    self.selectedScheduleCard = ko.observable();
    self.schedule = ko.observableArray([]);
    self.displayLecturers = ko.observableArray([]);

    self.unscheduledTutorials = ko.observableArray([]);
    self.scheduleInfoes = ko.observableArray([]);


    self.currentTimes = ko.observableArray([]);


    self.hasHash = function () {
        return typeof window.location.hash !== undefined && window.location.hash != "";
    };

    self.pushHashCommand = function (command) {
        var url = window.location.href.replace(/#.*/, '');

        window.location.href = url + '#' + command;
    };

    //Обновляет сетку расписания
    self.ApplySchedule = function (data) {





        days1 = [["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]];

        for (var j = 0; j < 30; ++j)
            isCheckTime_tmp[j] = false;
        self.isCheckTime(isCheckTime_tmp);


        //self.schedule(days1);

        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 30; j++) {
                days1[i][j] = {
                    FirstScheduleInfo: "",
                    FirstAuditorium: "",
                    FirstStartDate: "",
                    FirstEndDate: "",
                    FirstLecturer: "",
                    FirstTutorialTypeName: "",
                    FirstId: -1,
                    FirstTutorialName: "",
                    FirstStreamCollision: "",
                    FirstLecturerCollision: "",
                    FirstAuditoriumCollision: "",
                    FirstGroups: "",
                    FirstCourses: "",
                    FirstFaculty: "",

                    FirstAuditoriumId: "",
                    FirstTutorialTypeId: "",
                    FirstGroupsIds: "",
                    FirstLecturerId: "",
                    FirstFacultyId: "",

                    SecondScheduleInfo: "",
                    SecondAuditorium: "",
                    SecondStartDate: "",
                    SecondEndDate: "",
                    SecondLecturer: "",
                    SecondTutorialTypeName: "",
                    SecondId: -1,
                    SecondTutorialName: "",
                    SecondStreamCollision: "",
                    SecondLecturerCollision: "",
                    SecondAuditoriumCollision: "",
                    SecondGroups: "",
                    SecondCourses: "",
                    SecondFaculty: "",

                    SecondAuditoriumId: "",
                    SecondTutorialTypeId: "",
                    SecondGroupsIds: "",
                    SecondLecturerId: "",
                    SecondFacultyId: "",

                    ThirdScheduleInfo: "",
                    ThirdAuditorium: "",
                    ThirdStartDate: "",
                    ThirdEndDate: "",
                    ThirdLecturer: "",
                    ThirdTutorialTypeName: "",
                    ThirdId: -1,
                    ThirdTutorialName: "",
                    ThirdStreamCollision: "",
                    ThirdLecturerCollision: "",
                    ThirdAuditoriumCollision: "",
                    ThirdGroups: "",
                    ThirdCourses: "",
                    ThirdFaculty: "",

                    ThirdAuditoriumId: "",
                    ThirdTutorialTypeId: "",
                    ThirdGroupsIds: "",
                    ThirdLecturerId: "",
                    ThirdFacultyId: ""
                }
            }
        }


        $.each(data, function (index, item) {
            var ti = ind_inv[item.Period - 1];

            isCheckTime_tmp[ti] = true;

            var tt = item.DayOfWeek - 1;
            //alert("* " + tt + " " + ti + " : " + item.ScheduleInfo);

          
            
            if (item.WeekType == 1) {

                days1[item.DayOfWeek - 1][ti].FirstScheduleInfo = item.ScheduleInfo;
                days1[item.DayOfWeek - 1][ti].FirstAuditorium = item.Auditorium;
                days1[item.DayOfWeek - 1][ti].FirstStartDate = item.StartDate;
                days1[item.DayOfWeek - 1][ti].FirstEndDate = item.EndDate;
                days1[item.DayOfWeek - 1][ti].FirstLecturer = item.Lecturer;
                days1[item.DayOfWeek - 1][ti].FirstTutorialTypeName = item.TutorialType;
                days1[item.DayOfWeek - 1][ti].FirstId = item.Schedule;
                days1[item.DayOfWeek - 1][ti].FirstTutorialName = item.Tutorial;
                days1[item.DayOfWeek - 1][ti].FirstStreamCollision = item.StreamCollision;
                days1[item.DayOfWeek - 1][ti].FirstLecturerCollision = item.LecturerCollision;
                days1[item.DayOfWeek - 1][ti].FirstAuditoriumCollision = item.AuditoriumCollision;
                days1[item.DayOfWeek - 1][ti].FirstGroups = item.Groups;
                days1[item.DayOfWeek - 1][ti].FirstCourses = item.Courses;
                days1[item.DayOfWeek - 1][ti].FirstFaculty= item.Faculty;
                
                days1[item.DayOfWeek - 1][ti].FirstAuditoriumId = item.AuditoriumId;
                days1[item.DayOfWeek - 1][ti].FirstTutorialTypeId = item.TutorialTypeId;
                days1[item.DayOfWeek - 1][ti].FirstGroupsIds = item.GroupsIds;
                days1[item.DayOfWeek - 1][ti].FirstLecturerId = item.LecturerId;
                days1[item.DayOfWeek - 1][ti].FirstFacultyId = item.FacultyId;
            }

            if (item.WeekType == 2) {

              

                days1[item.DayOfWeek - 1][ti].SecondScheduleInfo = item.ScheduleInfo;
                days1[item.DayOfWeek - 1][ti].SecondAuditorium = item.Auditorium;
                days1[item.DayOfWeek - 1][ti].SecondStartDate = item.StartDate;
                days1[item.DayOfWeek - 1][ti].SecondEndDate = item.EndDate;
                days1[item.DayOfWeek - 1][ti].SecondLecturer = item.Lecturer;
                days1[item.DayOfWeek - 1][ti].SecondTutorialTypeName = item.TutorialType;
                days1[item.DayOfWeek - 1][ti].SecondId = item.Schedule;
                days1[item.DayOfWeek - 1][ti].SecondTutorialName = item.Tutorial;
                days1[item.DayOfWeek - 1][ti].SecondStreamCollision = item.StreamCollision;
                days1[item.DayOfWeek - 1][ti].SecondLecturerCollision = item.LecturerCollision;
                days1[item.DayOfWeek - 1][ti].SecondAuditoriumCollision = item.AuditoriumCollision;
                days1[item.DayOfWeek - 1][ti].SecondGroups = item.Groups;
                days1[item.DayOfWeek - 1][ti].SecondCourses = item.Courses;
                days1[item.DayOfWeek - 1][ti].SecondFaculty = item.Faculty;

                days1[item.DayOfWeek - 1][ti].SecondAuditoriumId = item.AuditoriumId;
                days1[item.DayOfWeek - 1][ti].SecondTutorialTypeId = item.TutorialTypeId;
                days1[item.DayOfWeek - 1][ti].SecondGroupsIds = item.GroupsIds;
                days1[item.DayOfWeek - 1][ti].SecondLecturerId = item.LecturerId;
                days1[item.DayOfWeek - 1][ti].SecondFacultyId = item.FacultyId;
            }

            if (item.WeekType == 3) {
                days1[item.DayOfWeek - 1][ti].ThirdScheduleInfo = item.ScheduleInfo;
                days1[item.DayOfWeek - 1][ti].ThirdAuditorium = item.Auditorium;
                days1[item.DayOfWeek - 1][ti].ThirdStartDate = item.StartDate;
                days1[item.DayOfWeek - 1][ti].ThirdEndDate = item.EndDate;
                days1[item.DayOfWeek - 1][ti].ThirdLecturer = item.Lecturer;
                days1[item.DayOfWeek - 1][ti].ThirdTutorialTypeName = item.TutorialType;
                days1[item.DayOfWeek - 1][ti].ThirdId = item.Schedule;
                days1[item.DayOfWeek - 1][ti].ThirdTutorialName = item.Tutorial;
                days1[item.DayOfWeek - 1][ti].ThirdStreamCollision = item.StreamCollision;
                days1[item.DayOfWeek - 1][ti].ThirdLecturerCollision = item.LecturerCollision;
                days1[item.DayOfWeek - 1][ti].ThirdAuditoriumCollision = item.AuditoriumCollision;
                days1[item.DayOfWeek - 1][ti].ThirdGroups = item.Groups;
                days1[item.DayOfWeek - 1][ti].ThirdCourses = item.Courses;
                days1[item.DayOfWeek - 1][ti].ThirdFaculty = item.Faculty;

                days1[item.DayOfWeek - 1][ti].ThirdAuditoriumId = item.AuditoriumId;
                days1[item.DayOfWeek - 1][ti].ThirdTutorialTypeId = item.TutorialTypeId;
                days1[item.DayOfWeek - 1][ti].ThirdGroupsIds = item.GroupsIds;
                days1[item.DayOfWeek - 1][ti].ThirdLecturerId = item.LecturerId;
                days1[item.DayOfWeek - 1][ti].ThirdFacultyId = item.FacultyId;
            }
            
        });

        self.isCheckTime(isCheckTime_tmp);

        self.schedule(days1);

    };

    // Обработчик url-команд
    this.hashCommandHadler = function (loc) {
        if (typeof loc !== 'undefined') {
            var url = loc.href.replace(/^.*#/, '');
            var command = url.split('\\');

            if (typeof (command[0]) !== "undefined" && command[0] != "") {
                this[command[0]](command);
            } else {
                this[this.defaultCommand](command);
            }
        }
    };

    self.updateWeekDays = function () {
        var ar = [];
        var ticksInDay = 86400000;

        for (var i = 0; i <= 5; i++) {

            var day = new Date(self.currentDay() - (self.currentDay().getDay() - 1) * ticksInDay + i * ticksInDay);

            ar[i] = {
                date: daysOfWeek[i] // + ", " + day.getDate() + " " + months[day.getMonth()] + " " + day.getFullYear() + " г."
            };
        }

        self.weekDayDates(ar);
    };

    self.showError = function (msg) {
        $.jGrowl("<b><span style='color: #f00;'>" + msg + "</span></b>", { header: "<b><span style='color: #f00;'>Ошибка</span></b>", position: "center" });
    };

    // push 7 days from current day 
    this.backWeek = function () {
        self.currentDay().setDate(self.currentDay().getDate() - 7);

        self.updateWeekDays();

        self.loadData({
            address: "schedule/get",
            params: { 'groupId': self.currentGroup() },
            onsuccess: function (data) {
                applySchedule(data);
            },
            onerror: function (x, h, r) {
            }
        });
    };

    // add 7 days to current day
    self.forwardWeek = function () {
        self.currentDay().setDate(self.currentDay().getDate() + 7);

        self.updateWeekDays();

        self.loadData({
            address: "schedule/get",
            params: { 'groupId': self.currentGroup() },
            onsuccess: function (data) {
                applySchedule(data);
            },
            onerror: function (x, h, r) {
            }
        });
    };

    // set current day today
    self.todayWeek = function () {
        self.currentDay(new Date());

        self.updateWeekDays();
    };

    self.loadData = function (arg) {
        ko.dependentObservable(function () {

            self.isLoading(true);

            $.ajax({
                type: 'GET',
                url: '/api/v1.0/' + arg.address,
                data: arg.params,
                success: function (data) {
                    if (arg.onbefore !== undefined)
                        arg.onbefore();

                    if (arg.obj !== undefined) {
                        arg.obj([]);
                        $.each(data, function (index, item) {

                            arg.obj.push(item);

                        });
                    }

                    if (arg.onsuccess !== undefined)
                        arg.onsuccess(data);

                    self.isLoading(false);
                },
                error: function (x, h, r) {
                    if (arg.onerror !== undefined)
                        arg.onerror(x, h, r);
                    else
                        self.showError("Возникла ошибка!");

                    self.isLoading(false);
                }
            });

            if (arg.after !== undefined)
                arg.after();

        }, this);
    };

    self.sendData = function (arg) {

        self.isLoading(true);

        if (arg.onbefore !== undefined)
            arg.onbefore(obj);

        $.ajax({
            type: 'POST',
            url: '/api/v1.0/' + arg.address,
            data: arg.params,
            success: function (data) {

                if (arg.onsuccess !== undefined)
                    arg.onsuccess(data);

                self.isLoading(false);
            },
            error: function () {
                if (arg.onerror !== undefined)
                    arg.onerror(x, h, r);
                else
                    self.showError("Возникла ошибка!");

                self.isLoading(false);
            }
        });
    };

    self.deleteData = function (arg) {
        self.isLoading(true);

        if (arg.onbefore !== undefined)
            arg.onbefore(obj);

        $.ajax({
            type: 'Delete',
            url: '/api/v1.0/' + arg.address,
            data: arg.params,
            success: function () {

                if (arg.onsuccess !== undefined)
                    arg.onsuccess();

                self.isLoading(false);
            },
            error: function () {
                if (arg.onerror !== undefined)
                    arg.onerror(x, h, r);
                else
                    self.showError("Возникла ошибка!");

                self.isLoading(false);
            }
        });
    };

    self.deselectAll = function () {
        if (document.selection) {
            document.selection.empty();
        } else if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    };

    self.depPlan = ko.observableArray([]);


    self.weektypes = ko.observableArray([]);
    self.currentWeekType = ko.observable();
    self.currentStartDate = ko.observable();
    self.currentEndDate = ko.observable();


    self.HeadLecturer = ko.observable("");
    self.HeadUnsTutorial = ko.observable("");
    self.HeadGroups = ko.observable("");
    self.HeadCourses = ko.observable("");
    self.HeadSpecialities = ko.observable("");
    self.HeadFaculty = ko.observable("");
    self.HeadBuilding = ko.observable("");
    self.HeadTutorial = ko.observable("");
    self.HeadTutorialType = ko.observable("");
    self.HeadAuditorium = ko.observable("");
    self.HeadWeekType = ko.observable("");

    self.init = function () {

        //var scheduleHelper = new scheduleHelperViewModel();
        //scheduleHelper.al();
       
        var localThis = this;

        self.isCheckTime(isCheckTime_tmp);

        if (self.hasHash()) {
            self.hashCommandHadler.call(this, window.location);
        }

        $(window).bind('hashchange', function (obj) {
            self.hashCommandHadler.call(localThis, obj.currentTarget.location);
        });


        //загрузка факультетов
        self.loadData({
            address: "faculty/getall",
            obj: self.faculties,
            
        });


        //загрузка курсов
        self.loadData({
            address: "course/getall",
            obj: self.courses,
            onsuccess: function () {
      
            }
        });

        for (var i = 0; i < 6; i++) {
            for (var j = 0; j < 30; j++) {
                days1[i][j] = {
                    FirstScheduleInfo: "",
                    FirstAuditorium: "",
                    FirstStartDate: "",
                    FirstEndDate: "",
                    FirstLecturer: "",
                    FirstTutorialTypeName: "",
                    FirstId: -1,
                    FirstTutorialName: "",
                    FirstStreamCollision: "",
                    FirstLecturerCollision: "",
                    FirstAuditoriumCollision: "",
                    FirstGroups: "",
                    FirstCourses: "",
                    FirstFaculty: "",

                    FirstAuditoriumId: "",
                    FirstTutorialTypeId: "",
                    FirstGroupsIds: "",
                    FirstLecturerId: "",
                    FirstFacultyId: "",

                    SecondScheduleInfo: "",
                    SecondAuditorium: "",
                    SecondStartDate: "",
                    SecondEndDate: "",
                    SecondLecturer: "",
                    SecondTutorialTypeName: "",
                    SecondId: -1,
                    SecondTutorialName: "",
                    SecondStreamCollision: "",
                    SecondLecturerCollision: "",
                    SecondAuditoriumCollision: "",
                    SecondGroups: "",
                    SecondCourses: "",
                    SecondFaculty: "",

                    SecondAuditoriumId: "",
                    SecondTutorialTypeId: "",
                    SecondGroupsIds: "",
                    SecondLecturerId: "",
                    SecondFacultyId: "",

                    ThirdScheduleInfo: "",
                    ThirdAuditorium: "",
                    ThirdStartDate: "",
                    ThirdEndDate: "",
                    ThirdLecturer: "",
                    ThirdTutorialTypeName: "",
                    ThirdId: -1,
                    ThirdTutorialName: "",
                    ThirdStreamCollision: "",
                    ThirdLecturerCollision: "",
                    ThirdAuditoriumCollision: "",
                    ThirdGroups: "",
                    ThirdCourses: "",
                    ThirdFaculty: "",

                    ThirdAuditoriumId: "",
                    ThirdTutorialTypeId: "",
                    ThirdGroupsIds: "",
                    ThirdLecturerId: "",
                    ThirdFacultyId: ""
                }
            }
        }
        self.schedule(days1);

        
        //Загрузка зданий
        self.loadData({
            address: "building/getall/",
            obj: self.buildings,
            onsuccess: function () {

            }
        });

        //Загрузка типов недель
        self.loadData({
            address: "weektype/getall/",
            obj: self.weektypes,
            onsuccess: function () {
                self.currentWeekType(self.weektypes()[2]);
            }
        });
    };

    //загрузка временных интервалов
    self.loadTimes = function (buildingId) {
        if (buildingId !== undefined) {
            self.loadData({
                address: "time/getallforbuilding",
                obj: self.times,
                params: {
                    buildingid: buildingId
                },
                onsucces: function () {
                    
                }
            });
        }
    }

    self.currentScheduleInfo = ko.observable();

    self.times.subscribe(function (newValue) {
        for (var i = 0; i < newValue.length; ++i) {
            ind_inv[newValue[i].Id - 1] = i;
            ind[i] = newValue[i].Id - 1;
        }
    });


    self.showBlock1 = ko.observable(1);
    self.showBlock2 = ko.observable(0);


    self.UnsTutorials = ko.observableArray([]);
    self.currentUnsTutorial = ko.observable();

    //загрузка специальностей
    self.loadSpecialities = function (facultyId) {
        if (facultyId !== undefined) {
            self.loadData({
                address: "speciality/Getbyfaculty/",
                params: {
                    facultyid: facultyId
                },
                obj: self.specialities1
            });
        } else {
            //self.showError("Выберите факультет");
        }
    }

    //загрузка групп
    self.loadGroups = function (facultyId, courseIds, specialityIds) {
        if (facultyId !== undefined) {
            self.loadData({
                address: "group/get/",
                obj: self.groups1,
                params: {
                    facultyid: facultyId,
                    courseids: courseIds,
                    specialityids: specialityIds
                },
                onsuccess: function () {
                }
            });
        } else {
            //self.showError("Выберите факультет");
        }
    }



    self.currentWeekType.subscribe(function (newValue) {
        self.HeadWeekType("");
        if (newValue !== undefined) {

         
            if (self.screenStack().length <= 1) {
                if (self.currentFaculty() !== undefined) {
                    //self.loadScheduledTutorialsForGroup(self.currentFaculty().Id, courseIds, specialityIds, groupIds);
                    if (self.currentScheduleInfo() !== undefined) {
                        self.loadScheduledTutorialsForGroup(self.currentFaculty().Id, courseIds, specialityIds, groupIds, self.currentScheduleInfo().Id,
                        -1, newValue.Id, CutId);
                    }
                }
            } else {
                var currentScreen = self.screenStack()[self.screenStack().length - 1];
                if (currentScreen.ThirdWeekTypeId !== "") {
                    self.loadScheduledTutorialsForGroup(currentScreen.ThirdFacultyId, "", "", currentScreen.ThirdGroupsIds, currentScreen.ThirdScheduleInfoId,
                        -1, newValue.Id, currentScreen.CutId);
                }
                if (currentScreen.FirstWeekTypeId !== "") {
                    self.loadScheduledTutorialsForGroup(currentScreen.FirstFacultyId, "", "", currentScreen.FirstGroupsIds, currentScreen.FirstScheduleInfoId,
                        -1, newValue.Id, currentScreen.CutId);
                } else {
                    if (currentScreen.SecondWeekTypeId !== "") {
                        self.loadScheduledTutorialsForGroup(currentScreen.SecondFacultyId, "", "", currentScreen.SecondGroupsIds, currentScreen.SecondScheduleInfoId,
                            -1, newValue.Id, currentScreen.CutId);
                    }
                }
            }
        }
    });


    self.loadFreeAuditoriums = function (facultyId, buildingId, periodId, dayOfWeek) {
        if (facultyId !== undefined) {
            self.loadData({
                address: "auditorium/getfreeauditoriums",
                obj: self.auditoriums1,
                params: {
                    facultyid: facultyId,
                    tutorialtypeid: self.currentScheduleInfo().TutorialType,
                    tutorialid: self.currentScheduleInfo().TutorialId,
                    periodid: periodId,
                    dayofweek: dayOfWeek,
                    startdate: "",
                    enddate: "",
                    buildingid: buildingId,
                    weektypeid: self.currentWeekType().Id,
                    courseids: courseIds,
                    specialityids: specialityIds,
                    groupids: groupIds

                },
                onsuccess: function () {
                    if (self.auditoriums1().length == 0) {
                        if (self.currentFaculty() !== undefined) {

                            self.currentAuditorium1(undefined);
                            //self.loadScheduledTutorialsForGroup(self.currentFaculty().Id, courseIds, specialityIds, groupIds);
                            if (self.screenStack().length <= 1) {
                                if (self.currentScheduleInfo() !== undefined
                                    && self.currentWeekType() !== undefined) {
                                    self.loadScheduledTutorialsForGroup(self.currentFaculty().Id, courseIds, specialityIds, groupIds, self.currentScheduleInfo().Id,
                                    -1, self.currentWeekType().Id, CutId);
                                }
                            }
                        } else {
                            alert("!!!!!!!");
                            var currentScreen = self.screenStack()[self.screenStack().length - 1];
                            if (currentScreen.ThirdWeekTypeId !== "") {
                                self.loadScheduledTutorialsForGroup(currentScreen.ThirdFacultyId, "", "", currentScreen.ThirdGroupsIds, currentScreen.ThirdScheduleInfoId,
                                    -1, newValue.Id, currentScreen.CutId);
                            }
                            if (currentScreen.FirstWeekTypeId !== "") {
                                self.loadScheduledTutorialsForGroup(currentScreen.FirstFacultyId, "", "", currentScreen.FirstGroupsIds, currentScreen.FirstScheduleInfoId,
                                    -1, newValue.Id, currentScreen.CutId);
                            } else {
                                if (currentScreen.SecondWeekTypeId !== "") {
                                    self.loadScheduledTutorialsForGroup(currentScreen.SecondFacultyId, "", "", currentScreen.SecondGroupsIds, currentScreen.SecondScheduleInfoId,
                                        -1, newValue.Id, currentScreen.CutId);
                                }
                            }
                        }
                    }
                }
            });
        }
    }

   
    self.currentBuilding.subscribe(function (newValue) {
        self.HeadBuilding("");
        if (newValue !== undefined) {
            self.loadTimes(newValue.Id);
            self.HeadBuilding(newValue.Name);
            self.loadFreeAuditoriums(self.currentFaculty().Id, newValue.Id, 1, 1);
        }
    });

    self.cuts = ko.observableArray(["Поток", "Преподаватель", "Аудитория"]);

    self.currentCuts = ko.observableArray([]);
    var CutId = 0;
    var CutLecturer = "Преподаватель";
    var CutAuditorium = "Аудитория";


    self.currentAuditorium1.subscribe(function (newValue) {
        self.HeadAuditorium("");
       // alert("*");
        if (newValue !== undefined) {
            self.currentAuditoriumId(newValue.AuditoriumId);
           // alert("***");
            self.HeadAuditorium(newValue.Auditorium);
            if (CutId == 7 || CutId == 8 || CutId == 10 || CutId == 11) {
                //alert("***)");
                if (self.currentFaculty() !== undefined) {
                    //self.loadScheduledTutorialsForGroup(self.currentFaculty().Id, courseIds, specialityIds, groupIds);
                    if (self.screenStack().length <= 1) {
                        if (self.currentScheduleInfo() !== undefined
                            && self.currentWeekType() !== undefined) {
                            self.loadScheduledTutorialsForGroup(self.currentFaculty().Id, courseIds, specialityIds, groupIds, self.currentScheduleInfo().Id,
                            -1, self.currentWeekType().Id, CutId);
                        } else {
                            //alert("^^^^^^^^^^^^");
                            var currentScreen = self.screenStack()[self.screenStack().length - 1];
                            if (currentScreen.ThirdWeekTypeId !== "") {
                                self.loadScheduledTutorialsForGroup(currentScreen.ThirdFacultyId, "", "", currentScreen.ThirdGroupsIds, currentScreen.ThirdScheduleInfoId,
                                    -1, currentScreen.ThirdWeekTypeId, CutId);
                            }
                            if (currentScreen.FirstWeekTypeId !== "") {
                                self.loadScheduledTutorialsForGroup(currentScreen.FirstFacultyId, "", "", currentScreen.FirstGroupsIds, currentScreen.FirstScheduleInfoId,
                                    -1, currentScreen.FirstWeekTypeId, CutId);
                            } else {
                                if (currentScreen.SecondWeekTypeId !== "") {
                                    self.loadScheduledTutorialsForGroup(currentScreen.SecondFacultyId, "", "", currentScreen.SecondGroupsIds, currentScreen.SecondScheduleInfoId,
                                        -1, currentScreen.SecondWeekTypeId, CutId);
                                }
                            }
                        }
                    }
                }
            } else {
                //alert("***))");
                if (self.currentFaculty() !== undefined) {
                    CutId += 7;
                    //alert("&&&&&&&&&&&&&");
                    //self.loadScheduledTutorialsForGroup(self.currentFaculty().Id, courseIds, specialityIds, groupIds);
                    if (self.screenStack().length <= 1) {
                        if (self.currentScheduleInfo() !== undefined
                            && self.currentWeekType() !== undefined) {
                            self.loadScheduledTutorialsForGroup(self.currentFaculty().Id, courseIds, specialityIds, groupIds, self.currentScheduleInfo().Id,
                            -1, self.currentWeekType().Id, CutId);
                        }
                    } else {
               
                        var currentScreen = self.screenStack()[self.screenStack().length - 1];
                        if (currentScreen.ThirdWeekTypeId !== "") {
                            self.loadScheduledTutorialsForGroup(currentScreen.ThirdFacultyId, "", "", currentScreen.ThirdGroupsIds, currentScreen.ThirdScheduleInfoId,
                                -1, currentScreen.ThirdWeekTypeId, CutId);
                        }
                        if (currentScreen.FirstWeekTypeId !== "") {
                            self.loadScheduledTutorialsForGroup(currentScreen.FirstFacultyId, "", "", currentScreen.FirstGroupsIds, currentScreen.FirstScheduleInfoId,
                                -1, currentScreen.FirstWeekTypeId, CutId);
                        } else {
                            if (currentScreen.SecondWeekTypeId !== "") {
                                self.loadScheduledTutorialsForGroup(currentScreen.SecondFacultyId, "", "", currentScreen.SecondGroupsIds, currentScreen.SecondScheduleInfoId,
                                    -1, currentScreen.SecondWeekTypeId, CutId);
                            }
                        }
                    }
                }
            }
        }
    });

    

    self.currentCuts.subscribe(function (newValue) {
        CutId = 0;
        if (newValue !== undefined) {
            if (self.currentFaculty() !== undefined) {
                for (var i = 0; i < newValue.length; ++i) {
                    if (newValue[i] == "Поток") {
                        CutId += 1;
                    }
                    if (newValue[i] == "Преподаватель") {
                        CutId += 3;
                    }
                    if (newValue[i] == "Аудитория") {
                        CutId += 7;
                    }
                }

                //self.loadScheduledTutorialsForGroup(self.currentFaculty().Id, courseIds, specialityIds, groupIds);
                if (self.screenStack().length <= 1) {
                    if (self.currentScheduleInfo().Id !== undefined
                        && self.currentWeekType() !== undefined) {
                        self.loadScheduledTutorialsForGroup(self.currentFaculty().Id, courseIds, specialityIds, groupIds, self.currentScheduleInfo().Id,
                        -1, self.currentWeekType().Id, CutId);
                    }
                } else {
                  
                    var currentScreen = self.screenStack()[self.screenStack().length - 1];
                    if (currentScreen.ThirdWeekTypeId !== "") {
                        self.loadScheduledTutorialsForGroup(currentScreen.ThirdFacultyId, "", "", currentScreen.ThirdGroupsIds, currentScreen.ThirdScheduleInfoId,
                            -1, currentScreen.ThirdWeekTypeId, CutId);
                    }
                    if (currentScreen.FirstWeekTypeId !== "") {
                        self.loadScheduledTutorialsForGroup(currentScreen.FirstFacultyId, "", "", currentScreen.FirstGroupsIds, currentScreen.FirstScheduleInfoId,
                            -1, currentScreen.FirstWeekTypeId, CutId);
                    } else {
                        if (currentScreen.SecondWeekTypeId !== "") {
                            self.loadScheduledTutorialsForGroup(currentScreen.SecondFacultyId, "", "", currentScreen.SecondGroupsIds, currentScreen.SecondScheduleInfoId,
                                -1, currentScreen.SecondWeekTypeId, CutId);
                        }
                    }


                }
            }
        }
    });

   

    var courseIds = "";
    var specialityIds = "";
    var groupIds = "";

    //загрузка групп при изменении курса
    self.currentCourses = ko.observableArray([]);
    self.currentCourses.subscribe(function (newValue) {
        self.HeadCourses("");
        self.HeadGroups("");
        if ((newValue + "") == "") {

            courseIds = "";
            groupIds = "";
            if (self.currentFaculty() !== undefined) {
                self.loadGroups(self.currentFaculty().Id, courseIds, specialityIds);
                //self.loadUscheduledTutorialsForGroupV2(self.currentFaculty().Id, courseIds, "", groupIds);
            }
            return;

        }

        courseIds = "";
        groupIds = "";

        var tmp = "";
        if (newValue !== undefined) {
            
            if (self.currentFaculty() !== undefined && self.currentCourses() !== undefined) {

                for (var i = 0; i < self.currentCourses().length; i++) {
                    if (self.currentCourses()[i] !== undefined) {
                        courseIds += self.currentCourses()[i].Id + ", ";
                        tmp += self.currentCourses()[i].Id + " ";
                    }
                }

                self.HeadCourses(tmp);

                self.loadGroups(self.currentFaculty().Id, courseIds, specialityIds);
                self.loadUscheduledTutorialsForCourse(self.currentFaculty().Id, courseIds);
                //self.loadUscheduledTutorialsForGroupV2(self.currentFaculty().Id, courseIds, "", groupIds);
            }
        }
    });

    //загрузка специальностей при выборе факультета, загрузка групп при выборе факультета и выбранном курсе
    self.currentFaculty.subscribe(function (newValue) {
        self.HeadFaculty("");
        self.HeadCourses("");
        self.HeadGroups("");
        if (newValue !== undefined) {
            self.HeadFaculty(newValue.Name);
            courseIds = "";
            specialityIds = "";
            groupIds = "";

            self.loadData({
                address: "course/getall",
                obj: self.courses,
            });

            self.loadSpecialities(newValue.Id);
            self.loadUscheduledTutorialsForFaculty(newValue.Id);
            //self.loadGroups(newValue.Id, courseIds, specialityIds);
            
        }

    });


    //Обновление текущей спецальности
    self.currentSpeciality1.subscribe(function (newValue) {
        self.HeadGroups("");
        if ((newValue + "") == "") {
            specialityIds = "";
            groupIds = "";

            if (self.currentFaculty() !== undefined) {
                self.loadGroups(self.currentFaculty().Id, courseIds, specialityIds);
                //self.loadUscheduledTutorialsForGroupV2(self.currentFaculty().Id, courseIds, "", groupIds);
            }
            return;
        }
        if (newValue !== undefined) {
            specialityIds = "";
            groupIds = "";

            if (self.currentFaculty() !== undefined && self.currentSpeciality1() !== undefined) {
                for (var i = 0; i < self.currentSpeciality1().length; i++) {
                    if (self.currentSpeciality1()[i] !== undefined) {
                        specialityIds += self.currentSpeciality1()[i].Id + ", ";
                    }
                }
                self.loadGroups(self.currentFaculty().Id, courseIds, specialityIds);
                self.loadUscheduledTutorialsForSpeciality(self.currentFaculty().Id, courseIds, specialityIds);
                //self.loadUscheduledTutorialsForGroupV2(self.currentFaculty().Id, courseIds, "", groupIds);
            }
        }
    });

    
    self.SchTutorials = ko.observableArray([]);
    self.currentSchTutorial = ko.observable();
    //загрузка незапланированных предметов для группы
    self.currentAuditoriumId = ko.observable();
    self.loadScheduledTutorialsForGroup = function (facultyId, courseIds, specialityIds, groupIds, scheduleInfoId, auditoriumId, weekTypeId, CurId) {
       
        if (facultyId !== undefined) {
            if (auditoriumId == -1)
                if (self.currentAuditoriumId() !== undefined) {
                    auditoriumId = self.currentAuditoriumId();
                }


            self.loadData({
                address: "schedule/getforgroup/",
                obj: self.SchTutorials,
                params: {
                    curid: CurId,
                    scheduleinfoid: scheduleInfoId,
                    auditoriumid: auditoriumId,
                    facultyid: facultyId,
                    startdate: "",
                    enddate: "",
                    weektype: weekTypeId,
                    courseids: courseIds,
                    specialityids: specialityIds,
                    groupids: groupIds
                },
                onsuccess: function (data) {
                    self.ApplySchedule(data);
                }
            });
        }
    }


    //загрузка незапланированных предметов для специальности
    self.loadUscheduledTutorialsForSpeciality = function (facultyId, courseIds, specialityIds) {

        if (facultyId !== undefined) {

            self.loadData({
                address: "scheduleinfo/GetScheduleInfoForSpeciality/",
                params: {
                    facultyid: facultyId,
                    courseids: courseIds,
                    specialityids: specialityIds
                },
                onsuccess: function (data) {
                    self.ApplyTable(data);
                }
            });
        }
    }

    //загрузка незапланированных предметов для группы
    self.loadUscheduledTutorialsForGroup = function (facultyId, courseIds, specialityIds, groupIds) {
       
        if (facultyId !== undefined) {

            self.loadData({
                address: "scheduleinfo/GetScheduleInfoForGroup/",
                params: {
                    facultyid: facultyId,
                    groupids: groupIds
                },
                onsuccess: function (data) {
                    self.ApplyTable(data);
                }
            });
        }
    }

    //загрузка незапланированных предметов для факультета
    self.loadUscheduledTutorialsForFaculty = function (facultyId) {

        if (facultyId !== undefined) {

            self.loadData({
                address: "scheduleinfo/GetScheduleInfoForFaculty/",
                params: {
                    facultyid: facultyId
                },
                onsuccess: function (data) {
                    self.ApplyTable(data);
                }
            });
        }
    }

    //загрузка незапланированных предметов для курсов
    self.loadUscheduledTutorialsForCourse = function (facultyId, courseIds) {

        if (facultyId !== undefined) {

            self.loadData({
                address: "scheduleinfo/GetScheduleInfoForCourse/",
                params: {
                    facultyid: facultyId,
                    courseids: courseIds
                },
                onsuccess: function (data) {
                    self.ApplyTable(data);
                }
            });
        }
    }

 
    

    self.currentGroup1.subscribe(function (newValue) {
        self.HeadGroups("");
        if ((newValue + "") == "") {
            groupIds = "";
            if (self.currentFaculty() !== undefined) {

            }
            return;
        }

        var tmp = "";
        if (newValue !== undefined) {
            groupIds = "";
            if (self.currentFaculty() !== undefined && self.currentGroup1() !== undefined) {
                for (var i = 0; i < self.currentGroup1().length; i++) {
                    if (self.currentGroup1()[i] !== undefined) {
                        groupIds += self.currentGroup1()[i].Id + ", ";
                        tmp += self.currentGroup1()[i].Code + " ";
                    }
                }
            }

            self.HeadGroups(tmp);
       
            self.loadUscheduledTutorialsForGroup(self.currentFaculty().Id, courseIds, "", groupIds);
    
        }
    });

    //Текущий html элемент под курсором
    self.setCurrentElement = function (val) {
        currentElement = val;
    }


    self.screenStack = ko.observableArray([]);
    var currentScreen = "";

    
    //Interface
    //Обновление выбраной клетки
    self.Select = function (row, column) {
        if (self.changeState()) {
            self.addFromTableButton(self.changeRow(), self.changeCol(), row, column);
            self.delFormTableButton(self.changeRow(), self.changeCol());
            self.changeState(false);
        }
        if (self.copyState()) {
            self.addFromTableButton(self.changeRow(), self.changeCol(), row, column);
            self.copyState(false);
        }
        if (self.swapState()) {
            self.swapFromTableButton(self.changeRow(), self.changeCol(), row, column);
            self.swapState(false);
        }
 
        /*alert(": " + self.schedule()[column][row].FirstScheduleInfo + " " +
              self.schedule()[column][row].SecondScheduleInfo + " " +
              self.schedule()[column][row].ThirdScheduleInfo + " ");*/
        
        self.Row(row);
        self.Col(column);

       
        //self.showBlock1(0);
        //self.showBlock2(1);
       //self.PushScreen(row, column);
    };

    self.PushScreen = function (row, column, state) {

        /*
        if (self.schedule()[column][row].FirstId == -1 &&
          self.schedule()[column][row].SecondId == -1 &&
          self.schedule()[column][row].ThirdId == -1){
            self.showError("Пустая клетка");
            return;
        }*/
       

        var currentScreen = {
            FirstId: -1,
            FirstScheduleInfoId: "",
            FirstFacultyId: "",
            FirstLecturerId: "",
            FirstAuditoriumId: "",
            FirstTutorialTypeId: "",
            FirstGroupsIds: "",
            FirstWeekTypeId: "",

            FirstTutorialName: "",
            FirstLecturer: "",
            FirstAuditorium: "",
            FirstTutorialTypeName: "",

            SecondId: -1,
            SecondScheduleInfoId: "",
            SecondFacultyId: "",
            SecondLecturerId: "",
            SecondAuditoriumId: "",
            SecondTutorialTypeId: "",
            SecondGroupsIds: "",
            SecondWeekTypeId: "",

            SecondTutorialName: "",
            SecondLecturer: "",
            SecondAuditorium: "",
            SecondTutorialTypeName: "",

            ThirdId: -1,
            ThirdScheduleInfoId: "",
            ThirdFacultyId: "",
            ThirdLecturerId: "",
            ThirdAuditoriumId: "",
            ThirdTutorialTypeId: "",
            ThirdGroupsIds: "",
            ThirdWeekTypeId: "",

            ThirdTutorialName: "",
            ThirdLecturer: "",
            ThirdAuditorium: "",
            ThirdTutorialTypeName: "",

            BuildingId: "",
            CutId: "",
        };


        //alert(":::" + self.schedule()[column][row].ThirdGroupsIds);
    
        if (self.screenStack().length == 0) {
            currentScreen.BuildingId = self.currentBuilding().Id;
            currentScreen.CutId = CutId;

            if (self.currentWeekType().Id == 1) {
                currentScreen.FirstId = -2;
                currentScreen.FirstScheduleInfoId = self.Table()[self.Row1()].Id;
                currentScreen.FirstFacultyId = self.currentFaculty().Id;
                currentScreen.FirstLecturerId = self.Table()[self.Row1()].LecturerId;

                if (self.currentAuditorium1() !== undefined) {
                    currentScreen.FirstAuditoriumId = self.currentAuditorium1().AuditoriumId;
                }

                currentScreen.FirstTutorialTypeId = self.Table()[self.Row1()].TutorialType;
                currentScreen.FirstGroupsIds = groupIds;
                currentScreen.FirstWeekTypeId = 1;

                currentScreen.FirstTutorialName = self.Table()[self.Row1()].Tutorial;
                currentScreen.FirstLecturer = self.Table()[self.Row1()].Lecturer;
                currentScreen.FirstAuditorium = self.Table()[self.Row1()].Auditorium;

                if(self.currentFaculty() !== undefined)
                    currentScreen.FirstFaculty = self.currentFaculty().Name;
                currentScreen.FirstCourses = self.Table()[self.Row1()].Courses;
                currentScreen.FirstGroups = self.Table()[self.Row1()].Groups;

                if(self.Table()[self.Row1()].TutorialType == 1)
                    currentScreen.FirstTutorialTypeName = "Лек.";
                if(self.Table()[self.Row1()].TutorialType == 2)
                    currentScreen.FirstTutorialTypeName = "Пр.";
                if(self.Table()[self.Row1()].TutorialType == 3)
                    currentScreen.FirstTutorialTypeName = "Лаб.";
            }

            if (self.currentWeekType().Id == 2) {
                currentScreen.SecondId = -2;
                currentScreen.SecondScheduleInfoId = self.Table()[self.Row1()].Id;
                currentScreen.SecondFacultyId = self.currentFaculty().Id;
                currentScreen.SecondLecturerId = self.Table()[self.Row1()].LecturerId;
                if (self.currentAuditorium1() !== undefined) {
                    currentScreen.SecondAuditoriumId = self.currentAuditorium1().AuditoriumId;
                }
                currentScreen.SecondTutorialTypeId = self.Table()[self.Row1()].TutorialType;
                currentScreen.SecondGroupsIds = groupIds;
                currentScreen.SecondWeekTypeId = 2;

                currentScreen.SecondTutorialName = self.Table()[self.Row1()].Tutorial;
                currentScreen.SecondLecturer = self.Table()[self.Row1()].Lecturer;
                currentScreen.SecondAuditorium = self.Table()[self.Row1()].Auditorium;

                if (self.currentFaculty() !== undefined)
                    currentScreen.SecondFaculty = self.currentFaculty().Name;
                currentScreen.SecondCourses = self.Table()[self.Row1()].Courses;
                currentScreen.SecondGroups = self.Table()[self.Row1()].Groups;

                if (self.Table()[self.Row1()].TutorialType == 1)
                    currentScreen.SecondTutorialTypeName = "Лек.";
                if (self.Table()[self.Row1()].TutorialType == 2)
                    currentScreen.SecondTutorialTypeName = "Пр.";
                if (self.Table()[self.Row1()].TutorialType == 3)
                    currentScreen.SecondTutorialTypeName = "Лаб.";
            }

            if (self.currentWeekType().Id == 3) {
                currentScreen.ThirdId = -2;
                currentScreen.ThirdScheduleInfoId = self.Table()[self.Row1()].Id;
                currentScreen.ThirdFacultyId = self.currentFaculty().Id;
                currentScreen.ThirdLecturerId = self.Table()[self.Row1()].LecturerId;
                if (self.currentAuditorium1() !== undefined) {
                    currentScreen.ThirdAuditoriumId = self.currentAuditorium1().AuditoriumId;
                }
                currentScreen.ThirdTutorialTypeId = self.Table()[self.Row1()].TutorialType;
                currentScreen.ThirdGroupsIds = groupIds;
                currentScreen.ThirdWeekTypeId = 3;

                currentScreen.ThirdTutorialName = self.Table()[self.Row1()].Tutorial;
                currentScreen.ThirdLecturer = self.Table()[self.Row1()].Lecturer;
                currentScreen.ThirdAuditorium = self.Table()[self.Row1()].Auditorium;

                if (self.currentFaculty() !== undefined)
                    currentScreen.ThirdFaculty = self.currentFaculty().Name;
                currentScreen.ThirdCourses = self.Table()[self.Row1()].Courses;
                currentScreen.ThirdGroups = self.Table()[self.Row1()].Groups;

                if (self.Table()[self.Row1()].TutorialType == 1)
                    currentScreen.ThirdTutorialTypeName = "Лек.";
                if (self.Table()[self.Row1()].TutorialType == 2)
                    currentScreen.ThirdTutorialTypeName = "Пр.";
                if (self.Table()[self.Row1()].TutorialType == 3)
                    currentScreen.ThirdTutorialTypeName = "Лаб.";
            }

            //alert("fid: " + currentScreen.FirstId + "sid: " + currentScreen.SecondId + "tid: " + currentScreen.ThirdId);

            //alert("11311");
            /*
            alert(" FirstScheduleInfoId: " + currentScreen.FirstScheduleInfoId +
            " FirstFacultyId: " + currentScreen.FirstFacultyId +
            " FirstLecturerId: " + currentScreen.FirstLecturerId +
            " FirstAuditoriumId: " + currentScreen.FirstAuditoriumId +
            " FirstTutorialTypeId: " + currentScreen.FirstTutorialTypeId +
            " FirstGroupsIds: " + currentScreen.FirstGroupsIds +
            " FirstWeekTypeId: " + currentScreen.FirstWeekTypeId);

            alert(" SecondScheduleInfoId: " + currentScreen.SecondScheduleInfoId +
            " SecondFacultyId: " + currentScreen.SecondFacultyId +
            " SecondLecturerId: " + currentScreen.SecondLecturerId +
            " SecondAuditoriumId: " + currentScreen.SecondAuditoriumId +
            " SecondTutorialTypeId: " + currentScreen.SecondTutorialTypeId +
            " SecondGroupsIds: " + currentScreen.SecondGroupsIds +
            " SecondWeekTypeId: " + currentScreen.SecondWeekTypeId);

            alert(" ThirdScheduleInfoId: " + currentScreen.ThirdScheduleInfoId +
                  " ThirdFacultyId: " + currentScreen.ThirdFacultyId +
                  " ThirdLecturerId: " + currentScreen.ThirdLecturerId +
                  " ThirdAuditoriumId: " + currentScreen.ThirdAuditoriumId +
                  " ThirdTutorialTypeId: " + currentScreen.ThirdTutorialTypeId +
                  " ThirdGroupsIds: " + currentScreen.ThirdGroupsIds +
                  " ThirdWeekTypeId: " + currentScreen.ThirdWeekTypeId);*/

          
            //self.loadScheduledTutorialsForGroup(currentScreen.ThirdFacultyId, "", "", currentScreen.ThirdGroupsIds, currentScreen.ThirdScheduleInfoId,
            //-1, currentScreen.ThirdWeekTypeId, currentScreen.CutId);


            self.screenStack.push(currentScreen);
        }

        if (state) {
            var currentScreen = {
                FirstId: -1,
                FirstScheduleInfoId: "",
                FirstFacultyId: "",
                FirstLecturerId: "",
                FirstAuditoriumId: "",
                FirstTutorialTypeId: "",
                FirstGroupsIds: "",
                FirstWeekTypeId: "",

                FirstTutorialName: "",
                FirstLecturer: "",
                FirstAuditorium: "",
                FirstTutorialTypeName: "",

                SecondId: -1,
                SecondScheduleInfoId: "",
                SecondFacultyId: "",
                SecondLecturerId: "",
                SecondAuditoriumId: "",
                SecondTutorialTypeId: "",
                SecondGroupsIds: "",
                SecondWeekTypeId: "",

                SecondTutorialName: "",
                SecondLecturer: "",
                SecondAuditorium: "",
                SecondTutorialTypeName: "",

                ThirdId: -1,
                ThirdScheduleInfoId: "",
                ThirdFacultyId: "",
                ThirdLecturerId: "",
                ThirdAuditoriumId: "",
                ThirdTutorialTypeId: "",
                ThirdGroupsIds: "",
                ThirdWeekTypeId: "",

                ThirdTutorialName: "",
                ThirdLecturer: "",
                ThirdAuditorium: "",
                ThirdTutorialTypeName: "",

                BuildingId: "",
                CutId: "",
            };



            currentScreen.BuildingId = self.currentBuilding().Id;
            currentScreen.CutId = CutId;


            //alert(":" + self.schedule()[column][row].FirstTutorialTypeId);
            //alert(":" + self.schedule()[column][row].SecondTutorialTypeId);
            //alert(":" + self.schedule()[column][row].ThirdTutorialTypeId);

            if (self.schedule()[column][row].FirstId !== -1) {
                currentScreen.FirstId = self.schedule()[column][row].FirstId;
                currentScreen.FirstScheduleInfoId = self.schedule()[column][row].FirstScheduleInfo;
                currentScreen.FirstFacultyId = self.schedule()[column][row].FirstFacultyId;
                currentScreen.FirstLecturerId = self.schedule()[column][row].FirstLecturerId;
                if (self.currentAuditorium1() !== undefined) {
                    currentScreen.FirstAuditoriumId = self.currentAuditorium1().AuditoriumId;
                }
                currentScreen.FirstTutorialTypeId = self.schedule()[column][row].FirstTutorialTypeId;
                currentScreen.FirstGroupsIds = self.schedule()[column][row].FirstGroupsIds;
                currentScreen.FirstWeekTypeId = 1;

                currentScreen.FirstTutorialName = self.schedule()[column][row].FirstTutorialName;
                currentScreen.FirstLecturer = self.schedule()[column][row].FirstLecturer;
                currentScreen.FirstAuditorium = self.schedule()[column][row].FirstAuditorium;

                currentScreen.FirstFaculty = self.schedule()[column][row].FirstFaculty;
                currentScreen.FirstCourses = self.schedule()[column][row].FirstCourses;
                currentScreen.FirstGroups = self.schedule()[column][row].FirstGroups;

                if (self.schedule()[column][row].FirstTutorialTypeId == 1)
                    currentScreen.FirstTutorialTypeName = "Лек.";
                if (self.schedule()[column][row].FirstTutorialTypeId == 2)
                    currentScreen.FirstTutorialTypeName = "Пр.";
                if (self.schedule()[column][row].FirstTutorialTypeId == 3)
                    currentScreen.FirstTutorialTypeName = "Лаб.";
            }
            if (self.schedule()[column][row].SecondId !== -1) {
                currentScreen.SecondId = self.schedule()[column][row].SecondId;
                currentScreen.SecondScheduleInfoId = self.schedule()[column][row].SecondScheduleInfo;
                currentScreen.SecondFacultyId = self.schedule()[column][row].SecondFacultyId;
                currentScreen.SecondLecturerId = self.schedule()[column][row].SecondLecturerId;
                if (self.currentAuditorium1() !== undefined) {
                    currentScreen.SecondAuditoriumId = self.currentAuditorium1().AuditoriumId;
                }
                currentScreen.SecondTutorialTypeId = self.schedule()[column][row].SecondTutorialTypeId;
                currentScreen.SecondGroupsIds = self.schedule()[column][row].SecondGroupsIds;
                currentScreen.SecondWeekTypeId = 2;

                currentScreen.SecondTutorialName = self.schedule()[column][row].SecondTutorialName;
                currentScreen.SecondLecturer = self.schedule()[column][row].SecondLecturer;
                currentScreen.SecondAuditorium = self.schedule()[column][row].SecondAuditorium;

                currentScreen.SecondFaculty = self.schedule()[column][row].SecondFaculty;
                currentScreen.SecondCourses = self.schedule()[column][row].SecondCourses;
                currentScreen.SecondGroups = self.schedule()[column][row].SecondGroups;

                if (self.schedule()[column][row].SecondTutorialTypeId == 1)
                    currentScreen.SecondTutorialTypeName = "Лек.";
                if (self.schedule()[column][row].SecondTutorialTypeId == 2)
                    currentScreen.SecondTutorialTypeName = "Пр.";
                if (self.schedule()[column][row].SecondTutorialTypeId == 3)
                    currentScreen.SecondTutorialTypeName = "Лаб.";
            }
            if (self.schedule()[column][row].ThirdId !== -1) {
                currentScreen.ThirdId = self.schedule()[column][row].ThirdId;
                currentScreen.ThirdScheduleInfoId = self.schedule()[column][row].ThirdScheduleInfo;
                currentScreen.ThirdFacultyId = self.schedule()[column][row].ThirdFacultyId;
                currentScreen.ThirdLecturerId = self.schedule()[column][row].ThirdLecturerId;
                if (self.currentAuditorium1() !== undefined) {
                    currentScreen.ThirdAuditoriumId = self.currentAuditorium1().AuditoriumId;
                }
                currentScreen.ThirdTutorialTypeId = self.schedule()[column][row].ThirdTutorialTypeId;
                currentScreen.ThirdGroupsIds = self.schedule()[column][row].ThirdGroupsIds;
                currentScreen.ThirdWeekTypeId = 3;

                currentScreen.ThirdTutorialName = self.schedule()[column][row].ThirdTutorialName;
                currentScreen.ThirdLecturer = self.schedule()[column][row].ThirdLecturer;
                currentScreen.ThirdAuditorium = self.schedule()[column][row].ThirdAuditorium;

                currentScreen.ThirdFaculty = self.schedule()[column][row].ThirdFaculty;
                currentScreen.ThirdCourses = self.schedule()[column][row].ThirdCourses;
                currentScreen.ThirdGroups = self.schedule()[column][row].ThirdGroups;

                if (self.schedule()[column][row].ThirdTutorialTypeId == 1)
                    currentScreen.ThirdTutorialTypeName = "Лек.";
                if (self.schedule()[column][row].ThirdTutorialTypeId == 2)
                    currentScreen.ThirdTutorialTypeName = "Пр.";
                if (self.schedule()[column][row].ThirdTutorialTypeId == 3)
                    currentScreen.ThirdTutorialTypeName = "Лаб.";
            }

           
            /*alert(" ThirdScheduleInfoId: " + currentScreen.ThirdScheduleInfoId +
                " ThirdFacultyId: " + currentScreen.ThirdFacultyId +
                " ThirdLecturerId: " + currentScreen.ThirdLecturerId +
                " ThirdAuditoriumId: " + currentScreen.ThirdAuditoriumId +
                " ThirdTutorialTypeId: " + currentScreen.ThirdTutorialTypeId +
                " ThirdGroupsIds: " + currentScreen.ThirdGroupsIds +
                " ThirdWeekTypeId: " + currentScreen.ThirdWeekTypeId);*/

            if (currentScreen.ThirdWeekTypeId !== "") {
                // alert("111111 " + currentScreen.CutId);

                self.HeadFaculty(currentScreen.ThirdFaculty);
                self.HeadCourses(currentScreen.ThirdCourses);
                self.HeadLecturer(currentScreen.ThirdLecturer);
                self.HeadTutorial(currentScreen.ThirdTutorialName);
                self.HeadGroups(currentScreen.ThirdGroups);

                self.currentAuditoriumId(currentScreen.ThirdAuditorium);
                self.loadScheduledTutorialsForGroup(currentScreen.ThirdFacultyId, "", "", currentScreen.ThirdGroupsIds, currentScreen.ThirdScheduleInfoId,
                    -1, currentScreen.ThirdWeekTypeId, currentScreen.CutId);
            }
            if (currentScreen.FirstWeekTypeId !== "") {

                self.HeadFaculty(currentScreen.FirstFaculty);
                self.HeadCourses(currentScreen.FirstCourses);
                self.HeadLecturer(currentScreen.FirstLecturer);
                self.HeadTutorial(currentScreen.FirstTutorialName);
                self.HeadGroups(currentScreen.FirstGroups);

                self.currentAuditoriumId(currentScreen.FirstAuditorium);
                self.loadScheduledTutorialsForGroup(currentScreen.FirstFacultyId, "", "", currentScreen.FirstGroupsIds, currentScreen.FirstScheduleInfoId,
                    -1, currentScreen.FirstWeekTypeId, currentScreen.CutId);
            } else {
                if (currentScreen.SecondWeekTypeId !== "") {

                    self.HeadFaculty(currentScreen.SecondFaculty);
                    self.HeadCourses(currentScreen.SecondCourses);
                    self.HeadLecturer(currentScreen.SecondLecturer);
                    self.HeadTutorial(currentScreen.SecondTutorialName);
                    self.HeadGroups(currentScreen.SecondGroups);

                    self.currentAuditoriumId(currentScreen.SecondAuditorium);
                    self.loadScheduledTutorialsForGroup(currentScreen.SecondFacultyId, "", "", currentScreen.SecondGroupsIds, currentScreen.SecondScheduleInfoId,
                        -1, currentScreen.SecondWeekTypeId, currentScreen.CutId);
                }
            }

            //alert("fid: " + currentScreen.FirstId + "sid: " + currentScreen.SecondId + "tid: " + currentScreen.ThirdId);
            //alert("777");


            self.screenStack.push(currentScreen);
        }

    }

   

    self.viewButton = function () {
        if (self.currentFaculty() !== undefined) {
            //CutId = 0;
            self.showBlock1(0);
            self.showBlock2(1);
        }
    }

    self.PopScreen = function (index) {
     
        var size = self.screenStack().length;
   
        
        for (var i = index; i < size; ++i)
            self.screenStack.pop();
       

        if (!self.screenStack().length) {
            self.backButton();
        } else {
            var currentScreen = self.screenStack()[self.screenStack().length - 1];
            if (currentScreen.FirstWeekTypeId !== "") {
                self.HeadFaculty(currentScreen.FirstFaculty);
                self.HeadCourses(currentScreen.FirstCourses);
                self.HeadLecturer(currentScreen.FirstLecturer);
                self.HeadTutorial(currentScreen.FirstTutorialName);
                self.HeadGroups(currentScreen.FirstGroups);
            }
            if (currentScreen.SecondWeekTypeId !== "") {
                self.HeadFaculty(currentScreen.SecondFaculty);
                self.HeadCourses(currentScreen.SecondCourses);
                self.HeadLecturer(currentScreen.SecondLecturer);
                self.HeadTutorial(currentScreen.SecondTutorialName);
                self.HeadGroups(currentScreen.SecondGroups);
            }
            if (currentScreen.ThirdWeekTypeId !== "") {
                self.HeadFaculty(currentScreen.ThirdFaculty);
                self.HeadCourses(currentScreen.ThirdCourses);
                self.HeadLecturer(currentScreen.ThirdLecturer);
                self.HeadTutorial(currentScreen.ThirdTutorialName);
                self.HeadGroups(currentScreen.ThirdGroups);
            }


            if (self.screenStack().length <= 1) {
                if (self.currentScheduleInfo() !== undefined
                                    && self.currentWeekType() !== undefined) {
                    self.loadScheduledTutorialsForGroup(self.currentFaculty().Id, courseIds, specialityIds, groupIds, self.currentScheduleInfo().Id,
                    -1, self.currentWeekType().Id, CutId);
                }
            } else {
              
                if (currentScreen.ThirdWeekTypeId !== "") {
                    //if(currentScreen.ThirdAuditorium !== "")
                        //self.currentAuditoriumId(currentScreen.ThirdAuditorium);
                    self.loadScheduledTutorialsForGroup(currentScreen.ThirdFacultyId, "", "", currentScreen.ThirdGroupsIds, currentScreen.ThirdScheduleInfoId,
                        -1, currentScreen.ThirdWeekTypeId, currentScreen.CutId);
                }
                if (currentScreen.FirstWeekTypeId !== "") {
                    //if (currentScreen.FirstAuditorium !== "")
                       // self.currentAuditoriumId(currentScreen.FirstAuditorium);
                    self.loadScheduledTutorialsForGroup(currentScreen.FirstFacultyId, "", "", currentScreen.FirstGroupsIds, currentScreen.FirstScheduleInfoId,
                        -1, currentScreen.FirstWeekTypeId, currentScreen.CutId);
                } else {
                    if (currentScreen.SecondWeekTypeId !== "") {
                        //if (currentScreen.SecondAuditorium !== "")
                            //self.currentAuditoriumId(currentScreen.SecondAuditorium);
                        self.loadScheduledTutorialsForGroup(currentScreen.SecondFacultyId, "", "", currentScreen.SecondGroupsIds, currentScreen.SecondScheduleInfoId,
                            -1, currentScreen.SecondWeekTypeId, currentScreen.CutId);
                    }
                }
            }
        }
    }

    

    self.backButton = function () {
        if (self.screenStack().length) {
            self.PopScreen(self.screenStack().length-1);
        }else{
            self.HeadBuilding("");
            self.HeadAuditorium("");
            self.HeadWeekType("");
            self.HeadLecturer("");
            self.HeadTutorial("");

            if (self.currentFaculty() !== undefined) {
                CutId = 0;
                //self.loadScheduledTutorialsForGroup(self.currentFaculty().Id, courseIds, specialityIds, groupIds);
                if (self.screenStack().length <= 1) {
                    if (self.currentScheduleInfo() !== undefined
                        && self.currentWeekType() !== undefined) {
                        self.loadScheduledTutorialsForGroup(self.currentFaculty().Id, courseIds, specialityIds, groupIds, self.currentScheduleInfo().Id,
                        -1, self.currentWeekType().Id, CutId);
                    }
                }
                //self.loadUscheduledTutorialsForGroupV2(self.currentFaculty().Id, courseIds, "", groupIds);
            }



            self.showBlock1(1);
            self.showBlock2(0);
        }
    };


    self.nextButton = function () {
        self.PushScreen(self.Row(), self.Col(), 1);
    }


    self.changeState = ko.observable(false);
    self.copyState = ko.observable(false);
    self.swapState = ko.observable(false);

    self.changeRow = ko.observable(-1);
    self.changeCol = ko.observable(-1);

    self.changeButton = function () {
        self.changeState(!self.changeState());
        self.changeRow(self.Row());
        self.changeCol(self.Col());
    }

    self.copyButton = function () {
        self.copyState(!self.copyState());
        self.changeRow(self.Row());
        self.changeCol(self.Col());
    }

    self.swapButton = function () {
        self.swapState(!self.swapState());
        self.changeRow(self.Row());
        self.changeCol(self.Col());
    }

    self.ToScreen = function (index) {
        /*alert("1111111111111");
        var tmp = self.screenStack()[index];
        self.screenStack()[index](self.screenStack()[self.screenStack().length - 1]);
        self.screenStack()[self.screenStack().length - 1](tmp);
        alert("2222222222222");*/
    }

    //Проеверка положения курсора
    self.isOnTable3 = ko.observable(0);
    self.isOnTable = function (value) {
        self.isOnTable3(value);
        if (value == 0) {
            //self.Col(-1);
            //self.Row(-1);
            self.preCol(-1);
            self.preRow(-1);
        }
    }





    //Обновление текущей клетки под курсором
    self.preSelect = function (column, row) {
    
        self.preRow(column);
        self.preCol(row);

    }

    self.swapFromTableButton = function (firstRow, firstCol, secondRow, secondCol) {
        if (firstRow == undefined || firstCol == undefined || secondRow == undefined || secondCol == undefined)
            return;
        var firstScheduleInfo;
        var firstAuditorium;
        var firstWeekType;
        var secondScheduleInfo;
        var secondAuditorium;
        var secondWeekType;
        var currentScreen = self.screenStack()[self.screenStack().length - 1];


        if (self.schedule()[firstCol][firstRow].FirstId != -1) {
            firstScheduleInfo = self.schedule()[firstCol][firstRow].FirstScheduleInfo;
            firstAuditorium = self.schedule()[firstCol][firstRow].FirstAuditoriumId;
            firstWeekType = 1;
        }
        if (self.schedule()[firstCol][firstRow].SecondId != -1) {

            firstScheduleInfo = self.schedule()[firstCol][firstRow].SecondScheduleInfo;
            firstAuditorium = self.schedule()[firstCol][firstRow].SecondAuditoriumId;
            firstWeekType = 2;
        }
        if (self.schedule()[firstCol][firstRow].ThirdId != -1) {
            firstScheduleInfo = self.schedule()[firstCol][firstRow].ThirdScheduleInfo;
            firstAuditorium = self.schedule()[firstCol][firstRow].ThirdAuditoriumId;
            firstWeekType = 3;
        }
        //------------------------------------------------------
        if (self.schedule()[secondCol][secondRow].FirstId != -1) {
            secondScheduleInfo = self.schedule()[secondCol][secondRow].FirstScheduleInfo;
            secondAuditorium = self.schedule()[secondCol][secondRow].FirstAuditoriumId;
            secondWeekType = 1;
        }
        if (self.schedule()[secondCol][secondRow].SecondId != -1) {

            secondScheduleInfo = self.schedule()[secondCol][secondRow].SecondScheduleInfo;
            secondAuditorium = self.schedule()[secondCol][secondRow].SecondAuditoriumId;
            secondWeekType = 2;
        }
        if (self.schedule()[firstCol][secondRow].ThirdId != -1) {
            secondScheduleInfo = self.schedule()[secondCol][secondRow].ThirdScheduleInfo;
            secondAuditorium = self.schedule()[secondCol][secondRow].ThirdAuditoriumId;
            secondWeekType = 3;
        }

        self.delFormTableButton(firstRow, firstCol);
        self.delFormTableButton(secondRow, secondCol);

       

        self.sendData({
            address: "schedule/add",
            params: {
                'ScheduleInfo': firstScheduleInfo,
                'Auditorium': firstAuditorium,
                'DayOfWeek': secondCol + 1,
                'Period': ind[secondRow] + 1,
                'WeekType': firstWeekType,
                'StartDate': "",
                'EndDate': ""
            },
            onsuccess: function (data) {
                self.sendData({
                    address: "schedule/add",
                    params: {
                        'ScheduleInfo': secondScheduleInfo,
                        'Auditorium': secondAuditorium,
                        'DayOfWeek': firstCol + 1,
                        'Period': ind[firstRow] + 1,
                        'WeekType': secondWeekType,
                        'StartDate': "",
                        'EndDate': ""
                    },
                    onsuccess: function (data) {
                        if (self.currentFaculty() !== undefined) {
                            if (self.screenStack().length <= 1) {
                                if (self.currentScheduleInfo() !== undefined
                                    && self.currentWeekType() !== undefined) {
                                    self.loadScheduledTutorialsForGroup(self.currentFaculty().Id, courseIds, specialityIds, groupIds, self.currentScheduleInfo().Id,
                                    -1, self.currentWeekType().Id, CutId);
                                }
                            } else {

                                if (currentScreen.ThirdWeekTypeId !== "") {


                                    self.loadScheduledTutorialsForGroup(currentScreen.ThirdFacultyId, "", "", currentScreen.ThirdGroupsIds, currentScreen.ThirdScheduleInfoId,
                                        -1, currentScreen.ThirdWeekTypeId, currentScreen.CutId);
                                }
                                if (currentScreen.FirstWeekTypeId !== "") {

                                    self.loadScheduledTutorialsForGroup(currentScreen.FirstFacultyId, "", "", currentScreen.FirstGroupsIds, currentScreen.FirstScheduleInfoId,
                                        -1, currentScreen.FirstWeekTypeId, currentScreen.CutId);
                                } else {
                                    if (currentScreen.SecondWeekTypeId !== "") {

                                        self.loadScheduledTutorialsForGroup(currentScreen.SecondFacultyId, "", "", currentScreen.SecondGroupsIds, currentScreen.SecondScheduleInfoId,
                                            -1, currentScreen.SecondWeekTypeId, currentScreen.CutId);
                                    }
                                }
                            }
                        }
                    }
                });

                
            },
            onerror: function (error) {
                self.showError("Сохранение в Базу Данных не удалось");
            }
        });

    }

    self.addFromTableButton = function (sourceRow, sourceCol, targetRow, targetCol) {
        if (sourceRow == undefined || sourceCol == undefined || targetRow == undefined || targetCol == undefined)
            return;

        var source_scheduleInfo;
        var source_auditorium;
        var source_weekType;
        var currentScreen = self.screenStack()[self.screenStack().length - 1];
        //abacaba
       
        //alert("::: " + sourceRow + " " + sourceCol + " : " + targetRow + " " + targetCol);
        
        if (self.schedule()[sourceCol][sourceRow].FirstId != -1) {
           
            source_scheduleInfo = self.schedule()[sourceCol][sourceRow].FirstScheduleInfo;
            source_auditorium = self.schedule()[sourceCol][sourceRow].FirstAuditoriumId;
            source_weekType = 1;
        }
        if (self.schedule()[sourceCol][sourceRow].SecondId != -1) {
       
            source_scheduleInfo = self.schedule()[sourceCol][sourceRow].SecondScheduleInfo;
            source_auditorium = self.schedule()[sourceCol][sourceRow].SecondAuditoriumId;
            source_weekType = 2;
        }
        if (self.schedule()[sourceCol][sourceRow].ThirdId != -1) {
            source_scheduleInfo = self.schedule()[sourceCol][sourceRow].ThirdScheduleInfo;
            source_auditorium = self.schedule()[sourceCol][sourceRow].ThirdAuditoriumId;

            source_weekType = 3;
        }

        self.sendData({
            address: "schedule/add",
            params: {
                'ScheduleInfo': source_scheduleInfo,
                'Auditorium': source_auditorium,
                'DayOfWeek': targetCol + 1,
                'Period': ind[targetRow] + 1,
                'WeekType': source_weekType,
                'StartDate': "",
                'EndDate': ""
            },
            onsuccess: function (data) {
           
                if (self.currentFaculty() !== undefined) {
                    //self.loadScheduledTutorialsForGroup(self.currentFaculty().Id, courseIds, specialityIds, groupIds);
                    if (self.screenStack().length <= 1) {
                        if (self.currentScheduleInfo() !== undefined
                            && self.currentWeekType() !== undefined) {
                            self.loadScheduledTutorialsForGroup(self.currentFaculty().Id, courseIds, specialityIds, groupIds, self.currentScheduleInfo().Id,
                            -1, self.currentWeekType().Id, CutId);
                        }
                    } else {
             
                        if (currentScreen.ThirdWeekTypeId !== "") {
                          
                          
                            self.loadScheduledTutorialsForGroup(currentScreen.ThirdFacultyId, "", "", currentScreen.ThirdGroupsIds, currentScreen.ThirdScheduleInfoId,
                                -1, currentScreen.ThirdWeekTypeId, currentScreen.CutId);
                        }
                        if (currentScreen.FirstWeekTypeId !== "") {
                   
                            self.loadScheduledTutorialsForGroup(currentScreen.FirstFacultyId, "", "", currentScreen.FirstGroupsIds, currentScreen.FirstScheduleInfoId,
                                -1, currentScreen.FirstWeekTypeId, currentScreen.CutId);
                        } else {
                            if (currentScreen.SecondWeekTypeId !== "") {
                              
                                self.loadScheduledTutorialsForGroup(currentScreen.SecondFacultyId, "", "", currentScreen.SecondGroupsIds, currentScreen.SecondScheduleInfoId,
                                    -1, currentScreen.SecondWeekTypeId, currentScreen.CutId);
                            }
                        }
                    }
                }
            },
            onerror: function (error) {
                self.showError("Сохранение в Базу Данных не удалось");
            }
        });
    }

    //Добавление предмета в расписание и сохранение его в БД.
    self.addButton = function () {


        if (self.currentAuditorium1() == undefined) {
            self.showError("Выберите аудиторию");
            return;
        }
 

        if (self.currentWeekType() == undefined) {
            self.currentWeekType(3);
            self.currentWeekType().Id = 3;
        }


        self.Col(self.Col() * 1);
        self.Row(self.Row() * 1);

        var currentScreen = self.screenStack()[self.screenStack().length - 1];
        var scheduleInfo;
        if (currentScreen.FirstScheduleInfoId != "")
            scheduleInfo = currentScreen.FirstScheduleInfoId;
        if (currentScreen.SecondScheduleInfoId != "")
            scheduleInfo = currentScreen.SecondScheduleInfoId;
        if (currentScreen.ThirdScheduleInfoId != "")
            scheduleInfo = currentScreen.ThirdScheduleInfoId;

            self.sendData({
                address: "schedule/add",
                params: {
                    'ScheduleInfo': scheduleInfo,
                    'Auditorium': self.currentAuditorium1().AuditoriumId,
                    'DayOfWeek': self.Col() + 1,
                    'Period': ind[self.Row()] + 1,
                    'WeekType': self.currentWeekType().Id,
                    'StartDate': "",
                    'EndDate': ""
                },
                onsuccess: function (data) {
                    if (self.currentFaculty() !== undefined) {
                        //self.loadScheduledTutorialsForGroup(self.currentFaculty().Id, courseIds, specialityIds, groupIds);
                        if (self.screenStack().length <= 1) {
                            if (self.currentScheduleInfo() !== undefined
                                && self.currentWeekType() !== undefined) {
                                self.loadScheduledTutorialsForGroup(self.currentFaculty().Id, courseIds, specialityIds, groupIds, self.currentScheduleInfo().Id,
                                -1, self.currentWeekType().Id, CutId);
                            }
                        } else {
                            if (currentScreen.ThirdWeekTypeId !== "") {
                                self.loadScheduledTutorialsForGroup(currentScreen.ThirdFacultyId, "", "", currentScreen.ThirdGroupsIds, currentScreen.ThirdScheduleInfoId,
                                    -1, currentScreen.ThirdWeekTypeId, currentScreen.CutId);
                            }
                            if (currentScreen.FirstWeekTypeId !== "") {
                                self.loadScheduledTutorialsForGroup(currentScreen.FirstFacultyId, "", "", currentScreen.FirstGroupsIds, currentScreen.FirstScheduleInfoId,
                                    -1, currentScreen.FirstWeekTypeId, currentScreen.CutId);
                            } else {
                                if (currentScreen.SecondWeekTypeId !== "") {

                                    self.loadScheduledTutorialsForGroup(currentScreen.SecondFacultyId, "", "", currentScreen.SecondGroupsIds, currentScreen.SecondScheduleInfoId,
                                        -1, currentScreen.SecondWeekTypeId, currentScreen.CutId);
                                }
                            }
                        }
                    }
                },
                onerror: function (error) {
                    self.showError("Сохранение в Базу Данных не удалось");
                }
            });
        
    };


    self.delFormTableButton = function(targetRow, targetCol){
        if (targetRow == undefined || targetCol == undefined)
            return;

        var DelId = -1;

        if (self.schedule()[targetCol][targetRow].FirstId != -1) {
            DelId = self.schedule()[targetCol][targetRow].FirstId;
        }
        if (self.schedule()[targetCol][targetRow].SecondId != -1) {
            DelId = self.schedule()[targetCol][targetRow].SecondId;
        }
        if (self.schedule()[targetCol][targetRow].ThirdId != -1) {
            DelId = self.schedule()[targetCol][targetRow].ThirdId;
        }

        var currentScreen = self.screenStack()[self.screenStack().length - 1];

        if (DelId !== -1) {
            self.sendData({
                address: "schedule/delete",
                params: {
                    'Id': DelId
                },
                onsuccess: function (data) {
                    if (self.currentFaculty() !== undefined) {
                        //self.loadScheduledTutorialsForGroup(self.currentFaculty().Id, courseIds, specialityIds, groupIds);
                        if (self.screenStack().length <= 1) {
                            if (self.currentScheduleInfo() !== undefined
                                && self.currentWeekType() !== undefined) {
                                self.loadScheduledTutorialsForGroup(self.currentFaculty().Id, courseIds, specialityIds, groupIds, self.currentScheduleInfo().Id,
                                -1, self.currentWeekType().Id, CutId);
                            }
                        } else {

                            if (currentScreen.ThirdWeekTypeId !== "") {
                                self.loadScheduledTutorialsForGroup(currentScreen.ThirdFacultyId, "", "", currentScreen.ThirdGroupsIds, currentScreen.ThirdScheduleInfoId,
                                    -1, currentScreen.ThirdWeekTypeId, currentScreen.CutId);
                            }
                            if (currentScreen.FirstWeekTypeId !== "") {
                                self.loadScheduledTutorialsForGroup(currentScreen.FirstFacultyId, "", "", currentScreen.FirstGroupsIds, currentScreen.FirstScheduleInfoId,
                                    -1, currentScreen.FirstWeekTypeId, currentScreen.CutId);
                            } else {
                                if (currentScreen.SecondWeekTypeId !== "") {

                                    self.loadScheduledTutorialsForGroup(currentScreen.SecondFacultyId, "", "", currentScreen.SecondGroupsIds, currentScreen.SecondScheduleInfoId,
                                        -1, currentScreen.SecondWeekTypeId, currentScreen.CutId);
                                }
                            }
                        }
                    }
                },
                onerror: function (error) {
                    alert("Сохранение в Базу Данных не удалось!");
                }
            });
        } else {
            self.showError("Для удаления выберите соответствующий тип недели");
        }
    }


    self.delButton = function () {
        if (self.schedule()[self.Col()][self.Row()] == undefined) {
            self.showError("Выберите клетку в таблице");
            return;
        }

        var DelId = -1;


        if (self.schedule()[self.Col()][self.Row()].FirstId  != -1) {
            DelId = self.schedule()[self.Col()][self.Row()].FirstId;
        }
        if (self.schedule()[self.Col()][self.Row()].SecondId != -1) {
            DelId = self.schedule()[self.Col()][self.Row()].SecondId;
        }
        if (self.schedule()[self.Col()][self.Row()].ThirdId != -1) {
            DelId = self.schedule()[self.Col()][self.Row()].ThirdId;
        }

        var currentScreen = self.screenStack()[self.screenStack().length - 1];

        if (DelId !== -1) {
            self.sendData({
                address: "schedule/delete",
                params: {
                    'Id': DelId
                },
                onsuccess: function (data) {
                    if (self.currentFaculty() !== undefined) {
                        //self.loadScheduledTutorialsForGroup(self.currentFaculty().Id, courseIds, specialityIds, groupIds);
                        if (self.screenStack().length <= 1) {
                            if (self.currentScheduleInfo() !== undefined
                                && self.currentWeekType() !== undefined) {
                                self.loadScheduledTutorialsForGroup(self.currentFaculty().Id, courseIds, specialityIds, groupIds, self.currentScheduleInfo().Id,
                                -1, self.currentWeekType().Id, CutId);
                            }
                        } else {
                           
                            if (currentScreen.ThirdWeekTypeId !== "") {
                                self.loadScheduledTutorialsForGroup(currentScreen.ThirdFacultyId, "", "", currentScreen.ThirdGroupsIds, currentScreen.ThirdScheduleInfoId,
                                    -1, currentScreen.ThirdWeekTypeId, currentScreen.CutId);
                            }
                            if (currentScreen.FirstWeekTypeId !== "") {
                                self.loadScheduledTutorialsForGroup(currentScreen.FirstFacultyId, "", "", currentScreen.FirstGroupsIds, currentScreen.FirstScheduleInfoId,
                                    -1, currentScreen.FirstWeekTypeId, currentScreen.CutId);
                            } else {
                                if (currentScreen.SecondWeekTypeId !== "") {

                                    self.loadScheduledTutorialsForGroup(currentScreen.SecondFacultyId, "", "", currentScreen.SecondGroupsIds, currentScreen.SecondScheduleInfoId,
                                        -1, currentScreen.SecondWeekTypeId, currentScreen.CutId);
                                }
                            }
                        }
                    }
                },
                onerror: function (error) {
                    alert("Сохранение в Базу Данных не удалось!");
                }
            });
        } else {
            self.showError("Для удаления выберите соответствующий тип недели");
        }
    }




    self.updButton = function () {
        if (self.currentUnsTutorial() == undefined) {
            self.showError("Выберите планируемый предмет");
            return;
        }


        if (self.currentEndDate() == undefined) {
            self.currentEndDate("");
        }

        if (self.currentStartDate() == undefined) {
            self.currentStartDate("");
        }

        if (self.currentWeekType() == undefined) {
            self.currentWeekType(3);
            self.currentWeekType().Id = 3;
        }



        //self.schedule(days);

        self.Col(self.Col() * 1);
        self.Row(self.Row() * 1);

        self.sendData({
            address: "schedule/add",
            params: {
                'ScheduleInfo': self.currentUnsTutorial().ScheduleInfoId,
                'Auditorium': 1,
                'DayOfWeek': self.Col() + 1,
                'Period': ind[self.Row()] + 1,
                'WeekType': self.currentWeekType().Id,
                'StartDate': self.currentStartDate(),
                'EndDate': self.currentEndDate()
            },
            onsuccess: function (data) {
                if (self.currentFaculty() !== undefined) {
                    if (self.screenStack().length <= 1) {
                        if (self.currentScheduleInfo() !== undefined
                            && self.currentWeekType() !== undefined) {
                            self.loadScheduledTutorialsForGroup(self.currentFaculty().Id, courseIds, specialityIds, groupIds, self.currentScheduleInfo().Id,
                            -1, self.currentWeekType().Id, CutId);
                        }
                    }
                }
            },
            onerror: function (error) {
                self.showError("Сохранение в Базу Данных не удалось");
            }
        });
    };




    self.hints = ko.observableArray([]);

    self.getHints = function () {
        if (self.currentScheduleInfo() !== undefined && self.currentBuilding() !== undefined) {
            self.loadData({
                address: "schedulehelper/getall",
                obj: self.hints,
                params: {
                    lecturerId: self.currentScheduleInfo().LecturerId,
                    buildingId: self.currentBuilding().Id,
                    groupIds: groupIds
                },
                onsuccess: function () {

                }
            });
        }
    }

    self.isCheckTime.subscribe(function (newValue) {
        self.getHints();
    });


    












    //----------------------------------------------------------------------------View2--------------------------------
    self.Table = ko.observableArray([]);

    self.ApplyTable = function (data) {
        var tbl = [];

        $.each(data, function (index, item) {
            tbl[index] = {
                Id: item.Id,
                Lecturer: item.Lecturer,
                Tutorial: item.Tutorial,
                TutorialType: item.TutorialType,
                HoursPerWeek: item.HoursPerWeek,
                Courses: item.Courses,
                Specialities: item.Specialities,
                Groups: item.Groups,
                Auditorium: item.Auditorium,
                TutorialId: item.TutorialId,
                LecturerId: item.LecturerId,
                GroupIds: item.GroupIds,
                CurrentHours: item.CurrentHours
            }

        });
        self.Table(tbl);
    }


    //Проеверка положения курсора
    self.isOnTable2 = ko.observable(0);

    self.preRow1 = ko.observable(-1);
    self.Row1 = ko.observable(-1);

    self.isOnTable1 = function (value) {
        self.isOnTable2(value);
        if (value == 0) {
            self.preRow1(-1);
        }
    };

    //Обновление текущей строки под курсором
    self.preSelect1 = function (row) {
        self.preRow1(row);
    };

    //Обновление выбраной строки
    self.Select1 = function (row) {
     
        self.Row1(row);
        self.currentScheduleInfo(self.Table()[self.Row1()]);
        
        //alert("(^(oo)^)");
        //alert(self.Table()[self.Row1()].GroupIds);
        groupIds = self.Table()[self.Row1()].GroupIds;

        self.HeadLecturer(self.Table()[self.Row1()].Lecturer);
        self.HeadTutorial(self.Table()[self.Row1()].Tutorial);
       
        if (self.Table()[self.Row1()].TutorialType == 1) {
            self.HeadTutorialType("(Лек.)");
        }
        if (self.Table()[self.Row1()].TutorialType == 2) {
            self.HeadTutorialType("(Пр.)");
        }
        if (self.Table()[self.Row1()].TutorialType == 3) {
            self.HeadTutorialType("(Лаб.)");
        }

        if (self.screenStack().length <= 1) {
            if (self.currentFaculty() !== undefined) {
                CutId = 4;
                self.currentCuts(["Поток", "Преподаватель"]);
                //alert(self.Table()[self.Row1()]);
                //self.loadScheduledTutorialsForGroup(self.currentFaculty().Id, courseIds, specialityIds, groupIds);
                if (self.currentScheduleInfo() !== undefined && self.currentWeekType() !== undefined) {
                    //alert("1111222211111");
                    self.loadScheduledTutorialsForGroup(self.currentFaculty().Id, courseIds, specialityIds, groupIds, self.currentScheduleInfo().Id,
                        -1, self.currentWeekType().Id, CutId);
                }
            }
        }
        self.showBlock1(0);
        self.showBlock2(1);

        
        self.PushScreen(0, 0, 0);
    };



    self.SortByCourseState = ko.observable(false);
    self.SortByCourse = function () {
        self.SortByCourseState(!self.SortByCourseState());
        if (self.SortByCourseState() == true) {
            self.Table.sort(function (left, right) { return left.Courses == right.Courses ? 0 : (left.Courses < right.Courses ? -1 : 1) });
        } else {
            self.Table.sort(function (left, right) { return left.Courses == right.Courses ? 0 : (left.Courses > right.Courses ? -1 : 1) });
        }
    };

    /*
    Id: item.Id,
    Lecturer: item.Lecturer,
    Tutorial: item.Tutorial,
    TutorialType: item.TutorialType,
    HoursPerWeek: item.HoursPerWeek,
    Courses: item.Courses,
    Specialities: item.Specialities,
    Groups: item.Groups,
    Auditorium: item.Auditorium,
    TutorialId: item.TutorialId,
    LecturerId: item.LecturerId,
    GroupIds: item.GroupIds*/

    self.SortByGroupsState = ko.observable(false);
    self.SortByGroups = function () {
        self.SortByGroupsState(!self.SortByGroupsState());
        if (self.SortByGroupsState() == true) {
            self.Table.sort(function (left, right) { return left.Groups == right.Groups ? 0 : (left.Groups < right.Groups ? -1 : 1) });
        } else {
            self.Table.sort(function (left, right) { return left.Groups == right.Groups ? 0 : (left.Groups > right.Groups ? -1 : 1) });
        }
    };

    self.SortBySpecialitiesState = ko.observable(false);
    self.SortBySpecialities = function () {
        self.SortBySpecialitiesState(!self.SortBySpecialitiesState());
        if (self.SortBySpecialitiesState() == true) {
            self.Table.sort(function (left, right) { return left.Specialities == right.Specialities ? 0 : (left.Specialities < right.Specialities ? -1 : 1) });
        } else {
            self.Table.sort(function (left, right) { return left.Specialities == right.Specialities ? 0 : (left.Specialities > right.Specialities ? -1 : 1) });
        }
    };


    self.SortByHoursPerWeekState = ko.observable(false);
    self.SortByHoursPerWeek = function () {
        self.SortByHoursPerWeekState(!self.SortByHoursPerWeekState());
        if (self.SortByHoursPerWeekState() == true) {
            self.Table.sort(function (left, right) { return left.HoursPerWeek == right.HoursPerWeek ? 0 : (left.HoursPerWeek < right.HoursPerWeek ? -1 : 1) });
        } else {
            self.Table.sort(function (left, right) { return left.HoursPerWeek == right.HoursPerWeek ? 0 : (left.HoursPerWeek > right.HoursPerWeek ? -1 : 1) });
        }
    };

    self.SortByTutorialTypeState = ko.observable(false);
    self.SortByTutorialType = function () {
        self.SortByTutorialTypeState(!self.SortByTutorialTypeState());
        if (self.SortByTutorialTypeState() == true) {
            self.Table.sort(function (left, right) { return left.TutorialType == right.TutorialType ? 0 : (left.TutorialType < right.TutorialType ? -1 : 1) });
        } else {
            self.Table.sort(function (left, right) { return left.TutorialType == right.TutorialType ? 0 : (left.TutorialType > right.TutorialType ? -1 : 1) });
        }
    };

    self.SortByTutorialState = ko.observable(false);
    self.SortByTutorial = function () {
        self.SortByTutorialState(!self.SortByTutorialState());
        if (self.SortByTutorialState() == true) {
            self.Table.sort(function (left, right) { return left.Tutorial == right.Tutorial ? 0 : (left.Tutorial < right.Tutorial ? -1 : 1) });
        } else {
            self.Table.sort(function (left, right) { return left.Tutorial == right.Tutorial ? 0 : (left.Tutorial > right.Tutorial ? -1 : 1) });
        }
    };

    self.SortByLecturerState = ko.observable(false);
    self.SortByLecturer = function () {
        self.SortByLecturerState(!self.SortByLecturerState());
        if (self.SortByLecturerState() == true) {
            self.Table.sort(function (left, right) { return left.Lecturer == right.Lecturer ? 0 : (left.Lecturer < right.Lecturer ? -1 : 1) });
        } else {
            self.Table.sort(function (left, right) { return left.Lecturer == right.Lecturer ? 0 : (left.Lecturer > right.Lecturer ? -1 : 1) });
        }
    };

    self.SortByIdState = ko.observable(false);
    self.SortById = function () {
        self.SortByIdState(!self.SortByIdState());
        if (self.SortByIdState() == true) {
            self.Table.sort(function (left, right) { return left.Id == right.Id ? 0 : (left.Id < right.Id ? -1 : 1) });
        } else {
            self.Table.sort(function (left, right) { return left.Id == right.Id ? 0 : (left.Id > right.Id ? -1 : 1) });
        }
    };



}

        function extend(child, parent) {
            if (typeof (parent) == "function")
                child.constructor.prototype = new parent();
            else
                child.constructor.prototype = parent;
            child.prototype = child.__proto__ = child.constructor.prototype;
        };