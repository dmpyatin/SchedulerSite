using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Runtime.Serialization;
using Timetable.Site.DataService;
using Timetable.Site.Models.Auditoriums;
using Timetable.Site.Controllers.Extends;

namespace Timetable.Site.Controllers.Api
{
    public partial class AuditoriumController : BaseApiController<Auditorium>
    {
        //Получает список всех аудиторий для здания
        public HttpResponseMessage GetByBuilding(
            int buildingId, 
            int auditoriumTypeId)
        {
            return CreateResponse<int, int, IEnumerable<SendModel>>(privateGetByBuilding, buildingId, auditoriumTypeId);
        }

        public IEnumerable<SendModel> privateGetByBuilding(
            int buildingId,
            int auditoriumTypeId)
        {
            var result = new List<SendModel>();

            var qBuilding = new Building();
            qBuilding.Id = buildingId;

            var qAuditoriumType = new AuditoriumType();
            qAuditoriumType.Id = auditoriumTypeId;

            var tmp = DataService.GetAuditoriums(qBuilding, qAuditoriumType);

            //var tmp = GetTempAuditoriums(qBuilding, qAuditoriumType);
            foreach (var t in tmp)
            {
                result.Add(new SendModel(t));
            }

            return result;
        }


        //Получает свободные аудитории для выбранной клетки расписания
        public HttpResponseMessage GetFree(
            int buildingId,
            int weekTypeId,
            int day,
            int timeId,
            int tutorialTypeId,
            int auditoriumTypeId,
            string startTime,
            string endTime)
        {

            return CreateResponse<int, int, int, int, int, int, string, string, IEnumerable<SendModel>>(privateGetFree, 
                buildingId, 
                weekTypeId,
                day,
                timeId,
                tutorialTypeId,
                auditoriumTypeId,
                startTime,
                endTime);
        }

        private IEnumerable<SendModel> privateGetFree(
            int buildingId,
            int weekTypeId,
            int day,
            int timeId,
            int tutorialTypeId,
            int auditoriumTypeId,
            string startTime,
            string endTime)
        {


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

            //TODO
            var result = new List<SendModel>();

            var qBuilding = new Building();
            qBuilding.Id = buildingId;

            var qWeekType = new WeekType();
            qWeekType.Id = weekTypeId;

            var qTime = new Time();
            qTime.Id = timeId;

            var dayOfWeek = day;

            var qTutorialType = new TutorialType();
            qTutorialType.Id = tutorialTypeId;

            var qAuditoriumType = new AuditoriumType();
            qAuditoriumType.Id = auditoriumTypeId;

            var capacity = 0;
    
            var tmp = DataService.GetFreeAuditoriums(qBuilding, dayOfWeek, qWeekType, qTime, null, qAuditoriumType, capacity, StartDate, EndDate);

            foreach(var t in tmp){
                result.Add(new SendModel(t));
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
            var aAuditorium = new Auditorium();

            var qBuilding = new Building();
            qBuilding.Id = model.BuildingId;
            aAuditorium.Building = qBuilding;

            var qAuditoriumType = new AuditoriumType();
            qAuditoriumType.Id = model.AuditoriumTypeId;
            aAuditorium.AuditoriumType = qAuditoriumType;

            aAuditorium.Capacity = model.Capacity;
            aAuditorium.Info = model.Info;
            aAuditorium.Name = model.Name;
            aAuditorium.Number = model.Number;

            aAuditorium.UpdateDate = DateTime.Now.Date;
            aAuditorium.CreatedDate = DateTime.Now.Date;
            aAuditorium.IsActual = true;


            DataService.Add(aAuditorium);
        }

        [HttpPost]
        public HttpResponseMessage Delete(DeleteModel model)
        {
            return CreateResponse(privateDelete, model.Id);
        }

        public void privateDelete(int Id)
        {
            var dAuditorium = new Auditorium();
            dAuditorium.Id = Id;
            DataService.Delete(dAuditorium);
        }
    }
}
