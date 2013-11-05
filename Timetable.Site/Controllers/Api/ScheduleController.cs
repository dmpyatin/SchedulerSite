using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using Timetable.Site.Models.Schedules;
using System.Runtime.Serialization;
using Timetable.Site.DataService;
using Timetable.Site.Controllers.Extends;

namespace Timetable.Site.Controllers.Api
{
    
    public partial class ScheduleController : BaseApiController<Schedule>
    {
        //Получить расписание для преподавателя
        public HttpResponseMessage GetByLecturer(
            int lecturerId,
            int studyYearId,
            int semesterId,
            int timetableId,
            string startTime,
            string endTime)
        {
            return CreateResponse<int, int, int, int, string, string, IEnumerable<SendModel>>(privateGetByLecturer, 
                lecturerId,
                studyYearId,
                semesterId,
                timetableId,
                startTime,
                endTime);
        }

        public IEnumerable<SendModel> privateGetByLecturer(
            int lecturerId,
            int studyYearId,
            int semesterId,
            int timetableId,
            string startTime,
            string endTime)
        {
            var result = new List<SendModel>();
            var qLecturer = new Lecturer();
            qLecturer.Id = lecturerId;

            var qStudyYear = new StudyYear();
            qStudyYear.Id = studyYearId;

            var StartDate = new DateTime();
            var EndDate = new DateTime();
            if (startTime != "" && startTime != null)
            {
                StartDate = DateTime.ParseExact(startTime, "yyyy-MM-dd", null);
            }
            if (endTime != "" && endTime != null)
            {
                EndDate = DateTime.ParseExact(endTime, "yyyy-MM-dd", null);
            }

            //qLecturer.Id = 50834;
            var tmp = DataService.GetSchedulesForLecturer(qLecturer, qStudyYear, semesterId, StartDate, EndDate);
            //var tmp = GetTempSchedulesForLecturer(); 
    
       
            foreach (var t in tmp)
            {
                result.Add(new SendModel(t,true,false,false));
            }

            return result;
        }

        //Получить расписание для аудитории
        public HttpResponseMessage GetByAuditorium(
            int auditoriumId,
            int studyYearId,
            int semesterId,
            int timetableId,
            string startTime,
            string endTime)
        {
            return CreateResponse<int, int, int, int, string, string, IEnumerable<SendModel>>(privateGetByAuditorium, 
                auditoriumId,
                studyYearId,
                semesterId,
                timetableId,
                startTime,
                endTime);
        }

        public IEnumerable<SendModel> privateGetByAuditorium(
            int auditoriumId,
            int studyYearId,
            int semesterId,
            int timetableId,
            string startTime,
            string endTime)
        {
            var result = new List<SendModel>();
            var qAuditorium = new Auditorium();
            qAuditorium.Id = auditoriumId;

            var qStudyYear = new StudyYear();
            qStudyYear.Id = studyYearId;

            //TODO
            var StartDate = new DateTime();
            var EndDate = new DateTime();
            if (startTime != "" && startTime != null)
            {
                StartDate = DateTime.ParseExact(startTime, "yyyy-MM-dd", null);
            }
            if (endTime != "" && endTime != null)
            {
                EndDate = DateTime.ParseExact(endTime, "yyyy-MM-dd", null);
            }

            //qAuditorium.Id = 1;
            var tmp = DataService.GetSchedulesForAuditorium(qAuditorium, qStudyYear, semesterId, StartDate, EndDate);
            //var tmp = GetTempSchedulesForAuditorium();

            foreach (var t in tmp)
            {
                result.Add(new SendModel(t,false,true,false));
            }

            return result;
        }


        public HttpResponseMessage GetByGroupsOnlyIds(
            string groupIds,
            int studyYearId,
            int semesterId,
            int timetableId,
            string startTime,
            string endTime)
        {
            return CreateResponse<string, int, int, int, string, string, IEnumerable<SendModel>>(privateGetByGroupsOnlyIds,
              groupIds,
              studyYearId,
              semesterId,
              timetableId,
              startTime,
              endTime);
        }

