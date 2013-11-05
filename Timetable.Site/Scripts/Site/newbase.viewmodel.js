//Модель данных
var dModel;

var printLecturerId;
var printAuditoriumId;
var printFacultyId;
var printCourseIds;
var printGroupIds;
var printStudyYearId;
var printSemesterId;
var printTimetableId;
var printSequence;

//Обработка ошибок
var showError = function (msg) {
    $.jGrowl("<b><span style='color: #f00;'>" + msg + "</span></b>", { header: "<b><span style='color: #f00;'>Ошибка</span></b>", position: "center" });
};

var pair = function (first, second) {
    this.first = first;
    this.second = second;
}

//Отображаемая информация в элементе клетки расписания
var ScheduleDisplay = function (lecturer, tutorial, tutorialType, groups, auditorium, weekType, time, subgroup) {
    var self = this;
    self.Lecturer = ko.observable(lecturer);
    self.Tutorial = ko.observable(tutorial);
    self.TutorialType = ko.observable(tutorialType);
    self.Groups = ko.observable(groups);
    self.Auditorium = ko.observable(auditorium);
    self.WeekType = ko.observable(weekType);
    self.Time = ko.observable(time);
    self.subGroup=ko.observable(subgroup);
};

//Служебная информация в элементе клетки расписания
var ScheduleData = function (scheduleId, scheduleInfoId, tutorialId, tutorialTypeId, groupsIds, auditoriumId, weekTypeId, dayOfWeek, periodId, lecturerId, startDate, endDate, autoDelete) {
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
    self.StartDate = ko.observable(startDate);
    self.EndDate = ko.observable(endDate);
    self.AutoDelete = ko.observable(autoDelete);
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
                sum += newValue[i].Data.WeekTypeId()*newValue[i].Data.WeekTypeId();
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

//Форма печати отчетов
var PrintReportForm = function () {
    var self = this;

    self.init = function (status) {
        if (status == true) {

        }
    };

    self.openDialog = function (status) {
        if (status == true) {
            $("#printdialog").modal('show');
        }
    }

    self.closeDialog = function (status) {
        if (status == true) {
            $("#printdialog").modal('hide');
        }
    }

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
var UpdateScheduleForm = function (parentForm, param) {

    var self = this;

    self.currentConfirmForm = ko.observable();
    self.validateScheduleForm = ko.observable();

    self.translateDate = function (status, date) {
        if (status == true) {
            res = date.split(".");
            return res[2] + "-" + res[1] + "-" + res[0];
        }
    }

    self.days = ko.observableArray([{ Id: 1, Name: "Понедельник" }, { Id: 2, Name: "Вторник" }, { Id: 3, Name: "Среда" }, { Id: 4, Name: "Четверг" }, { Id: 5, Name: "Пятница" }, { Id: 6, Name: "Суббота" }]);
    self.auditoriumTypes = ko.observableArray([]);
    self.currentAuditoriumType = ko.observable();
    self.auditoriums = ko.observableArray([]);
    self.currentAuditorium = ko.observable();
    self.currentSchedule = ko.observable(parentForm.clickedSchedule());


    self.currentStartDate = ko.observable(self.translateDate(true, self.currentSchedule().StartDate));
    self.currentEndDate = ko.observable(self.translateDate(true, self.currentSchedule().EndDate));

    
    self.presetAuditoriumType = function (status) {
        
        if (status == true) {


            for (var i = 0; i < self.auditoriumTypes().length; ++i)
                if (self.currentSchedule().AuditoriumTypeId == self.auditoriumTypes()[i].Id) {
            
                    self.currentAuditoriumType(self.auditoriumTypes()[i]);
                }
        }
    }

    self.presetDay = function (status) {
        if (status == true) {
   
            for (var i = 0; i < self.days().length; ++i)
                if (self.currentSchedule().DayOfWeek == self.days()[i].Id) {
      
                    self.currentDay(self.days()[i]);
                }
        }
    }

    self.presetTime = function (status) {
        if (status == true) {

            for (var i = 0; i < self.times().length; ++i)
                if (self.currentSchedule().PeriodId == self.times()[i].Id) {
  
                    self.currentTime(self.times()[i]);
                }
            //TODO: preset schedule paramenters in fields
        }
    }

    self.presetWeekType = function (status) {
        if (status == true) {

            for (var i = 0; i < self.weekTypes().length; ++i)
                if (self.currentSchedule().WeekTypeId == self.weekTypes()[i].Id) {
       
                    self.currentWeekType(self.weekTypes()[i]);
                }
            //TODO: preset schedule paramenters in fields
        }
    }

    self.presetAuditorium = function (status) {
        if (status == true) {
      
            for (var i = 0; i < self.auditoriums().length; ++i)
                if (self.currentSchedule().AuditoriumId == self.auditoriums()[i].Id) {
  
                    self.currentAuditorium(self.auditoriums()[i]);
                }
        }
    }

    self.currentStartDate.subscribe(function (newValue) {
   
    });

    self.currentEndDate.subscribe(function (newValue) {

    });

    self.currentDay = ko.observable(self.days()[parentForm.clickedSchedule().DayOfWeek - 1]);
    self.currentDay.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadFreeAuditoriums(true, 1, self.currentAuditoriumType());
        }
    });

    self.times = ko.observableArray([]);
    self.currentTime = ko.observable();

    self.currentTime.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadFreeAuditoriums(true, 1, self.currentAuditoriumType());
        }
    });

    self.subGroups = ko.observableArray(["Все", "1", "2", "3"]);
    self.currentSubGroup = ko.observable();

    self.weekTypes = ko.observableArray([]);
    self.currentWeekType = ko.observable();
    self.currentWeekType.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadFreeAuditoriums(true, 1, self.currentAuditoriumType());
        }
    });
 

    self.currentAuditoriumType.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadFreeAuditoriums(true, 1, newValue);
        }
    });

    self.loadTimes = function (status, buildingId, isInit) {
        if (status == true) {
            dModel.loadData({
                address: "time/getall",
                obj: self.times,
                params: {
                    buildingId: 1 //TODO: Fix Host Project
                },
                onsuccess: function () {
       
                    if (isInit)
                        self.presetTime(true);
                }
            });
        }
    }

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

    self.ValidateSchedule = function (status, innerFunction) {
        if (status == true) {

     
            dModel.loadData({
                address: "schedule/Validate",
                params: {
                    AuditoriumId: self.currentAuditorium().Id,
                    ScheduleInfoId: self.currentSchedule().ScheduleInfoId,
                    DayOfWeek: self.currentDay().Id,
                    PeriodId: self.currentTime().Id,
                    WeekTypeId: self.currentWeekType().Id,
                    StartDate: self.currentStartDate(),
                    EndDate: self.currentEndDate()
                },
                onsuccess: function (data) {
                    if (data.length == 0) {
                   
                        innerFunction(true);
                    } else {
                        self.validateScheduleForm(new ValidateScheduleForm(data));
                        self.validateScheduleForm().openDialog(true);
           
                    }
                }
            });
        }
    };

    self.ValidateSchedule2 = function (status, innerFunction, schedule) {
        if (status == true) {
     

  
         
            dModel.loadData({
                address: "schedule/Validate",
                params: {
                    AuditoriumId: schedule.Id,
                    ScheduleInfoId: schedule.ScheduleInfoId,
                    DayOfWeek: schedule.DayOfWeek,
                    PeriodId: schedule.PeriodId,
                    WeekTypeId: schedule.WeekTypeId,
                    StartDate: self.translateDate(true, schedule.StartDate),
                    EndDate: self.translateDate(true, schedule.EndDate)
                },
                onsuccess: function (data) {
                    if (data.length == 0) {
             
                        innerFunction(true, schedule);
                    } else {
                        self.validateScheduleForm(new ValidateScheduleForm(data));
                        self.validateScheduleForm().openDialog(true);
              
                    }
                }
            });
        }
    };

    self.updateSchedule = function (status) {
        if (status == true) {
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
                        'SubGroup': subGroup
                    },
                    onsuccess: function () {
                  
                        parentForm.updateReload(true, self.currentSchedule(), self.currentTime().Id, self.currentDay().Id, self.currentWeekType().Id);
                    }
                });
            }
        }
    }

    self.updateSchedule2 = function (status, schedule) {
        if (status == true) {
            var subGroup = schedule.SubGroup;
            if (subGroup == "Все")
                subGroup = "";

            dModel.sendData({
                address: "schedule/update",
                params: {
                    'ScheduleId': schedule.Id,
                    'AuditoriumId': schedule.AuditoriumId,
                    'ScheduleInfoId': schedule.ScheduleInfoId,
                    'DayOfWeek': schedule.DayOfWeek,
                    'PeriodId': schedule.PeriodId,
                    'WeekTypeId': schedule.WeekTypeId,
                    'StartDate': self.translateDate(schedule.StartDate),
                    'EndDate': self.translateDate(schedule.EndDate),
                    'AutoDelete': schedule.AutoDelete,
                    'SubGroup': schedule.subGroup
                },
                onsuccess: function () {
                
                    parentForm.updateReload(true, schedule, schedule.PeriodId, schedule.DayOfWeek, schedule.WeekTypeId);
                }
            });
        }

    }
  
    self.init = function (status) {
        if (status == true) {
            if (param !== true) {
                self.loadWeekTypes(true, true);
                self.loadTimes(true, self.currentSchedule().BuildingId, true);

                self.loadAuditoriumTypes(true, true);


                self.presetDay(true);
            }
        }
    };

    self.updateButtonClick = function (status) {
        if (status == true) {
            self.currentConfirmForm(new UpdateScheduleConfirmForm(self.updateSchedule));
            self.currentConfirmForm().openDialog(true);
   
            //self.updateSchedule(true);
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

var FreeAuditoriumsForm = function (timeId, dayId, wtId, tutorialTypeId, parentForm) {
    var self = this;

    self.startDate = ko.observable("");
    self.endDate = ko.observable("");

    self.auditoriumTypes = ko.observableArray([]);
    self.currentAuditoriumType = ko.observable();
    self.currentAuditoriumType.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadFreeAuditoriums(true, parentForm.currentBuilding().Id, newValue);
        }
    });

    self.auditoriums = ko.observableArray([]);
    self.currentAuditorium = ko.observable();

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
                    tutorialtypeid: tutorialTypeId,
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
                                                    parentForm.times()[ind.row].Id, parentForm.days()[ind.col].Id, weekTypeId));
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
            parentForm.freeAuditoriumsForm(new FreeAuditoriumsForm(parentForm.times()[ind.row].Id, parentForm.days()[ind.col].Id, weekTypeId, 1, parentForm));
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
                                                        lecturerId, groupIds, parentForm.currentSubGroup()));

            parentForm.currentCalendarForm().openDialog(true);
            self.closeDialog(true);
        }
    };


};

