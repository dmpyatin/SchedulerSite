using System;
using System.Collections.Generic;
using System.Web.Mvc;
using System.Net.Http;
using Timetable.Site.DataService;
using Timetable.Site.Models.TutorialTypes;
using System.Runtime.Serialization;

namespace Timetable.Site.Controllers.Api
{
   public partial class TutorialTypeController : BaseApiController<TutorialType>
   {
        //Получить виды занятий
        //TODO
        public HttpResponseMessage GetAll()
        {
            return CreateResponse<IEnumerable<SendModel>>(privateGetAll);
        }

        private IEnumerable<SendModel> privateGetAll()
        {
            var result = new List<SendModel>();
            var tmp = DataService.GetTutorialTypes();
            //var tmp = GetTempTutorialTypes();

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
            var aTutorialType = new TutorialType();

            aTutorialType.Name = model.Name;

            var AuditoriumApplicabilities = new List<Auditorium>();

            if (model.AuditoriumApplicabilityIds != null)
            {
                if (model.AuditoriumApplicabilityIds != null)
                {
                    foreach (var aaId in model.AuditoriumApplicabilityIds.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                    {
                        var a = new Auditorium();
                        a.Id = int.Parse(aaId);
                        AuditoriumApplicabilities.Add(a);
                    }
                }
            }

            aTutorialType.AuditoriumApplicabilities = AuditoriumApplicabilities.ToArray();


            aTutorialType.UpdateDate = DateTime.Now.Date;
            aTutorialType.CreatedDate = DateTime.Now.Date;
            aTutorialType.IsActual = true;


            DataService.Add(aTutorialType);
        }

        [HttpPost]
        public HttpResponseMessage Delete(DeleteModel model)
        {
            return CreateResponse(privateDelete, model.Id);
        }

        public void privateDelete(int Id)
        {
            var dTutorialType = new TutorialType();
            dTutorialType.Id = Id;
            DataService.Delete(dTutorialType);
        }
   }
}