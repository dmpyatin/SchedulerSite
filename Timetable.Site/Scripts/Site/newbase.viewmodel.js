//Модель данных
var dModel;
var freeScheduleTable = [[[], [], [], [], [], [], []],
                        [[], [], [], [], [], [], []],
                        [[], [], [], [], [], [], []],
                        [[], [], [], [], [], [], []],
                        [[], [], [], [], [], [], []],
                        [[], [], [], [], [], [], []],
                        [[], [], [], [], [], [], []],
                        [[], [], [], [], [], [], []],
                        [[], [], [], [], [], [], []]];




//Обработка ошибок
var showError = function (msg) {
    $.jGrowl("<b><span style='color: #f00;'>" + msg + "</span></b>", { header: "<b><span style='color: #f00;'>Ошибка</span></b>", position: "center" });
};

function CreateDateRangePicker(selector, parentForm) {


    /*
        {
            ranges: {
                'Сегодня': [moment(), moment()],
                'Вчера': [moment().subtract('days', 1), moment().subtract('days', 1)],
                'Эта неделя': [moment().startOf('week'), moment().endOf('week')],
                'Последние 7 дней': [moment().subtract('days', 6), moment()],
                'Последние 30 дней': [moment().subtract('days', 29), moment()],
                'Этот месяц': [moment().startOf('month'), moment().endOf('month')],
                'Прошлый месяц': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
            },
            startDate: moment().startOf('week'),
            endDate: moment().endOf('week')
        },
        function (start, end) {
            //parentForm.startDate(start);
            //parentForm.endDate(end);
            console.log("RANGE : ")
            console.log(start);
            console.log(end);
            $(selector + ' span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        });*/
};


//Форма печати отчетов
var PrintSettingForm = function (startDate, endDate, parentForm) {
    var self = this;

    self.currentFlowSelectForPrintForm = ko.observable(new FlowSelectForm(self));

    self.startDate = ko.observable(startDate);
    self.endDate = ko.observable(endDate);

    self.title = ko.computed(function () {
        var res = "";
        if (self.currentFlowSelectForPrintForm() !== undefined) {
            if (self.currentFlowSelectForPrintForm().currentBranch() !== undefined)
                res += self.currentFlowSelectForPrintForm().currentBranch().Name + " ";

            if (self.currentFlowSelectForPrintForm().currentFaculty() !== undefined)
                res += self.currentFlowSelectForPrintForm().currentFaculty().Name + " ";

            if (self.currentFlowSelectForPrintForm().currentCourses() !== undefined) {
                for (var i = 0; i < self.currentFlowSelectForPrintForm().currentCourses().length; ++i)
                    res += self.currentFlowSelectForPrintForm().currentCourses()[i].Name + " ";
            }

            if (self.currentFlowSelectForPrintForm().currentSpecialities() !== undefined) {
                for (var i = 0; i < self.currentFlowSelectForPrintForm().currentSpecialities().length; ++i)
                    res += self.currentFlowSelectForPrintForm().currentSpecialities()[i].Name + " ";
            }
            
            if (self.currentFlowSelectForPrintForm().currentGroups() !== undefined) {
                for (var i = 0; i < self.currentFlowSelectForPrintForm().currentGroups().length; ++i)
                    res += self.currentFlowSelectForPrintForm().currentGroups()[i].Code + " ";
            }
        }

        res += "(" + self.startDate() + " - ";
        res += self.endDate() + ")";

        return res;
    });

    self.fontSize = ko.observable(12);

    self.init = function (status) {
        if (status == true) {

        }
    };

    self.openDialog = function (status) {
        if (status == true) {
            $("#printsettingdialog").modal('show');
        }
    };

    self.closeDialog = function (status) {
        if (status == true) {
            $("#printsettingdialog").modal('hide');
        }
    };


  

    self.createPrintForm = function (status) {
        if (status == true) {
            console.log("create print form");
            var facultyId = null;
            var courseIds = "";
            var specialityIds = "";
            var groupIds = "";
            var subGroup = "";

            if(self.currentFlowSelectForPrintForm() !== undefined){
                if(self.currentFlowSelectForPrintForm().currentFaculty() !== undefined)
                    facultyId = self.currentFlowSelectForPrintForm().currentFaculty().Id;

                if(self.currentFlowSelectForPrintForm().currentCourses() !== undefined)
                    for(var i = 0; i < self.currentFlowSelectForPrintForm().currentCourses().length; ++i)
                        courseIds +=  self.currentFlowSelectForPrintForm().currentCourses()[i].Id + ", ";

                if(self.currentFlowSelectForPrintForm().currentSpecialities() !== undefined)
                    for(var i = 0; i < self.currentFlowSelectForPrintForm().currentSpecialities().length; ++i)
                        specialityIds +=  self.currentFlowSelectForPrintForm().currentSpecialities()[i].Id + ", ";

                if(self.currentFlowSelectForPrintForm().currentGroups() !== undefined)
                    for(var i = 0; i < self.currentFlowSelectForPrintForm().currentGroups().length; ++i)
                        groupIds += self.currentFlowSelectForPrintForm().currentGroups()[i].Id + ", ";
            }
           
            var ScheduleModel = {
               lecturerId: null,
               auditoriumId: null,
               facultyId: facultyId,
               courseIds: courseIds,
               specialityIds: specialityIds,
               groupIds: groupIds,
               subGroup: subGroup,
               startDate: self.startDate(),
               endDate: self.endDate()
            };

            var TimeModel = {
                buildingid: 1
            };

            $.ajax({
                url: "PrintSchedule/IndexForGroups",
                type: 'POST',
                contentType: 'application/json',
                dataType: 'html',
                data: JSON.stringify({ s: ScheduleModel, t: TimeModel, h: self.title(), fs: self.fontSize()}),
                success: function (responseText, textStatus, XMLHttpRequest) {
                    console.log("success print");
                    console.log(responseText);
                   
                    var OpenWindow = window.open('', 'Форма печати', 'width=1100,height=500,resizable=1');
                    console.log(OpenWindow);
                    $(OpenWindow.document.body).ready(function () {
                        $(OpenWindow.document.body).append(responseText);
                    });
                },
                error: function () {

                }
            });
        }
    }

    self.makeReport = function (status) {
        if (status == true) {
            self.createPrintForm(true);
        }
    };

    self.init(true);

};

//Форма подтверждения обновления сведения к расписанию
var UpdateScheduleInfoConfirmForm = function (action) {
    var self = this;

    self.init = function (status) {
        if (status == true) {

        }
    };

    self.openDialog = function (status) {
        if (status == true) {
            $("#updsiconfdialog").modal('show');
        }
    }

    self.closeDialog = function (status) {
        if (status == true) {
            $("#updsiconfdialog").modal('hide');
        }
    }

    self.okButtonClick = function (status) {
        if (status == true) {
            action(true);
            self.closeDialog(true);
        }
    }

    self.cancelButtonClick = function (status) {
        if (status == true) {
            self.closeDialog(true);
        }
    }

    self.init(true);

};

//Форма подтверждения удаления занятия
var DeleteScheduleConfirmForm = function (action, schedule) {
    var self = this;

    self.init = function (status) {
        if (status == true) {

        }
    };

    self.openDialog = function (status) {
        if (status == true) {
            $("#delsconfdialog").modal('show');
        }
    }

    self.closeDialog = function (status) {
        if (status == true) {
            $("#delsconfdialog").modal('hide');
        }
    }

    self.okButtonClick = function (status) {
        if (status == true) {
            action(true, schedule);
            self.closeDialog(true);
        }
    }

    self.cancelButtonClick = function (status) {
        if (status == true) {
            self.closeDialog(true);
        }
    }

    self.init(true);

};

//Форма подтверждения обновления занятия
var UpdateScheduleConfirmForm = function (action) {
    var self = this;

    self.openDialog = function (status) {
        if (status == true) {
            $("#updsconfdialog").modal('show');
        }
    }

    self.closeDialog = function (status) {
        if (status == true) {
            $("#updsconfdialog").modal('hide');
        }
    }

    self.okButtonClick = function (status) {
        if (status == true) {
            action(true);
            self.closeDialog(true);
        }
    }

    self.cancelButtonClick = function (status) {
        if (status == true) {
            self.closeDialog(true);
        }
    }

    //self.init(true);

};