//Форма выбора занятий
var ScheduleSelectForm = function (lecturer, auditorium, groups, startTime, endTime, parentForm) {
    var self = this;



    self.parentForm = parentForm;

    self.title = ko.computed(function() {
        var res = "";
        if(parentForm.currentFlowSelectForm() !== undefined){
            if(parentForm.currentFlowSelectForm().currentBranch() !== undefined)
                res += parentForm.currentFlowSelectForm().currentBranch().Name + " ";

            if(parentForm.currentFlowSelectForm().currentFaculty() !== undefined)
                res += parentForm.currentFlowSelectForm().currentFaculty().Name + " ";

            if (parentForm.currentFlowSelectForm().currentGroups() !== undefined) {
                for (var i = 0; i < parentForm.currentFlowSelectForm().currentGroups().length; ++i)
                    res += parentForm.currentFlowSelectForm().currentGroups()[i].Code + " ";
            }

        }
        return res;
    });
        
       
    self.isScheduleLoad = false;

    self.currentDeleteConfirmForm = ko.observable();
    self.currentScheduleUpdateForm = ko.observable();
    self.scheduleBacketContextMenuForm = ko.observable();
    self.scheduleContextMenuForm = ko.observable();
    self.scheduleUpdateForm = ko.observable();
    self.currentScheduleAddForm = ko.observable();
    self.currentCalendarForm = ko.observable();
    self.freeAuditoriumsForm = ko.observable();

   

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

    self.lecturer = ko.observable(lecturer);
    self.lecturer.subscribe(function (newValue) {
        //self.loadSchedules(true);
    });

    self.auditorium = ko.observable(auditorium);
    self.auditorium.subscribe(function (newValue) {
        //self.loadSchedules(true);
    });


    self.groups = ko.observable(groups);
    self.groups.subscribe(function (newValue) {
        //self.loadSchedules(true);
    });


    self.weekTypes = ko.observableArray([]);
    self.currentWeekType = ko.observable();
    self.currentWeekType.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadSchedules(true);
        }
    });

    self.subGroups = ko.observableArray(["Все", "1", "2", "3"]);
    self.currentSubGroup = ko.observable();
    self.currentSubGroup.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadSchedules(true);
        }
    });


    self.startTime = ko.observable(startTime);
    self.startTime.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadSchedules(true);
        }
    });

    self.endTime = ko.observable(endTime);
    self.endTime.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadSchedules(true);
        }
    });

    self.days = ko.observableArray([{}, { Id: 1, Name: "Понедельник" }, { Id: 2, Name: "Вторник" }, { Id: 3, Name: "Среда" }, { Id: 4, Name: "Четверг" }, { Id: 5, Name: "Пятница" }, { Id: 6, Name: "Суббота" }]);


    self.preselectedBacketIndexes = ko.observable({ row: -1, col: -1, wt: -1 });
    self.clickedBacketIndexes = ko.observable({ row: -1, col: -1, wt: -1 });

    self.preselectedSchedule = ko.observable();
    self.clickedSchedule = ko.observable();

    self.blockedRows = ko.observableArray();

    self.preselectBacket = function(status, row, col, wt){
        if (status == true) {
            self.preselectedBacketIndexes({row: row, col: col, wt: wt});
        }
    }

    self.clickBacketLeft = function (status, row, col, wt) {
        if (status == true) {
  
            self.clickedBacketIndexes({ row: row, col: col, wt: wt });
        }
    }

    self.doubleClickBacket = function (status, row, col, wt) {
        if (status == true) {
            console.log("db-click");
            var weekTypeId = 1;
            if (wt == 0) weekTypeId = 2;
            if (wt == 2) weekTypeId = 3;

            self.currentScheduleAddForm(new ScheduleAddForm(self, parentForm.currentScheduleInfoSelectForm().currentScheduleInfo(), self.times()[row].Id, self.days()[col].Id, weekTypeId));
            self.currentScheduleAddForm().openDialog(true);
            //self.currentScheduleAddForm().ValidateSchedule(true, self.currentScheduleAddForm().AddSchedule);
        }
    }

    
    self.clickBacketRight = function (status, row, col, wt, data, event) {
        if (status == true) {
            if (self.schedules()[row]()[col]()[wt]() == undefined) {

                if (self.scheduleContextMenuForm() !== undefined)
                    self.scheduleContextMenuForm().closeDialog(true);

            
                self.clickedBacketIndexes({ row: row, col: col, wt: wt });

                self.scheduleBacketContextMenuForm(new ScheduleBacketContextMenuForm(event.pageX, event.pageY, self));
                self.scheduleBacketContextMenuForm().openDialog(true);
            } else {
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
            self.preselectedSchedule(self.schedules()[row]()[col]()[wt]());
        }
    }

    self.clickScheduleLeft = function (status, row, col, wt) {
        if (status == true) {

            self.clickedSchedule(self.schedules()[row]()[col]()[wt]());
        }
    }

    self.clickScheduleRight = function (status, row, col, wt, data, event) {
        if (status == true) {
            self.clickedSchedule(self.schedules()[row]()[col]()[wt]());
            self.scheduleContextMenuForm(new ScheduleContextMenuForm(self.clickedSchedule(), event.pageX, event.pageY, self));
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
            self.clickedSchedule(self.schedules()[row]()[col]()[wt]());

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

                self.currentScheduleAddForm(new ScheduleAddForm(self, parentForm.currentScheduleInfoSelectForm().currentScheduleInfo(), self.times()[row].Id, self.days()[col].Id, weekTypeId));
                self.currentScheduleAddForm().openDialog(true);

            }else{
             
                self.scheduleUpdateForm(new UpdateScheduleForm(self, true));
                self.clickedSchedule().DayOfWeek = self.days()[col].Id;
                self.clickedSchedule().PeriodId = self.times()[row].Id;
                self.clickedSchedule().WeekTypeId = wt;
                if (wt == 0) self.clickedSchedule().WeekTypeId = 2;
                if (wt == 2) self.clickedSchedule().WeekTypeId = 3;

                self.scheduleUpdateForm().ValidateSchedule2(true, self.scheduleUpdateForm().updateSchedule2, self.clickedSchedule());
            }
        }
    }

    self.outBacket = function (status) {
        if (status == true) {
            //self.preselectedBacketIndexes({ row: -1, col: -1, wt: -1 });
        }
    }

    self.overBacket = function (status, row, col, wt, data, event) {
        if (status == true) {
    
        }
    }

    self.schedules = ko.observableArray([]);

    self.addReload = function (status, timeId, dayId, wtId) {
        if (status == true) {
            //TODO: reload only one backet
            self.loadSchedules(true);
        }
    }

    self.updateReload = function (status, schedule, timeId, dayId, wtId) {
        //if (wtId == 1) wtId = 1;
        if (wtId == 2) wtId = 0;
        if (wtId == 3) wtId = 2;

        if (status == true) {
            for (var i = 0; i < self.times().length; ++i) {
                if (self.times()[i].Id == timeId) {
                    timeId = i;
                    break;
                }
            }

            for (var i = 0; i < self.days().length; ++i) {
                if (self.days()[i].Id == dayId) {
                    dayId = i;
                    break;
                }
            }

            for (var i = 0; i < self.schedules().length; ++i)
                for (var j = 0; j < self.schedules()[i]().length; ++j)
                    for (var k = 0; k < self.schedules()[i]()[j]().length; ++k)
                        if (self.schedules()[i]()[j]()[k]() !== undefined) {
                            if (self.schedules()[i]()[j]()[k]().Id == schedule.Id) {
                                self.schedules()[i]()[j]()[k](undefined);
                                self.getScheduleByIdToObject(true, schedule.Id, timeId, dayId, wtId);
                            }
                        }
        }
    }

    self.deleteReload = function (status, schedule) {
        if (status == true) {
            for (var i = 0; i < self.schedules().length; ++i)
                for (var j = 0; j < self.schedules()[i]().length; ++j)
                    for (var k = 0; k < self.schedules()[i]()[j]().length; ++k)
                        if (self.schedules()[i]()[j]()[k]() !== undefined)
                            if (self.schedules()[i]()[j]()[k]().Id == schedule.Id)
                                self.schedules()[i]()[j]()[k](undefined);
        }
    }

    self.realDeleteSchedule = function (status, schedule) {
        if (status == true) {
         
            if (schedule !== undefined) {
                dModel.sendData({
                    address: "schedule/delete",
                    params: {
                        'Id': schedule.Id,
                    },
                    onsuccess: function () {
                        self.deleteReload(true, schedule);
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

    self.getScheduleByIdToObject = function (status, id, i, j, k) {
        if (status == true) {
            dModel.loadData({
                address: "schedule/GetScheduleById",
                params: {
                    Id: id,
                },
                onsuccess: function (data) {
                    self.schedules()[i]()[j]()[k](data);
                }
            });
        }
    }

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

    self.loadSchedules = function (status) {
   
        if (status == true && !self.isScheduleLoad) {


            self.isScheduleLoad = true;

            if(self.lecturer() !== undefined)
                var lecturerId = self.lecturer().Id;
            if (self.auditorium() !== undefined)
                var auditoriumId = self.auditorium().Id;
            if (self.currentWeekType() !== undefined)
                var weekTypeId = self.currentWeekType().Id;
            if (self.currentSubGroup() !== undefined)
                var subGroup = self.currentSubGroup();
            if (self.startTime() !== undefined)
                var startTime = self.startTime();
            if (self.endTime() !== undefined)
                var endTime = self.endTime();

            
            if (lecturerId == undefined) lecturerId = null;
            if (auditoriumId == undefined) auditoriumId = null;
            if (weekTypeId == undefined) weekTypeId = null;
            if (lecturerId == undefined) lecturerId = null;
            if (startTime == undefined) startTime = "";
            if (endTime == undefined) endTime = "";
            if (subGroup == "Все") subGroup = "";

            var groupIds = "";
            if (self.groups() !== undefined) {
                for (var i = 0; i < self.groups().length; ++i)
                    groupIds += self.groups()[i].Id + ", ";
            }

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
                    
               

                    self.filteredTimes = ko.observableArray([]);
                    self.scheduleTimes([]);
                    self.times([]);
                    self.schedules([]);


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

                    for (var i = 0; i < self.times().length; ++i) {
                        self.schedules.push(new ko.observableArray([new ko.observableArray([new ko.observable(), new ko.observable(), new ko.observable()]),
                                                                    new ko.observableArray([new ko.observable(), new ko.observable(), new ko.observable()]),
                                                                    new ko.observableArray([new ko.observable(), new ko.observable(), new ko.observable()]),
                                                                    new ko.observableArray([new ko.observable(), new ko.observable(), new ko.observable()]),
                                                                    new ko.observableArray([new ko.observable(), new ko.observable(), new ko.observable()]),
                                                                    new ko.observableArray([new ko.observable(), new ko.observable(), new ko.observable()]),
                                                                    new ko.observableArray([new ko.observable(), new ko.observable(), new ko.observable()])]));
                        if (self.times()[i].IsBuilding == false)
                            self.blockedRows()[i] = true;
                        else
                            self.blockedRows()[i] = false;
                    }


                    //self.times.sort(function(left, right) { return left.lastName == right.lastName ? 0 : (left.lastName < right.lastName ? -1 : 1) });

                    
                    for (var i = 0; i < data.length; ++i) {
                        var row = -1;
                        for (var j = 0; j < self.times().length; ++j)
                            if (data[i].PeriodId == self.times()[j].Id)
                                row = j;
                        var col = data[i].DayOfWeek;
                        var wt = 1;
                        if (data[i].WeekTypeId == 2)wt = 0;
                        if (data[i].WeekTypeId == 3)wt = 2;

                        self.schedules()[row]()[col]()[wt](data[i]);
             
                    }
                    self.isScheduleLoad = false;

          
                
      
                }


                
            });
        }
    }

    self.init(true);

    self.startDrag = function (status) {
        if (status == true) {
        
        }
    };

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



    self.copiedSchedule = ko.observable();
    self.cutedSchedule = ko.observable();

    self.copySchedule = function (status) {
        if (status == true) {
            self.cutedSchedule(undefined);
            self.copiedSchedule(self.clickedSchedule());
        }
    };

    
    self.cutSchedule = function (status) {
        if (status == true) {
            self.copiedSchedule(undefined);
            self.cutedSchedule(self.clickedSchedule());
        }
    }

    self.pasteSchedule = function (status) {
        if (status == true) {
            if (self.cutedSchedule() !== undefined) {
                self.scheduleUpdateForm(new UpdateScheduleForm(self, true));

                var ind = self.clickedBacketIndexes();

                self.cutedSchedule().DayOfWeek = self.days()[ind.col].Id;
                self.cutedSchedule().PeriodId = self.times()[ind.row].Id;
                self.cutedSchedule().WeekTypeId = ind.wt;
                if (ind.wt == 0) self.cutedSchedule().WeekTypeId = 2;
                if (ind.wt == 2) self.cutedSchedule().WeekTypeId = 3;

                self.scheduleUpdateForm().ValidateSchedule2(true, self.scheduleUpdateForm().updateSchedule2, self.cutedSchedule());

                //self.cutedSchedule(undefined);
            }
            if (self.copiedSchedule() !== undefined) {
                //self.copiedSchedule(undefined);
            }
        }
    }

};

//Форма выбора потока
var FlowSelectForm = function (parentForm) {
    var self = this;

    var specialityIds = "";
    var courseIds = "";

    self.branches = ko.observableArray([]);

    self.currentBranch = ko.observable();
    self.currentBranch.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadFaculties(true,newValue.Id);
            self.groups("");
        }
    });

    self.courses = ko.observableArray([]);
    self.currentCourses = ko.observableArray([]);
    self.faculties = ko.observableArray([]);

    self.currentFaculty = ko.observable();
    self.currentFaculty.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadSpecialities(true,newValue.Id);
            self.groups("");
        }
    });

    self.specialities = ko.observableArray([]);
    self.currentSpecialities = ko.observableArray([]);
    self.currentSpecialities.subscribe(function (newValue) {
        if (newValue !== undefined) {
            if (self.currentFaculty() !== undefined) {
                specialityIds = "";
                for(var i = 0; i < newValue.length; ++i)
                    specialityIds += newValue[i].Id + ", ";
                self.loadGroups(true, self.currentFaculty().Id, courseIds, specialityIds);
            }
        }
    });

    self.currentCourses.subscribe(function (newValue) {
        if (newValue !== undefined) {
            if (self.currentFaculty() !== undefined) {
                courseIds = "";
                for (var i = 0; i < newValue.length; ++i)
                     courseIds += newValue[i].Id + ", ";
                self.loadGroups(true, self.currentFaculty().Id, courseIds, specialityIds);
            }
        }
    });

    self.groups = ko.observableArray([]);
    self.currentGroups = ko.observableArray([]);
    self.currentGroups.subscribe(function (newValue) {
        parentForm.currentScheduleInfoSelectForm(new ScheduleInfoSelectForm(newValue, { Id: 12 }, { Id: 0 }, parentForm));
        if (newValue !== undefined) {
            parentForm.currentScheduleSelectForm().groups(newValue);

            parentForm.currentScheduleSelectForm().loadSchedules(true);
        }
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
                    //self.loadFaculties(true, self.branches()[0].Id);
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
                    parentForm.updateReload(true, self.newScheduleInfo());
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
var ScheduleContextMenuForm = function (schedule, xPos, yPos, parentForm) {
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
            parentForm.currentScheduleUpdateForm(new UpdateScheduleForm(parentForm));
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

    var oldScheduleInfo;
    self.currentScheduleInfo.subscribe(function (newValue) {
        if (newValue !== undefined) {
            if (newValue != oldScheduleInfo) {
                var newGroups = newValue.GroupIds.split(", "); newGroups.pop();
                var ng = [];
                for(var i = 0; i < newGroups.length; ++i)
                    ng.push({Id: newGroups[i]});
  
                parentForm.currentScheduleSelectForm().groups(ng);
                parentForm.currentScheduleSelectForm().lecturer({ Id: newValue.LecturerId });
       
                parentForm.currentScheduleSelectForm().loadSchedules(true);
            }
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
        }
    };

    self.init(true);
    
    self.updateReload = function (status, scheduleInfo) {
        for(var i = 0; i < self.scheduleInfoes().length; ++i)
            if (self.scheduleInfoes()[i].Id == scheduleInfo.Id) {
                self.loadScheduleInfoByIdToObject(true, scheduleInfo.Id, i);
            }
    }

    self.loadScheduleInfoByIdToObject = function (status, id, i) {
        if (status == true) {
            dModel.loadData({
                address: "scheduleinfo/GetById",
                params: {
                    Id: id
                },
                onsuccess: function (data) {
                    var newScheduleInfoes = self.scheduleInfoes();
                    newScheduleInfoes[i] = data;
                    self.scheduleInfoes(newScheduleInfoes);
                }
            });
            
        }
    }

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
var ValidateScheduleForm = function (validateErrors) {
    var self=this;
    self.validateErrors = ko.observableArray(validateErrors);

    self.init = function (status) {
        if (status == true) {

        }
    };
    
    self.openDialog=function(status) {
        if (status == true) {
            $('#validatedialog').modal('show');       
            for (var i = 0; i < self.validateErrors().length; ++i) {
                $("#validatemessage" + self.validateErrors()[i]).removeClass("hide");
            }
        }
    };

    self.closeDialog=function(status) {
        if(status==true) {
       
            $("#validatedialog").modal('hide');
        }
    };
};

//Меню добавления занятия
var ScheduleAddForm = function (parentForm, scheduleInfo, timeId, dayId, weekTypeId) {

    var self = this;

    self.validateScheduleForm = ko.observable();

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
        }
    });

    self.times = ko.observableArray([]);
    self.currentTime = ko.observable();
    self.currentTime.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadFreeAuditoriums(true, 1, self.currentAuditoriumType());
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

    self.weekTypes = ko.observableArray([]);
    self.currentWeekType = ko.observable();
    self.currentWeekType.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadFreeAuditoriums(true, 1, self.currentAuditoriumType());
        }
    });
   

    self.subGroups = ko.observableArray(["Все", "1", "2", "3"]);
    self.currentSubGroup = ko.observable();

    self.auditoriumTypes = ko.observableArray([]);
    self.currentAuditoriumType = ko.observable();
    self.currentAuditoriumType.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.loadFreeAuditoriums(true, 1, newValue);
        }
    });
 
    self.startDate = ko.observable("");
    self.endDate = ko.observable("");
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

    self.ValidateSchedule=function(status, innerFunction) {
        if (status == true) {
        
            var startDateLocal = self.startDate();
            var endDateLocal = self.endDate();
            if (startDateLocal == undefined)
                startDateLocal = "";
            if (endDateLocal == undefined)
                endDateLocal = "";

            dModel.loadData({
                address: "schedule/Validate",
                params: {
                    AuditoriumId: self.currentAuditorium().Id,
                    ScheduleInfoId: self.scheduleInfo().Id,
                    DayOfWeek: self.currentDay().Id,
                    PeriodId: self.currentTime().Id,
                    WeekTypeId: self.currentWeekType().Id,
                    StartDate: startDateLocal,
                    EndDate: endDateLocal
                },
                onsuccess: function (data) {
                    if(data.length==0) {
                   
                        innerFunction(true);
                        parentForm.addReload(true, self.currentTime().Id, self.currentDay().Id, self.currentWeekType().Id);
                    } else {
                        self.validateScheduleForm(new ValidateScheduleForm(data));
                        self.validateScheduleForm().openDialog(true);
           
                    }
                }
            });
        }
    };

    self.AddSchedule=function(status) {
        if (status == true) {
   
            var subGroup = self.currentSubGroup();
            if (subGroup == "Все")
                subGroup = "";

            if(self.currentAuditorium() !== undefined &&
               self.scheduleInfo() !== undefined &&
               self.currentDay() !== undefined &&
               self.currentTime() !== undefined &&
               self.currentWeekType() !== undefined &&
               self.startDate() !== undefined &&
               self.endDate() !== undefined &&
               self.autoDelete() !== undefined){

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
                        'SubGroup': subGroup
                    },
                    onsuccess: function () {
                    
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
         
            self.ValidateSchedule(true, self.AddSchedule);
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
var Calendar=function(dayOfWeek, periodId, weekTypeId, lecturerId, groupIds, subGroup) {
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

            self.scheduleContextMenuForm(new ScheduleContextMenuForm(self.clickedSchedule(), event.pageX, event.pageY, self));
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

            var newCalendarSchedules = [];
            for (var jjj = 0; jjj < self.weeks().length-1; ++jjj)
                newCalendarSchedules[jjj] = self.calendarSchedules()[jjj+1];
            newCalendarSchedules.push(new ko.observableArray([]));

            self.calendarSchedules(newCalendarSchedules);
            
            //self.weeks([self.weeks()[1], self.weeks()[2], newWeek]);
            //self.calendarSchedules([self.calendarSchedules()[1], self.calendarSchedules()[2], new ko.observableArray([])]);
            setTimeout(function () { self.loadCalendarSchedules(toStrDate(tss), toStrDate(tes), self.weeks().length - 1, true); }, 500);
        }
    };

    self.updateReload = function (status, schedule, timeId, dayId, wtId) {
        if (status == true) {
            for (var i = 0; i < 7; ++i) {
                for(var j = 0; j < self.calendarSchedules()[i]().length; ++j)
                    if (self.calendarSchedules()[i]()[j].Id == schedule.Id) {
                        if (self.dayOfWeek().Id == dayId && self.periodId() == timeId)
                            self.getScheduleByIdToObject(true, schedule.Id, i, j);
                        else {
                            self.calendarSchedules()[i].remove(self.calendarSchedules()[i]()[j]);
                        }
                    }
            }
        }
    }
    
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

            var newCalendarSchedules = [];
            newCalendarSchedules.push(new ko.observableArray([]));
            for (var j = 1; j < self.weeks().length; ++j)
                newCalendarSchedules.push(self.calendarSchedules()[j-1]);

            self.calendarSchedules(newCalendarSchedules);
            setTimeout(function () { self.loadCalendarSchedules(toStrDate(tss), toStrDate(tes), 0, true); }, 500);
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
    
    setTimeout(function () { self.loadCalendarSchedules(self.weeks()[0].StartDate, self.weeks()[0].EndDate, 0, true); }, 200);
    setTimeout(function () { self.loadCalendarSchedules(self.weeks()[1].StartDate, self.weeks()[1].EndDate, 1, true); }, 200);
    setTimeout(function () { self.loadCalendarSchedules(self.weeks()[2].StartDate, self.weeks()[2].EndDate, 2, true); }, 200);
    setTimeout(function () { self.loadCalendarSchedules(self.weeks()[3].StartDate, self.weeks()[3].EndDate, 3, true); }, 200);
    setTimeout(function () { self.loadCalendarSchedules(self.weeks()[4].StartDate, self.weeks()[4].EndDate, 4, true); }, 200);
    setTimeout(function () { self.loadCalendarSchedules(self.weeks()[5].StartDate, self.weeks()[5].EndDate, 5, true); }, 200);
    setTimeout(function () { self.loadCalendarSchedules(self.weeks()[6].StartDate, self.weeks()[6].EndDate, 6, true); }, 200);
    

    self.realDeleteSchedule = function (status, schedule) {
        if (status == true) {
        
            if (schedule !== undefined) {
                dModel.sendData({
                    address: "schedule/delete",
                    params: {
                        'Id': schedule.Id,
                    },
                    onsuccess: function () {
                        self.deleteReload(true, schedule);
                    }
                });
            }
        }
    }

    self.deleteReload = function (status, schedule) {

        if (status == true) {
            for (var i = 0; i < 7; ++i) {
                for (var j = 0; j < self.calendarSchedules()[i]().length; ++j)
                    if (self.calendarSchedules()[i]()[j].Id == schedule.Id) {
                        self.calendarSchedules()[i].remove(self.calendarSchedules()[i]()[j]);
                    }
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
};


function baseViewModel() {
    var self = this;

    dModel = new dataModel();

    
    self.currentFlowSelectForm = ko.observable(new FlowSelectForm(self));
    self.currentScheduleInfoSelectForm = ko.observable();
    self.currentScheduleAddForm = ko.observable();
    self.currentCalendar = ko.observable();
    self.currentScheduleSelectForm = ko.observable(new ScheduleSelectForm(undefined, undefined, undefined, undefined, undefined, self));

    //#init function
    self.init = function () {
     
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
