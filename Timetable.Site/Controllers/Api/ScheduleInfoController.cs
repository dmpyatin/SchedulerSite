using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Runtime.Serialization;
using Timetable.Site.DataService;
using Timetable.Site.Models.ScheduleInfoes;
using Timetable.Site.Controllers.Extends;


namespace Timetable.Site.Controllers.Api
{
    public partial class ScheduleInfoController : BaseApiController<ScheduleInfo>
    {
        //Получить сведения к расписанию по преподавателю
        public HttpResponseMessage GetByLecturer(
            int lecturerId,
            int tutorialTypeId,
            int studyYearId,
            int semesterId)
        {
            return CreateResponse<int, int, int, int, IEnumerable<SendModel>>(privateGetByLecturer, 
                lecturerId,
                tutorialTypeId,
                studyYearId,
                semesterId);
        }

        private IEnumerable<SendModel> privateGetByLecturer(
            int lecturerId,
            int tutorialTypeId,
            int studyYearId,
            int semesterId)
       {
           var result = new List<SendModel>();
           var qLecturer = new Lecturer();
           qLecturer.Id = lecturerId;

            var qStudyYear = new StudyYear();
            qStudyYear.Id = studyYearId;

           //TODO
           var qDepartment = new Department();
           qDepartment.Id = lecturerId;

           var tmp = DataService.GetScheduleInfoesForDepartment(qDepartment, qStudyYear, semesterId);
           //var tmp = GetTempScheduleInfoes();

           foreach (var t in tmp)
           {
               if (t.Groups.Count() > 0)
               {
                   int CurrentHours = DataService.CountSchedulesForScheduleInfoes(t);
                   //int CurrentHours = 10;
                   result.Add(new SendModel(t, CurrentHours));
               }
           }

           return result;
       }


        public HttpResponseMessage GetById(int Id)
        {
            return CreateResponse<int, SendModel>(privateGetById, Id);
        }

        private SendModel privateGetById(int Id)
        {
            var result = DataService.GetScheduleInfoById(Id);
            return new SendModel(result, 0);
        }



        public HttpResponseMessage GetByGroupsOnly(
               string groupIds,
               int tutorialTypeId,
               int studyYearId,
               int semesterId)
        {
            return CreateResponse<string, int, int, int, IEnumerable<SendModel>>(privateGetByGroupsOnly,
                     groupIds,
                     tutorialTypeId,
                     studyYearId,
                     semesterId);
        }

        private IEnumerable<SendModel> privateGetByGroupsOnly(
            string groupIds,
            int tutorialTypeId,
            int studyYearId,
            int semesterId)
        {
            var result = new List<SendModel>();
            var groups = new List<Group>();

            var qTutorialType = new TutorialType {Id = tutorialTypeId};
            var qStudyYear = new StudyYear {Id = studyYearId};

            if (groupIds != null)
                foreach (var groupId in groupIds.Split(new[] {','}, StringSplitOptions.RemoveEmptyEntries))
                    if (groupId != " ")
                        groups.Add(new Group(){Id = int.Parse(groupId)});

            var tmp = DataService.GetScheduleInfoesForGroups(groups.ToArray(), qTutorialType, qStudyYear, semesterId);
 
            foreach (var t in tmp)
            {
                if (t.Groups.Any())
                {
                    int CurrentHours = 0;// DataService.CountSchedulesForScheduleInfoes(t);
                    result.Add(new SendModel(t, CurrentHours));
                }
            }

            return result;
        }

        //Получить сведения к расписанию по группам (в текущей версии делается объединение по группам)

            public
            HttpResponseMessage GetByGroups(
                int facultyId,
                string courseIds,
                string groupIds,
                int tutorialTypeId,
                int studyYearId,
                int semesterId)
       {
           return CreateResponse<int, string, string, int, int, int, IEnumerable<SendModel>>(privateGetByGroups, 
                    facultyId,
                    courseIds,
                    groupIds,
                    tutorialTypeId,
                    studyYearId,
                    semesterId);
       }