//Форма обновления занятия
var UpdateScheduleForm = function (parentForm, param, schedule, times) {

    var self = this;

    self.currentConfirmForm = ko.observable();
    self.validateScheduleForm = ko.observable();

    self.translateDate = function (status, date) {
        if (status == true) {
            res = date.split(".");
            console.log(res);
            return res[2] + "-" + res[1] + "-" + res[0];
        }
    }

    self.days = ko.observableArray([{ Id: 1, Name: "Понедельник" }, { Id: 2, Name: "Вторник" }, { Id: 3, Name: "Среда" }, { Id: 4, Name: "Четверг" }, { Id: 5, Name: "Пятница" }, { Id: 6, Name: "Суббота" }]);
    self.currentDay = ko.observable();

    self.times = ko.observableArray(times);
    self.currentTime = ko.observable();

    self.auditoriumTypes = ko.observableArray([]);
    self.currentAuditoriumType = ko.observable();
    self.auditoriums = ko.observableArray([]);
    self.currentAuditorium = ko.observable();

    self.currentSchedule = ko.observable(schedule);


    self.currentStartDate = ko.observable(self.translateDate(true, self.currentSchedule().StartDate));
    self.currentEndDate = ko.observable(self.translateDate(true, self.currentSchedule().EndDate));

    self.subGroups = ko.observableArray(["Все", "1", "2", "3"]);
    self.currentSubGroup = ko.observable();

    self.weekTypes = ko.observableArray([]);
    self.currentWeekType = ko.observable();

    self.presetAuditoriumType = function (status) {  
        if (status == true) {
            for (var i = 0; i < self.auditoriumTypes().length; ++i)
                if (self.currentSchedule().AuditoriumTypeId == self.auditoriumTypes()[i].Id)
                    self.currentAuditoriumType(self.auditoriumTypes()[i]);
        }
    }

    self.presetDay = function (status) {
        if (status == true) {
            for (var i = 0; i < self.days().length; ++i)
                if (self.currentSchedule().DayOfWeek == self.days()[i].Id)
                    self.currentDay(self.days()[i]);
        }
    }

    self.presetTime = function (status) {
        if (status == true) {
            for (var i = 0; i < self.times().length; ++i)
                if (self.currentSchedule().PeriodId == self.times()[i].Id)
                    self.currentTime(self.times()[i]);
        }
    }

    self.presetWeekType = function (status) {
        if (status == true) {
            for (var i = 0; i < self.weekTypes().length; ++i)
                if (self.currentSchedule().WeekTypeId == self.weekTypes()[i].Id)
                    self.currentWeekType(self.weekTypes()[i]);
        }
    }

    self.presetAuditorium = function (status) {
        if (status == true) {
            for (var i = 0; i < self.auditoriums().length; ++i)
                if (self.currentSchedule().AuditoriumId == self.auditoriums()[i].Id)
                    self.currentAuditorium(self.auditoriums()[i]);
        }
    }

    self.presetSubGroup = function (status) {
        if (status == true) {
            for (var i = 0; i < self.subGroups().length; ++i)
                if (self.currentSchedule().subGroup == self.subGroups()[i])
                    self.currentSubGroup(self.subGroups()[i]);
        }
    }

    self.currentStartDate.subscribe(function (newValue) {
        self.tryUpdateSchedule(true);
    });

    self.currentEndDate.subscribe(function (newValue) {
        self.tryUpdateSchedule(true);
    });

    self.currentDay.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadFreeAuditoriums(true, 1, self.currentAuditoriumType());
            self.tryUpdateSchedule(true);
        }
    });

    self.currentTime.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadFreeAuditoriums(true, 1, self.currentAuditoriumType());
            self.tryUpdateSchedule(true);
        }
    });

    self.currentSubGroup.subscribe(function (newValue) {
        if(newValue !== undefined)
            self.tryUpdateSchedule(true);
    });

    self.currentWeekType.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadFreeAuditoriums(true, 1, self.currentAuditoriumType());
            self.tryUpdateSchedule(true);
        }
    });
 
    self.currentAuditoriumType.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadFreeAuditoriums(true, 1, newValue);
            self.tryUpdateSchedule(true);
        }
    });

    self.currentAuditorium.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.tryUpdateSchedule(true);
        }
    });

    self.loadAuditoriumTypes = function (status, isInit) {
        if (status == true) {
            dModel.loadData({
                address: "auditoriumtype/getall",
                obj: self.auditoriumTypes,
                onsuccess: function () {
                    if (isInit)
                        self.presetAuditoriumType(true);
                }
            });
        }
    }

    self.loadFreeAuditoriums = function (status, buildingId, auditoriumType) {
        if (status == true &&
            self.currentWeekType() !== undefined &&
            self.currentDay() !== undefined &&
            self.currentTime() !== undefined &&
            self.currentSchedule() !== undefined &&
            auditoriumType !== undefined) {

            dModel.loadData({
                address: "auditorium/GetFree",
                obj: self.auditoriums,
                params: {
                    buildingId: buildingId,
                    weekTypeId: self.currentWeekType().Id,
                    day: self.currentDay().Id,
                    timeId: self.currentTime().Id,
                    tutorialtypeid: self.currentSchedule().TutorialTypeId,
                    auditoriumtypeid: auditoriumType.Id,
                    starttime: self.currentStartDate(),
                    endtime: self.currentEndDate(),
                },
                onsuccess: function () {
                    self.presetAuditorium(true);
                }
            });
        }
    }
   
    self.loadWeekTypes = function (status, isInit) {
        if (status == true) {
            dModel.loadData({
                address: "weektype/getall",
                obj: self.weekTypes,
                onsuccess: function () {
          
                    if(isInit)
                        self.presetWeekType(true);
                }
            });
        }
    }

    self.tryUpdateSchedule = function (status) {
        if (status == true) {
            console.log("TRY UPD");
            self.updateScheduleReal(true, "try");
        }
    };

    self.updateSchedule = function (status) {
        if (status == true) {
            console.log("UPD");
            self.updateScheduleReal(true, "execute");
        }
    };

    self.updateSchedule2 = function (status, schedule) {
        if (status == true) {
            console.log("UPD2");
            self.updateScheduleReal2(true, schedule, "execute");
        }
    }

    self.isScheduleLoading = ko.observable(false);

    self.updateScheduleReal = function (status, mode) {
        if (status == true && !self.isScheduleLoading()) {

            self.validateScheduleForm(undefined);

            var subGroup = self.currentSubGroup();
            if (subGroup == "Все")
                subGroup = "";

            if (self.currentSchedule() !== undefined &&
                self.currentAuditorium() !== undefined &&
                self.currentDay() !== undefined &&
                self.currentTime() !== undefined &&
                self.currentWeekType() !== undefined &&
                self.currentStartDate() !== undefined &&
                self.currentEndDate() !== undefined) {

                
                self.isScheduleLoading(true);
                dModel.sendData({
                    address: "schedule/update",
                    params: {
                        'ScheduleId': self.currentSchedule().Id,
                        'AuditoriumId': self.currentAuditorium().Id,
                        'ScheduleInfoId': self.currentSchedule().ScheduleInfoId,
                        'DayOfWeek': self.currentDay().Id,
                        'PeriodId': self.currentTime().Id,
                        'WeekTypeId': self.currentWeekType().Id,
                        'StartDate': self.currentStartDate(),
                        'EndDate': self.currentEndDate(),
                        'AutoDelete': self.currentSchedule().AutoDelete,
                        'SubGroup': subGroup,
                        'GroupIds': self.currentSchedule().GroupIds,
                        'Mode': mode
                    },
                    onsuccess: function (data) {
                        self.isScheduleLoading(false);

                        self.validateScheduleForm(new ValidateScheduleForm());
                        self.validateScheduleForm().doingSuccess(false);

                        self.validateScheduleForm().validate(true, data);
                 
                        if (data.length == 0) {
                            parentForm.loadSchedules(true);

                            if (mode == "try")
                                self.validateScheduleForm().canDo(true);
                            if (mode == "execute") {
                                self.validateScheduleForm().doingSuccess(true);
                            }
                        } else {
                            self.validateScheduleForm().canDo(false);
                            self.validateScheduleForm().doingSuccess(false);
                        }
                    }
                });
            }
        }
    }

    self.updateScheduleReal2 = function (status, schedule, mode) {
        if (status == true && !self.isScheduleLoading()) {

            self.validateScheduleForm(undefined);

            var subGroup = schedule.SubGroup;
            if (subGroup == "Все")
                subGroup = "";

            self.isScheduleLoading(true);
            dModel.sendData({
                address: "schedule/update",
                params: {
                    'ScheduleId': schedule.Id,
                    'AuditoriumId': schedule.AuditoriumId,
                    'ScheduleInfoId': schedule.ScheduleInfoId,
                    'DayOfWeek': schedule.DayOfWeek,
                    'PeriodId': schedule.PeriodId,
                    'WeekTypeId': schedule.WeekTypeId,
                    'StartDate': self.translateDate(true, schedule.StartDate),
                    'EndDate': self.translateDate(true, schedule.EndDate),
                    'AutoDelete': schedule.AutoDelete,
                    'SubGroup': schedule.SubGroup,
                    'GroupIds': schedule.GroupIds,
                    'Mode': mode
                },
                onsuccess: function (data) {
                    self.isScheduleLoading(false);

                    self.validateScheduleForm(new ValidateScheduleForm());
                    self.validateScheduleForm().doingSuccess(false);

                    self.validateScheduleForm().validate(true, data);

                    if (data.length == 0) {
                        parentForm.loadSchedules(true);

                        if (mode == "try")
                            self.validateScheduleForm().canDo(true);
                        if (mode == "execute") {
                            self.validateScheduleForm().doingSuccess(true);
                        }

                    } else {
                        self.validateScheduleForm().canDo(false);
                        self.validateScheduleForm().doingSuccess(false);
                        self.validateScheduleForm().openDialog(true);
                    }
                }
            });
        }

    }
  
    self.init = function (status) {
        if (status == true) {

            self.presetSubGroup(true);

            if (param !== true) {
                self.loadWeekTypes(true, true);
                self.loadAuditoriumTypes(true, true);
                self.presetDay(true);
            }
        }
    };

    self.updateButtonClick = function (status) {
        if (status == true) {
            if (!$("#ScheduleOkButton").hasClass("disabled")) {
                self.currentConfirmForm(new UpdateScheduleConfirmForm(self.updateSchedule));
                self.currentConfirmForm().openDialog(true);
            }
        }
    }

    self.openDialog = function (status) {
        if (status == true) {
            $("#updsdialog").modal('show');
        }
    }

    self.closeDialog = function (status) {
        if (status == true) {
            $("#updsdialog").modal('hide');
        }
    }

    self.cancelButtonClick = function (status) {
        if (status == true) {
            self.closeDialog(true);
        }
    }

    self.init(true);
};

var FreeAuditoriumsForm = function (timeId, dayId, wtId, scheduleInfo, parentForm, startDate, endDate) {
    var self = this;

    self.startDate = ko.observable(startDate);
    self.endDate = ko.observable(endDate);

    self.auditoriumTypes = ko.observableArray([]);
    self.currentAuditoriumType = ko.observable();
    self.currentAuditoriumType.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadFreeAuditoriums(true, parentForm.currentBuilding().Id, newValue);
        }
    });

    self.auditoriums = ko.observableArray([]);
    self.currentAuditorium = ko.observable();

    self.currentAuditorium.subscribe(function (newValue) {
        if (newValue !== undefined) {
            parentForm.auditorium(newValue);
        }
    });

    self.loadAuditoriumTypes = function (status) {
        if (status == true) {
            dModel.loadData({
                address: "auditoriumtype/getall",
                obj: self.auditoriumTypes,
                onsuccess: function () {

                }
            });
        }
    }

    self.loadFreeAuditoriums = function (status, buildingId, auditoriumType) {
        if (status == true &&
            auditoriumType !== undefined) {

            dModel.loadData({
                address: "auditorium/GetFree",
                obj: self.auditoriums,
                params: {
                    buildingId: buildingId,
                    weekTypeId: wtId,
                    day: dayId,
                    timeId: timeId,
                    tutorialtypeid: 1,
                    auditoriumtypeid: auditoriumType.Id,
                    starttime: self.startDate(),
                    endtime: self.endDate(),
                },
                onsuccess: function () {

                }
            });
        }
    }


    self.init = function (status) {
        if (status == true) {
            self.loadAuditoriumTypes(true);
        }
    };


    self.openDialog = function (status) {
        if (status == true) {
            $("#auditoriumdialog").modal('show');
        }
    }

    self.closeDialog = function (status) {
        if (status == true) {
            $("#auditoriumdialog").modal('hide');
        }
    }

    self.cancelButtonClick = function (status) {
        if (status == true) {
            self.closeDialog(true);
        }
    }

    self.selectButtonClick = function (status) {
        if (status == true) {
            self.closeDialog(true);
        }
    }

    self.init(true);

};

