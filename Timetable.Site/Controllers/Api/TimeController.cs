using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Web.Http;
using Timetable.Site.DataService;
using Timetable.Site.Models.Times;
using System.Runtime.Serialization;

namespace Timetable.Site.Controllers.Api
{
    public partial class TimeController : BaseApiController<Time>
    {
        public HttpResponseMessage TempGetAll(ForAllModel model)
        {
            return CreateResponse<ForAllModel, IEnumerable<SendModel>>(privateTempGetAll, model);
        }

        public IEnumerable<SendModel> privateTempGetAll(ForAllModel model)
        {
            var result = new List<SendModel>();
            var tmp = GetTempTimes();

            int i = 1;
            foreach (var t in tmp)
            {
                result.Add(new SendModel(t, i));
                i++;
            }

            return result;
        }


        //Получить все звонки в здании
        public HttpResponseMessage GetAll(int buildingId)
        {
            return CreateResponse<int, IEnumerable<SendModel>>(privateGetAll, buildingId);
        }

        public IEnumerable<SendModel> privateGetAll(int buildingId)
        {
           var result = new List<SendModel>();

           var qBuilding = new Building();
           qBuilding.Id = buildingId;
           //qBuilding.Id = 1;

           //var tmp = GetTempTimes();
           var tmp = DataService.GetTimes(qBuilding);

           int i = 1;
           foreach (var t in tmp)
           {
               result.Add(new SendModel(t, i));
               i++;
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
            var aTime = new Time();

            aTime.Building = new Building();
            aTime.Building.Id = model.BuildingId;

            aTime.Start = TimeSpan.Parse(model.StartTime);
            aTime.End = TimeSpan.Parse(model.EndTime);

            aTime.UpdateDate = DateTime.Now.Date;
            aTime.CreatedDate = DateTime.Now.Date;
            aTime.IsActual = true;

            DataService.Add(aTime);
        }

        [HttpPost]
        public HttpResponseMessage Delete(DeleteModel model)
        {
            return CreateResponse(privateDelete, model.Id);
        }

        public void privateDelete(int Id)
        {
            var dTime = new Time();
            dTime.Id = Id;
            DataService.Delete(dTime);
        }
    }
}