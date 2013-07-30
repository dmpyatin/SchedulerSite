function updateDataScheduleViewModel(parent) {
    var self = this;

    if (parent != null)
        extend(this, parent);

    self.currentFacultyId = ko.observable();
    self.currentScheduleInfoId = ko.observable();
    self.departments = ko.observableArray([]);
    self.scheduleInfos = ko.observableArray([]);
    self.specialities = ko.observableArray([]);
    self.lecturers = ko.observableArray([]);
    self.groups = ko.observableArray([]);

    self.addd = function () {
        alert(self.currentFacultyId());

    };

    self.addEditModal = {        
        currentGroupsId: ko.observableArray([]),
        currentSpecialitiesId: ko.observableArray([]),
        tutorialId: ko.observable(),
        tutorialTypeId: ko.observable(),
        auditorium: ko.observable(),
        lecturerId: ko.observable(),
        hoursPerWeek: ko.observable(),
        subGroupCount: ko.observable(),

        init: function() {
            this.tutorialId(undefined);
            this.tutorialType(undefined);
            this.auditorium(undefined);
            this.lecturerId(undefined);
            this.isupdate = false;
        },

        save: function() {
            var actionName = "scheduleinfo/post";
            self.sendData({
                    address: actionName,
                    params: {
                        'Id': self.currentScheduleInfoId(),
                        'faculty.Id': self.currentFacultyId(),
                        'course.Id': self.currentCourseId(),
                        'department.Id': self.currentDepartmentId(),
                        'tutorial.Id': self.addEditModal.tutorialId(),
                        'tutorialType.Id': self.addEditModal.tutorialTypeId(),
                        'groupIds': self.addEditModal.currentGroupsId(),
                        'specialityIds': self.addEditModal.currentSpecialitiesId(),
                        'auditoriumNum': self.addEditModal.auditorium(),
                        'lecturer.Id': self.addEditModal.lecturerId(),
                        'hoursPerWeek': self.addEditModal.hoursPerWeek(),
                        'subGroupCount': self.addEditModal.subGroupCount()
                    },
                    onsuccess: function(data) {
                        $("option:selected").prop("selected", false);

                        $("#lessonCardSuccessMessage").show();

                        setTimeout(function() {
                            $("#lessonCardSuccessMessage").hide();
                        }, 3000);

                        self.loadData({
                                address: "schedule/getforgroup",
                                params: { 'groupId': self.currentGroup() },
                                onsuccess: function(data) {
                                    self.applySchedule(data);
                                },
                                onerror: function(x, h, r) {
                                }
                            });

                        self.addLessonCardModel.init();
                    },
                    onerror: function(error) {
                        self.showError("Cохранение неудалось!");
                    }
                });
        },

        saveAndClose: function() {
            self.addEditModal.save();
            $("#addEditModal").modal('close');
        }
    };

    self.applySchedule = function (data) {
        var days = [["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""]];
        $.each(data, function (index, item) {

            days[item.DayOfWeek - 1][item.Period.Id - 1] = {
                Id: item.Id,
                TutorialName: item.Tutorial.Name,
                TutorialTypeName: item.TutorialType.Name,
                BuildingName: item.Auditorium.Building.Name,
                AuditoriumNum: item.Auditorium.Number,
                Lecturer: item.Lecturer.Lastname + " " + item.Lecturer.Firstname + " " + item.Lecturer.Middlename
            };
        });

        self.schedule(days);
    };

    self.currentDepartmentId.subscribe(function (newValue) {
        if(newValue !== undefined) {
            self.loadData({
                address: "ScheduleInfo/GetByDepartment",
                params: {
                    departmentid: newValue
                },
                onsuccess: function (data) {
                    self.scheduleInfos(data);
                },
                onerror: function (x, h, r) {
                }
            });

            self.loadData({
                address: "lecturer/getbydepartment",
                params: {
                    departmentId: newValue
                },
                onsuccess: function (data) {

                    $(data).each(function(index, item) {
                        data[index].fio = item.Lastname + ' ' + item.Firstname[0] + '. ' + item.Middlename[0] + '.';
                    });
                    
                    self.lecturers(data);
                },
                onerror: function (x, h, r) {
                }
            });
        }
    });
    

    
    self.currentFacultyId.subscribe(function (newValue) {
        if(newValue !== undefined) {
            self.loadData({
                address: "speciality/Getbyfaculty",
                params: {
                    facultyId: newValue
                },
                onsuccess: function (data) {
                    self.specialities(data);
                },
                onerror: function (x, h, r) {
                }
            });

            if (self.currentCourseId() !== undefined) {
                loadGroups();
            }
        }
    });

    self.currentCourseId.subscribe(function(newValue) {
        if(newValue !== undefined) {
            if(self.currentFacultyId() !== undefined)
            loadGroups();
        }
    });

    self.addEditModal.tutorialId.subscribe(function (newValue) {
        if (newValue !== undefined) {
            loadLecturers();
        }
    });

    // ######################### ViewModel command #################################
    // show add new lesson window
    self.addLessonView = function () {
        $("#addEditModal").modal();
    };

    // show edit lesson window
    self.editLessonView = function (s, e) {
        $("#addEditModal").modal();
    };

    // show delete lesson window
    self.deleteLessonView = function (s, e) {
    };

    self.deleteScheduleInfo = function(s, e) {
        self.deleteData({
            address: "ScheduleInfo",
            params: {
                id: self.currentScheduleInfoId()
            }
        });
    };

    self.scheduleInfoClick = function (s, e) {
        var currentTarget = $(e.currentTarget);

        self.currentScheduleInfoId(currentTarget.attr("data-scheduleinfoid"));
        
        $("tr.selected").removeClass("selected");
        currentTarget.addClass("selected");
    };

    function loadGroups() {
        self.loadData({
            address: "group/get/",
            obj: self.groups,
            params: {
                facultyid: self.currentFacultyId(),
                courseid: self.currentCourseId()
            },
            onbefore: function() {
                self.groups([]);
            },
            onsuccess: function () {
            }
        });
    }
    
    function loadLecturers() {
        self.loadData({
            address: "lecturer/get/",
            obj: self.lecturers,
            params: {
                tutorialid: self.addEditModal.tutorialId(),
            }
        });
    }

    // Initialize object
    this.init = function () {
        this.prototype.init.call(this);

        //if (!self.hasHash()) getData();
        self.applySchedule([]);
        self.updateWeekDays();
        
        self.loadData({
            address: "department/getall",
            onsuccess: function (data) {
                self.departments(data);
            },
            onerror: function (x, h, r) {
            }
        });

        jQuery.ajaxSettings.traditional = true;

//        $(".content").jScrollPane({ autoReinitialise: true });
//        $(".left-menu").jScrollPane({
//            autoReinitialise: true
//        });
        $("a, button, input").tooltip({ placement: 'bottom' });
        $("select").tooltip({ placement: 'bottom' });

        $(".numeric").autoNumeric({aPad: false});
    };
};

$(function () {
    var schedule = new updateDataScheduleViewModel(baseViewModel);

    schedule.init();

    ko.applyBindings(schedule);
})