//Форма контекстного меню для клетки таблицы занятий
var ScheduleBacketContextMenuForm = function (xPos, yPos, parentForm) {
    var self = this;

    $(document).click(function () {
        $("#scheduleBacketContextMenu").addClass("hide");
    });


    self.init = function (status) {
        if (status == true) {

        }
    };

    self.openDialog = function (status) {
        if (status == true) {
            $("#scheduleBacketContextMenu").removeClass("hide");
            $("#scheduleBacketContextMenu").css({
                left: xPos,
                top: yPos
            });
        }
    };

    self.closeDialog = function (status) {
        if (status == true) {
            $("#scheduleBacketContextMenu").addClass("hide");
        }
    };


    self.addScheduleClick = function (status) {
        if (status == true) {
            
            console.log("Add Schedule Click");

            var ind = parentForm.clickedBacketIndexes();
            var weekTypeId = 1;
            if (ind.wt == 0) weekTypeId = 2;
            if (ind.wt == 2) weekTypeId = 3;

            parentForm.currentScheduleAddForm(new ScheduleAddForm(parentForm, parentForm.parentForm.currentScheduleInfoSelectForm().currentScheduleInfo(),
                                                    parentForm.times()[ind.row].Id, parentForm.days()[ind.col].Id, weekTypeId, parentForm.startTime(), parentForm.endTime(), parentForm.auditorium().Id));
            parentForm.currentScheduleAddForm().openDialog(true);
            self.closeDialog(true);
        }
    };

    self.freeAuditoriumsClick = function (status) {
        if (status == true) {
            var ind = parentForm.clickedBacketIndexes();
            var weekTypeId = 1;
            if (ind.wt == 0) weekTypeId = 2;
            if (ind.wt == 2) weekTypeId = 3;
            parentForm.freeAuditoriumsForm(new FreeAuditoriumsForm(parentForm.times()[ind.row].Id, parentForm.days()[ind.col].Id, weekTypeId, parentForm.parentForm.currentScheduleInfoSelectForm().currentScheduleInfo(), parentForm, parentForm.startTime(), parentForm.endTime()));
            parentForm.freeAuditoriumsForm().openDialog(true);
            self.closeDialog(true);
        }
    };

    self.calendarClick = function (status) {
        if (status == true) {

            var ind = parentForm.clickedBacketIndexes();
            var weekTypeId = 1;
            if (ind.wt == 0) weekTypeId = 2;
            if (ind.wt == 2) weekTypeId = 3;

            console.log("Calendar click");
            var groupIds = "";
            for(var i = 0; i < parentForm.groups().length; ++i)
                groupIds += parentForm.groups()[i].Id + ", ";
            var lecturerId = undefined;
            if(parentForm.lecturer() !== undefined)
                lecturerId = parentForm.lecturer().Id;

            parentForm.currentCalendarForm(new Calendar(parentForm.days()[ind.col].Id, parentForm.times()[ind.row].Id, weekTypeId,
                                                        lecturerId, groupIds, parentForm.currentSubGroup(), parentForm));

            parentForm.currentCalendarForm().openDialog(true);
            self.closeDialog(true);
        }
    };


};

