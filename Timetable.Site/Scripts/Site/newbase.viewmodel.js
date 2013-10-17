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


var ScheduleSelectForm=function(creteria) {
    var self = this;
};


var ScheduleContextMenuForm = function (schedule) {
    var self = this;
    
    self.currentSchedule = ko.observable(schedule);
    self.updateScheduleClick=function(status) {
        if(status==true) {
            
        }
    };
    self.deleteScheduleClick=function(status) {
        if (status == true) {

        }
    };
};

var ScheduleInfoContextMenuForm = function (scheduleInfo, xPos, yPos) {
    var self = this;
    
    $(document).click(function () {
        $("#scheduleInfoContextMenu").addClass("hide");
    });
    
    self.currentScheduleInfo = ko.observable(scheduleInfo);

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
            self.closeDialog(true);
        }
    };
    self.planScheduleInfoClick = function (status) {
        if (status == true) {
            self.closeDialog(true);
        }
    };
};

var ScheduleInfoSelectForm = function (groups,currentStudyYear,currentSemester) {
    var self = this;
    
    console.log("11111111111111111111111111aaaaaa::");
    console.log(groups);

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

    self.loadTutorialTypes(true);

    self.loadScheduleInfoes = function (status) {
        if (status == true && self.currentTutorialType() !== undefined
                           && self.currentStudyYear() !== undefined
                           && self.currentSemester() !== undefined) {
            var groupIds = "";
            for(var i=0;i<self.currentGroups().length;++i)
                groupIds+=self.currentGroups()[i].Id+", ";

            console.log("aaa:::: "+groupIds);
            dModel.loadData({
                address: "scheduleinfo/GetByGroupsOnly",
                params: {
                    groupids: groupIds,
                    tutorialtypeid: self.currentTutorialType().Id,
                    studyyearid: self.currentStudyYear().Id,
                    semesterid: self.currentSemester().Id
                },
                onsuccess: function (data) {
                    console.log(data);
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

            self.scheduleInfoContextMenuForm(new ScheduleInfoContextMenuForm(self.currentScheduleInfo(), event.pageX, event.pageY));
            self.scheduleInfoContextMenuForm().openDialog(true);
        }
    };
    
    self.mouseOverScheduleInfo = function (status, index) {
        if (status == true) {
            self.selectedScheduleInfoIndex(index);
        }
    };
    
    self.mouseOutForm = function (status) {
        
        if (status == true) {
            console.log("MouseOutForm");
            self.selectedScheduleInfoIndex(-1);
        }
    };

    self.openDialog = function (status) {
        if (status == true) {
            console.log("openDialog");
            $("#sidialog").modal('show');
        }
    };

    self.closeDialog = function (status) {
        
        if (status == true) {
            if(self.scheduleInfoContextMenuForm()!==undefined)
                self.scheduleInfoContextMenuForm().closeDialog(true);
            
            console.log("closeDialog");
            $("#sidialog").modal('hide');
        }
    };
};


//Форма валидации
var ValidateScheduleForm = function (validateErrors) {
    var self=this;
    self.validateErrors = ko.observableArray(validateErrors);
    
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
            console.log("closeDialog");
            $("#validatedialog").modal('hide');
        }
    };
};

//Меню добавления занятия
var ScheduleAddForm = function (auditoriums,
                                presetAuditoriumIndex,
                                scheduleInfo,
                                days,
                                presetDayIndex,
                                times,
                                presetTimeIndex,
                                weekTypes,
                                presetWeekTypeIndex,
                                startDate,
                                endDate,
                                autoDelete,
                                subGroups,
                                presetSubGroupIndex) {
    var self=this;
    self.auditoriums=ko.observable(auditoriums);
    self.scheduleInfo = ko.observable(scheduleInfo);
    self.days = ko.observable(days);
    self.times = ko.observable(times);
    self.weekTypes = ko.observable(weekTypes);
    self.startDate = ko.observable(startDate);
    self.endDate = ko.observable(endDate);
    self.autoDelete = ko.observable(autoDelete);
    self.subGroups = ko.observable(subGroups);

    self.currentAuditorium = ko.observable(auditoriums[presetAuditoriumIndex]);
    self.currentWeekType = ko.observable(weekTypes[presetWeekTypeIndex]);
    self.currentSubGroup = ko.observable(subGroups[presetSubGroupIndex]);
    self.currentDay = ko.observable(days[presetDayIndex]);
    self.currentTime = ko.observable(times[presetTimeIndex]);


    self.validateScheduleForm=ko.observable();

    self.ValidateSchedule=function(status, innerFunction) {
        if (status == true) {
            console.log("ValidateSchedule");
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
                    ScheduleInfoId: self.scheduleInfo().Data.ScheduleInfoId(),
                    DayOfWeek: self.currentDay().Id,
                    PeriodId: self.currentTime().Id,
                    WeekTypeId: self.currentWeekType().Id,
                    StartDate: startDateLocal,
                    EndDate: endDateLocal
                },
                onsuccess: function (data) {
                    if(data.length==0) {
                        console.log("ok111");
                        innerFunction(true);
                    } else {
                        self.validateScheduleForm(new ValidateScheduleForm(data));
                        self.validateScheduleForm().openDialog(true);
                        console.log("sorry, validate error");
                    }
                }
            });
        }
    };

    self.AddSchedule=function(status) {
        if (status == true) {
            console.log("AddSchedule");
            var subGroup = self.currentSubGroup();
            if (subGroup == "Все")
                subGroup = "";

            dModel.sendData({
                address: "schedule/add",
                params: {
                    'AuditoriumId': self.currentAuditorium().Id,
                    'ScheduleInfoId': self.scheduleInfo().Data.ScheduleInfoId(),
                    'DayOfWeek': self.currentDay().Id,
                    'PeriodId': self.currentTime().Id,
                    'WeekTypeId': self.currentWeekType().Id,
                    'StartDate': self.startDate(),
                    'EndDate': self.endDate(),
                    'AutoDelete': self.autoDelete(),
                    'SubGroup': subGroup
                },
                onsuccess: function () {
                    console.log("correct add need refresh page");
                }
            });
        }
    };

    self.openDialog = function (status) {
        
        if (status == true) {
            console.log("openDialog");
            $("#adddialog").modal('show');
        }
    };

    self.closeDialog = function (status) {
       
        if (status == true) {
            console.log("closeDialog");
            $("#adddialog").modal('hide');
        }
    };

    self.addButtonPress = function (status) {
       
        if (status == true) {
            console.log("addButtonPress");
            self.ValidateSchedule(true, self.AddSchedule);
        }
    };

    console.log("auditoriums");
    console.log(auditoriums);
    console.log("scheduleInfo");
    console.log(self.scheduleInfo());
    console.log("days");
    console.log(days);
    console.log("times");
    console.log(times);
    console.log("weekTypes");
    console.log(weekTypes);
    console.log("startDate");
    console.log(startDate);
    console.log("endDate");
    console.log(endDate);
    console.log("autoDelete");
    console.log(autoDelete);
    console.log("subGroups");
    console.log(subGroups);
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
var Calendar=function(dayOfWeek, periodId, weekTypeId, lecturerId, auditoriumId, groupIds, subGroup) {
    var self = this;
    
    if (lecturerId == undefined) lecturerId = null;
    if (auditoriumId == undefined) auditoriumId = null;
    if (weekTypeId == undefined) weekTypeId = null;
    if (periodId == undefined) periodId = null;

    self.dayOfWeek=ko.observable(dayOfWeek);
    self.periodId=ko.observable(periodId);
    self.weekTypeId=ko.observable(weekTypeId);
    self.lecturerId=ko.observable(lecturerId);
    self.auditoriumId=ko.observable(auditoriumId);
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


    self.startDrag=function(status) {
        if(status==true) {
            
        }
    };

    self.clickOnScheduleLeft=function(parentIndex,index,flag) {
        if(flag==true) {
            self.clickedSchedule(self.calendarSchedules()[parentIndex]()[index]);
            self.clickedScheduleIndex(index);
        }
    };
    
    self.clickOnScheduleRight = function (parentIndex, index, flag) {
        if (flag == true) {
            self.clickedSchedule(self.calendarSchedules()[parentIndex]()[index]);
            self.clickedScheduleIndex(index);
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
    
    self.loadCalendarSchedules = function (startDate, endDate, index, flag) {
        if(flag==true) {
            dModel.loadData({
                address:"schedule/GetScheduleByDayPeriodDate",
                params:{
                    dayOfWeek:self.dayOfWeek(),
                    periodId:self.periodId(),
                    weekTypeId:null,
                    lecturerId:self.lecturerId(),
                    auditoriumId:self.auditoriumId(),
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
    setTimeout(function () { self.loadCalendarSchedules(self.weeks()[2].StartDate, self.weeks()[3].EndDate, 3, true); }, 200);
    setTimeout(function () { self.loadCalendarSchedules(self.weeks()[2].StartDate, self.weeks()[4].EndDate, 4, true); }, 200);
    setTimeout(function () { self.loadCalendarSchedules(self.weeks()[2].StartDate, self.weeks()[5].EndDate, 5, true); }, 200);
    setTimeout(function () { self.loadCalendarSchedules(self.weeks()[2].StartDate, self.weeks()[6].EndDate, 6, true); }, 200);
    
};


function baseViewModel() {
    var self = this;


    self.hints = ko.observableArray([]);

   // self.addDialogValidationSummary = ko.observableArray([]);
   // self.addHoursValidationSummary = ko.observableArray([]);

    self.IsPrint = ko.observable(false);
    self.PrintHandler=function() {
        //self.IsPrint(!self.IsPrint());
    };

    //Отображается или нет ссылка для автоматического выбора клетки
    self.helperLink = ko.observable(false);
    self.addHoursLink = ko.observable(false);

    //Верхние и нижние границы временных интервалов
    //Переменные для установки границы
    self.currentScheduleStartDate = ko.observable();
    self.currentScheduleEndDate = ko.observable();
    
    self.currentScheduleStartDate.subscribe(function (newValue) {
        self.loadScheduleByAll();
    });
    
    self.currentScheduleEndDate.subscribe(function (newValue) {
        self.loadScheduleByAll();
    });

    
    //Границы для отображения таблицы расписания
   // self.getScheduleStartDate = ko.observable();
   // self.getScheduleEndDate = ko.observable();

    //Текущее значение автоудаления
    self.currentAutoDelete = ko.observable(false);

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

    self.currentDayTimeId=ko.observable();

    //Массив открытых контекстных меню
    self.ContextMenuArray = ko.observableArray([]);

    //Массив открытых downdrop меню
    self.DownDropMenuArray = ko.observableArray([]);

    self.weekTypes = ko.observableArray([]);
    self.currentWeekType = ko.observable();

    //Динамически привязываемые css классы
    self.ScheduleInfoContextMenuCss = [new ko.observable(""), new ko.observable("")];
    self.ScheduleContextMenuCss = [new ko.observable(""), new ko.observable(""), new ko.observable("")];
    self.ScheduleBacketContextMenuCss = [new ko.observable(""), new ko.observable(""), new ko.observable("")];

    self.ScheduleArray = ko.observableArray([]);
    self.ScheduleInfoArray = ko.observableArray([]);

    //Текущее сведение к расписанию
    self.currentScheduleInfo = ko.observable();

    self.currentScheduleInfoSelectForm=ko.observable();

    self.currentCalendar=ko.observable();
    self.currentScheduleAddForm=ko.observable();

    self.currentGroupsIds=ko.observable();

    self.cells = ko.observableArray([]);

    self.daysOfweek = ko.observableArray([{ Id: 1, Name: "Понедельник" }, {Id:2, Name: "Вторник"}, {Id:3, Name: "Среда"},{Id: 4, Name: "Четверг"},{Id:5, Name: "Пятница"},{Id:6, Name: "Суббота"}]);


    self.tutorialtypes = ko.observableArray([]);
    self.currentSiTutorialType = ko.observable();

    

    //Установка заголовка таблицы
    self.timeTableTitle = ko.observable("");
    self.fillTimeTableTitle=function(faculty,building,groups) {
        var title="";
        if(faculty!==undefined)
            title+=faculty+' > ';
        if(building!==undefined)
            title+=building+' > ';
        ;
        if(groups!==undefined)
            title+=groups;

        self.timeTableTitle(title);
    };


    self.auditoriumTypes = ko.observableArray([{ Id: 1, Name: "аудитории" }, { Id: 2, Name: "кабинеты" }, { Id: 3, Name: "дисплейные" },
         { Id: 4, Name: "лабораторные" }, { Id: 5, Name: "комнаты" }, { Id: 6, Name: "залы" }, { Id: 7, Name: "отделы" }, { Id: 8, Name: "лингафонные" },
         { Id: 9, Name: "разные" }]);

    self.currentAuditoriumType = ko.observable();

    self.studyyears = ko.observableArray([]);
    self.currentStudyYear = ko.observable();
    self.semesters = ko.observableArray([{ Id: 0, Name: "0" }, { Id: 1, Name: "1" }, 
                                         { Id: 2, Name: "2" }, { Id: 3, Name: "3" }, { Id: 4, Name: "4" }, { Id: 5, Name: "5" }, { Id: 6, Name: "6" },
                                         { Id: 7, Name: "7" }, { Id: 8, Name: "8" }, { Id: 9, Name: "9" }, { Id: 10, Name: "10" }, { Id: 11, Name: "11" },
                                         { Id: 12, Name: "12" }, { Id: 13, Name: "13" }]);
    self.currentSemester = ko.observable({ Id: 0, Name: "0" });

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

    self.subgroups = ko.observableArray(["Все", "1", "2", "3"]);
    self.currentSubGroup = ko.observable("Все");
    

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
             self.currentDayOfweek().Id, self.currentDayTimes()[0].Id, self.currentSiTutorialType().Id, self.currentAuditoriumType().Id, self.currentScheduleStartDate(), self.currentScheduleEndDate());
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
        $("#freeAuditorium").removeClass("disabled");
        $("#freeAuditorium").addClass("enabled");

        self.ScheduleBacketSelectedArray.push(self.toRealIndex(index));
        if (self.ScheduleArray()[self.toRealIndex(index)] !== undefined) {
            self.ScheduleArray()[self.toRealIndex(index)].IsSelected(true);
            self.ScheduleArray()[self.toRealIndex(index)].CssClass("onScheduleBacketClick");
        }   
    }

    //Выделить ScheduleTicket
    self.selectScheduleTicket=function(parentIndex,index) {
        $("#del").removeClass("disabled");
        $("#del").addClass("enabled");

        $("#changeAuditorium").removeClass("disabled");
        $("#changeAuditorium").addClass("enabled");
        self.ScheduleTicketSelectedArray.push(new pair(self.toRealIndex(parentIndex),index));

        if(self.ScheduleArray()[self.toRealIndex(parentIndex)].Tickets()[index]!==undefined) {
            self.ScheduleArray()[self.toRealIndex(parentIndex)].Tickets()[index].IsSelected(true);
            self.ScheduleArray()[self.toRealIndex(parentIndex)].Tickets()[index].CssClass("onScheduleTicketClick");
        }
    };

    self.currentScheduleInfo.subscribe(function(newValue) {
        if(newValue !== undefined) {
            self.currentLecturer(newValue.Data.LecturerId());
            self.currentGroupsIds(newValue.Data.GroupsIds());
        } else {
            self.currentLecturer(undefined);
            self.currentGroupsIds(groupIds);
        }
    });

    //Выделить ScheduleInfo
    self.selectScheduleInfo=function(index) {
        $("#add").removeClass("disabled");
        $("#add").addClass("enabled");
        self.ScheduleInfoSelectedArray.push(index);
        self.currentScheduleInfo(self.ScheduleInfoArray()[index]);
        self.ScheduleInfoArray()[index].IsSelected(true);
        self.ScheduleInfoArray()[index].Display.CssClass("onScheduleInfoClick");
    };

    //Очистить выделенные ScheduleBackets
    self.clearSelectedScheduleBackets = function () {
        $("#freeAuditorium").removeClass("enabled");
        $("#freeAuditorium").addClass("disabled");

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
        $("#del").removeClass("enabled");
        $("#del").addClass("disabled");

        $("#changeAuditorium").removeClass("enabled");
        $("#changeAuditorium").addClass("disabled");

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
        $("#del").removeClass("enabled");
        $("#del").addClass("disabled");

        this.t = ko.observableArray([]);
        t = self.ScheduleInfoSelectedArray.removeAll();
        self.currentScheduleInfo(undefined);
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
        //###
        self.currentDayOfweek(self.daysOfweek()[index % self.daysOfweek().length]);
        
        if (self.timesFromSchedules()[self.Div(index, self.daysOfweek().length)].dayTimeId !== -1) {
            self.currentDayTimes([self.dayTimes()[
                    self.timesFromSchedules()[self.Div(index, self.daysOfweek().length)].dayTimeId]]);

            console.log(self.currentDayTimes()[0]);

            console.log("!!!!!!!!!!!!!!!!!!!");
        } else {
            self.currentDayTimes([self.dayTimes()[0]]);
            console.log("**************");
        }

            //self.SchedulePlanValidation("back");
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
                    .css({position:'fixed'});
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

    //Поместить выбраное сведение к расписанию в выбраную клетку при двойном щелчке
    self.TransferScheduleInfoToScheduleBacket=function(data,event,prevformstate) {

        var scheduleTicket=new ScheduleTicket(
            new ScheduleDisplay(
                self.currentScheduleInfo().Display.Lecturer(),
                self.currentScheduleInfo().Display.Tutorial(),
                self.currentScheduleInfo().Display.TutorialType(),
                self.currentScheduleInfo().Display.Groups(),
                self.currentAuditorium().Number,
                self.currentWeekType().Name,
                self.currentDayTimes(),
                self.currentSubGroup()
            ),
            new ScheduleData(
                1,
                self.currentScheduleInfo().Data.ScheduleInfoId(),
                self.currentScheduleInfo().Data.TutorialId(),
                self.currentScheduleInfo().Data.TutorialTypeId(),
                self.currentScheduleInfo().Data.GroupsIds(),
                self.currentAuditorium().Id,
                self.currentWeekType().Id,
                self.currentDayOfweek().Id,
                self.currentDayTimes()[0].Id,
                self.currentScheduleInfo().Data.LecturerId(),
                self.currentScheduleStartDate(),
                self.currentScheduleEndDate(),
                self.currentAutoDelete()),
            false,
            false,
            false,
            "onScheduleTicketUnselectForGroup",
            false,
            false,
            true);

        self.ValidateSchedule(scheduleTicket,self.AddSchedule,scheduleTicket);

        return 0;
    };

   
    //Удалить выбранный предмет из клетки расписания
    self.DeleteScheduleTicket=function() {
        console.log("DeleteScheduleTicket");

        //Удаляются все выбранные ScheduleTicket
        for(var i=0;i<self.ScheduleTicketSelectedArray().length;++i) {
            self.DelSchedule(self.ScheduleArray()[self.ScheduleTicketSelectedArray()[i].first].Tickets()[self.ScheduleTicketSelectedArray()[i].second]);
        }

        self.hideAllContextMenu();
        self.hideAllDownDropMenu();

        return 0;
    };

    self.fontSize = ko.observable(12);

    self.fontSize.subscribe(function (newValue) {
        console.log("1111111asd");
    });
    self.ShowPrintSettingMenu=function(data,event) {
        console.log("111111111111dadsad");
        $("#printsettingdialog").modal('show');
    };


    //Показать меню выбора свободных аудиторий
    self.ShowFreeAuditoriumsMenu=function(data,event) {

        self.loadFreeAuditoriumsT1();

        var x=event.pageX-$(document).scrollLeft();
        var y=event.pageY-$(document).scrollTop();

        console.log("ShowFreeAuditoriumsMenu");
      
        $("#auditoriumdialog").modal('show');
    };

    //Показать меню замены аудитории
    self.ShowChangeAuditoriumsMenu=function(data,event) {
        self.loadFreeAuditoriumsT1();

        var x=event.pageX-$(document).scrollLeft();
        var y=event.pageY-$(document).scrollTop();

        console.log("ShowChangeAuditoriumsMenu");

        //$('#pop').popover('show')

        $('#changeauditoriumdialog').modal('show');
    };

    //Показать меню замены занятия
    self.ShowChangeScheduleMenu=function(data,event) {
        var x=event.pageX-$(document).scrollLeft();
        var y=event.pageY-$(document).scrollTop();

        console.log("ShowChangeScheduleMenu");

        $("#changescheduledialog").dialog({
            position:[x,y],
            autoOpen:false,
            height:280,
            width:400,
            modal:true,
        });

        $("#changescheduledialog").dialog("open");
    };


   /* self.addDialogValidationSummary.subscribe(function (newValue) {
        if (newValue !== undefined) {
            if (newValue.length > 0) {
                $("#validationError").removeClass('hide')
                $("#addScheduleOkButton").removeClass("enabled");
                $("#addScheduleOkButton").addClass("disabled");
            } else {
                $("#addScheduleOkButton").removeClass("disabled");
                $("#addScheduleOkButton").addClass("enabled");
                $("#validationError").addClass('hide');
                
            }
        }
    });*/
       

    /*self.SchedulePlanValidation = function (param) {
        self.addDialogValidationSummary([]);

        self.addHoursLink(false);
        self.helperLink(false);

        var currentSiIndex = self.ScheduleInfoSelectedArray()[self.ScheduleInfoSelectedArray().length - 1];
        if (self.ScheduleInfoArray()[currentSiIndex] !== undefined) {
            var prevHours = self.ScheduleInfoArray()[currentSiIndex].Display.curHours();
            var maxHours = self.ScheduleInfoArray()[currentSiIndex].Display.maxHours()

            if (self.currentWeekType() == undefined){
                self.addDialogValidationSummary.push({ Id: 1, Name: "Не выбран тип недели" });
                return -1;
            }

            if(self.currentDayTimes() == undefined){
                self.addDialogValidationSummary.push({ Id: 2, Name: "Не выбрано время" });
                return -1;
            }

            if(self.currentDayOfweek() == undefined){
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
    }*/

    //Показать меню планирования занятия
    self.ShowSchedulePlanMenu = function (data, event) {

        self.loadFreeAuditoriumsT1();

        //var state = self.SchedulePlanValidation("to");

       // if (state !== -2) {
            var x = event.pageX - $(document).scrollLeft();
            var y = event.pageY - $(document).scrollTop();

            console.log("ShowSchedulePlanMenu");

            $('#adddialog').modal('show');

            //if(state == -3){
                //self.ShowAddHoursMenu(data, event);
            //}
       // }
    }


    //Обработка выбора дней в меню планирования занятия
    self.currentDayOfweek.subscribe(function (newValue) {
        if (newValue !== undefined) {
            self.clearSelectedScheduleBackets();

            var currentDayIndex = newValue.Id - 1;

            //###
            for (var i = 0; i < self.currentDayTimes().length; ++i) {
                var currentTimeIndex = self.currentDayTimes()[i].ViewId - 1;
                self.ScheduleBacketSelectedArray.push(self.gi(currentTimeIndex, currentDayIndex));
                if (self.ScheduleArray()[self.gi(currentTimeIndex, currentDayIndex)] !== undefined) {
                    self.ScheduleArray()[self.gi(currentTimeIndex, currentDayIndex)].IsSelected(true);
                    self.ScheduleArray()[self.gi(currentTimeIndex, currentDayIndex)].CssClass("onScheduleBacketClick");
                }
            }

            //self.SchedulePlanValidation("back");
        }
    });

    //Обработка выбора типа недели
    self.currentWeekType.subscribe(function (newValue) {
        //if (newValue !== undefined) {
           //self.SchedulePlanValidation("back");
        //}
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
            //self.SchedulePlanValidation("back");
        }
    });

    //Обработка нажатия на ссылку подсказки
    self.helperLinkClick=function(data,event) {
        var s2=self.ScheduleInfoSelectedArray().length;
        var currentSiIndex=self.ScheduleInfoSelectedArray()[s2-1];

        if(self.currentFaculties()!==undefined&&self.currentBuilding()!==undefined&&
            self.currentStudyYear()!==undefined&&self.currentSemester()!==undefined&&self.currentTimetable()!==undefined&&
            self.currentWeekType()!==undefined&&self.currentSiTutorialType()!==undefined&&self.currentAuditoriumType()!==undefined) {

            self.loadHint(self.currentFaculties().Id,self.currentBuilding().Id,self.ScheduleInfoArray()[currentSiIndex].Data.LecturerId(),
                courseIds,groupIds,self.currentStudyYear().Id,self.currentSemester().Id,self.currentTimetable().Id,
                self.currentWeekType().Id,self.currentSiTutorialType().Id,self.currentAuditoriumType().Id,
                self.currentScheduleStartDate(),self.currentScheduleEndDate());
        }
    };

    self.addHoursLinkClick = function (data, event) {
        self.ShowAddHoursMenu(data, event);
    }

    self.gi = function (i, j) {
        return i * self.daysOfweek().length + j;
    };

    self.gf = function (index) {
        return index - (self.daysOfweek().length + 1) - (index / (self.daysOfweek().length + 1) >> 0);
    }


    /*self.addHoursValidationSummary.subscribe(function (newValue) {
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
    });*/

   

   /* self.AddHoursValidation = function () {
        //self.addHoursValidationSummary([]);
        if (self.newScheduleInfoMaxHours() == undefined || self.newScheduleInfoMaxHours() == 0 || self.newScheduleInfoMaxHours() == "") {
           // self.addHoursValidationSummary.push({ Id: 1, Name: "Часы не введены" });
            return -1;
        }
        return 0;
    }*/


    //Показать меню добавления времени к сведению о расписании
    self.ShowAddHoursMenu = function (data, event) {

        //self.AddHoursValidation();

        var x = event.pageX - $(document).scrollLeft();
        var y = event.pageY - $(document).scrollTop();

        console.log("ShowAddHoursMenu");

        /*
        $("#addhoursdialog").dialog({
            position: [x, y],
            autoOpen: false,
            height: 200,
            width: 280,
            modal: true,
        });*/

        $("#addhoursdialog").modal('show');
    }


    //Заполнение таблицы с расписанием
    self.ScheduleRangeLength = ko.observable(10);

    self.fillScheduleTable = function (data) {

        self.cells.removeAll();
        
        //###
        for (var i = 0; i < 1 + self.daysOfweek().length * self.ScheduleRangeLength() + self.daysOfweek().length + self.ScheduleRangeLength(); ++i) {
            self.cells.push(1);
        }

        for (var i = 0; i < self.ScheduleRangeLength(); ++i) {
            for (var j = 0; j < self.daysOfweek().length; ++j) {
                //2x
                var scheduleTickets = [];
                self.ScheduleArray.push(new ScheduleBacket(scheduleTickets, false, false));
            }
        }
    }


    self.timesFromSchedules = ko.observableArray([]);
    self.usedTimes = ko.observableArray([]);

    self.fillScheduleTable2 = function (data) {

        var tt = self.clearSelectedScheduleTickets();
  
        for (var i = 0; i < self.ScheduleArray().length; ++i) {
            self.ScheduleArray()[i].Tickets.removeAll();
        }

        self.timesFromSchedules.removeAll();
        self.usedTimes.removeAll();

        for (var i = 0; i < self.dayTimes().length; ++i) {
            var curTime = {
                Start: self.dayTimes()[i].Start,
                End: self.dayTimes()[i].End,
                dayTimeId: i,
            };

            if (self.usedTimes.indexOf(curTime.Start + curTime.End) == -1) {
                self.timesFromSchedules.push(curTime);
                self.usedTimes.push(curTime.Start + curTime.End);
            }
        }

        for (var i = 0; i < data.length; ++i) {
            var curTime = {
                Start: data[i].StartTime,
                End: data[i].EndTime,
                dayTimeId: -1,
            };

            if (self.usedTimes.indexOf(curTime.Start+curTime.End) == -1) {
                self.timesFromSchedules.push(curTime);
                self.usedTimes.push(curTime.Start + curTime.End);
            }
        }

       

       
        self.timesFromSchedules.sort(function (left, right)
        {
            return left.Start == right.Start ? 0 : (left.Start < right.Start ? -1 : 1)
        });

        console.log(self.timesFromSchedules());

       

        self.ScheduleRangeLength(self.timesFromSchedules().length);
        self.fillScheduleTable();
       
        for (var i = 0; i < data.length; ++i) {

            var Index = 0;
            for (var j = 0; j < self.timesFromSchedules().length; ++j) {
                if (self.timesFromSchedules()[j].Start == data[i].StartTime &&
                    self.timesFromSchedules()[j].End == data[i].EndTime) {
                    Index = j;
                    break;
                }
            }

            var currentSbIndex = self.gi(Index, data[i].DayOfWeek - 1);

            //console.log(self.timesFromSchedules()[i].Start / 60 + ":" + self.timesFromSchedules()[i].Start % 60 + "  " + self.timesFromSchedules()[i].Index + " - " + (self.timesFromSchedules()[i].Data.DayOfWeek - 1) + " " + currentSbIndex);

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
                                        data[i].WeekTypeName,
                                        data[i].StartTime + "-" + data[i].EndTime,
                                        data[i].SubGroup
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
                                        data[i].LecturerId,
                                        data[i].StartDate,
                                        data[i].EndDate,
                                        data[i].AutoDelete),
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
            }, 0, data[i]);
        }
    }

    //#init function
    self.init = function () {
        
        var start = new Date();
        start.setDate(start.getDate() - (start.getDay() - 1));
        start=toStrDate(start);

        var end = new Date();
        end.setDate(end.getDate() + 7 - end.getDay());
        end = toStrDate(end);

        self.currentScheduleStartDate(start);
        self.currentScheduleEndDate(end);

        
       
        self.currentTimetable(self.timetables()[0]);
        self.fillScheduleTable();

        $("#adddialog").draggable({
            handle: ".modal-header"
        });

        $("#validatedialog").draggable({
            handle: ".modal-header"
        });

        $("#auditoriumdialog").draggable({
            handle: ".modal-header"
        });

        $("#changeauditoriumdialog").draggable({
            handle: ".modal-header"
        });

        $("#addhoursdialog").draggable({
            handle: ".modal-header"
        });

        Ext.create('Ext.panel.Panel', {
            width: 'auto',
            height: 600,
            layout: 'accordion',
            renderTo: 'flowTab',
            defaults: {
                bodyStyle: 'padding:3px'
            },
            layoutConfig: {
                titleCollapse: false,
                animate: true,
                activeOnTop: true
            },
            items: [{
                title: 'Группы',
                contentEl: 'flowGroups'
            }, {
                title: 'Сведения к расписанию',
                contentEl: 'flowSI'
            },{
                title: 'Добавить занятие',
                contentEl: 'flowAdd'
            }]
        });

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
                    width: 200,
                    minSize: 100,
                    maxSize: 250,
                    preventHeader: true ,
                    hideCollapseTool: true,
                    contentEl: 'menu11'
                },
                 {
                     region: 'north',
                     autoScroll: false,
                     height: 85,
                     preventHeader: true,
                     hideCollapseTool: true,
                     contentEl: 'headerMenu11'
                 }, {
                    collapsible: false,
                    layout: 'fit',
                    region: 'center',
                    height: 500,
                    margins: '5 0 0 0',
                    contentEl: 'timetable11',
                    autoScroll: true
                }],


            renderTo: 'div11'

        });
    }

    //Обработчики щелчков #ClickEventHandlers
    self.currentScheduleClicked = ko.observable();
    self.currentScheduleInfoClicked = ko.observable();

    self.ScheduleSingleLeftClick = function (parentIndex, index, data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();

        self.clearSelectedScheduleTickets();

        self.selectScheduleTicket(parentIndex, index);
    }

    self.ScheduleSingleRightClick = function (parentIndex, index, data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
        self.toContextMenu(data, event, "#ScheduleContextMenuDialog");

        self.clearSelectedScheduleTickets();

        self.selectScheduleTicket(parentIndex, index);
    }

    self.ScheduleDoubleClick = function (data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
    }

    self.ScheduleBacketSingleLeftClick = function (index, data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();

        self.UpdateCurrentScheduleBacket(self.toRealIndex(index));
  
        self.clearSelectedScheduleBackets();

        self.selectScheduleBacket(index);
    }

    self.ScheduleBacketSingleRightClick=function(index,data,event) {

        self.UpdateCurrentScheduleBacket(self.toRealIndex(index));

        self.clearSelectedScheduleBackets();

        self.selectScheduleBacket(index);


        if(event.target.classList[0]=="ScheduleBacket"||event.target.classList[0]=="onScheduleBacketSelect"||event.target.classList[0]=="onScheduleBacketClick") {
            self.hideAllContextMenu();
            self.hideAllDownDropMenu();
            self.toContextMenu(data,event,"#ScheduleBacketContextMenuDialog");
        }
    };

    self.ScheduleBacketDoubleClick=function(data,event) {

        if(event.target.classList[0]=="ScheduleBacket"||event.target.classList[0]=="onScheduleBacketSelect"||event.target.classList[0]=="onScheduleBacketClick") {
            self.hideContextMenu("#ScheduleBacketContextMenuDialog");
        }
    };

    self.ScheduleInfoSingleLeftClick = function (index, data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
   
        self.clearSelectedScheduleInfoes();

        //Загрузка расписания для преподавателя
      
        self.selectScheduleInfo(index);
        self.loadScheduleByAll();
    }

    self.ScheduleInfoSingleRightClick = function (index, data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
        self.toContextMenu(data, event, "#ScheduleInfoContextMenuDialog");

        self.clearSelectedScheduleInfoes();

        self.selectScheduleInfo(index);
    }

    self.ScheduleInfoDoubleClick = function (data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();

        self.TransferScheduleInfoToScheduleBacket(data, event, 0);
    }

    //Drag обработчики #DragEventHandlers
    self.currentScheduleDrag = ko.observable();
    self.currentScheduleInfoDrag = ko.observable();

    self.ScheduleStartDrag = function (data, event) {

    }

    //Начало перетаскивания сведения к расписанию
    self.ScheduleInfoStartDrag=function(index,data,event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();

        self.clearSelectedScheduleInfoes();

        //Загрузка расписания для преподавателя

        self.selectScheduleInfo(index);

        self.loadScheduleByAll();

        self.ScheduleInfoArray()[index].IsDragged(true);
        self.ScheduleInfoArray()[index].Display.CssClass("onScheduleInfoDrag");
    };
   

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


    //Обработчики кнопок в header меню #HeaderMenuButtons

    self.ScheduleInfoButton = function (data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();

        self.currentScheduleInfoSelectForm(new ScheduleInfoSelectForm(self.currentGroups(),self.currentStudyYear(),self.currentSemester()));
        self.currentScheduleInfoSelectForm().openDialog(true);
    };
    
    //Обработка нажатия кнопки 'Запланировать' в Header menu
    self.SchedulePlanButton=function(data,event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();

        self.ShowSchedulePlanMenu(data,event);
    };

    self.ScheduleDeleteButton=function(data,event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
        self.DeleteScheduleTicket();
    };

    self.ScheduleChangeButton=function(data,event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
    };

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

    self.PrintSettingButton = function (data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
        self.ShowPrintSettingMenu();
    }

    self.PrintScheduleButton = function (data, event) {
 
      
        var ScheduleModel = {
            lecturerid: printLecturerId,
            auditoriumid: printAuditoriumId,
            facultyid: self.currentFaculties().Id,
            courseids: courseIds,
            groupids: printGroupIds,
            specialityids: specialityIds,
            studyyearid: printStudyYearId,
            semesterid: printSemesterId,
            timetableid: printTimetableId,
            sequence: printSequence,
            starttime: self.currentScheduleStartDate(),
            endtime: self.currentScheduleEndDate()
        };

        var printBuildingId = 0;

        if(self.currentBuilding() !== undefined)
            printBuildingId = self.currentBuilding().Id;

        var TimeModel = {
            buildingid: printBuildingId
        };

       

        $.ajax({
            url: "PrintSchedule/Index",
            type: 'POST',
            contentType: 'application/json',
            dataType: 'html',
            data: JSON.stringify({ s: ScheduleModel, t: TimeModel, h: self.timeTableTitle(), fs: self.fontSize(), mode: "forTable" }),
            success: function (responseText, textStatus, XMLHttpRequest) {
                var OpenWindow = window.open('', '_blank', 'width=1100,height=500,resizable=1');
                $(OpenWindow.document.body).ready(function () {
                    $(OpenWindow.document.body).append(responseText);
                });
            },
            error: function () {
                
            }
        });      
    }

    self.PrintScheduleForAuditoriumButton = function (data, event) {


        var ScheduleModel = {
            lecturerid: printLecturerId,
            auditoriumid: printAuditoriumId,
            facultyid: self.currentFaculties().Id,
            courseids: courseIds,
            groupids: printGroupIds,
            specialityids: specialityIds,
            studyyearid: printStudyYearId,
            semesterid: printSemesterId,
            timetableid: printTimetableId,
            sequence: printSequence,
            starttime: self.currentScheduleStartDate(),
            endtime: self.currentScheduleEndDate()
        };

        var printBuildingId = 0;

        if (self.currentBuilding() !== undefined)
            printBuildingId = self.currentBuilding().Id;

        var TimeModel = {
            buildingid: printBuildingId
        };

        var tHeader = "аудитория: ";
        tHeader += self.currentAuditorium().Number;

        $.ajax({
            url: "PrintSchedule/Index",
            type: 'POST',
            contentType: 'application/json',
            dataType: 'html',
            data: JSON.stringify({ s: ScheduleModel, t: TimeModel, h: tHeader, fs: self.fontSize(), mode: "forAuditorium" }),
            success: function (responseText, textStatus, XMLHttpRequest) {
                var OpenWindow = window.open('', '_blank', 'width=1100,height=500,resizable=1');
                $(OpenWindow.document.body).ready(function () {
                    $(OpenWindow.document.body).append(responseText);
                });
            },
            error: function () {

            }
        });
    }

    self.PrintScheduleForLecturerButton = function (data, event) {


        var ScheduleModel = {
            lecturerid: printLecturerId,
            auditoriumid: printAuditoriumId,
            facultyid: self.currentFaculties().Id,
            courseids: courseIds,
            groupids: printGroupIds,
            specialityids: specialityIds,
            studyyearid: printStudyYearId,
            semesterid: printSemesterId,
            timetableid: printTimetableId,
            sequence: printSequence,
            starttime: self.currentScheduleStartDate(),
            endtime: self.currentScheduleEndDate()
        };

        var printBuildingId = 0;

        if (self.currentBuilding() !== undefined)
            printBuildingId = self.currentBuilding().Id;

        var TimeModel = {
            buildingid: printBuildingId
        };

        var tHeader = "преподаватель: ";
        tHeader += self.currentScheduleInfo().Display.Lecturer();

        $.ajax({
            url: "PrintSchedule/Index",
            type: 'POST',
            contentType: 'application/json',
            dataType: 'html',
            data: JSON.stringify({ s: ScheduleModel, t: TimeModel, h: tHeader, fs: self.fontSize(), mode: "forLecturer" }),
            success: function (responseText, textStatus, XMLHttpRequest) {
                var OpenWindow = window.open('', '_blank', 'width=1100,height=500,resizable=1');
                $(OpenWindow.document.body).ready(function () {
                    $(OpenWindow.document.body).append(responseText);
                });
            },
            error: function () {

            }
        });
    }


    self.PrintScheduleForGroupsButton = function (data, event) {
        var ScheduleModel = {
            lecturerid: printLecturerId,
            auditoriumid: printAuditoriumId,
            facultyid: self.currentFaculties().Id,
            courseids: courseIds,
            groupids: printGroupIds,
            specialityids: specialityIds,
            studyyearid: printStudyYearId,
            semesterid: printSemesterId,
            timetableid: printTimetableId,
            sequence: printSequence,
            starttime: self.currentScheduleStartDate(),
            endtime: self.currentScheduleEndDate()
        };

        var printBuildingId = 0;

        if (self.currentBuilding() !== undefined)
            printBuildingId = self.currentBuilding().Id;

        var TimeModel = {
            buildingid: printBuildingId
        };


        var tHeader = "";
        tHeader += self.currentFaculties().Name + " группы: ";
        for (var i = 0; i < self.currentGroups().length; ++i) {
            tHeader += self.currentGroups()[i].Code;
        }

        $.ajax({
            url: "PrintSchedule/IndexForGroups",
            type: 'POST',
            contentType: 'application/json',
            dataType: 'html',
            data: JSON.stringify({ s: ScheduleModel, t: TimeModel, h: tHeader, fs: self.fontSize(), mode: "forGroups" }),
            success: function (responseText, textStatus, XMLHttpRequest) {
                var OpenWindow = window.open('', '_blank', 'width=1100,height=500,resizable=1');
                $(OpenWindow.document.body).ready(function () {
                    $(OpenWindow.document.body).append(responseText);
                });
            },
            error: function () {

            }
        });
    }


    self.PrintScheduleForCoursesButton = function (data, event) {
        var ScheduleModel = {
            lecturerid: printLecturerId,
            auditoriumid: printAuditoriumId,
            facultyid: self.currentFaculties().Id,
            courseids: courseIds,
            groupids: printGroupIds,
            specialityids: specialityIds,
            studyyearid: printStudyYearId,
            semesterid: printSemesterId,
            timetableid: printTimetableId,
            sequence: printSequence,
            starttime: self.currentScheduleStartDate(),
            endtime: self.currentScheduleEndDate()
        };

        var printBuildingId = 0;

        if (self.currentBuilding() !== undefined)
            printBuildingId = self.currentBuilding().Id;

        var TimeModel = {
            buildingid: printBuildingId
        };

        var tHeader = "";
        tHeader += self.currentFaculties().Name + " ";

        for (var i = 0; i < self.currentCourses().length; ++i) {
            tHeader += self.currentCourses()[i].Name + ", ";
        }

        $.ajax({
            url: "PrintSchedule/IndexForGroups",
            type: 'POST',
            contentType: 'application/json',
            dataType: 'html',
            data: JSON.stringify({ s: ScheduleModel, t: TimeModel, h: tHeader, fs: self.fontSize(), mode: "forCourses" }),
            success: function (responseText, textStatus, XMLHttpRequest) {
                var OpenWindow = window.open('', '_blank', 'width=1100,height=500,resizable=1');
                $(OpenWindow.document.body).ready(function () {
                    $(OpenWindow.document.body).append(responseText);
                });
            },
            error: function () {

            }
        });
    }

    self.PrintScheduleForSpecialitiesButton = function (data, event) {
        var ScheduleModel = {
            lecturerid: printLecturerId,
            auditoriumid: printAuditoriumId,
            facultyid: printFacultyId,
            courseids: printCourseIds,
            groupids: printGroupIds,
            specialityids: specialityIds,
            studyyearid: printStudyYearId,
            semesterid: printSemesterId,
            timetableid: printTimetableId,
            sequence: printSequence,
            starttime: self.currentScheduleStartDate(),
            endtime: self.currentScheduleEndDate()
        };

        var printBuildingId = 0;

        if (self.currentBuilding() !== undefined)
            printBuildingId = self.currentBuilding().Id;

        var TimeModel = {
            buildingid: printBuildingId
        };

        var tHeader = "";
        tHeader += self.currentFaculties().Name + " специальности: ";
        for (var i = 0; i < self.currentSpecialities().length; ++i) {
            tHeader += self.currentSpecialities()[i].Name;
        }

        $.ajax({
            url: "PrintSchedule/IndexForGroups",
            type: 'POST',
            contentType: 'application/json',
            dataType: 'html',
            data: JSON.stringify({ s: ScheduleModel, t: TimeModel, h: tHeader, fs: self.fontSize(), mode: "forSpecialities" }),
            success: function (responseText, textStatus, XMLHttpRequest) {
                var OpenWindow = window.open('', '_blank', 'width=1100,height=500,resizable=1');
                $(OpenWindow.document.body).ready(function () {
                    $(OpenWindow.document.body).append(responseText);
                });
            },
            error: function () {

            }
        });
    }

    //Обработчики кнопок всплывающих форм #PopUpFormButtonHandlers
    //Кнопки на форме добавления занятия #SchedulePlanFormButtons

    self.SchedulePlanFormOkButton = function (data, event) {
        console.log("Ok");
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
        self.TransferScheduleInfoToScheduleBacket(data, event, 1);
    }

    self.SchedulePlanFormCancelButton = function (data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
        console.log("Cancel");
        $('#adddialog').modal('hide');
    }

    //Кнопки на форме сообщений валидации
    self.validateFormOkButton = function (data, event) {
        console.log("Ok");
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
        $('#validatedialog').modal('hide');
        for(var i = 2; i <= 9; ++i)
            $("#validatemessage" + i).addClass("hide");
    }

    self.validateFormCancelButton = function (data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
        console.log("Cancel");
        $('#validatedialog').modal('hide');
    }

    //Кнопки на форме списка свободных аудиторий
    self.FreeAuditoriumFormOkButton = function (data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
        
        console.log("AOk");
        $("#auditoriumdialog").modal('hide');
    }

    self.FreeAuditoriumFormCancelButton = function (data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
        console.log("ACancel");
        $("#auditoriumdialog").modal('hide');
    }

    //Кнопки на форме замены аудитории
    self.ChangeAuditoriumFormOkButton = function (data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();

        //Поменять аудиторию
        if (self.currentChangeAuditorium() !== undefined) {
            for (var i = 0; i < self.ScheduleTicketSelectedArray().length; ++i) {
                if (self.currentAuditorium() !== undefined) {
                    self.ScheduleArray()[self.ScheduleTicketSelectedArray()[i].first].Tickets()[self.ScheduleTicketSelectedArray()[i].second].Display.Auditorium(self.currentAuditorium().Number);
                    self.ScheduleArray()[self.ScheduleTicketSelectedArray()[i].first].Tickets()[self.ScheduleTicketSelectedArray()[i].second].Data.AuditoriumId(self.currentAuditorium().Id);
                    self.UpdateSchedule(self.ScheduleArray()[self.ScheduleTicketSelectedArray()[i].first].Tickets()[self.ScheduleTicketSelectedArray()[i].second]);
                }
            }
            $('#changeauditoriumdialog').modal('hide');
        } else {
            alert("Аудитория не выбрана!");
        }
    }

    self.PrintSettingCancelButton = function (data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
        $('#printsettingdialog').modal('hide');
    }

    self.ChangeAuditoriumFormCancelButton = function (data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
        console.log("CACancel");
        $('#changeauditoriumdialog').modal('hide');
    }

    //Кнопки на форме добавления часов
    self.newScheduleInfoMaxHours = ko.observable();

    self.newScheduleInfoMaxHours.subscribe(function (newValue) {
        //self.AddHoursValidation();
    });


    self.AddHoursFormOkButton = function (data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
  
        if (self.newScheduleInfoMaxHours() !== undefined) {
            for (var i = 0; i < self.ScheduleInfoSelectedArray().length; ++i) {
                //###
                self.ScheduleInfoArray()[self.ScheduleInfoSelectedArray()[i]].Display.maxHours(self.newScheduleInfoMaxHours());
                //console.log("1111111111: " + self.ScheduleInfoArray()[self.ScheduleInfoSelectedArray()[i]].Display.maxHours());
                self.UpdateScheduleInfo(self.ScheduleInfoArray()[self.ScheduleInfoSelectedArray()[i]]);
            }
            //self.SchedulePlanValidation("to");
            $("#addhoursdialog").modal('hide');
        } 
    }

    self.AddHoursFormCancelButton = function (data, event) {
        self.hideAllContextMenu();
        self.hideAllDownDropMenu();
        console.log("Add Hours Cancel Button");
        $("#addhoursdialog").modal('hide');
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

    self.ScheduleContextMenuElementClick_ChangeSchedule=function(data,event) {
        //self.hideContextMenu("#ScheduleContextMenuDialog");
        self.ShowChangeScheduleMenu(data,event);
        self.hideAllDownDropMenu();
        self.hideAllContextMenu();
    };

    self.ScheduleContextMenuElementClick_ChangeAuditorium=function(data,event) {
        // self.hideContextMenu("#ScheduleContextMenuDialog");
        self.ShowChangeAuditoriumsMenu(data,event);
        self.hideAllDownDropMenu();
        self.hideAllContextMenu();
    };


    self.ScheduleBacketContextMenuElementClick_PlanSchedule=function(data,event) {
        self.hideAllDownDropMenu();
        self.hideAllContextMenu();
        console.log("ABABCABA");
        self.currentScheduleAddForm(new ScheduleAddForm(self.auditoriums(),0,self.currentScheduleInfo(), self.daysOfweek(),0, self.dayTimes(),0, self.weekTypes(),0, self.currentScheduleStartDate(), self.currentScheduleEndDate(), false, self.subgroups(), 0));
        self.currentScheduleAddForm().openDialog(true);
    };

    self.ScheduleBacketContextMenuElementClick_Calendar=function(data,event) {
        self.hideAllDownDropMenu();
        self.hideAllContextMenu();
        
        
        

        //self.toContextMenu(data, event, "#ScheduleBacketContextMenuCalendar");
        //$(".ScheduleBacket").popover('destroy');
        //var elem = $('.calendarPopover').html();
       // $('.ScheduleBacket').popover({ animation: true, content: elem, html: true, placement: "bottom", delay: { show: 1000 } }); //({ delay: { show: 1000, hide: 0 } });


        console.log(self.currentDayTimes());
        

        if (self.currentDayOfweek() !== undefined && self.currentDayTimes()[0] !== undefined)
            self.currentCalendar( new Calendar(self.currentDayOfweek().Id, self.currentDayTimes()[0].Id, self.currentWeekType().Id, self.currentLecturer(), self.currentAuditorium().Id, groupIds, self.currentSubGroup()));
        console.log(self.currentCalendar().weeks().length);
        
        $('#calendardialog').modal('show');
    };

    self.ScheduleBacketContextMenuElementClick_FreeAuditoriums=function(data,event) {
        //self.hideContextMenu("#ScheduleBacketContextMenuDialog");
        self.ShowFreeAuditoriumsMenu(data,event);
        self.hideAllDownDropMenu();
        self.hideAllContextMenu();
    };

    self.getColumn=function(value) {
        return value%7;
    };

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

    self.datainit = function () {
        //Загрузка зданий
        dModel.loadData({
            address: "building/getall",
            obj: self.buildings,
            onsuccess: function () {

                //Загрузка звонков
                if (self.buildings()[0] !== undefined) {
                    //self.fillScheduleTable2([]);
                    self.loadTimes(self.buildings()[0].Id);
                }
            }
        });

        //Загрузка годов
        dModel.loadData({
            address: "studyyear/getall",
            obj: self.studyyears,
            onsuccess: function () {
                //TODO
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
                //self.fillScheduleTable();
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
    self.loadFreeAuditoriums = function (buildingId, weekTypeId, day, timeId, tutorialTypeId, auditoriumTypeId, startDate, endDate) {
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
                    auditoriumtypeid: auditoriumTypeId,
                    starttime: startDate,
                    endtime: endDate,
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
    

    self.loadScheduleByAll = function () {
        
        var lecturerId = self.currentLecturer();

        var auditoriumId;
        if (self.currentAuditorium() !== undefined)
            auditoriumId = self.currentAuditorium().Id;
        
        var groupsIds = self.currentGroupsIds();
        if (groupsIds == undefined) groupsIds = groupIds;

        var weekTypeId;
        if(self.currentWeekType()!==undefined) {
            weekTypeId=self.currentWeekType().Id;
        }
        
        var subGroup=self.currentSubGroup();
        var startTime=self.currentScheduleStartDate();
        var endTime=self.currentScheduleEndDate();

        if (lecturerId == undefined) lecturerId = null;
        if (auditoriumId == undefined) auditoriumId = null;
        if (weekTypeId == undefined) weekTypeId = null;
        if (lecturerId == undefined) lecturerId = null;
        if (startTime == undefined) startTime = "";
        if (endTime == undefined) endTime = "";

      
        dModel.loadData({
            address:"schedule/GetScheduleByAll",
            params:{
                lecturerId: lecturerId,
                auditoriumId: auditoriumId,
                groupIds:groupIds,
                weekTypeId:weekTypeId,
                subGroup:subGroup,
                startTime:startTime,
                endTime:endTime
            },
            onsuccess:function(data) {
                self.fillScheduleTable2(data);
            }
        });
    };

    //Загрузка подсказки
    self.loadHint = function (facultyId, buildingId, lecturerId, courseIds, groupIds, studyYearId, semesterId, timetableId, weekTypeId, tutorialTypeId, auditoriumTypeId, startDate, endDate) {
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
                auditoriumtypeid: auditoriumTypeId,
                startdate: startDate,
                enddate: endDate
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
        var subGroup = Schedule.Display.subGroup();
        if(subGroup=="Все")
            subGroup="";

        dModel.sendData({
            address: "schedule/add",
            params: {
                'AuditoriumId': Schedule.Data.AuditoriumId(),
                'ScheduleInfoId': Schedule.Data.ScheduleInfoId(),
                'DayOfWeek': Schedule.Data.DayOfWeek(),
                'PeriodId': Schedule.Data.PeriodId(),
                'WeekTypeId': Schedule.Data.WeekTypeId(),
                'StartDate': Schedule.Data.StartDate(),
                'EndDate': Schedule.Data.EndDate(),
                'AutoDelete': Schedule.Data.AutoDelete(),
                'SubGroup' : subGroup
            },
            onsuccess: function () {
                self.loadScheduleByAll();
                if (self.currentFaculties() !== undefined && self.currentSiTutorialType() !== undefined && self.currentStudyYear() !== undefined && self.currentSemester() !== undefined) {
                    self.loadScheduleInfoes(self.currentFaculties().Id, courseIds, groupIds, self.currentSiTutorialType().Id, self.currentStudyYear().Id, self.currentSemester().Id);
                }
            }
        });
    }

    //Удаление клетки расписания
    self.DelSchedule = function (Schedule) {
        dModel.sendData({
            address: "schedule/delete",
            params: {
                'Id': Schedule.Data.ScheduleId()
            },
            onsuccess: function () {
                self.loadScheduleByAll();
           
                if (self.currentFaculties() !== undefined && self.currentSiTutorialType() !== undefined && self.currentStudyYear() !== undefined && self.currentSemester() !== undefined) {
                    self.loadScheduleInfoes(self.currentFaculties().Id, courseIds, groupIds, self.currentSiTutorialType().Id, self.currentStudyYear().Id, self.currentSemester().Id);
                }
            }
        });
    }

    //Обновление клетки расписания
    self.UpdateSchedule = function (Schedule) {
        var subGroup = Schedule.Display.subGroup();
        if (subGroup == "Все")
            subGroup = "";
        
        dModel.sendData({
            address: "schedule/update",
            params: {
                'ScheduleId': Schedule.Data.ScheduleId(),
                'AuditoriumId': Schedule.Data.AuditoriumId(),
                'ScheduleInfoId': Schedule.Data.ScheduleInfoId(),
                'DayOfWeek': Schedule.Data.DayOfWeek(),
                'PeriodId': Schedule.Data.PeriodId(),
                'WeekTypeId': Schedule.Data.WeekTypeId(),
                'StartDate': Schedule.Data.StartDate(),
                'EndDate': Schedule.Data.EndDate(),
                'AutoDelete': Schedule.Data.AutoDelete(),
                'SubGroup': subGroup
            },
            onsuccess: function () {

                self.loadScheduleByAll();
            }
        });
    }

    //Валидация занятия
    self.ValidateSchedule = function (Schedule, innerFunction, scheduleTicket) {

        console.log(innerFunction);

        var startDate = Schedule.Data.StartDate();
        var endDate = Schedule.Data.EndDate();
        if (startDate == undefined)
            startDate = "";
        if (endDate == undefined)
            endDate = "";

        dModel.loadData({
            address: "schedule/Validate",
            params: {
                AuditoriumId: Schedule.Data.AuditoriumId(),
                ScheduleInfoId: Schedule.Data.ScheduleInfoId(),
                DayOfWeek: Schedule.Data.DayOfWeek(),
                PeriodId: Schedule.Data.PeriodId(),
                WeekTypeId: Schedule.Data.WeekTypeId(),
                StartDate: startDate,
                EndDate: endDate
            },
            onsuccess: function (data) {
                console.log(data);
                console.log("***");
                if (data !== 1) {
                    console.log("#validatemessage" + data);
                    $('#validatedialog').modal('show');
                    $("#validatemessage" + data).removeClass("hide");
                } else {
                    innerFunction(scheduleTicket);
                    $('#adddialog').modal('hide');
                    console.log("ok111");
                }
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
            },
            onsuccess: function () {
                if (self.currentFaculties() !== undefined && self.currentSiTutorialType() !== undefined && self.currentStudyYear() !== undefined && self.currentSemester() !== undefined) {
                    self.loadScheduleInfoes(self.currentFaculties().Id, courseIds, groupIds, self.currentSiTutorialType().Id, self.currentStudyYear().Id, self.currentSemester().Id);
                }
            }
        });
    }


    //Действия при выборе аудитории
    self.currentAuditorium.subscribe(function (newValue) {
        //self.loadScheduleByAll("auditorium,lecturer,group");
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

            if(self.currentBuilding() !== undefined)
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
                self.currentDayOfweek().Id, self.currentDayTimes()[0].Id, self.currentSiTutorialType().Id, self.currentAuditoriumType().Id, self.currentScheduleStartDate(), self.currentScheduleEndDate());
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
        $("#add").removeClass("enabled");
        $("#add").addClass("disabled");

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
                self.loadScheduleByAll();
            }
        }
    });


    self.currentAuditoriumType.subscribe(function (newValue) {
        if (newValue !== undefined) {
            if (self.currentBuilding() !== undefined && self.currentWeekType() !== undefined && self.currentDayOfweek() !== undefined && self.currentDayTimes()[0] !== undefined && self.currentSiTutorialType() !== undefined) {
                self.loadFreeAuditoriums(self.currentBuilding().Id, self.currentWeekType().Id,
                self.currentDayOfweek().Id, self.currentDayTimes()[0].Id, self.currentSiTutorialType().Id, newValue.Id, self.currentScheduleStartDate(), self.currentScheduleEndDate());
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
            self.loadScheduleByAll();

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
            self.loadScheduleByAll();

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
    viewModel.datainit();
   

    // Activates knockout.js
    ko.applyBindings(viewModel);
});
