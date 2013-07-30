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
                StartDate = DateTime.ParseExact(startTime, "dd-MMM-yyyy", null);
            }
            if (endTime != "" && endTime != null)
            {
                EndDate = DateTime.ParseExact(endTime, "dd-MMM-yyyy", null);
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
                StartDate = DateTime.ParseExact(startTime, "dd-MMM-yyyy", null);
            }
            if (endTime != "" && endTime != null)
            {
                EndDate = DateTime.ParseExact(endTime, "dd-MMM-yyyy", null);
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

        //Получить расписание для групп (в текущей версии делается объединение по группам)
        public HttpResponseMessage GetByGroups(
            int facultyId,
            string courseIds,
            string groupIds,
            int studyYearId,
            int semesterId,
            int timetableId,
            string startTime,
            string endTime)
        {
            return CreateResponse<int, string, string, int, int, int, string, string, IEnumerable<SendModel>>(privateGetByGroups, 
                facultyId,
                courseIds,
                groupIds,
                studyYearId,
                semesterId,
                timetableId,
                startTime,
                endTime);
        }

        public IEnumerable<SendModel> privateGetByGroups(
            int facultyId,
            string courseIds,
            string groupIds,
            int studyYearId,
            int semesterId,
            int timetableId,
            string startTime,
            string endTime)
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
                StartDate = DateTime.ParseExact(startTime, "dd-MMM-yyyy", null);
            }
            if (endTime != "" && endTime != null)
            {
                EndDate = DateTime.ParseExact(endTime, "dd-MMM-yyyy", null);
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
                                    var tmp = DataService.GetSchedulesForGroup(qFaculty, qCourse, qGroup, qStudyYear, semesterId, StartDate, EndDate);
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
            string endTime)
        {
            return CreateResponse<int, int, int, string, string, int, int, int, string, string, string, IEnumerable<SendModel>>(privateGetByAll, 
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
                endTime);
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
            string endTime)
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
                                endTime
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
                //qSchedule.DayOfWeek = model.DayOfWeek;

                if (qSchedule.Auditorium != null)
                {
                    qSchedule.Auditorium = new Auditorium();
                    qSchedule.Auditorium.Id = model.AuditoriumId;
                    qSchedule.AuditoriumId = model.AuditoriumId;
                }

                /*
                qSchedule.PeriodId = model.PeriodId;
                qSchedule.ScheduleInfoId = model.ScheduleInfoId;
                qSchedule.WeekTypeId = model.WeekTypeId;*/

                qSchedule.UpdateDate = DateTime.Now.Date;


                /*
                if (qSchedule.Period != null)
                {
                    qSchedule.PeriodId = model.PeriodId;
                }

                if (qSchedule.ScheduleInfo != null)
                {
                    qSchedule.ScheduleInfoId = model.ScheduleInfoId;
                }

                if (qSchedule.WeekType != null)
                {
                    qSchedule.WeekTypeId = model.WeekTypeId;
                }*/
            }

            
            if (model.StartDate != "" && model.StartDate != null)
            {
                qSchedule.StartDate = DateTime.ParseExact(model.StartDate, "dd-MMM-yyyy", null);
            }
            if (model.EndDate != "" && model.EndDate != null)
            {
                qSchedule.EndDate = DateTime.ParseExact(model.EndDate, "dd-MMM-yyyy", null);
            }


            if (model.AutoDelete != null)
            {
                qSchedule.AutoDelete = model.AutoDelete;
            }

            DataService.Update(qSchedule);
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

            aSchedule.AuditoriumId = model.AuditoriumId;
            aSchedule.PeriodId = model.PeriodId;
            aSchedule.ScheduleInfoId = model.ScheduleInfoId;
            aSchedule.WeekTypeId = model.WeekTypeId;

            aSchedule.CreatedDate = DateTime.Now.Date;
            aSchedule.UpdateDate = DateTime.Now.Date;
            aSchedule.IsActual = true;

            aSchedule.StartDate = DateTime.ParseExact(model.StartDate, "dd-MMM-yyyy", null);
            aSchedule.EndDate = DateTime.ParseExact(model.EndDate, "dd-MMM-yyyy", null);

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

    
        public HttpResponseMessage ValidateSchedule(
            int AuditoriumId,
            int ScheduleInfoId,
            int DayOfWeek,
            int PeriodId,
            int WeekTypeId,
            string StartDate,
            string EndDate)
        {
            return CreateResponse<int, int, int, int, int, string, string, IEnumerable<ValidateModel>>(privateValidateSchedule, 
             AuditoriumId,
             ScheduleInfoId,
             DayOfWeek,
             PeriodId,
             WeekTypeId,
             StartDate,
             EndDate);
        }

        private IEnumerable<ValidateModel> privateValidateSchedule(
            int AuditoriumId,
            int ScheduleInfoId,
            int DayOfWeek,
            int PeriodId,
            int WeekTypeId,
            string StartDate,
            string EndDate)
        {
            var result = new List<ValidateModel>();
            var messages = new List<string>();

            var aSchedule = new Schedule();

            aSchedule.DayOfWeek = DayOfWeek;

            aSchedule.AuditoriumId = AuditoriumId;
            aSchedule.PeriodId = PeriodId;
            aSchedule.ScheduleInfoId = ScheduleInfoId;
            aSchedule.WeekTypeId = WeekTypeId;

            aSchedule.CreatedDate = DateTime.Now.Date;
            aSchedule.UpdateDate = DateTime.Now.Date;
            aSchedule.IsActual = true;

            aSchedule.StartDate = DateTime.ParseExact(StartDate, "dd-MMM-yyyy", null);
            aSchedule.EndDate = DateTime.ParseExact(EndDate, "dd-MMM-yyyy", null);

            aSchedule.AutoDelete = false;

            /*
             * TODO
             * if (DataService.ValidateSchedule(aSchedule))
            {
                messages.Add("Выбранная позиция свободна");
                result.Add(new ValidateModel(true, messages));
            }else{
                messages.Add("Выбранная позиция занята");
                result.Add(new ValidateModel(false, messages ));
            }*/

            return result;
        }
    }
}