//Форма выбора занятий
var ScheduleSelectForm = function (lecturer, groups, startTime, endTime, parentForm) {
    var self = this;

    self.translateDate = function (status, date) {
        if (status == true) {
            res = date.split(".");
            console.log(res);
            return res[2] + "-" + res[1] + "-" + res[0];
        }
    }

    self.parentForm = parentForm;

    self.auditorium = ko.observable();
    self.auditorium.subscribe(function (newValue) {
     
    });

    self.lecturer = ko.observable(lecturer);
    self.lecturer.subscribe(function (newValue) {

    });

    self.scheduleStartTime = ko.observable();
    self.scheduleEndTime = ko.observable();


    self.startTime = ko.observable(startTime);
    self.endTime = ko.observable(endTime);

    self.title = ko.computed(function() {
        var res = "";
        if(parentForm.currentFlowSelectForm() !== undefined){
            if(parentForm.currentFlowSelectForm().currentBranch() !== undefined)
                res += parentForm.currentFlowSelectForm().currentBranch().Name + " ";

            if(parentForm.currentFlowSelectForm().currentFaculty() !== undefined)
                res += parentForm.currentFlowSelectForm().currentFaculty().Name + " ";

            if (parentForm.currentFlowSelectForm().currentCourses() !== undefined) {
                for (var i = 0; i < parentForm.currentFlowSelectForm().currentCourses().length; ++i)
                    res += parentForm.currentFlowSelectForm().currentCourses()[i].Name + " ";
            }

            if (parentForm.currentFlowSelectForm().currentSpecialities() !== undefined) {
                for (var i = 0; i < parentForm.currentFlowSelectForm().currentSpecialities().length; ++i)
                    res += parentForm.currentFlowSelectForm().currentSpecialities()[i].Name + " ";
            }

            if (parentForm.currentFlowSelectForm().currentGroups() !== undefined) {
                for (var i = 0; i < parentForm.currentFlowSelectForm().currentGroups().length; ++i)
                    res += parentForm.currentFlowSelectForm().currentGroups()[i].Code + " ";
            }
        }

        if (self.lecturer() !== undefined)
            res += self.lecturer().Name + " ";
        

        if (self.auditorium() !== undefined)
            if (self.auditorium().Number !== undefined) {
                res += " ауд № " + self.auditorium().Number + " ";
            }


        if (self.scheduleStartTime() !== undefined && self.scheduleEndTime() !== undefined) {
            res += "(" + self.scheduleStartTime() + " - ";
            res += self.scheduleEndTime() + ")";
        }else{
            res += "(" + self.startTime() + " - ";
            res += self.endTime() + ")";
        }

        return res;
    });
         
    self.isScheduleLoad = false;

    //Forms
    self.currentDeleteConfirmForm = ko.observable();
    self.currentScheduleUpdateForm = ko.observable();
    self.scheduleBacketContextMenuForm = ko.observable();
    self.scheduleContextMenuForm = ko.observable();
    self.scheduleUpdateForm = ko.observable();
    self.currentScheduleAddForm = ko.observable();
    self.currentCalendarForm = ko.observable();
    self.freeAuditoriumsForm = ko.observable();
    self.freeAuditoriumsInTableForm = ko.observable();
    self.selectAuditoriumContextMenuForm = ko.observable();

    //Properties
    self.buildings = ko.observableArray([]);
    self.currentBuilding = ko.observable();
    self.currentBuilding.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadTimes(true, newValue);
        }
    });

    self.buildingTimes = ko.observableArray([]);
    self.scheduleTimes = ko.observableArray([]);
    self.times = ko.observableArray([]);

    


    self.groupIds = ko.observable("");
    

    self.setGroupsIds = function (status, groups) {
        if (status == true) {
            var groupIds = "";
            if (groups !== undefined)
                for (var i = 0; i < groups.length; ++i)
                    groupIds += groups[i].Id + ", ";
            self.groupIds(groupIds);
        }
    };

    self.setGroupsIds(true, groups);

 
    self.weekTypes = ko.observableArray([]);
    self.currentWeekType = ko.observable();
    self.currentWeekType.subscribe(function (newValue) {
        if (newValue !== undefined) {
        }
    });

    self.subGroups = ko.observableArray(["Все", "1", "2", "3"]);
    self.currentSubGroup = ko.observable();
    self.currentSubGroup.subscribe(function (newValue) {
        if (newValue !== undefined) {
        }
    });


    self.startTime.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadSchedules(true);
        }
    });

    self.endTime.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadSchedules(true);
        }
    });

   

    self.isDragSchedule = ko.observable(false);

    self.days = ko.observableArray([{}, { Id: 1, Name: "Понедельник" }, { Id: 2, Name: "Вторник" }, { Id: 3, Name: "Среда" }, { Id: 4, Name: "Четверг" }, { Id: 5, Name: "Пятница" }, { Id: 6, Name: "Суббота" }]);


    self.preselectedBacketIndexes = ko.observable({ row: -1, col: -1, wt: -1 });
    self.clickedBacketIndexes = ko.observable({ row: -1, col: -1, wt: -1 });
    self.blockedRows = ko.observableArray();
    self.schedules = ko.observableArray([]);
    self.preselectedSchedule = ko.observable();
    self.clickedSchedule = ko.observable();


    //Backet and schedule subscribes

    self.clickedBacketIndexes.subscribe(function (newValue) {
        if (newValue !== undefined) {
            if (newValue.row != -1 && newValue.col != -1 && newValue.wt != -1) {

                //self.auditorium({ Id: undefined, Number: undefined });

                if (self.schedules()[newValue.row][newValue.col][newValue.wt] == undefined && !self.isDragSchedule())
                    self.clickedSchedule(undefined);

                $("#addButton").removeClass("disabled");
                $("#freeAuditoriumButton").removeClass("disabled");

                var WeekTypeId = newValue.wt;
                if (newValue.wt == 0) WeekTypeId = 2;
                if (newValue.wt == 2) WeekTypeId = 3;

                //if (parentForm.currentScheduleInfoSelectForm() !== undefined)
                   // self.freeAuditoriumsInTableForm(new FreeAuditoriumsForm(self.times()[newValue.row].Id, self.days()[newValue.col].Id, WeekTypeId, parentForm.currentScheduleInfoSelectForm().currentScheduleInfo(), self, self.startTime(), self.endTime()));
            } else {
                $("#addButton").addClass("disabled");
                $("#freeAuditoriumButton").addClass("disabled");
            }
        }
    });

  
    self.clickedSchedule.subscribe(function (newValue) {
        if (newValue !== undefined) {

            self.lecturer({ Id: newValue.LecturerId, Name: newValue.LecturerName });
            self.auditorium({ Id: newValue.AuditoriumId, Number: newValue.AuditoriumNumber });
            self.currentSubGroup(newValue.SubGroup);
            self.groupIds(newValue.GroupIds);
            self.scheduleStartTime(self.translateDate(true, newValue.StartDate));
            self.scheduleEndTime(self.translateDate(true, newValue.EndDate));

            self.loadSchedules(true);

            if (parentForm.currentScheduleInfoSelectForm() !== undefined)
                parentForm.currentScheduleInfoSelectForm().currentScheduleInfo(undefined);

            $("#delButton").removeClass("disabled");
            $("#changeScheduleButton").removeClass("disabled");
        } else {
            self.scheduleStartTime(undefined);
            self.scheduleEndTime(undefined);
            //self.lecturer(undefined);
            //self.auditorium(undefined);
            //self.currentSubGroup(undefined);
            //self.groupIds(undefined);

            $("#delButton").addClass("disabled");
            $("#changeScheduleButton").addClass("disabled");
        }
    });

   
    //Backet and Schedule events
    self.preselectBacket = function(status, row, col, wt){
        if (status == true) {
            self.preselectedBacketIndexes({row: row, col: col, wt: wt});
        }
    }

    self.clickBacketLeft = function (status, row, col, wt) {
        
        if (status == true) {
            var ind = self.clickedBacketIndexes();
            if (ind.row !== row || ind.col !== col || ind.wt !== wt) {

                self.auditorium({ Id: undefined, Number: undefined });
                if (self.schedules()[row][col][wt] == undefined)
                    self.clickedBacketIndexes({ row: row, col: col, wt: wt });
                else
                    self.clickedBacketIndexes({ row: -1, col: -1, wt: -1 });
            }
        }
    }

    self.doubleClickBacket = function (status, row, col, wt) {
        if (status == true) {
            console.log("db-click");
            var weekTypeId = 1;
            if (wt == 0) weekTypeId = 2;
            if (wt == 2) weekTypeId = 3;

            self.currentScheduleAddForm(new ScheduleAddForm(self, parentForm.currentScheduleInfoSelectForm().currentScheduleInfo(), self.times()[row].Id, self.days()[col].Id, weekTypeId, self.startTime(), self.endTime(), self.auditorium().Id));
            self.currentScheduleAddForm().openDialog(true);
        }
    }

    self.clickBacketRight = function (status, row, col, wt, data, event) {
        if (status == true) {
            var ind = self.clickedBacketIndexes();

            if (self.schedules()[row][col][wt] == undefined) {
                if (ind.row !== row || ind.col !== col || ind.wt !== wt) {
                    self.clickedBacketIndexes({ row: row, col: col, wt: wt });
                }
                if (self.scheduleContextMenuForm() !== undefined)
                    self.scheduleContextMenuForm().closeDialog(true);
                self.scheduleBacketContextMenuForm(new ScheduleBacketContextMenuForm(event.pageX, event.pageY, self));
                self.scheduleBacketContextMenuForm().openDialog(true);
            } else {
                self.clickedBacketIndexes({ row: -1, col: -1, wt: -1 });
                if (self.scheduleBacketContextMenuForm() !== undefined)
                    self.scheduleBacketContextMenuForm().closeDialog(true);

            }
        }
    }

    self.mouseOutBacket = function (status) {
        if (status == true) {
            self.preselectedBacketIndexes({ row: -1, col: -1, wt: -1});
        }
    }

    self.preselectSchedule = function (status, row, col, wt) {
        if (status == true) {
            self.preselectedSchedule(self.schedules()[row][col][wt]);
        }
    }

    self.clickScheduleLeft = function (status, row, col, wt) {
        if (status == true) {
            console.log("self.clickScheduleLeft");
            console.log(self.clickedSchedule());
            if (self.clickedSchedule() !== undefined && self.schedules()[row][col][wt] !== undefined) {
                if (self.clickedSchedule().Id !== self.schedules()[row][col][wt].Id)
                    self.clickedSchedule(self.schedules()[row][col][wt]);
            } else {
                self.clickedSchedule(self.schedules()[row][col][wt]);
            }
        }
    }

    self.clickScheduleRight = function (status, row, col, wt, data, event) {
        if (status == true) {
            if (self.clickedSchedule() !== undefined && self.schedules()[row][col][wt] !== undefined) {
                if (self.clickedSchedule().Id !== self.schedules()[row][col][wt].Id)
                    self.clickedSchedule(self.schedules()[row][col][wt]);
            } else {
                self.clickedSchedule(self.schedules()[row][col][wt]);
            }

            self.scheduleContextMenuForm(new ScheduleContextMenuForm(self.clickedSchedule(), event.pageX, event.pageY, self, self.times()));
            self.scheduleContextMenuForm().openDialog(true);
        }
    }

    self.mouseOutSchedule = function (status) {
        if (status == true) {
            self.preselectedSchedule(null);
        }
    }

    self.startDragSchedule = function (status, row, col, wt) {
        if (status) {
            self.isDragSchedule(true);

            console.log("self.startDragSchedule");
            console.log(self.clickedSchedule());
            console.log(self.schedules()[row][col][wt]);

            if (self.clickedSchedule() !== undefined && self.schedules()[row][col][wt] !== undefined) {
                if (self.clickedSchedule().Id !== self.schedules()[row][col][wt].Id)
                    self.clickedSchedule(self.schedules()[row][col][wt]);
            } else {
                self.clickedSchedule(self.schedules()[row][col][wt]);
            }

            self.clickedBacketIndexes({ row: row, col: col, wt: wt });       
        }
    }

    self.stopDragSchedule = function (status, row, col) {
        if (status == true) {
          
        }
    }

    self.dropBacket = function (status, row, col, wt, event, data) {
        if (status == true) {
     
            var myIndexes = event.target.firstElementChild.innerText.split(" ");
   
            row = myIndexes[0];
            col = myIndexes[1];
            wt = myIndexes[2];
       
            self.clickedBacketIndexes({ row: row, col: col, wt: wt });

            if (data.draggable.context.className.indexOf("scheduleInfo") !== -1) {
        
                var weekTypeId = 1;
                if (wt == 0) weekTypeId = 2;
                if (wt == 2) weekTypeId = 3;

                self.currentScheduleAddForm(new ScheduleAddForm(self, parentForm.currentScheduleInfoSelectForm().currentScheduleInfo(), self.times()[row].Id, self.days()[col].Id, weekTypeId, self.startTime(), self.endTime(), self.auditorium().Id));
                self.currentScheduleAddForm().openDialog(true);

            }else{
             
                self.currentScheduleUpdateForm(new UpdateScheduleForm(self, true, self.clickedSchedule(), self.times()));
                self.clickedSchedule().DayOfWeek = self.days()[col].Id;
                self.clickedSchedule().PeriodId = self.times()[row].Id;
                self.clickedSchedule().WeekTypeId = wt;
                if (wt == 0) self.clickedSchedule().WeekTypeId = 2;
                if (wt == 2) self.clickedSchedule().WeekTypeId = 3;

                self.currentScheduleUpdateForm().updateSchedule2(true, self.clickedSchedule());
            }

            self.isDragSchedule(false);
        }
    }

    self.outBacket = function (status) {
        if (status == true) {
        }
    }

    self.overBacket = function (status, row, col, wt, data, event) {
        if (status == true) {
        }
    }


    //Delete schedule
    self.realDeleteSchedule = function (status, schedule) {
        if (status == true) {
         
            if (schedule !== undefined) {
                dModel.sendData({
                    address: "schedule/delete",
                    params: {
                        'Id': schedule.Id,
                    },
                    onsuccess: function () {
                        self.loadSchedules(true);
                        parentForm.currentScheduleInfoSelectForm().loadScheduleInfoes(true);
                    }
                });
            }
        }
    }

    self.deleteSchedule = function (status, schedule) {
        if (status == true) {
            self.currentDeleteConfirmForm(new DeleteScheduleConfirmForm(self.realDeleteSchedule, schedule));
            self.currentDeleteConfirmForm().openDialog(true);
        }
    }

    //init table
    self.init = function (status) {
        if (status == true) {
            self.loadWeekTypes(true);
            self.loadBuildings(true);
        }
    };


    self.loadBuildings = function (status) {
        if (status == true) {
            dModel.loadData({
                address: "building/getall",
                obj: self.buildings,
                onsuccess: function () {
                   
                }
            });
        }
    }

    self.loadTimes = function (status, building) {
        if (status == true && building !== undefined) {
            dModel.loadData({
                address: "time/getall",
                obj: self.buildingTimes,
                params: {
                    buildingId: building.Id
                },
                onsuccess: function () {
                    self.loadSchedules(true);
                }
            });
        }
    }

    self.loadWeekTypes = function (status) {
        if (status == true) {
            dModel.loadData({
                address: "weektype/getall",
                obj: self.weekTypes,
                onsuccess: function () {
             
                }
            });
        }
    }


    self.blockedCells = ko.observableArray([]);
    //loadSchedules
    self.loadSchedules = function (status) {
    
        if (status == true && !self.isScheduleLoad) {
            console.log("self.loadSchedules");
            console.log(self.groupIds());

            var prevClickedSchedule = self.clickedSchedule();
            var prevClickedBacketIndexes = self.clickedBacketIndexes();

            self.isScheduleLoad = true;
         
            if(self.lecturer() !== undefined)
                var lecturerId = self.lecturer().Id;
            if (self.auditorium() !== undefined)
                var auditoriumId = self.auditorium().Id;
            if (self.currentWeekType() !== undefined)
                var weekTypeId = self.currentWeekType().Id;
            if (self.currentSubGroup() !== undefined)
                var subGroup = self.currentSubGroup();


            if (self.scheduleStartTime() !== undefined && self.scheduleEndTime() !== undefined) {
                var startTime = self.scheduleStartTime();
                var endTime = self.scheduleEndTime();

                

            } else {
                if (self.startTime() !== undefined)
                    var startTime = self.startTime();
                if (self.endTime() !== undefined)
                    var endTime = self.endTime();
            }

            console.log(startTime);
            console.log(endTime);

            
            if (lecturerId == undefined) lecturerId = null;
            if (auditoriumId == undefined) auditoriumId = null;
            if (weekTypeId == undefined) weekTypeId = null;
            if (lecturerId == undefined) lecturerId = null;
            if (startTime == undefined) startTime = "";
            if (endTime == undefined) endTime = "";
            if (subGroup == "Все") subGroup = "";


            var groupIds = self.groupIds();

            
            console.log("AuditoriumId");
            console.log(auditoriumId);

            dModel.loadData({
                address: "schedule/GetScheduleByAll",
                params: {
                    lecturerId: lecturerId,
                    auditoriumId: auditoriumId,
                    groupIds: groupIds,
                    weekTypeId: weekTypeId,
                    subGroup: subGroup,
                    startTime: startTime,
                    endTime: endTime
                },
                onsuccess: function (data) {

                    self.clickedBacketIndexes({ row: -1, col: -1, wt: -1 });

                    self.filteredTimes = ko.observableArray([]);
                    self.scheduleTimes([]);
                    self.times([]);
                    
                    
                    for (var i = 0; i < self.buildingTimes().length; ++i) {
                        var t = { Id: self.buildingTimes()[i].Id, Start: self.buildingTimes()[i].Start, End: self.buildingTimes()[i].End, StartEnd: self.buildingTimes()[i].StartEnd, IsBuilding: true };
                        if (self.filteredTimes.indexOf(t.StartEnd) == -1) {
                            self.filteredTimes.push(t.StartEnd);
                            self.times.push(t);
                        }
                    }

                    for (var i = 0; i < data.length; ++i) {
                        var t = { Id: data[i].PeriodId, Start: data[i].StartTime, End: data[i].EndTime, StartEnd: data[i].StartTime + "-" + data[i].EndTime, IsBuilding: false };
                        if (self.filteredTimes.indexOf(t.StartEnd) == -1) {
                            self.filteredTimes.push(t.StartEnd);
                            self.scheduleTimes.push(t);
                            self.times.push(t);
                        }
                    }

                    self.times.sort(function (left, right) {
                        return left.Start == right.Start ? 0 : (left.Start < right.Start ? -1 : 1)
                    });


                    var tempSchedulesArray = []
                    var tempBlockedCells = []
          
                    for (var i = 0; i < self.times().length; ++i) {
                
                        tempSchedulesArray.push([[], [], [], [], [], [], []]);
                        tempBlockedCells.push([[], [], [], [], [], [], []]);

                        if (self.times()[i].IsBuilding == false)
                            self.blockedRows()[i] = true;
                        else
                            self.blockedRows()[i] = false;
                    }
                
             
                    var prevInd;
                    for (var i = 0; i < data.length; ++i) {
                        var row = -1;
                        for (var j = 0; j < self.times().length; ++j)
                            if (data[i].PeriodId == self.times()[j].Id)
                                row = j;
                        var col = data[i].DayOfWeek;
                        var wt = 1;
                        if (data[i].WeekTypeId == 2)wt = 0;
                        if (data[i].WeekTypeId == 3)wt = 2;

                        if(prevClickedSchedule !== undefined)
                            if (data[i].Id == prevClickedSchedule.Id)
                                prevInd = { row: row, col: col, wt: wt };

                        tempSchedulesArray[row][col][wt] = data[i];

                        if (prevClickedSchedule !== undefined) {
                            if (data[i].Id !== prevClickedSchedule.Id) {
                                tempBlockedCells[row][col][wt] = true;
                                if (wt == 1) {
                                    tempBlockedCells[row][col][0] = true;
                                    tempBlockedCells[row][col][2] = true;
                                }
                                if (wt == 2) {
                                    tempBlockedCells[row][col][1] = true;
                                }
                                if (wt == 0) {
                                    tempBlockedCells[row][col][1] = true;
                                }
                            }
                        } else {
                            tempBlockedCells[row][col][wt] = true;
                            if (wt == 1) {
                                tempBlockedCells[row][col][0] = true;
                                tempBlockedCells[row][col][2] = true;
                            }
                            if (wt == 2) {
                                tempBlockedCells[row][col][1] = true;
                            }
                            if (wt == 0) {
                                tempBlockedCells[row][col][1] = true;
                            }
                        }
                    }

                    self.schedules(tempSchedulesArray);
                    self.blockedCells(tempBlockedCells);

                    console.log("self.blockedCells");
                    console.log(self.blockedCells());
                    console.log(self.schedules());
                   

                    if (prevInd !== undefined && parentForm.currentScheduleInfoSelectForm().currentScheduleInfo() == undefined) {
                        self.clickedSchedule(self.schedules()[prevInd.row][prevInd.col][prevInd.wt]);
                        self.lecturer({ Id: self.clickedSchedule().LecturerId, Name: self.clickedSchedule().LecturerName });
                        self.auditorium({ Id: self.clickedSchedule().AuditoriumId, Number: self.clickedSchedule().AuditoriumNumber });
                        self.groupIds(self.clickedSchedule().GroupIds);
                    }

                   

                    console.log("prevInd");
                    console.log(prevInd);
                    self.isScheduleLoad = false;
                }      
            });
        }
    }

   
    //Dialog functions and events

    self.openDialog = function (status) {
        if (status == true) {
            $("#ssdialog").modal('show');
        }
    };

    self.closeDialog = function (status) {
        if (status == true) {
            $("#ssdialog").modal('hide');
        }
    };

    self.startDrag = function (status) {
        if (status == true) {
        }
    };


    //Buttons handles
  
    self.clickSelectAuditorium = function (status, data, event) {
        console.log(event);
        if (status == true) {
            console.log("self.clickSelectAuditorium ");
            var ind = self.clickedBacketIndexes();
            var weekTypeId = 1;
            if (ind.wt == 0) weekTypeId = 2;
            if (ind.wt == 2) weekTypeId = 3;
            self.selectAuditoriumContextMenuForm(new SelectAuditoriumContextMenuForm(event.pageX, event.pageY, self.times()[ind.row].Id, self.days()[ind.col].Id, weekTypeId, parentForm.currentScheduleInfoSelectForm().currentScheduleInfo(), self, self.startTime(), self.endTime()));
            self.selectAuditoriumContextMenuForm().openDialog(true);

            console.log(ind);
        }
    }

    self.clickAddButton = function (status) {
        if (status == true) {
            var ind = self.clickedBacketIndexes();
            var weekTypeId = 1;
            if (ind.wt == 0) weekTypeId = 2;
            if (ind.wt == 2) weekTypeId = 3;
            self.currentScheduleAddForm(new ScheduleAddForm(self, parentForm.currentScheduleInfoSelectForm().currentScheduleInfo(), self.times()[ind.row].Id, self.days()[ind.col].Id, weekTypeId, self.startTime(), self.endTime(), self.auditorium().Id));
            self.currentScheduleAddForm().openDialog(true);
        }
    };

    self.clickDelButton = function (status) {
        if (status == true) {
            self.deleteSchedule(true, self.clickedSchedule());
        }
    }

    self.clickChangeScheduleButton = function (status) {
        if (status == true) {
            self.currentScheduleUpdateForm(new UpdateScheduleForm(self, false, self.clickedSchedule(), self.times()));
            self.currentScheduleUpdateForm().openDialog(true);
        }
    }

    self.clickFreeAuditoriumButton = function (status) {
        if (status == true) {
            var ind = self.clickedBacketIndexes();
            var weekTypeId = 1;
            if (ind.wt == 0) weekTypeId = 2;
            if (ind.wt == 2) weekTypeId = 3;
            self.freeAuditoriumsForm(new FreeAuditoriumsForm(self.times()[ind.row].Id, self.days()[ind.col].Id, weekTypeId, parentForm.currentScheduleInfoSelectForm().currentScheduleInfo(), self, self.startTime(), self.endTime()));
            self.freeAuditoriumsForm().openDialog(true);
        }
    }

    self.clickPrintSettingsButton = function (status) {
        console.log("okokok");
        if (status == true) {
            console.log("okokok23445");
            parentForm.currentPrintSettingForm(new PrintSettingForm(startTime, endTime, self));
            parentForm.currentPrintSettingForm().openDialog(true);
        }
    }


    self.init(true);
};


