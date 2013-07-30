var daysOfWeek = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
var months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];




days1 = [["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
                   ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]];


var ind_inv = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];


var currentElement;


function auditoriumViewModel() {
   

    var self = this;
    self.screenStack = ko.observableArray([]);

    self.displayTimeSelect = ko.observable(false);
    var isCheckTime_tmp = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
    self.isCheckTime = ko.observableArray([]);
    self.isSelectTime = ko.observable(-1);

    self.changeTimeSelect = function () {
        self.displayTimeSelect(!self.displayTimeSelect());
    }
    self.checkTime = function (index) {
        if(isCheckTime_tmp[index] == true)
            isCheckTime_tmp[index] = false;
        else
            isCheckTime_tmp[index] = true;

        self.isCheckTime(isCheckTime_tmp);
    }
    self.selectTimeSelect = function (index) {
        //alert(index);
        self.isSelectTime(index);
    }
   

    self.Page = ko.observable(2);

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
                    ThirdGroups: ""
                }
            }
        }


        $.each(data, function (index, item) {
            //alert(item.Period - 1);
            var ti = ind_inv[item.Period - 1];
         
            isCheckTime_tmp[ti] = true;
     

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
            }

            if (item.WeekType == 3) {
                days1[item.DayOfWeek - 1][ti].ThirdScheduleInfo = item.ScheduleInfo;
                days1[item.DayOfWeek - 1][ti].ThirdAuditorium = item.Auditorium;
                days1[item.DayOfWeek - 1][ti].ThirdStartDate = item.StartDate;
                days1[item.DayOfWeek - 1][ti].ThirdEndDate = item.EndDate;
                days1[item.DayOfWeek - 1][ti].ThirdLecturer = item.Lecturer;
                days1[item.DayOfWeek - 1][ti].ThirdTutorialTypeName = item.TutorialType;
                
                days1[item.DayOfWeek - 1][ti].ThirdTutorialName = item.Tutorial;
                days1[item.DayOfWeek - 1][ti].ThirdStreamCollision = item.StreamCollision;
                days1[item.DayOfWeek - 1][ti].ThirdLecturerCollision = item.LecturerCollision;
                days1[item.DayOfWeek - 1][ti].ThirdAuditoriumCollision = item.AuditoriumCollision;
                days1[item.DayOfWeek - 1][ti].ThirdId = item.Schedule;
                days1[item.DayOfWeek - 1][ti].ThirdGroups = item.Groups;
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
                    ThirdGroups: ""
                }
            }
        }
        self.schedule(days1);


        //загрузка курсов
        self.loadData({
            address: "course/getall",
            obj: self.courses,
        });

        //загрузка временных интервалов
        self.loadData({
            address: "time/getall",
            obj: self.times,
            onsucces: function () {
           
            }
        });

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

    self.times.subscribe(function (newValue) {
        for (var i = 0; i < newValue.length; ++i) {
            ind_inv[newValue[i].Id - 1] = i;
        }
    });
  

    self.currentWeekType.subscribe(function (newValue) {
        self.HeadWeekType("");
        if (newValue !== undefined) {
            if (self.currentAuditorium1() !== undefined) {
                self.loadScheduledTutorialsForAuditorium();
            }
        }
    });

 
    self.showBlock1 = ko.observable(1);
    self.showBlock2 = ko.observable(0);
    self.auditoriumSearch = ko.observable();

   

    self.currentBuilding.subscribe(function (newValue) {
        self.HeadBuilding("");
        self.HeadAuditorium("");
        if (newValue !== undefined) {
            self.HeadBuilding(newValue.Name);
            self.LoadAuditoriums();
        }
    });



    self.auditoriumSearch.subscribe(function (newValue) {
        if (newValue !== undefined) {
            for (var i = 0; i < self.auditoriums1().length; i++) {
                if (self.auditoriums1()[i].Auditorium == newValue) {
                    self.currentAuditorium1(self.auditoriums1()[i]);
                    return;
                }
            }
        }
    });

    self.currentAuditorium1.subscribe(function (newValue) {
        self.HeadAuditorium("");
        if (newValue !== undefined) {
            self.loadScheduledTutorialsForAuditorium();
            self.HeadAuditorium("Аудитория № " + self.currentAuditorium1().Auditorium);
        }
    });

    self.LoadAuditoriums = function () {
        self.loadData({
            address: "auditorium/GetAllForBuilding/",
            obj: self.auditoriums1,
            params: {
                buildingid: self.currentBuilding().Id,
            }
        });
    }

    self.SchTutorials = ko.observableArray([]);

    self.loadScheduledTutorialsForAuditorium = function () {
        self.loadData({
            address: "schedule/getforgroup/",
            obj: self.SchTutorials,
            params: {
                curid: 7,
                scheduleinfoid: -1,
                auditoriumid: self.currentAuditorium1().AuditoriumId,
                facultyid: -1,
                startdate: "",
                enddate: "",
                weektype: 3,
                courseids: "",
                specialityids: "",
                groupids: ""
            },
            onsuccess: function (data) {
                self.ApplySchedule(data);
            }
        });
    }


    
    //Текущий html элемент под курсором
    self.setCurrentElement = function (val) {
        currentElement = val;
    }


    //Обновление выбраной клетки
    self.Select = function (column, row) {
        //self.Row(column);
        //self.Col(row);
    };

    //Проеверка положения курсора
    self.isOnTable3 = ko.observable(0);
    self.isOnTable = function (value) {
        self.isOnTable3(value);
        //if (value == 0) {
           // self.preCol(-1);
           // self.preRow(-1);
        //}
    }

    //Обновление текущей клетки под курсором
    self.preSelect = function (column, row) {
        //self.preRow(column);
        //self.preCol(row);
    }

    self.printVersion = ko.observable(0);
    self.printTable = function (value) {
        self.printVersion(value);
    }

  


 

    //----------------------------------------------------------------------------View2--------------------------------
    /*
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
                TutorialId: item.TutorialId
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

        if (self.currentFaculty() !== undefined) {
            CutId = 4;
            self.currentCuts(["Поток", "Преподаватель"]);
            self.loadScheduledTutorialsForGroup(self.currentFaculty().Id, courseIds, specialityIds, groupIds);
        }
        self.showBlock1(0);
        self.showBlock2(1);
    };*/




}

$(function () {
    var auditorium = new auditoriumViewModel();
    auditorium.init();
    ko.applyBindings(auditorium);
});