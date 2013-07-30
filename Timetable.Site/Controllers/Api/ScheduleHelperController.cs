using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Runtime.Serialization;
using Timetable.Site.Controllers.Extends;
using Timetable.Site.DataService;
using Timetable.Site.Models.Hints;
using SendTime = Timetable.Site.Models.Times.SendModel;

namespace Timetable.Site.Controllers.Api
{
   //Жадный алгоритм для подсказки
   public class ScheduleHelperController : BaseApiController<BaseEntity>
    {
     
       public HttpResponseMessage GetAll(ForAllModel model)
       {
           return CreateResponse<ForAllModel, IEnumerable<SendModel>>(privateGetAll, model);
       }

       private IEnumerable<SendModel> privateGetAll(ForAllModel model)
       {
           var Schedule = new ScheduleController();
           var Times = new TimeController();

           var result = new List<SendModel>();

           var qTutorialType = new TutorialType();
           qTutorialType.Id = model.tutorialTypeId;

           var qWeekType = new WeekType();
           qWeekType.Id = model.weekTypeId;

           var qBuilding = new Building();
           qBuilding.Id = model.buildingId;
        
           //Получение расписания для групп
           var groupSchedule = new List<Schedule>();
           var qFaculty = new Faculty();
           qFaculty.Id = model.facultyId;

           var qStudyYear = new StudyYear();
           qStudyYear.Id = model.studyYearId;

           var qAuditoriumType = new AuditoriumType();
           qAuditoriumType.Id = model.auditoriumTypeId;

           var StartDate = DateTime.ParseExact(model.startDate, "dd-MMM-yyyy", null);
           var EndDate = DateTime.ParseExact(model.endDate, "dd-MMM-yyyy", null);

           if (model.courseIds != null)
           {
               foreach (var courseId in model.courseIds.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
               {
                   if (courseId != " ")
                   {
                       int icourseId = int.Parse(courseId);

                       var qCourse = new Course();
                       qCourse.Id = icourseId;

                       if (model.groupIds != null)
                       {
                           foreach (var groupId in model.groupIds.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                           {
                               if (groupId != " ")
                               {
                                   int igroupId = int.Parse(groupId);
                                   var qGroup = new Group();
                                   qGroup.Id = igroupId;
                                   //TODO
                                

                                   var tmp = DataService.GetSchedulesForGroup(qFaculty, qCourse, qGroup, qStudyYear, model.semesterId, StartDate, EndDate);
                                   //var tmp = Schedule.GetTempSchedulesForGroup(qFaculty, qCourse, qGroup);
                                   foreach (var t in tmp)
                                   {
                                       groupSchedule.Add(t);
                                   }
                               }
                           }
                       }
                   }
               }
           }

           //Получить расписание по преподавателю
           var lecturerSchedule = new List<Schedule>();
           var qLecturer = new Lecturer();
           qLecturer.Id = model.lecturerId;

           

           var tmp1 = DataService.GetSchedulesForLecturer(qLecturer, qStudyYear, model.semesterId, StartDate, EndDate);
           //var tmp1 = Schedule.GetTempSchedulesForLecturer(qLecturer);

           foreach (var t in tmp1)
           {
               lecturerSchedule.Add(t);
           }


           //Найти свободную клетку
           var capacity = 0;
           var times = DataService.GetTimes(qBuilding);
           var times2 = new List<SendTime>();
           int i = 1;
           foreach (var tt in times)
           {
               times2.Add(new SendTime(tt,i));
               i++;
           }
           var daysOfWeek = new List<int>() { 1, 2, 3, 4, 5, 6 };
           
           foreach (var d in daysOfWeek)
           {
               foreach (var t in times2)
               {
                   var qPeriod = new Time();
                   qPeriod.Id = t.Id;
                   var auditoriums = DataService.GetFreeAuditoriums(qBuilding, d, qWeekType, qPeriod, null, qAuditoriumType, capacity);
                   //var auditoriums = DataService.GetAuditoriums(qBuilding, qAuditoriumType);

                   if (auditoriums.ToList().Count > 0)
                   {
                       if(t != null && auditoriums[0] != null){
                           if (qWeekType.Id == 1)
                           {
                               if (!lecturerSchedule.Any(x => (x.Period.Id == t.Id && x.DayOfWeek == d)) &&
                                   !groupSchedule.Any(x => (x.Period.Id == t.Id && x.DayOfWeek == d)))
                               {
                                   result.Add(new SendModel(d, t, auditoriums[0]));
                                   return result;
                               }
                           }
                           else
                           {
                               if (!lecturerSchedule.Any(x => (x.Period.Id == t.Id && x.DayOfWeek == d && x.WeekType.Id == qWeekType.Id)) &&
                                   !groupSchedule.Any(x => (x.Period.Id == t.Id && x.DayOfWeek == d && x.WeekType.Id == qWeekType.Id)))
                               {
                                   result.Add(new SendModel(d, t, auditoriums[0]));
                                   return result;
                               }
                           }
                       }
                   }
               }
           }

           result.Add(new SendModel(0,null,null));
           return result;
       }



      /* public HttpResponseMessage GetAll(int lecturerId, int BuildingId, string groupIds)
        {
            return CreateResponse<int, int, string, IEnumerable<SendHintModel>>(privateGetAll, lecturerId, BuildingId, groupIds);
        }


        private IEnumerable<SendHintModel> privateGetAll(int lecturerId, int BuildingId, string groupIds)
        {
            var result = new List<SendHintModel>();
         
             
            //Загружаем временные промежутки
            var times = TimeService.GetAllForBuilding(BuildingId);

            //Количество людей в группах
            int sumOfPeople = 0;

            var lecturerAndGroupSchedule = new HashSet<Pair<int, int>>();

            //Получаем расписание для преподавателя
            var lecturerSchedule = ScheduleService.GetAllForLecturer(lecturerId);
            foreach (var ls in lecturerSchedule)
            {
                lecturerAndGroupSchedule.Add(new Pair<int, int>(ls.DayOfWeek, ls.Period.Id));
            }

          
            //Парсим строку с ид групп, и получаем расписание для групп
            if (groupIds != null)
            {
                foreach (var groupId in groupIds.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    if (groupId != " ")
                    {
                        int igroupId = int.Parse(groupId);
                        var tGroup = GroupService.GetGroupById(igroupId);
                        sumOfPeople += (int)tGroup.StudentsCount;
                        var tSchedule = ScheduleService.GetAllForGroup(igroupId);
                        foreach(var ts in tSchedule)
                        {
                            if (!lecturerAndGroupSchedule.Any(x => (x.First == ts.DayOfWeek && x.Second == ts.Period.Id)))
                                lecturerAndGroupSchedule.Add(new Pair<int, int>(ts.DayOfWeek, ts.Period.Id));
                        }
                    }
                }
            }


            //Загружаем подходящие аудитории (BuildingId, TutorialTypeId, StudentsCount)
            var auditoriums = AuditoriumService.GetAllForBuilding(BuildingId);

            foreach (var aud in auditoriums)
            {
                var auditoriumSchedule = ScheduleService.GetAllForAuditorium(aud.Id);

                for (int i = 1; i < 7; ++i)
                {
                    foreach (var t in times)
                    {
                        if (!lecturerAndGroupSchedule.Any(x => (x.First == i && x.Second == t.Id)) &&
                            !auditoriumSchedule.Any(x => (x.DayOfWeek == i && x.Period.Id == t.Id))){
                            
                             var ut = new SendHintModel();
                             ut.Time = t.Id;
                             ut.Day = i;
                             ut.Auditorium = aud.Number;
                             ut.AuditoriumId = aud.Id;

                             if (result.Count < 10)
                                 result.Add(ut);
                             else
                                 return result;
                        }
                    }
                }
            }

            return result;
        }*/

    }
}