var SelectAuditoriumContextMenuForm = function (xPos, yPos, timeId, dayId, wtId, scheduleInfo, parentForm, startDate, endDate) {
    var self = this;

  

    self.currentAuditorium = ko.observable();

    self.currentAuditorium.subscribe(function (newValue) {
        if (newValue !== undefined) {
            parentForm.auditorium(newValue);
            self.closeDialog(true);
        }
    });

    self.freeAuditoriumsForm = ko.observable(new FreeAuditoriumsForm(timeId, dayId,wtId,scheduleInfo,parentForm,startDate,endDate));

    self.init = function (status) {
        if (status == true) {

        }
    };

    self.openDialog = function (status) {
        if (status == true) {
            $("#selectAuditoriumContextMenu").removeClass("hide");
            $("#selectAuditoriumContextMenu").css({
                left: xPos,
                top: yPos
            });
        }
    };

    self.closeDialog = function (status) {
        if (status == true) {
            $("#selectAuditoriumContextMenu").addClass("hide");
        }
    };
}

//Форма выбора потока
var FlowSelectForm = function (parentForm) {
    var self = this;

    var specialityIds = "";
    var courseIds = "";
    var groupIds = "";

    self.branches = ko.observableArray([]);
    self.currentBranch = ko.observable();

    self.courses = ko.observableArray([]);
    self.currentCourses = ko.observableArray([]);

    self.faculties = ko.observableArray([]);
    self.currentFaculty = ko.observable();

    self.groups = ko.observableArray([]);
    self.currentGroups = ko.observableArray([]);

    self.specialities = ko.observableArray([]);
    self.currentSpecialities = ko.observableArray([]);

    self.currentBranch.subscribe(function (newValue) {
        specialityIds = "";
        groupIds = "";
        if (newValue !== undefined) {
            self.loadFaculties(true,newValue.Id);
        }
    });

    self.currentFaculty.subscribe(function (newValue) {
        specialityIds = "";
        groupIds = "";
        if (newValue !== undefined) {
            console.log("Faculty sub");
            self.loadSpecialities(true, newValue.Id);
        }
    });

    self.currentSpecialities.subscribe(function (newValue) {
        groupIds = "";
        if (newValue !== undefined) {
            console.log("Speciality sub");
            if (self.currentFaculty() !== undefined) {
                specialityIds = "";
                for (var i = 0; i < newValue.length; ++i)
                    specialityIds += newValue[i].Id + ", ";
                self.loadGroups(true, self.currentFaculty().Id, courseIds, specialityIds);
            }
        }
    });

    self.currentCourses.subscribe(function (newValue) {
        groupIds = "";
        if (newValue !== undefined) {
            console.log("Courses sub");
            if (self.currentFaculty() !== undefined) {
                courseIds = "";
                for (var i = 0; i < newValue.length; ++i)
                     courseIds += newValue[i].Id + ", ";
                self.loadGroups(true, self.currentFaculty().Id, courseIds, specialityIds);
            }
        }
    });


    self.reloadScheduleAndScheduleInfo = function (status, newValue) {
        if (status == true) {
            if (parentForm.currentScheduleInfoSelectForm !== undefined) {
                if (newValue !== undefined) {
                    parentForm.currentScheduleInfoSelectForm(new ScheduleInfoSelectForm(newValue, { Id: 12 }, { Id: 0 }, parentForm));
                    parentForm.currentScheduleInfoSelectForm().loadScheduleInfoes(true);
                } else {
                    parentForm.currentScheduleInfoSelectForm(undefined);
                }
            }

            if (parentForm.currentScheduleSelectForm !== undefined) {
                parentForm.currentScheduleSelectForm().setGroupsIds(true, newValue);
                parentForm.currentScheduleSelectForm().loadSchedules(true);
            }
        }
    };

    self.currentGroups.subscribe(function (newValue) {
            self.reloadScheduleAndScheduleInfo(true, newValue);
    });


    self.loadFaculties = function (status, branchId) {
        if (status == true) {
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
    };

    self.loadSpecialities = function (status, facultyId) {
        if (status == true) {
            dModel.loadData({
                address: "speciality/getall",
                params: {
                    facultyid: facultyId,
                },
                obj: self.specialities,
                onsuccess: function () {
                }
            });
        }
    };

    self.loadGroups = function (status, facultyId, courseIds, specialityIds) {
        if (status == true) {
            dModel.loadData({
                address: "group/GetAll",
                params: {
                    facultyid: facultyId,
                    courseids: courseIds,
                    specialityids: specialityIds
                },
                obj: self.groups,
                onsuccess: function () {
                    self.reloadScheduleAndScheduleInfo(true, undefined);
                }
            });
        }
    };

    self.init = function (status) {
        if (status == true) {
            dModel.loadData({
                address: "course/getall",
                obj: self.courses,
                onsuccess: function () {

                }
            });
            dModel.loadData({
                address: "branch/getall",
                obj: self.branches,
                onsuccess: function () {
                }
            });
        }
    };

    self.init(true);

    self.openDialog = function (status) {
        if (status == true) {
            $("#flowdialog").modal('show');
        }
    };

    self.closeDialog = function (status) {
        if (status == true) {
            $("#flowdialog").modal('hide');
        }
    };
}

//Форма редактирования сведения к расписанию
var UpdateScheduleInfoForm = function (parentForm) {
    var self = this;

    self.currentConfirmForm = ko.observable();

    self.newScheduleInfo = ko.observable(parentForm.currentScheduleInfo());
    self.newHoursPerWeek = ko.observable(parentForm.currentScheduleInfo().HoursPerWeek);
    self.newLecturer = ko.observable(parentForm.currentScheduleInfo().LecturerName);

    self.updateScheduleInfo = function (status) {
        if (status == true) {
            self.newScheduleInfo().HoursPerWeek = self.newHoursPerWeek();

            dModel.sendData({
                address: "scheduleinfo/update",
                params: {
                    'ScheduleInfoId': self.newScheduleInfo().Id,
                    'HoursPerWeek': self.newScheduleInfo().HoursPerWeek
                },
                onsuccess: function () {
                    parentForm.loadScheduleInfoes(true);
                    //parentForm.scheduleInfoes()[parentForm.currentScheduleInfoIndex()] = self.newScheduleInfo();
                    //parentForm.scheduleInfoes(parentForm.scheduleInfoes());
                }
            });
        }
    }


    self.init = function (status) {
        if (status == true) {

        }
    };

    self.updateButtonClick = function (status) {
        if (status == true) {
            self.currentConfirmForm(new UpdateScheduleInfoConfirmForm(self.updateScheduleInfo));
            self.currentConfirmForm().openDialog(true);
            //self.updateScheduleInfo(true);
        }
    }

    self.openDialog = function (status) {
        if (status == true) {
            $("#updsidialog").modal('show');
        }
    }

    self.closeDialog = function (status) {
        if (status == true) {
            $("#updsidialog").modal('hide');
        }
    }

    self.cancelButtonClick = function (status) {
        if (status == true) {
            self.closeDialog(true);
        }
    }

    self.init(true);

};

//Форма контекстного меню для занятия
var ScheduleContextMenuForm = function (schedule, xPos, yPos, parentForm, times) {
    var self = this;

    self.isOpen = false;

    $(document).click(function () {
        $("#scheduleContextMenu").addClass("hide");
    });

    self.currentSchedule = ko.observable(schedule);

    self.init = function (status) {
        if (status == true) {

        }
    };

    self.openDialog = function (status) {
        if (status == true) {
            self.isOpen = true;
            $("#scheduleContextMenu").removeClass("hide");
            $("#scheduleContextMenu").css({
                left: xPos,
                top: yPos
            });
        }
    };

    self.closeDialog = function (status) {
        if (status == true) {
            self.isOpen = false;
            $("#scheduleContextMenu").addClass("hide");
        }
    };

 
    self.updateScheduleClick = function (status) {
        if (status == true) {
            parentForm.currentScheduleUpdateForm(new UpdateScheduleForm(parentForm, false, schedule, times));
            parentForm.currentScheduleUpdateForm().openDialog(true);
            self.closeDialog(true);
        }
    };
    self.deleteScheduleClick = function (status) {
        if (status == true) {
            parentForm.deleteSchedule(true, schedule);
            self.closeDialog(true);
        }
    };
};

//Форма контексного меню для сведения к расписанию
var ScheduleInfoContextMenuForm = function (scheduleInfo, xPos, yPos, parentForm) {
    var self = this;
    
    $(document).click(function () {
        $("#scheduleInfoContextMenu").addClass("hide");
    });
    
    self.currentScheduleInfo = ko.observable(scheduleInfo);

    self.init = function (status) {
        if (status == true) {

        }
    };

    self.openDialog=function(status) {
        if(status==true) {
            $("#scheduleInfoContextMenu").removeClass("hide");
            $("#scheduleInfoContextMenu").css({
                left: xPos,
                top: yPos
            });
        }
    };

    self.closeDialog=function(status) {
        if(status==true) {
            $("#scheduleInfoContextMenu").addClass("hide");
        }
    };

    self.updateScheduleInfoClick = function (status) {
        if (status == true) {
            parentForm.currentScheduleInfoUpdateForm(new UpdateScheduleInfoForm(parentForm));
            parentForm.currentScheduleInfoUpdateForm().openDialog(true);
            self.closeDialog(true);
        }
    };
    self.planScheduleInfoClick = function (status) {
        if (status == true) {
            self.closeDialog(true);
        }
    };
};

//Форма выбора сведений к расписанию
var ScheduleInfoSelectForm = function (groups, currentStudyYear, currentSemester, parentForm) {
    var self = this;

    self.currentScheduleInfoUpdateForm = ko.observable();

    self.scheduleInfoContextMenuForm=ko.observable();

    self.currentGroups = ko.observableArray(groups);
    self.currentStudyYear = ko.observable(currentStudyYear);
    self.currentSemester = ko.observable(currentSemester);
    
    self.tutorialTypes = ko.observableArray([]);
    self.currentTutorialType = ko.observable();
    self.currentTutorialType.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadScheduleInfoes(true);
        }
    });

    self.scheduleInfoes = ko.observableArray([]);
    self.currentScheduleInfo = ko.observable();
  

    self.currentScheduleInfoIndex = ko.observable(-1);
    self.selectedScheduleInfoIndex = ko.observable(-1);

    self.selectedScheduleInfoIndex.subscribe(function (newValue) {
        if (newValue !== undefined) {

        } else {
            self.currentScheduleInfo(undefined);
        }
    });

    var oldScheduleInfo;
    self.currentScheduleInfo.subscribe(function (newValue) {
        if (newValue !== undefined) {
            if (newValue != oldScheduleInfo) {

                parentForm.currentScheduleSelectForm().clickedSchedule(undefined);

                var newGroups = newValue.GroupIds.split(", "); newGroups.pop();
                var ng = [];
                for (var i = 0; i < newGroups.length; ++i)
                    ng.push({ Id: newGroups[i] });

                parentForm.currentScheduleSelectForm().lecturer({ Id: newValue.LecturerId, Name: newValue.LecturerName });
                parentForm.currentScheduleSelectForm().auditorium({ Id: newValue.AuditoriumId, Name: newValue.AuditoriumName });
                parentForm.currentScheduleSelectForm().currentSubGroup(newValue.SubGroup);
                parentForm.currentScheduleSelectForm().groupIds(newValue.GroupIds);

                parentForm.currentScheduleSelectForm().loadSchedules(true);
            }
        } else {
            self.currentScheduleInfoIndex(-1);
        }
        oldScheduleInfo = newValue;
    });
    
    self.loadTutorialTypes = function (status) {
        if (status == true) {
            dModel.loadData({
                address: "tutorialtype/getall",
                obj: self.tutorialTypes,
                onsuccess: function () {
                    
                }
            });
        }
    };

    self.init = function (status) {
        if (status == true) {
            self.loadTutorialTypes(true);
            parentForm.currentScheduleSelectForm().lecturer(undefined);
        }
    };

    self.init(true);
    
    self.loadScheduleInfoes = function (status) {
        if (status == true && self.currentTutorialType() !== undefined
                           && self.currentStudyYear() !== undefined
                           && self.currentSemester() !== undefined) {
            var groupIds = "";
            if (self.currentGroups() !== undefined) {
                for (var i = 0; i < self.currentGroups().length; ++i)
                    groupIds += self.currentGroups()[i].Id + ", ";
            }


            dModel.loadData({
                address: "scheduleinfo/GetByGroupsOnly",
                params: {
                    groupids: groupIds,
                    tutorialtypeid: self.currentTutorialType().Id,
                    studyyearid: self.currentStudyYear().Id,
                    semesterid: self.currentSemester().Id
                },
                onsuccess: function (data) {
                  
                    self.scheduleInfoes(data);
                }
            });
        }
    };
    
    self.startDrag = function (status) {
        if (status == true) {
            if (self.scheduleInfoContextMenuForm() !== undefined)
                self.scheduleInfoContextMenuForm().closeDialog(true);
        }
    };
    
    self.clickLeftScheduleInfo = function (status, index, data, event) {
        if (status == true) {
            self.currentScheduleInfo(self.scheduleInfoes()[index]);
            self.currentScheduleInfoIndex(index);

        }
    };
    
    self.doubleClickScheduleInfo = function (status, index) {
        if (status == true) {
            self.currentScheduleInfo(self.scheduleInfoes()[index]);
            self.currentScheduleInfoIndex(index);
        }
    };
    
    self.clickRightScheduleInfo = function (status, index, data, event) {
        if (status == true) {
            self.currentScheduleInfo(self.scheduleInfoes()[index]);
            self.currentScheduleInfoIndex(index);

            self.scheduleInfoContextMenuForm(new ScheduleInfoContextMenuForm(self.currentScheduleInfo(), event.pageX, event.pageY, self));
            self.scheduleInfoContextMenuForm().openDialog(true);
        }
    };
    
    self.mouseOverScheduleInfo = function (status, index) {
        if (status == true) {
            self.selectedScheduleInfoIndex(index);
        }
    };

    self.startDragScheduleInfo = function (status, index) {
        if (status == true) {
            self.currentScheduleInfo(self.scheduleInfoes()[index]);
            self.currentScheduleInfoIndex(index);
        }
    };

    self.stopDragScheduleInfo = function (status, index) {
        if (status == true) {

        }
    };
    
    self.mouseOutForm = function (status) {
        
        if (status == true) {
      
            self.selectedScheduleInfoIndex(-1);
        }
    };

    self.openDialog = function (status) {
        if (status == true) {
    
            $("#sidialog").modal('show');
        }
    };

    self.closeDialog = function (status) {
        
        if (status == true) {
            if(self.scheduleInfoContextMenuForm()!==undefined)
                self.scheduleInfoContextMenuForm().closeDialog(true);
         
            $("#sidialog").modal('hide');
        }
    };
};