        public IEnumerable<SendModel> privateGetByGroupsOnlyIds(
            string groupIds,
            int studyYearId,
            int semesterId,
            int timetableId,
            string startTime,
            string endTime)
        {
            var result = new List<SendModel>();

            DateTime? StartDate = null;
            DateTime? EndDate = null;

            if (!string.IsNullOrEmpty(startTime))
                StartDate = DateTime.ParseExact(startTime, "yyyy-MM-dd", null);

            if (!string.IsNullOrEmpty(endTime))
                EndDate = DateTime.ParseExact(endTime, "yyyy-MM-dd", null);
     
            var qGroups = new List<Group>();
            if (groupIds != null)
                foreach (var groupId in groupIds.Split(new[] {','}, StringSplitOptions.RemoveEmptyEntries))
                    if (groupId != " ")
                        qGroups.Add(new Group() { Id = int.Parse(groupId)});

            var tmp = DataService.GetSchedulesForAll(null, null, qGroups.ToArray(), null, null, StartDate, EndDate);

            foreach (var t in tmp)
                result.Add(new SendModel(t, false, false, true));

            return result;
        }
        
        public HttpResponseMessage GetScheduleByDayPeriodDate(
                int? dayOfWeek,
                int? periodId,
                int? weekTypeId,
                int? lecturerId,
                int? auditoriumId,
                string groupIds,
                string subGroup,
                string startTime,
                string endTime)
        {
            return CreateResponse<int?, int?, int?, int?, int?, string, string, string, string, IEnumerable<SendModel>>(privateGetScheduleByDayPeriodDate,
                dayOfWeek,
                periodId,
                weekTypeId,
                lecturerId,
                auditoriumId,
                groupIds,
                subGroup,
                startTime,
                endTime);
        }