        private IEnumerable<SendModel> privateGetByGroups(
            int facultyId,
            string courseIds,
            string groupIds,
            int tutorialTypeId,
            int studyYearId,
            int semesterId)
       {
           var result = new List<SendModel>();
           var qFaculty = new Faculty();
           qFaculty.Id = facultyId;

           var qTutorialType = new TutorialType();
           qTutorialType.Id = tutorialTypeId;

           var qStudyYear = new StudyYear();
           qStudyYear.Id = studyYearId;

           if (courseIds != null)
           {
               foreach (var courseId in courseIds.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
               {
                   if (courseId != " ")
                   {
                       int icourseId = int.Parse(courseId);

                       var qCourse = new Course();
                       qCourse.Id = icourseId;

                       if (groupIds != null)
                       {
                           foreach (var groupId in groupIds.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                           {
                               if (groupId != " ")
                               {
                                   int igroupId = int.Parse(groupId);
                                   var qGroup = new Group();

                                   qGroup.Id = igroupId;
                                   //TODO
                                   var tmp = DataService.GetScheduleInfoesForGroup(qFaculty, qCourse, qGroup, qTutorialType, qStudyYear, semesterId);
                                   //var tmp = GetTempScheduleInfoes();
                              
                                   foreach (var t in tmp)
                                   {
                                       if (t.Groups.Count() > 0)
                                       {
                                           int CurrentHours = DataService.CountSchedulesForScheduleInfoes(t);
                                           //int CurrentHours = 10;
                                           result.Add(new SendModel(t, CurrentHours));
                                       }
                                       //TODO
                                   
                                   }
                               }
                           }
                       }
                   }
               }
           }

           return result;
       }

       [HttpPost]
       public HttpResponseMessage Add(AddModel model)
       {
           return CreateResponse(privateAdd, model);
       }

       public void privateAdd(AddModel model)
       {
           var aScheduleInfo = new ScheduleInfo();

           var Courses = new List<Course>();

           if (model.CourseIds != null)
           {
               foreach (var courseId in model.CourseIds.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
               {
                   var c = new Course();
                   c.Id = int.Parse(courseId);
                   Courses.Add(c);
               }
           }

           aScheduleInfo.Courses = Courses.ToArray();

           var Specialities = new List<Speciality>();

           if (model.SpecialityIds != null)
           {
               foreach (var specialityId in model.SpecialityIds.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
               {
                   var s = new Speciality();
                   s.Id = int.Parse(specialityId);
                   Specialities.Add(s);
               }
           }

           aScheduleInfo.Specialities = Specialities.ToArray();

           var Groups = new List<Group>();

           if (model.GroupIds != null)
           {
               foreach (var groupId in model.GroupIds.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
               {
                   var g = new Group();
                   g.Id = int.Parse(groupId);
                   Groups.Add(g);
               }
           }

           aScheduleInfo.Groups = Groups.ToArray();

           var Faculties = new List<Faculty>();

           if (model.FacultyIds != null)
           {
               foreach (var facultyId in model.FacultyIds.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
               {
                   var f = new Faculty();
                   f.Id = int.Parse(facultyId);
                   Faculties.Add(f);
               }
           }

           aScheduleInfo.Faculties = Faculties.ToArray();

           var LikeAuditoriums = new List<Auditorium>();

           if (model.LikeAuditoriumIds != null)
           {
               foreach (var likeAuditoriumId in model.LikeAuditoriumIds.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
               {
                   var a = new Auditorium();
                   a.Id = int.Parse(likeAuditoriumId);
                   LikeAuditoriums.Add(a);
               }
           }

           aScheduleInfo.LikeAuditoriums = LikeAuditoriums.ToArray();

           aScheduleInfo.Lecturer = new Lecturer();
           aScheduleInfo.Lecturer.Id = model.LecturerId;

           aScheduleInfo.Department = new Department();
           aScheduleInfo.Department.Id = model.DepartmentId;

           aScheduleInfo.HoursPerWeek = model.HoursPerWeek;

           aScheduleInfo.Semester = model.Semester;

           aScheduleInfo.StudyYear = new StudyYear();
           aScheduleInfo.StudyYear.Id = model.StudyYearId;

           aScheduleInfo.SubgroupCount = model.SubgroupCount;

           aScheduleInfo.Tutorial = new Tutorial();
           aScheduleInfo.Tutorial.Id = model.TutorialId;

           aScheduleInfo.TutorialType = new TutorialType();
           aScheduleInfo.TutorialType.Id = model.TutorialTypeId;

           aScheduleInfo.StartDate = Convert.ToDateTime(model.StartDate);
           aScheduleInfo.EndDate = Convert.ToDateTime(model.EndDate);

           aScheduleInfo.UpdateDate = DateTime.Now.Date;
           aScheduleInfo.CreatedDate = DateTime.Now.Date;
           aScheduleInfo.IsActual = true;

           DataService.Add(aScheduleInfo);
       }

       //Удалить запись из расписания
       [HttpPost]
       public HttpResponseMessage Delete(DeleteModel model)
       {
           return CreateResponse(privateDelete, model.Id);
       }

       public void privateDelete(int Id)
       {
           var dScheduleInfo = new ScheduleInfo();
           dScheduleInfo.Id = Id;
           DataService.Delete(dScheduleInfo);
       }

       //Обновить часы в сведении к расписанию
       [HttpPost]
       public HttpResponseMessage Update(UpdateModel model)
       {
           return CreateResponse(privateUpdate, model);
       }

       private void privateUpdate(UpdateModel model)
       {
           
           var qScheduleInfo = DataService.GetScheduleInfoById(model.ScheduleInfoId);

           qScheduleInfo.HoursPerWeek = model.HoursPerWeek;

           qScheduleInfo.UpdateDate = DateTime.Now.Date;

           DataService.Update(qScheduleInfo);
       }
    }
}