//Форма валидации добавляемого занятия
var ValidateScheduleForm = function () {
    var self=this;

    self.doingSuccess = ko.observable(false);
    self.canDo = ko.observable(false);

    self.doingSuccess.subscribe(function (newValue) {
        if (newValue == true) {
            $("#ScheduleOkButton").removeClass("disabled");
            $("#ScheduleOkButtonWithClose").removeClass("disabled");
            $("#ScheduleOkButtonUpdate").removeClass("disabled");
        }
    });

    self.canDo.subscribe(function (newValue) {
        if (newValue == true) {
            $("#ScheduleOkButton").removeClass("disabled");
            $("#ScheduleOkButtonWithClose").removeClass("disabled");
            $("#ScheduleOkButtonUpdate").removeClass("disabled");
   
        } else {
            $("#ScheduleOkButton").addClass("disabled");
            $("#ScheduleOkButtonWithClose").addClass("disabled");
            $("#ScheduleOkButtonUpdate").addClass("disabled");
        }
    });
   
    self.init = function (status) {
        if (status == true) {

        }
    };
    
    self.openDialog=function(status) {
        if (status == true) {
            $('#validatedialogmodal').modal('show');
        }
    };

    self.validate = function (status, validateErrors) {
        if (status == true) {
            for (var i = 0; i < validateErrors.length; ++i) {
                $("#validatemessage" + validateErrors[i]).removeClass("hide");
            }
        }
    };

    self.closeDialog=function(status) {
        if(status==true) {
            $("#validatedialogmodal").modal('hide');
        }
    };
};

