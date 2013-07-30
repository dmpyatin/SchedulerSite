


function unscheduledViewModel() {

    var self = this;

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
                CurrentHours: item.CurrentHours
            }
         
        });
        self.Table(tbl);
    }


    self.routingPattern = "{0}\\{1}"; //{ViewModelMethod}\{ParameterObject}
    self.defaultCommand = "page"; //  
    self.isLoading = ko.observable(false);
 
    self.hasHash = function () {
        return typeof window.location.hash !== undefined && window.location.hash != "";
    };

    self.pushHashCommand = function (command) {
        var url = window.location.href.replace(/#.*/, '');

        window.location.href = url + '#' + command;
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



    self.faculties = ko.observableArray([]);
    self.targetfaculties = ko.observableArray([]);
    self.courses = ko.observableArray([]);
    self.departments = ko.observableArray([]);
    self.currentFaculty = ko.observable();
    self.targetFaculty = ko.observable();
    self.currentCourses = ko.observableArray([]);
    self.currentDepartment = ko.observable();

    self.tutorials = ko.observableArray([]);
    self.currentTutorial = ko.observable();

    self.lecturers = ko.observableArray([]);
    self.currentLecturer = ko.observable();

    self.specialities = ko.observableArray([]);
    self.currentSpecialities = ko.observableArray([]);

    self.groups = ko.observableArray([]);
    self.currentGroups = ko.observableArray([]);

    self.tutorialtypes = ko.observableArray([]);
    self.currentTutorialType = ko.observable();

    

    self.hoursPerWeek = ko.observable();

    self.hoursPerWeek.subscribe(function (newValue) {
        if (newValue !== undefined) {
         
        }
    });



    var groupIds = "";
    var specialityIds = "";
    var courseIds = "";
  
    self.init = function () {
        var localThis = this;

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
                self.loadData({
                    address: "faculty/getall",
                    obj: self.targetfaculties,
                    onsuccess: function () {
                     
                    }
                });
            }
        });

        

       
        //загрузка курсов
        self.loadData({
            address: "course/getall",
            obj: self.courses,
        });

        //загрузка типа предмета
        self.loadData({
            address: "tutorialtype/getall",
            obj: self.tutorialtypes,
        });

    };

    //загрузка специальностей
    self.loadSpecialities = function (facultyId) {
        if (facultyId !== undefined) {
            self.loadData({
                address: "speciality/Getbyfaculty/",
                params: {
                    facultyid: facultyId
                },
                obj: self.specialities
            });
        }
    }

    self.loadUnscheduledTutorials = function(departmentId){
        if (departmentId !== undefined) {
            self.loadData({
                address: "scheduleinfo/getbydepartment/",
                params: {
                    departmentid: departmentId
                },
                onsuccess: function (data) {
                    self.ApplyTable(data);
                }
            });
        }
    }

    //загрузка групп
    self.loadGroups = function (facultyId, courseIds, specialityIds) {
        if (facultyId !== undefined) {
            self.loadData({
                address: "group/get/",
                obj: self.groups,
                params: {
                    facultyid: facultyId,
                    courseids: courseIds,
                    specialityids: specialityIds
                },
                onsuccess: function () {
                }
            });
        }
    }

    self.loadDepartments = function (facultyId) {
        //загрузка кафедр
        if (facultyId !== undefined) {
            self.loadData({
                address: "department/getbyfaculty",
                params: {
                    facultyid: facultyId
                },
                obj: self.departments,
            });
        }
    }

    self.loadTutorials = function (departmentId) {
        if (departmentId !== undefined) {
            self.loadData({
                address: "tutorial/getbydepartment",
                params: {
                    departmentid: departmentId
                },
                obj: self.tutorials,
            });
        }
    }

    self.loadLecturers = function (departmentId) {
        if (departmentId !== undefined) {
            self.loadData({
                address: "lecturer/getbydepartment",
                params: {
                    departmentid: departmentId
                },
                obj: self.lecturers,
            });
        }
    }

    self.currentFaculty.subscribe(function (newValue) {
        if (newValue !== undefined) {
            courseIds = "";
            specialityIds = "";
            groupIds = "";
            self.loadDepartments(newValue.Id);
        }
    });

  

   
    self.targetFaculty.subscribe(function (newValue) {
        if (newValue !== undefined) {
            courseIds = "";
            specialityIds = "";
            groupIds = "";
            self.loadSpecialities(newValue.Id);
        }
    });

    self.currentDepartment.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadLecturers(newValue.Id);
            self.loadTutorials(newValue.Id);
            self.loadUnscheduledTutorials(newValue.Id);
        }
    });

    
    self.currentCourses.subscribe(function (newValue) {
        if ((newValue + "") == "") {
            courseIds = "";
            groupIds = "";
            if (self.targetFaculty() !== undefined) {
                self.loadGroups(self.targetFaculty().Id, courseIds, specialityIds);
            }
            return;
        }
        courseIds = "";
        groupIds = "";
        if (newValue !== undefined) {
            if (self.targetFaculty() !== undefined && self.currentCourses() !== undefined) {
                for (var i = 0; i < self.currentCourses().length; i++) {
                    if (self.currentCourses()[i] !== undefined) {
                        courseIds += self.currentCourses()[i].Id + ", ";
                    }
                }
            }
            self.loadGroups(self.targetFaculty().Id, courseIds, specialityIds);
        }
    });
   

    self.currentSpecialities.subscribe(function (newValue) {
        if ((newValue + "") == "") {
            specialityIds = "";
            groupIds = "";
            if (self.targetFaculty() !== undefined) {
                self.loadGroups(self.targetFaculty().Id, courseIds, specialityIds);
            }
            return;
        }
        specialityIds = "";
        groupIds = "";
        if (newValue !== undefined) {
           
            if (self.targetFaculty() !== undefined && self.currentSpecialities() !== undefined) {
                for (var i = 0; i < self.currentSpecialities().length; i++) {
                    if (self.currentSpecialities()[i] !== undefined) {
                        specialityIds += self.currentSpecialities()[i].Id + ", ";
                    }
                }
                self.loadGroups(self.targetFaculty().Id, courseIds, specialityIds);
            }
        }
    });

    
    self.currentGroups.subscribe(function (newValue) {
        if ((newValue + "") == "") {
            groupIds = "";
            return;
        }
        groupIds = "";
        if (newValue !== undefined) {
          
            if (self.targetFaculty() !== undefined && self.currentGroups() !== undefined) {
                for (var i = 0; i < self.currentGroups().length; i++) {
                    if (self.currentGroups()[i] !== undefined) {
                        groupIds += self.currentGroups()[i].Id + ", ";
                    }
                }
            }
        }
    });


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
    };

   

    self.addButton = function () {
        var okstate = 1;
     
        if (self.currentFaculty() == undefined) {
            self.showError("Выберите факультет")
            okstate = 0;
        } else {
            if (self.currentDepartment() == undefined) {
                self.showError("Выберите кафедру")
                okstate = 0;
            } else {
                if (self.currentLecturer() == undefined) {
                    self.showError("Выберите преподавателя")
                    okstate = 0;
                }
                if (self.currentTutorial() == undefined) {
                    self.showError("Выберите предмет")
                    okstate = 0;
                } else {
                    if (self.currentTutorialType() == undefined) {
                        self.showError("Выберите тип предмета")
                        okstate = 0;
                    }
                    if (self.hoursPerWeek() == undefined) {
                        self.showError("Введите кол-во часов в неделю")
                        okstate = 0;
                    }
                }
                if (groupIds == "") {
                    self.showError("Выберите группы")
                    okstate = 0;
                }
            }
        }

        if (okstate == 1) {
            self.sendData({
                address: "scheduleinfo/add",
                params: {
                    'LecturerId': self.currentLecturer().Id,
                    'TutorialTypeId': self.currentTutorialType().Id,
                    'TutorialId': self.currentTutorial().Id,
                    'DepartmentId': self.currentDepartment().Id,
                    'HoursPerWeek': self.hoursPerWeek(),
                    'FacultyId': self.targetFaculty().Id,
                    'groupIds': groupIds
                },
                onsuccess: function (data) {
                    if (self.currentDepartment() !== undefined) {
                        self.loadUnscheduledTutorials(self.currentDepartment().Id);
                    }
                },
                onerror: function (error) {
                    self.showError("Сохранение в Базу Данных не удалось");
                }
            });
        }
    };

    self.delButton = function () {
        if (self.Row1() == -1 || self.Row1() == undefined) {
            self.showError("Выберите строку для удаления");
            return;
        }

        self.sendData({
            address: "scheduleinfo/delete",
            params: {
                'Id': self.Table()[self.Row1()].Id
            },
            onsuccess: function (data) {
                self.Row1(-1);
                if (self.currentDepartment() !== undefined) {
                    self.loadUnscheduledTutorials(self.currentDepartment().Id);
                }
            },
            onerror: function (error) {
                alert("Удаление из Базы Данных не удалось!");
            }
        });

    };

    self.HeadFaculty = ko.observable("");
    self.HeadCourses = ko.observable("");
    self.HeadLecturer = ko.observable("");
    self.HeadTutorial = ko.observable("");
    self.HeadGroups = ko.observable("");
    self.HeadBuilding = ko.observable("");
    self.HeadAuditorium = ko.observable("");
    self.HeadWeekType = ko.observable("");

    self.SortByCourseState = ko.observable(false);
    self.SortByCourse = function () {
        self.SortByCourseState(!self.SortByCourseState());
        if (self.SortByCourseState() == true) {
            self.Table.sort(function (left, right) { return left.Courses == right.Courses ? 0 : (left.Courses < right.Courses ? -1 : 1) });
        } else {
            self.Table.sort(function (left, right) { return left.Courses == right.Courses ? 0 : (left.Courses > right.Courses ? -1 : 1) });
        }
    };

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





$(function () {
    var unscheduled = new unscheduledViewModel();
    unscheduled.init();
    ko.applyBindings(unscheduled);
});
