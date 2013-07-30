using System;
using System.Collections.Generic;
using System.Net.Http;
using Timetable.Site.DataService;
using System.Runtime.Serialization;
using Timetable.Site.Models.StudyYears;
using System.Web.Http;

namespace Timetable.Site.Controllers.Api
{
    public partial class StudyYearController : BaseApiController<StudyYear>
    {
        //Получить года обучения
        //TODO
        public HttpResponseMessage GetAll()
        {
            return CreateResponse<IEnumerable<SendModel>>(privateGetAll);
        }

        private IEnumerable<SendModel> privateGetAll()
        {
            var result = new List<SendModel>();
            var tmp = DataService.GetStudyYears();

            //var tmp = GetTempStudyYears();

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
            var aStudyYear = new StudyYear();

            //aStudyYear.Name = model.Id.ToString();

            aStudyYear.UpdateDate = DateTime.Now.Date;
            aStudyYear.CreatedDate = DateTime.Now.Date;
            aStudyYear.IsActual = true;

            DataService.Add(aStudyYear);
        }

        [HttpPost]
        public HttpResponseMessage Delete(DeleteModel model)
        {
            return CreateResponse(privateDelete, model.Id);
        }

        public void privateDelete(int Id)
        {
            var dStudyYear = new StudyYear();
            dStudyYear.Id = Id;
            DataService.Delete(dStudyYear);
        }
    }
}