//Меню добавления занятия
var ScheduleAddForm = function (parentForm, scheduleInfo, timeId, dayId, weekTypeId, startDate, endDate, auditoriumId) {

    var self = this;

    $('.datepicker').datepicker({ autoclose: true });

    self.validateScheduleForm = ko.observable();

    self.isScheduleAdding = ko.observable(false);

    self.translateDate = function (status, date) {
        if (status == true) {
            res = date.split(".");
            return res[2] + "-" + res[1] + "-" + res[0];
        }
    }

    self.scheduleInfo = ko.observable(scheduleInfo);

    self.auditoriums = ko.observableArray([]);
    self.currentAuditorium = ko.observable();

    self.days = ko.observableArray([{ Id: 1, Name: "Понедельник" }, { Id: 2, Name: "Вторник" }, { Id: 3, Name: "Среда" }, { Id: 4, Name: "Четверг" }, { Id: 5, Name: "Пятница" }, { Id: 6, Name: "Суббота" }]);
    self.currentDay = ko.observable();
    self.currentDay.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadFreeAuditoriums(true, 1, self.currentAuditoriumType());
            self.tryAddSchedule(true);
        }
    });

    self.times = ko.observableArray([]);
    self.currentTime = ko.observable();
    self.currentTime.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadFreeAuditoriums(true, 1, self.currentAuditoriumType());
            self.tryAddSchedule(true);
        }
    });

    self.preselectTime = function (status) {
        if (status == true) {
            for (var i = 0; i < self.times().length; ++i)
                if (self.times()[i].Id == timeId)
                    self.currentTime(self.times()[i]);
        }
    };

    self.preselectDay= function (status) {
        if (status == true) {
            for (var i = 0; i < self.days().length; ++i)
                if (self.days()[i].Id == dayId)
                    self.currentDay(self.days()[i]);
        }
    };

    self.preselectWeekType = function (status) {
        if (status == true) {
            for (var i = 0; i < self.weekTypes().length; ++i)
                if (self.weekTypes()[i].Id == weekTypeId)
                    self.currentWeekType(self.weekTypes()[i]);
        }
    };

    self.preselectAuditorium = function (status) {
        if (status == true) {
            for (var i = 0; i < self.auditoriums().length; ++i)
                if (self.auditoriums()[i].Id == auditoriumId)
                    self.currentAuditorium(self.auditoriums()[i]);
        }
    };

    self.weekTypes = ko.observableArray([]);
    self.currentWeekType = ko.observable();
    self.currentWeekType.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadFreeAuditoriums(true, 1, self.currentAuditoriumType());
            self.tryAddSchedule(true);
        }
    });
   

    self.subGroups = ko.observableArray(["Все", "1", "2", "3"]);
    self.currentSubGroup = ko.observable();
    self.currentSubGroup.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.tryAddSchedule(true);
        }
    });

    self.auditoriumTypes = ko.observableArray([]);
    self.currentAuditoriumType = ko.observable();
    self.currentAuditoriumType.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadFreeAuditoriums(true, 1, newValue);
            self.tryAddSchedule(true);
        }
    });
 
    self.startDate = ko.observable(startDate);
    self.startDate.subscribe(function (newValue) {
        if(newValue !== undefined)
            self.tryAddSchedule(true);
    });

    self.endDate = ko.observable(endDate);
    self.endDate.subscribe(function (newValue) {
        if (newValue !== undefined)
            self.tryAddSchedule(true);
    });


    self.autoDelete = ko.observable(false);

    self.loadTimes = function (status, buildingId) {
        if (status == true) {
            dModel.loadData({
                address: "time/getall",
                obj: self.times,
                params: {
                    buildingId: 1 //TODO: Fix Host Project
                },
                onsuccess: function () {
                    self.preselectTime(true);
                }
            });
        }
    }

    self.loadAuditoriumTypes = function (status) {
        if (status == true) {
            dModel.loadData({
                address: "auditoriumtype/getall",
                obj: self.auditoriumTypes,
                onsuccess: function () {
                   
                }
            });
        }
    }

    self.loadFreeAuditoriums = function (status, buildingId, auditoriumType) {
        if (status == true &&
            self.currentWeekType() !== undefined &&
            self.currentDay() !== undefined &&
            self.currentTime() !== undefined &&
            self.scheduleInfo() !== undefined &&
            auditoriumType !== undefined) {

            dModel.loadData({
                address: "auditorium/GetFree",
                obj: self.auditoriums,
                params: {
                    buildingId: buildingId,
                    weekTypeId: self.currentWeekType().Id,
                    day: self.currentDay().Id,
                    timeId: self.currentTime().Id,
                    tutorialtypeid: self.scheduleInfo().TutorialTypeId,
                    auditoriumtypeid: auditoriumType.Id,
                    starttime: self.startDate(),
                    endtime: self.endDate(),
                },
                onsuccess: function () {
                    self.tryAddSchedule(true);
                    self.preselectAuditorium(true);
                }
            });
        }
    }

    self.loadWeekTypes = function (status) {
        if (status == true) {
            dModel.loadData({
                address: "weektype/getall",
                obj: self.weekTypes,
                onsuccess: function () {
                    self.preselectWeekType(true);
                }
            });
        }
    }

    self.init = function (status) {
        if (status == true) {
            self.preselectDay(true);
            self.loadWeekTypes(true);
            self.loadTimes(true, 1);
            self.loadAuditoriumTypes(true);
        }
    };

    self.tryAddSchedule = function (status) {
        if (status == true) {
            console.log("TRY ADD");
            self.AddSchedule(true, "try");
        }
    };

    self.AddSchedule=function(status, mode) {
        if (status == true){// && !self.isScheduleAdding()) {

            self.validateScheduleForm(undefined);
            //self.validateScheduleForm().doingSuccess(false);

            console.log("TEST");

            var subGroup = self.currentSubGroup();
            if (subGroup == "Все")
                subGroup = "";

            var groupIds = parentForm.groupIds();
          
            if(self.currentAuditorium() !== undefined &&
               self.scheduleInfo() !== undefined &&
               self.currentDay() !== undefined &&
               self.currentTime() !== undefined &&
               self.currentWeekType() !== undefined &&
               self.startDate() !== undefined &&
               self.endDate() !== undefined &&
               self.autoDelete() !== undefined){

                self.isScheduleAdding(true);
                dModel.sendData({
                    address: "schedule/add",
                    params: {
                        'AuditoriumId': self.currentAuditorium().Id,
                        'ScheduleInfoId': self.scheduleInfo().Id,
                        'DayOfWeek': self.currentDay().Id,
                        'PeriodId': self.currentTime().Id,
                        'WeekTypeId': self.currentWeekType().Id,
                        'StartDate': self.startDate(),
                        'EndDate': self.endDate(),
                        'AutoDelete': self.autoDelete(),
                        'SubGroup': subGroup,
                        'GroupIds': groupIds,
                        'Mode': mode
                    },
                    onsuccess: function (data) {
                        self.isScheduleAdding(false);

                        self.validateScheduleForm(new ValidateScheduleForm());
                        self.validateScheduleForm().doingSuccess(false);

                        self.validateScheduleForm().validate(true, data);
                        if (data.length == 0) {
                            if (mode == "try")
                                self.validateScheduleForm().canDo(true);
                            if (mode == "execute") {
                                self.validateScheduleForm().doingSuccess(true);
                                parentForm.loadSchedules(true);
                                parentForm.parentForm.currentScheduleInfoSelectForm().loadScheduleInfoes(true);
                            }
                        } else {
                            self.validateScheduleForm().canDo(false);
                            self.validateScheduleForm().doingSuccess(false);
                        }
                    }
                });
            }
        }
    };

    self.openDialog = function (status) {
        
        if (status == true) {
      
            $("#adddialog").modal('show');
        }
    };

    self.closeDialog = function (status) {
       
        if (status == true) {
      
            $("#adddialog").modal('hide');
        }
    };

    self.addButtonPress = function (status) {
        if (status == true) {
            if (!$("#ScheduleOkButton").hasClass("disabled")) {
                self.AddSchedule(true, "execute");
            }
        }
    };


    self.addAndCloseButtonPress = function (status) {
        if (status == true) {
            if (!$("#ScheduleOkButtonWithClose").hasClass("disabled")) {
                self.AddSchedule(true, "execute");
                self.closeDialog(true);
            }
        }
    };

    self.init(true);
};


