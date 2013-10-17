using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ScheduleForAllModel = Timetable.Site.Models.Schedules.ForAllModel;
using TimeForAllModel = Timetable.Site.Models.Times.ForAllModel;
using SendSchedule = Timetable.Site.Models.Schedules.SendModel;
using Timetable.Site.Models;
using Timetable.Site.DataService;
using System.Net.Http;
using Timetable.Site.Controllers.Api;
using AudSendModel = Timetable.Site.Models.Auditoriums.SendModel;
using SendGroup = Timetable.Site.Models.Groups.SendModel;
using Timetable.Site.Controllers.Extends;

namespace Timetable.Site.Controllers
{
    
    public class PrintScheduleController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Index(ScheduleForAllModel s, TimeForAllModel t, string h, int fs, string mode)
        {
           
            var scheduleController = new Timetable.Site.Controllers.Api.ScheduleController();
            var timeController = new Timetable.Site.Controllers.Api.TimeController();

            var printScheduleModel = new PrintScheduleModel();

            printScheduleModel.FontSize = fs;

            printScheduleModel.Header = h;
            
            printScheduleModel.Times = timeController.privateGetAll(t.buildingId);

            printScheduleModel.Days = new List<string>() { "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота" }.AsEnumerable();

            printScheduleModel.ScheduleTable = new SendSchedule[30, 30, 5];

            printScheduleModel.Mode = mode;
         
           var Schedules = scheduleController.privateGetByAll(
                    s.lecturerId,
                    s.auditoriumId,
                    s.facultyId,
                    s.courseIds,
                    s.groupIds,
                    s.studyYearId,
                    s.semesterId,
                    s.timetableId,
                    s.sequence,
                    s.startTime,
                    s.endTime,
                    "");
           

            if (mode == "forAuditorium")
            {
                Schedules = scheduleController.privateGetByAuditorium(
                                    s.auditoriumId,
                                    s.studyYearId,
                                    s.semesterId,
                                    s.timetableId,
                                    s.startTime,
                                    s.endTime);
            }


            if (mode == "forLecturer")
            {
                Schedules = scheduleController.privateGetByLecturer(
                                    s.lecturerId,
                                    s.studyYearId,
                                    s.semesterId,
                                    s.timetableId,
                                    s.startTime,
                                    s.endTime);
            }


            foreach (var ss in Schedules)
            {
                int timeId = 0;
                foreach (var tt in printScheduleModel.Times)
                {
                    if (tt.Id == ss.PeriodId)
                    {
                        timeId = tt.ViewId;
                        break;
                    }
                }

                printScheduleModel.ScheduleTable[timeId - 1, ss.DayOfWeek - 1, ss.WeekTypeId] = ss;
            }

            //printScheduleModel.Schedules = scheduleController.privateGetByAll(s);
            //printScheduleModel.Times = timeController.privateGetAll(t);
            
            return View(printScheduleModel);
        }



        /*PrintScheduleForGroupsModel getBestPrintForGroupsModel(PrintScheduleForGroupsModel currentModel)
        {

        }*/


