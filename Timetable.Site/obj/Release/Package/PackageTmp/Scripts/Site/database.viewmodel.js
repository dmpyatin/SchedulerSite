var daysOfWeek = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
var months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

function databaseViewModel() {
    var self = this;

    self.routingPattern = "{0}\\{1}"; //{ViewModelMethod}\{ParameterObject}
    self.defaultCommand = "page"; // 
    self.isLoading = ko.observable(false);
    self.selectedScheduleCard = ko.observable();

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

    self.departments = ko.observableArray([]);
    self.faculties = ko.observableArray([]);
    self.ranks = ko.observableArray([]);
    self.buildings = ko.observableArray([]);
    self.specialities = ko.observableArray([]);
    self.tutorialtypes = ko.observableArray([]);
    var auditoriumTutorialApplicabilities = " ";

    self.currentTutorialTypes = ko.observableArray([]);

    self.currentDepartment = ko.observable();
    self.currentFaculty = ko.observable();
    self.currentBuilding = ko.observable();
    self.currentRank = ko.observable();
    self.currentSpeciality = ko.observable();

    self.currentLecturerFIO = ko.observable();
    self.currentLecturerContact = ko.observable();

    self.currentAuditoriumNumber = ko.observable();
    self.currentAuditoriumCapacity = ko.observable();
    self.currentAuditoriumName = ko.observable();
    self.currentAuditoriumInfo = ko.observable();

    self.currentTutorialName = ko.observable();
    self.currentTutorialShortName = ko.observable();

    self.currentTimeStart = ko.observable();
    self.currentTimeEnd = ko.observable();


    self.init = function () {
        var localThis = this;

        self.loadData({
            address: "faculty/getall",
            obj: self.faculties,
            onsuccess: function () {

            }
        });

        self.loadData({
            address: "building/getall/",
            obj: self.buildings,
            onsuccess: function () {

            }
        });

        self.loadData({
            address: "tutorialtype/getall/",
            obj: self.tutorialtypes,
            onsuccess: function () {

            }
        });

        /*self.loadData({
            address: "rank/getall/",
            obj: self.ranks,
            onsuccess: function () {

            }
        });*/


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

    self.currentTutorialTypes.subscribe(function (newValue) {
        auditoriumTutorialApplicabilities = "";
        if(newValue !== undefined){
            for (var i = 0; i < newValue.length; ++i){
                auditoriumTutorialApplicabilities += newValue[i].Id + ", ";
            }
        }
    });

    self.currentFaculty.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadDepartments(newValue.Id);
            self.loadSpecialities(newValue.Id);
        }
    });

    self.currentDepartment.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadLecturersFormDB(newValue.Id);

            self.loadTutorialsFormDB(newValue.Id, -1);
        }
    });

    self.currentBuilding.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadAuditoriumsFormDB(newValue.Id);
            self.loadTimesFormDB(newValue.Id);
        }
    });

    

    self.pageState = ko.observable(0);
    self.changePage = function (page) {
        if (page == 0) {
            self.currentFaculty(self.faculties()[0]);
            self.currentSpeciality(self.specialities()[0]);
            self.currentBuilding(self.buildings()[0]);
            self.currentDepartment(self.departments()[0]);
        }
        self.pageState(page);
    }

    
    self.addLecturer = function () {
            self.sendData({
                address: "lecturer/add",
                params: {
                    'DepartmentId': self.currentDepartment().Id,
                    'FIO': self.currentLecturerFIO(),
                    'Contacts': self.currentLecturerContact(),
                    'RankId': self.currentRank()
                },
                onsuccess: function (data) {
                    if (self.currentDepartment() !== undefined) {
                        self.loadLecturersFormDB(self.currentDepartment().Id);
                    }
                },
                onerror: function (error) {
                    self.showError("Сохранение в Базу Данных не удалось");
                }
            });
    }

    self.delLecturer = function () {
        self.sendData({
            address: "lecturer/delete",
            params: {
                'Id': self.LecturerTable()[self.Row1()].Id
            },
            onsuccess: function (data) {
                if (self.currentDepartment() !== undefined) {
                    self.loadLecturersFormDB(self.currentDepartment().Id);
                }
            },
            onerror: function (error) {
                alert("Удаление из Базы Данных не удалось!");
            }
        });
    }

    self.addTutorial = function () {
       // alert("*");
        self.sendData({
            address: "tutorial/add",
            params: {
                'FacultyId': self.currentFaculty().Id,
                'SpecialityId': "",
                'DepartmentId': self.currentDepartment().Id,
                'Name': self.currentTutorialName(),
                'ShortName': self.currentTutorialShortName()
            },
            onsuccess: function (data) {
                if (self.currentDepartment() !== undefined) {
                    self.loadTutorialsFormDB(self.currentDepartment().Id, -1);
                }
            },
            onerror: function (error) {
                self.showError("Сохранение в Базу Данных не удалось");
            }
        });
    }

    self.delTutorial = function () {
            self.sendData({
                address: "tutorial/delete",
                params: {
                    'Id': self.TutorialTable()[self.Row1()].Id
                },
                onsuccess: function (data) {
                    if (self.currentDepartment() !== undefined) {
                        self.loadTutorialsFormDB(self.currentDepartment().Id, -1);
                    }
                },
                onerror: function (error) {
                    alert("Удаление из Базы Данных не удалось!");
                }
            });
    }

    self.addAuditorium = function () {
        self.sendData({
            address: "auditorium/add",
            params: {
                'BuildingId': self.currentBuilding().Id,
                'Number': self.currentAuditoriumNumber(),
                'Capacity': self.currentAuditoriumCapacity(),
                'Name': self.currentAuditoriumName(),
                'Info': self.currentAuditoriumInfo(),
                'TutorialApplicabilities': auditoriumTutorialApplicabilities
            },
            onsuccess: function (data) {
                if (self.currentBuilding() !== undefined) {
                    self.loadAuditoriumsFormDB(self.currentBuilding().Id);
                }
            },
            onerror: function (error) {
                self.showError("Сохранение в Базу Данных не удалось");
            }
        });
    }

    self.delAuditorium = function () {
        self.sendData({
            address: "auditorium/delete",
            params: {
                'Id': self.AuditoriumTable()[self.Row1()].Id
            },
            onsuccess: function (data) {
                if (self.currentBuilding() !== undefined) {
                    self.loadAuditoriumsFormDB(self.currentBuilding().Id);
                }
            },
            onerror: function (error) {
                alert("Удаление из Базы Данных не удалось!");
            }
        });
    }

    self.addTime = function () {
        self.sendData({
            address: "time/add",
            params: {
                'Start': self.currentTimeStart(),
                'End': self.currentTimeEnd(),
                'BuildingId': self.currentBuilding().Id,
            },
            onsuccess: function (data) {
                if (self.currentBuilding() !== undefined) {
                    self.loadTimesFormDB(self.currentBuilding().Id);
                }
            },
            onerror: function (error) {
                self.showError("Сохранение в Базу Данных не удалось");
            }
        });
    }

    self.delTime = function () {
        self.sendData({
            address: "time/delete",
            params: {
                'Id': self.TimesTable()[self.Row1()].Id
            },
            onsuccess: function (data) {
                if (self.currentBuilding() !== undefined) {
                    self.loadTimesFormDB(self.currentBuilding().Id);
                }
            },
            onerror: function (error) {
                alert("Удаление из Базы Данных не удалось!");
            }
        });
    }


    self.loadLecturersFormDB = function (departmentId) {
        if (departmentId !== undefined) {
            self.loadData({
                address: "lecturer/getfordepartment/",
                params: {
                    departmentid: departmentId
                },
                onsuccess: function (data) {
                    self.ApplyLecturerTable(data);
                }
            });
        }
    }

    self.loadTutorialsFormDB = function (departmentId, specialityId) {
        if (departmentId !== undefined && specialityId !== undefined) {
            self.loadData({
                address: "tutorial/GetForDepartmentAndSpeciality/",
                params: {
                    departmentid: departmentId,
                    specialityid: specialityId
                },
                onsuccess: function (data) {
                    self.ApplyTutorialTable(data);
                }
            });
        }
    }

    self.loadAuditoriumsFormDB = function (buildingId) {
        if (buildingId !== undefined) {
            self.loadData({
                address: "auditorium/GetAuditoriumForBuilding/",
                params: {
                    buildingid: buildingId,
                },
                onsuccess: function (data) {
                
                    self.ApplyAuditoriumTable(data);
                    
                }
            });
        }
    }

    self.loadTimesFormDB = function (buildingId) {
        if (buildingId !== undefined) {
            self.loadData({
                address: "time/GetTimeForBuilding/",
                params: {
                    buildingid: buildingId,
                },
                onsuccess: function (data) {
                    self.ApplyTimesTable(data);
                }
            });
        }
    }


    self.LecturerTable = ko.observableArray([]);
    self.ApplyLecturerTable = function (data) {
        var tbl = [];

        $.each(data, function (index, item) {
            tbl[index] = {
                Id: item.Id,
                FIO: item.Name,
                Contacts: item.Contacts,
                Rank: item.Rank
            }
        });
        self.LecturerTable(tbl);
    }

    self.TutorialTable = ko.observableArray([]);
    self.ApplyTutorialTable = function (data) {
        var tbl = [];

        $.each(data, function (index, item) {
            tbl[index] = {
                Id: item.Id,
                Name: item.Name,
                ShortName: item.ShortName,
            }
        });
        self.TutorialTable(tbl);
    }

    self.AuditoriumTable = ko.observableArray([]);
    self.ApplyAuditoriumTable = function (data) {
        var tbl = [];

        $.each(data, function (index, item) {
            tbl[index] = {
                Id: item.Id,
                Number: item.Number,
                Capacity: item.Capacity,
                Name: item.Name,
                Info: item.Info,
                Types: item.Types
            }
        });
        self.AuditoriumTable(tbl);
        self.AuditoriumTable.sort(function (left, right) { return left.Number == right.Number ? 0 : (left.Number < right.Number ? -1 : 1) });
    }

    self.TimesTable = ko.observableArray([]);
    self.ApplyTimesTable = function (data) {
        var tbl = [];

        $.each(data, function (index, item) {
            tbl[index] = {
                Id: item.Id,
                Start: item.Start,
                End: item.End,
            }
        });
        self.TimesTable(tbl);
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

    }
};


$(function () {
    var database = new databaseViewModel();
    database.init();
    ko.applyBindings(database);
});