function toStrDate(date) {
    var day = ("0" + date.getDate()).slice(-2);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    return date.getFullYear() + "-" + (month) + "-" + (day);
};


function toStrDateDDMMYYYY(date) {
    var day = ("0" + date.getDate()).slice(-2);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    return (day)+"."+(month);//+"."+date.getFullYear();
}

//Календарь
var Calendar=function(dayOfWeek, periodId, weekTypeId, lecturerId, groupIds, subGroup, parentForm) {
    var self = this;
    
    if (lecturerId == undefined) lecturerId = null;
    if (weekTypeId == undefined) weekTypeId = null;
    if (periodId == undefined) periodId = null;

    self.scheduleContextMenuForm = ko.observable();
    self.currentScheduleUpdateForm = ko.observable();
    self.currentDeleteConfirmForm = ko.observable();

    self.dayOfWeek=ko.observable(dayOfWeek);
    self.periodId=ko.observable(periodId);
    self.weekTypeId=ko.observable(weekTypeId);
    self.lecturerId=ko.observable(lecturerId);
    self.groupIds=ko.observable(groupIds);
    self.subGroup = ko.observable(subGroup);
    self.clickedSchedule = ko.observable({ Id: -1 });
    self.preselectedSchedule = ko.observable({ Id: -1 });
    self.preselectedScheduleIndex = ko.observable(-1);
    self.clickedScheduleIndex=ko.observable(-1);
    self.currentWeek = ko.observable();
    
    
    self.weeks = ko.observableArray([]);
    self.calendarSchedules = ko.observableArray([new ko.observableArray([]),
                                                 new ko.observableArray([]),
                                                 new ko.observableArray([]),
                                                 new ko.observableArray([]),
                                                 new ko.observableArray([]),
                                                 new ko.observableArray([]),
                                                 new ko.observableArray([])]);


    self.startDrag = function (status) {
        if (status == true) {
            if (self.scheduleContextMenuForm() !== undefined)
                self.scheduleContextMenuForm().closeDialog(true);
        }
    };

    self.clickOnScheduleLeft=function(parentIndex,index,flag) {
        if(flag==true) {
            self.clickedSchedule(self.calendarSchedules()[parentIndex]()[index]);
            self.clickedScheduleIndex(index);
        }
    };


    self.clickOnScheduleRight = function (parentIndex, index, flag, data, event) {
        if (flag == true) {
            self.clickedSchedule(self.calendarSchedules()[parentIndex]()[index]);
            self.clickedScheduleIndex(index);

            //TODO: load times in calendar and pass into context form
            self.scheduleContextMenuForm(new ScheduleContextMenuForm(self.clickedSchedule(), event.pageX, event.pageY, self, []));
            self.scheduleContextMenuForm().openDialog(true);
        }
    };

    self.mouseover = function (parentIndex, index, flag) {
        if(flag==true) {
            self.preselectedSchedule(self.calendarSchedules()[parentIndex]()[index]);
        }
    };
    
    self.mouseOutForm= function (flag) {
        if (flag == true) {
            self.preselectedSchedule({ Id: -1 });
        }
    };

    self.toNextWeek = function (flag) {
        if (flag == true) {
            
            var tss = new Date(self.weeks()[self.weeks().length - 1].Ts);
            var tes = new Date(self.weeks()[self.weeks().length - 1].Te);
            tss.setDate(tss.getDate()+7);
            tes.setDate(tes.getDate() + 7);

            var newWeek = {
                StartDate:toStrDate(tss),
                EndDate: toStrDate(tes),
                StartDateFormat: toStrDateDDMMYYYY(tss),
                EndDateFormat: toStrDateDDMMYYYY(tes),
                Ts:tss,
                Te:tes
            };
            
            var newWeeks = [];
           
            for (var jj = 0; jj < self.weeks().length-1; ++jj)
                newWeeks[jj] = self.weeks()[jj+1];
            newWeeks.push(newWeek);
            self.weeks(newWeeks);

            self.loadSchedules(true);
        }
    };


    self.toPrevWeek = function (flag) {
        if (flag == true) {

            var tss=new Date(self.weeks()[0].Ts);
            var tes=new Date(self.weeks()[0].Te);
            tss.setDate(tss.getDate()-7);
            tes.setDate(tes.getDate() - 7);
           
            var newWeek={
                StartDate:toStrDate(tss),
                EndDate:toStrDate(tes),
                StartDateFormat:toStrDateDDMMYYYY(tss),
                EndDateFormat:toStrDateDDMMYYYY(tes),
                Ts:tss,
                Te:tes
            };

            var newWeeks = [];
            newWeeks.push(newWeek);
            for(var j=1;j<self.weeks().length;++j)
                newWeeks.push(self.weeks()[j-1]);
            self.weeks(newWeeks);

            self.loadSchedules(true);
        }
    };
    
    self.getScheduleByIdToObject = function (status, id, i, j) {
        if (status == true) {
            dModel.loadData({
                address: "schedule/GetScheduleById",
                params: {
                    Id: id,
                },
                onsuccess: function (data) {
                    var newSchedules = self.calendarSchedules()[i]();
                    newSchedules[j] = data;
                    self.calendarSchedules()[i](newSchedules);
                }
            });
        }
    }

    self.loadCalendarSchedules = function (startDate, endDate, index, flag) {
        if(flag==true) {
            dModel.loadData({
                address:"schedule/GetScheduleByDayPeriodDate",
                params:{
                    dayOfWeek:self.dayOfWeek(),
                    periodId:self.periodId(),
                    weekTypeId:null,
                    lecturerId:self.lecturerId(),
                    auditoriumId:null,
                    groupIds:self.groupIds(),
                    subGroup:self.subGroup(),
                    startTime:startDate,
                    endTime:endDate
                },
                onsuccess:function(data) {
                    self.calendarSchedules()[index](data);
                }
            });
        }
    };
 
    var start = new Date();
    var end =  new Date();
    
    start.setDate(start.getDate() - (start.getDay() - 1));
    end.setDate(end.getDate() + 7 - end.getDay());

    self.currentWeek(toStrDate(start));

    self.currentWeek.subscribe=function(newValue) {

    };

    for (var i = -3; i <= 3; ++i) {
        var ts= new Date(start);
        var te= new Date(end);
        ts.setDate(ts.getDate() + 7*i);
        te.setDate(te.getDate() + 7*i);
        self.weeks.push({
            StartDate: toStrDate(ts),
            EndDate: toStrDate(te),
            StartDateFormat: toStrDateDDMMYYYY(ts),
            EndDateFormat: toStrDateDDMMYYYY(te),
            Ts: ts,
            Te: te
        });
    }
    
    self.loadSchedules = function (status) {
        if (status == true) {
            for(var i = 0; i <= 6; ++i)
                self.loadCalendarSchedules(self.weeks()[i].StartDate, self.weeks()[i].EndDate, i, true);
        }
    };


    self.realDeleteSchedule = function (status, schedule) {
        if (status == true) {
        
            if (schedule !== undefined) {
                dModel.sendData({
                    address: "schedule/delete",
                    params: {
                        'Id': schedule.Id,
                    },
                    onsuccess: function () {
                        self.loadSchedules(true);
                        parentForm.loadSchedules(true);
                    }
                });
            }
        }
    }

  
    self.deleteSchedule = function (status, schedule) {
        if (status == true) {
            self.currentDeleteConfirmForm(new DeleteScheduleConfirmForm(self.realDeleteSchedule, schedule));
            self.currentDeleteConfirmForm().openDialog(true);
        }
    }

    self.openDialog = function (status) {
        if (status == true) {
            $("#calendardialog").modal('show');
        }
    };

    self.closeDialog = function (status) {

        if (status == true) {

            $("#calendardialog").modal('hide');
        }
    };

    self.init = function (status) {
        if (status == true) {
            self.loadSchedules(true);
        }
    };

    self.init(true);
};


function getCurrentWeek(){
    var start = new Date();
    start.setDate(start.getDate() - (start.getDay() - 1));
    var day = ("0" + start.getDate()).slice(-2);
    var month = ("0" + (start.getMonth() + 1)).slice(-2);
    start = start.getFullYear() + "-" + (month) + "-" + (day);

    var end = new Date();
    end.setDate(end.getDate() + 7 - end.getDay());
    var day = ("0" + end.getDate()).slice(-2);
    var month = ("0" + (end.getMonth() + 1)).slice(-2);
    end = end.getFullYear() + "-" + (month) + "-" + (day);
    return { start: start, end: end };
}

function baseViewModel() {
    var self = this;

    dModel = new dataModel();

    self.currentFlowSelectForm = ko.observable(new FlowSelectForm(self));
    self.currentScheduleInfoSelectForm = ko.observable();
    self.currentScheduleAddForm = ko.observable();
    self.currentCalendar = ko.observable();
   

    var date = getCurrentWeek();
    self.currentScheduleSelectForm = ko.observable(new ScheduleSelectForm(undefined, undefined, date.start, date.end, self));
    self.currentPrintSettingForm = ko.observable();

    //#init function
    self.init = function () {

        console.log("777");

        Ext.create('Ext.container.Viewport', {
            width: 1400,
            height: '100%',
            layout: 'border',
            defaults: {
                collapsible: true,
                split: true,
                autoScroll: true
            },
            items: [
                {
                    region: 'west',
                    margins: '5 0 0 0',
                    cmargins: '5 5 0 0',
                    width: 260,
                    minSize: 100,
                    maxSize: 250,
                    preventHeader: true ,
                    hideCollapseTool: true,
                    contentEl: 'menu11'
                },
                 {
                     region: 'north',
                     autoScroll: false,
                     height: 110,
                     preventHeader: true,
                     hideCollapseTool: true,
                     contentEl: 'ssheader'
                 }, {
                     collapsible: false,
                     layout: 'fit',
                     region: 'center',
                     height: 500,
                     margins: '5 0 0 0',
                     contentEl: 'ssdialogintable',
                     autoScroll: true
                 }],


            renderTo: 'div11'
            
        });

       
    }
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

    //spinner binding
    ko.bindingHandlers.spinner = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            //initialize datepicker with some optional options
            var options = allBindingsAccessor().spinnerOptions || {};
            $(element).spinner(options);

            //handle the field changing
            ko.utils.registerEventHandler(element, "spinchange", function () {
                var observable = valueAccessor();
                observable($(element).spinner("value"));
            });

            //handle disposal (if KO removes by the template binding)
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).spinner("destroy");
            });

        },
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());

            current = $(element).spinner("value");
            if (value !== current) {
                $(element).spinner("value", value);
            }
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

    // Activates knockout.js
    ko.applyBindings(viewModel);
});
