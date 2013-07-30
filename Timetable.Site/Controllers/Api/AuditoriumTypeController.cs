using System;
using System.Collections.Generic;
using System.Net.Http;
using Timetable.Site.DataService;
using System.Runtime.Serialization;
using Timetable.Site.Models.AuditoriumTypes;
using System.Web.Http;

namespace Timetable.Site.Controllers.Api
{
    public partial class AuditoriumTypeController : BaseApiController<AuditoriumType>
    {
        //Получить типы аудиторий
        //TODO
        public HttpResponseMessage GetAll()
        {
            return CreateResponse<IEnumerable<SendModel>>(privateGetAll);
        }

        private IEnumerable<SendModel> privateGetAll()
        {
            var result = new List<SendModel>();
            var tmp = DataService.GetAuditoriumTypes();
            //var tmp = GetTempAuditoriumTypes();

            foreach (var t in tmp)
            {
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
            var aAuditoriumType = new AuditoriumType();

            aAuditoriumType.Name = model.Name;

            aAuditoriumType.UpdateDate = DateTime.Now.Date;
            aAuditoriumType.CreatedDate = DateTime.Now.Date;
            aAuditoriumType.IsActual = true;

            DataService.Add(aAuditoriumType);
        }

        [HttpPost]
        public HttpResponseMessage Delete(DeleteModel model)
        {
            return CreateResponse(privateDelete, model.Id);
        }

        public void privateDelete(int Id)
        {
            var dAuditoriumType = new Auditorium();
            dAuditoriumType.Id = Id;
            DataService.Delete(dAuditoriumType);
        }
    }
}