        [HttpPost]
        public ActionResult IndexForGroups(ScheduleForAllModel s, TimeForAllModel t, string h, int fs, string mode)
        {
            
            var scheduleController = new Timetable.Site.Controllers.Api.ScheduleController();
            var timeController = new Timetable.Site.Controllers.Api.TimeController();
            var groupController = new Timetable.Site.Controllers.Api.GroupController();

            var printScheduleModel = new PrintScheduleForGroupsModel();
            printScheduleModel.FontSize = fs;
            printScheduleModel.Header = h;
            printScheduleModel.Times = timeController.privateGetAll(t.buildingId);

            string targetGroupsIds = "";
            string targetCourseIds = "";
         
            if (mode == "forGroups")
            {
                printScheduleModel.Groups = groupController.GetByIds(s.groupIds);
                targetGroupsIds = s.groupIds;
                targetCourseIds = s.courseIds;
            }
            
            if (mode == "forCourses")
            {
                printScheduleModel.Groups = groupController.privateGetByCourses(s.facultyId, s.courseIds);
                foreach (var g in printScheduleModel.Groups)
                {
                    targetGroupsIds += g.Id.ToString() + ", ";
                }
                targetCourseIds = s.courseIds;
            }

            if (mode == "forSpecialities")
            {
                printScheduleModel.Groups = groupController.privateGetBySpecialities(s.specialityIds);

                var courseController = new CourseController();
                var courses = courseController.privateGetAll();

                foreach (var c in courses)
                {
                    targetCourseIds += c.Id.ToString() + ", ";
                }

                foreach (var g in printScheduleModel.Groups)
                {
                    targetGroupsIds += g.Id.ToString() + ", ";
                }
            }
              



            printScheduleModel.Days = new List<string>() { "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота" }.AsEnumerable();
            printScheduleModel.ScheduleTable = new SendSchedule[35, 35, 35, 35];

            printScheduleModel.Colspan = new int[35, 35, 35];
            printScheduleModel.Rowspan = new int[35];
            printScheduleModel.Skip = new bool[35, 35];
            printScheduleModel.Skip2 = new bool[35, 35, 35];
          
            
            //Достаем занятия для всех групп
            //var Schedules = scheduleController.privateGetByAll(s.lecturerId, s.auditoriumId, s.facultyId, s.courseIds, s.groupIds, s.studyYearId, s.semesterId, s.timetableId, s.sequence);
            var Schedules = scheduleController.privateGetByGroups(s.facultyId, targetCourseIds, targetGroupsIds, s.studyYearId, s.semesterId, s.timetableId, s.startTime, s.endTime, "");

            string newGroupIds = "";

            foreach (var gg in printScheduleModel.Groups)
            {
                bool skip = false;
                foreach (var ss in Schedules)
                {
                    foreach (var groupId in ss.GroupIds.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                    {
                        if (groupId != " ")
                        {
                            int igroupId = int.Parse(groupId);
                            if (gg.Id == igroupId)
                            {
                                newGroupIds += gg.Id + ", ";
                                skip = true;
                                break;
                            }
                        }

                    }
                    if (skip == true)
                        break;
                }
            }

            printScheduleModel.Groups = groupController.GetByIds(newGroupIds);

            foreach (var ss in Schedules)
            {
                int timeId = 0;
                foreach (var tt in printScheduleModel.Times)
                {
                    if (tt.Id == ss.PeriodId)
                    {
                        timeId = tt.ViewId;
                        break;
                    }
                }

                int gId = 0;

                //Получаем очередной id из выбранного списка групп
                foreach (var gg in printScheduleModel.Groups)
                { 
                    //Получаем список idшников групп из занятия
                    foreach (var groupId in ss.GroupIds.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                    {
                        if(groupId != " "){
                            int igroupId = int.Parse(groupId);

                            //Очередной idшник группы из занятия
                            if (gg.Id == igroupId)
                            {
                                //usedGroups.Add(new Pair<int,int>(ss.ScheduleInfoId, gg.Id));
                                printScheduleModel.ScheduleTable[gId, ss.DayOfWeek - 1, timeId - 1, ss.WeekTypeId] = ss;
                            }
                        }
                    }
                    gId++;
                }
            }

            
            int dsize = printScheduleModel.Days.Count();
            int tsize = printScheduleModel.Times.Count();
            int gsize = printScheduleModel.Groups.Count();

            for (int k = 0; k < dsize; ++k)
            {
                for (int i = 0; i < tsize; ++i)
                {
                    bool empty = true;
                    for (int j = 0; j < gsize; ++j)
                    {
                        if (printScheduleModel.ScheduleTable[j, k, i, 1] != null ||
                           printScheduleModel.ScheduleTable[j, k, i, 2] != null ||
                           printScheduleModel.ScheduleTable[j, k, i, 3] != null)
                        {
                            empty = false;
                            break;
                        }
                    }
                    if (empty == true)
                    {
                        printScheduleModel.Skip[k, i] = true;
                        printScheduleModel.Rowspan[k]++;
                    }
                    else
                    {
                        int cur = 0;
                        for (int j = cur+1; j < gsize; ++j)
                        {
                            if(printScheduleModel.ScheduleTable[cur, k, i, 1] == null){
                                cur++;
                                continue;
                            }

                            if (printScheduleModel.ScheduleTable[j, k, i, 1] != null)
                            {
                                if (printScheduleModel.ScheduleTable[cur, k, i, 1].AuditoriumNumber
                                    == printScheduleModel.ScheduleTable[j, k, i, 1].AuditoriumNumber)
                                {
                                    printScheduleModel.Skip2[j, k, i] = true;
                                    printScheduleModel.Colspan[cur, k, i]++;
                                }
                                else
                                {
                                    cur = j;
                                }
                            }
                            else
                            {
                                cur = j;
                            }
                        }

                        //Числитель и знаменатель
                        cur = 0;
                        for (int j = cur+1; j < gsize; ++j)
                        {
                            if(printScheduleModel.ScheduleTable[cur, k, i, 2] == null || printScheduleModel.ScheduleTable[cur, k, i, 3] == null){
                                cur++;
                                continue;
                            }

                            if (printScheduleModel.ScheduleTable[j, k, i, 2] != null && printScheduleModel.ScheduleTable[j, k, i, 3] != null)
                            {
                                if (printScheduleModel.ScheduleTable[cur, k, i, 2].AuditoriumNumber
                                    == printScheduleModel.ScheduleTable[j, k, i, 2].AuditoriumNumber 
                                    && printScheduleModel.ScheduleTable[cur, k, i, 3].AuditoriumNumber
                                    == printScheduleModel.ScheduleTable[j, k, i, 3].AuditoriumNumber)
                                {
                                    printScheduleModel.Skip2[j, k, i] = true;
                                    printScheduleModel.Colspan[cur, k, i]++;
                                }
                                else
                                {
                                    cur = j;
                                }
                            }
                            else
                            {
                                cur = j;
                            }
                        }

                        //Числитель
                        cur = 0;
                        for (int j = cur + 1; j < gsize; ++j)
                        {
                            if (printScheduleModel.ScheduleTable[cur, k, i, 2] == null || printScheduleModel.ScheduleTable[cur, k, i, 3] != null)
                            {
                                cur++;
                                continue;
                            }

                            if (printScheduleModel.ScheduleTable[j, k, i, 2] != null && printScheduleModel.ScheduleTable[j, k, i, 3] == null)
                            {
                                if (printScheduleModel.ScheduleTable[cur, k, i, 2].AuditoriumNumber
                                    == printScheduleModel.ScheduleTable[j, k, i, 2].AuditoriumNumber)
                                {
                                    printScheduleModel.Skip2[j, k, i] = true;
                                    printScheduleModel.Colspan[cur, k, i]++;
                                }
                                else
                                {
                                    cur = j;
                                }
                            }
                            else
                            {
                                cur = j;
                            }
                        }

                        //Знаменатель
                        cur = 0;
                        for (int j = cur + 1; j < gsize; ++j)
                        {
                            if (printScheduleModel.ScheduleTable[cur, k, i, 2] != null || printScheduleModel.ScheduleTable[cur, k, i, 3] == null)
                            {
                                cur++;
                                continue;
                            }

                            if (printScheduleModel.ScheduleTable[j, k, i, 2] == null && printScheduleModel.ScheduleTable[j, k, i, 3] != null)
                            {
                                if (printScheduleModel.ScheduleTable[cur, k, i, 3].AuditoriumNumber
                                    == printScheduleModel.ScheduleTable[j, k, i, 3].AuditoriumNumber)
                                {
                                    printScheduleModel.Skip2[j, k, i] = true;
                                    printScheduleModel.Colspan[cur, k, i]++;
                                }
                                else
                                {
                                    cur = j;
                                }
                            }
                            else
                            {
                                cur = j;
                            }
                        }
                    }
                }
            }

            //printScheduleModel.Schedules = scheduleController.privateGetByAll(s);
            //printScheduleModel.Times = timeController.privateGetAll(t);

            return View(printScheduleModel);
        }
    }
}