        private IEnumerable<SendModel> privateGetScheduleByDayPeriodDate(
                int? dayOfWeek,
                int? periodId,
                int? weekTypeId,
                int? lecturerId,
                int? auditoriumId,
                string groupIds,
                string subGroup,
                string startTime,
                string endTime)
        {
            var result = new List<SendModel>();

            DateTime? StartDate = null;
            DateTime? EndDate = null;

            if (!string.IsNullOrEmpty(startTime))
                StartDate = DateTime.ParseExact(startTime, "yyyy-MM-dd", null);

            if (!string.IsNullOrEmpty(endTime))
                EndDate = DateTime.ParseExact(endTime, "yyyy-MM-dd", null);

            var qPeriod = periodId != null ? new Time { Id = periodId.Value } : null;
            var qLecturer = lecturerId != null ? new Lecturer { Id = lecturerId.Value } : null;
            var qAuditorium = auditoriumId != null ? new Auditorium { Id = auditoriumId.Value } : null;
            var qWeekType = weekTypeId != null ? new WeekType { Id = weekTypeId.Value } : null;
            var qGroups = new List<Group>();

            if (groupIds != null)
                foreach (var groupId in groupIds.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                    if (groupId != " ")
                        qGroups.Add(new Group() { Id = int.Parse(groupId) });

            var tmp = DataService.GetSchedulesForDayTimeDate(dayOfWeek, qPeriod, qWeekType, qLecturer, qAuditorium, qGroups.ToArray(), subGroup,
              StartDate, EndDate);


            foreach (var t in tmp)
            {
                //TODO: correct divide on types
                result.Add(new SendModel(t, t.ScheduleInfo.LecturerId == lecturerId, t.AuditoriumId == auditoriumId, (t.ScheduleInfo.LecturerId != lecturerId) &&
                                                                                                                     (t.AuditoriumId != auditoriumId)));
            }

            return result;
        }

        [HttpGet]
        public HttpResponseMessage GetScheduleById(
                int Id)
        {
            return CreateResponse<int, SendModel>(privateGetScheduleById, Id);
        }

        private SendModel privateGetScheduleById(
               int Id)
        {
            var result = DataService.GetScheduleById(Id);
            return new SendModel(result, false, false, false);
        }

  
        [HttpGet]
        public HttpResponseMessage GetScheduleByAll(
                int? lecturerId,
                int? auditoriumId,
                string groupIds,
                int? weekTypeId,
                string subGroup,
                string startTime,
                string endTime)
        {
            return CreateResponse<int?, int?, string, int?, string, string, string, IEnumerable<SendModel>>(privateGetScheduleByAll,
                lecturerId,
                auditoriumId,
                groupIds,
                weekTypeId,
                subGroup,
                startTime,
                endTime);
        }

        private IEnumerable<SendModel> privateGetScheduleByAll(
           int? lecturerId,
           int? auditoriumId,
           string groupIds,
           int? weekTypeId,
           string subGroup,
           string startTime,
           string endTime)
        {
            var result = new List<SendModel>();

            DateTime? StartDate = null;
            DateTime? EndDate = null;

            if (!string.IsNullOrEmpty(startTime))
                StartDate = DateTime.ParseExact(startTime, "yyyy-MM-dd", null);
        
            if (!string.IsNullOrEmpty(endTime))
                EndDate = DateTime.ParseExact(endTime, "yyyy-MM-dd", null);
       

            var qLecturer = lecturerId != null ? new Lecturer {Id = lecturerId.Value} : null;
            var qAuditorium = auditoriumId != null ? new Auditorium { Id = auditoriumId.Value } : null;
            var qWeekType = weekTypeId != null ? new WeekType { Id = weekTypeId.Value } : null;
            var qGroups = new List<Group>();
          

            if (groupIds != null)
                foreach (var groupId in groupIds.Split(new[] {','}, StringSplitOptions.RemoveEmptyEntries))
                    if (groupId != " ")
                        qGroups.Add(new Group() { Id = int.Parse(groupId) });


            var tmp = DataService.GetSchedulesForAll(qLecturer, qAuditorium, qGroups.ToArray(), qWeekType, subGroup,
                StartDate, EndDate);

            var answer = tmp.GroupBy(x => new { x.DayOfWeek, x.Period, x.WeekType })
                        .Select(q => q.OrderBy(x => x.CreatedDate).First()).ToList();

            foreach (var t in answer)
            {
                //TODO: correct divide on types
                result.Add(new SendModel(t, t.ScheduleInfo.LecturerId == lecturerId, t.AuditoriumId == auditoriumId, (t.ScheduleInfo.LecturerId != lecturerId) &&
                                                                                                                     (t.AuditoriumId != auditoriumId)));
            }

            return result;
        }

        //Получить расписание для групп (в текущей версии делается объединение по группам)
            public
            HttpResponseMessage GetByGroups(
            int facultyId,
            string courseIds,
            string groupIds,
            int studyYearId,
            int semesterId,
            int timetableId,
            string startTime,
            string endTime,
            string subGroup)
        {
            return CreateResponse<int, string, string, int, int, int, string, string, string, IEnumerable<SendModel>>(privateGetByGroups, 
                facultyId,
                courseIds,
                groupIds,
                studyYearId,
                semesterId,
                timetableId,
                startTime,
                endTime,
                subGroup);
        }

        public IEnumerable<SendModel> privateGetByGroups(
            int facultyId,
            string courseIds,
            string groupIds,
            int studyYearId,
            int semesterId,
            int timetableId,
            string startTime,
            string endTime,
            string subGroup)
        {
            var result = new List<SendModel>();
            var qFaculty = new Faculty();
            qFaculty.Id = facultyId;

            var qStudyYear = new StudyYear();
            qStudyYear.Id = studyYearId;


            var StartDate = new DateTime();
            var EndDate = new DateTime();
            if (startTime != "" && startTime != null)
            {
                StartDate = DateTime.ParseExact(startTime, "yyyy-MM-dd", null);
            }
            if (endTime != "" && endTime != null)
            {
                EndDate = DateTime.ParseExact(endTime, "yyyy-MM-dd", null);
            }


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
                                    //var tmp = DataService.GetSchedulesForGroup(qFaculty, qCourse, qGroup);
                                    //qFaculty.Id = 83;
                                    //qCourse.Id = 301;
                                    //qGroup.Id = 687;
                                    var tmp = DataService.GetSchedulesForGroup(qFaculty, qCourse, qGroup, qStudyYear, semesterId, StartDate, EndDate, subGroup);
                                    //var tmp = GetTempSchedulesForGroup(qGroup);
                                    foreach (var t in tmp)
                                    {
                                        result.Add(new SendModel(t, false, false, true));
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return result;
        }

        public HttpResponseMessage GetByAllTest(ForAllModel model)
        {
            return CreateResponse<ForAllModel, IEnumerable<SendModel>>(privateGetByAllTest, model);
        }

        public IEnumerable<SendModel> privateGetByAllTest(ForAllModel model)
        {
            var result = new List<SendModel>();

            /*var tmp = GetTempSchedulesForGroup();
            foreach (var t in tmp)
            {
                result.Add(new SendModel(t, false, true, false));
            }*/

            return result;
        }

        //Получить расписание для всего
        public HttpResponseMessage GetByAll(
            int lecturerId,
            int auditoriumId,
            int facultyId,
            string courseIds,
            string groupIds,
            int studyYearId,
            int semesterId,
            int timetableId,
            string sequence,
            string startTime,
            string endTime,
            string subGroup)
        {
            return CreateResponse<int, int, int, string, string, int, int, int, string, string, string, string, IEnumerable<SendModel>>(privateGetByAll, 
                lecturerId,
                auditoriumId,
                facultyId,
                courseIds,
                groupIds,
                studyYearId,
                semesterId,
                timetableId,
                sequence,
                startTime,
                endTime,
                subGroup);
        }


        public IEnumerable<SendModel> privateGetByAll(
            int lecturerId,
            int auditoriumId,
            int facultyId,
            string courseIds,
            string groupIds,
            int studyYearId,
            int semesterId,
            int timetableId,
            string sequence,
            string startTime,
            string endTime,
            string subGroup)
        {
            

            var result = new List<SendModel>();

            if (sequence != null)
            {
                foreach (var seq in sequence.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    if (seq == "lecturer")
                    {
                        if (lecturerId != 0)
                        {
                            //var forLecturerModel = new ForLecturerModel();
                            //forLecturerModel.lecturerId = model.lecturerId;
                            //forLecturerModel.studyYearId = model.studyYearId;
                            //forLecturerModel.semesterId = model.semesterId;
                            //forLecturerModel.timetableId = model.timetableId;

                            var lecturerSchedule = privateGetByLecturer(lecturerId, studyYearId, semesterId, timetableId, startTime, endTime);
                            foreach (var t in lecturerSchedule)
                            {

                                if (!result.Any(x => (x.PeriodId == t.PeriodId && x.DayOfWeek == t.DayOfWeek && (x.WeekTypeId == t.WeekTypeId || x.WeekTypeId == 1 || t.WeekTypeId == 1))))
                                {
                                    result.Add(t);
                                }
                            }
                        }
                    }

                    if (seq == "auditorium")
                    {
                        if (auditoriumId != 0)
                        {
                            /*var forAuditoriumModel = new ForAuditoriumModel();
                            forAuditoriumModel.auditoriumId = model.auditoriumId;
                            forAuditoriumModel.studyYearId = model.studyYearId;
                            forAuditoriumModel.semesterId = model.semesterId;
                            forAuditoriumModel.timetableId = model.timetableId;*/

                            var auditoriumSchedule = privateGetByAuditorium(auditoriumId, studyYearId, semesterId, timetableId, startTime, endTime);
                            foreach (var t in auditoriumSchedule)
                            {
                                if (!result.Any(x => (x.PeriodId == t.PeriodId && x.DayOfWeek == t.DayOfWeek && (x.WeekTypeId == t.WeekTypeId || x.WeekTypeId == 1 || t.WeekTypeId == 1))))
                                {
                                    result.Add(t);
                                }
                            }
                        }
                    }

                    if (seq == "group")
                    {
                        if (facultyId != 0 && courseIds != "" && groupIds != "")
                        {
                            /*var forGroupModel = new ForGroupModel();
                            forGroupModel.facultyId = model.facultyId;
                            forGroupModel.courseIds = model.courseIds;
                            forGroupModel.groupIds = model.groupIds;
                            forGroupModel.studyYearId = model.studyYearId;
                            forGroupModel.semesterId = model.semesterId;
                            forGroupModel.timetableId = model.timetableId;*/

                            var groupSchedule = privateGetByGroups(
                                facultyId,
                                courseIds,
                                groupIds,
                                studyYearId,
                                semesterId,
                                timetableId,
                                startTime,
                                endTime,
                                subGroup
                                );
                            foreach (var t in groupSchedule)
                            {
                                if (!result.Any(x => (x.PeriodId == t.PeriodId && x.DayOfWeek == t.DayOfWeek && (x.WeekTypeId == t.WeekTypeId || x.WeekTypeId == 1 || t.WeekTypeId == 1))))
                                {
                                    result.Add(t);
                                }
                            }
                        }
                    }
                }
                
            }

            var tt = result;
            
            return result;
        }


        [HttpGet]
        public HttpResponseMessage Validate(
            int? AuditoriumId,
            int? ScheduleInfoId,
            int? DayOfWeek,
            int? PeriodId,
            int? WeekTypeId,
            string StartDate,
            string EndDate)
        {
            return CreateResponse<int?, int?, int?, int?, int?, string, string, IEnumerable<int>>(privateValidate,
             AuditoriumId,
             ScheduleInfoId,
             DayOfWeek,
             PeriodId,
             WeekTypeId,
             StartDate,
             EndDate);
        }

        private IEnumerable<int> privateValidate(
            int? AuditoriumId,
            int? ScheduleInfoId,
            int? DayOfWeek,
            int? PeriodId,
            int? WeekTypeId,
            string StartDate,
            string EndDate)
        {

            var validateErrors = new List<int>();
            var aSchedule = new Schedule();


            if (DayOfWeek == null)
                validateErrors.Add(3);
            else
                aSchedule.DayOfWeek = DayOfWeek.Value;


            if (AuditoriumId == null)
                validateErrors.Add(4);
            else
            {
                aSchedule.Auditorium = new Auditorium();
                aSchedule.Auditorium.Id = AuditoriumId.Value;
                aSchedule.AuditoriumId = AuditoriumId.Value;
            }


            if (PeriodId == null)
                validateErrors.Add(5);
            else
            {
                aSchedule.Period = new Time();
                aSchedule.Period.Id = PeriodId.Value;
                aSchedule.PeriodId = PeriodId.Value;
            }

         
            if (ScheduleInfoId == null)
                validateErrors.Add(6);
            else
                aSchedule.ScheduleInfoId = ScheduleInfoId.Value;

            if (WeekTypeId == null)
                validateErrors.Add(7);
            else
            {
                aSchedule.WeekType = new WeekType();
                aSchedule.WeekType.Id = WeekTypeId.Value;
                aSchedule.WeekTypeId = WeekTypeId.Value;
            }

            aSchedule.CreatedDate = DateTime.Now.Date;
            aSchedule.UpdateDate = DateTime.Now.Date;
            aSchedule.IsActual = true;

            if (StartDate == null)
                validateErrors.Add(8);
            else
                aSchedule.StartDate = DateTime.ParseExact(StartDate, "yyyy-MM-dd", null);

            if (EndDate == null)
                validateErrors.Add(9);
            else
                aSchedule.EndDate = DateTime.ParseExact(EndDate, "yyyy-MM-dd", null);

            aSchedule.AutoDelete = false;

            if (!DataService.ValidateSchedule(aSchedule))
                validateErrors.Add(2);

            return validateErrors;
        }


        //Обновить запись в расписании
        [HttpPost]
        public HttpResponseMessage Update(UpdateModel model)
        {
            return CreateResponse(privateUpdate, model);
        }

        public void privateUpdate(UpdateModel model)
        {
            
            var qSchedule = DataService.GetScheduleById(model.ScheduleId);

            if (qSchedule != null)
            {

                qSchedule.SubGroup = model.SubGroup;
                qSchedule.DayOfWeek = model.DayOfWeek;

                if (model.AuditoriumId != null)
                {
                    qSchedule.Auditorium = new Auditorium();
                    qSchedule.Auditorium.Id = model.AuditoriumId;
                    qSchedule.AuditoriumId = model.AuditoriumId;
                }

                qSchedule.UpdateDate = DateTime.Now.Date;


                if (model.PeriodId != null)
                {
                    qSchedule.Period = new Time();
                    qSchedule.Period.Id = model.PeriodId;
                    qSchedule.PeriodId = model.PeriodId;
                }


                if (model.ScheduleInfoId != null)
                {
                    qSchedule.ScheduleInfoId = model.ScheduleInfoId;
                }

                if (model.WeekTypeId != null)
                {
                    qSchedule.WeekType = new WeekType();
                    qSchedule.WeekType.Id = model.WeekTypeId;
                    qSchedule.WeekTypeId = model.WeekTypeId;
                }



                if (model.StartDate != "" && model.StartDate != null)
                    qSchedule.StartDate = DateTime.ParseExact(model.StartDate, "yyyy-MM-dd", null);
                if (model.EndDate != "" && model.EndDate != null)
                    qSchedule.EndDate = DateTime.ParseExact(model.EndDate, "yyyy-MM-dd", null);



                if (model.AutoDelete != null)
                    qSchedule.AutoDelete = model.AutoDelete;

                DataService.Update(qSchedule);
            }

        }


        //Добавить запись в расписание
        [HttpPost]
        public HttpResponseMessage Add(AddModel model)
        {
            return CreateResponse(privateAdd, model);
        }

        public void privateAdd(AddModel model)
        {
            var aSchedule = new Schedule();
            
            aSchedule.DayOfWeek = model.DayOfWeek;
            aSchedule.SubGroup = model.SubGroup;

            aSchedule.AuditoriumId = model.AuditoriumId;
            aSchedule.PeriodId = model.PeriodId;
            aSchedule.ScheduleInfoId = model.ScheduleInfoId;
            aSchedule.WeekTypeId = model.WeekTypeId;

            aSchedule.CreatedDate = DateTime.Now.Date;
            aSchedule.UpdateDate = DateTime.Now.Date;
            aSchedule.IsActual = true;

            aSchedule.StartDate = DateTime.ParseExact(model.StartDate, "yyyy-MM-dd", null);
            aSchedule.EndDate = DateTime.ParseExact(model.EndDate, "yyyy-MM-dd", null);

            aSchedule.AutoDelete = model.AutoDelete;

            DataService.Add(aSchedule);
        }

        //Удалить запись из расписания
        [HttpPost]
        public HttpResponseMessage Delete(DeleteModel model)
        {
            return CreateResponse(privateDelete, model.Id);
        }

        public void privateDelete(int Id)
        {
            var aSchedule = new Schedule();
            aSchedule.Id = Id;
            DataService.Delete(aSchedule);
        }

    
        
    }
}