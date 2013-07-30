using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Runtime.Serialization;
using Timetable.Site.DataService;
using Timetable.Site.Models.Specialities;
using System.Web.Http;

namespace Timetable.Site.Controllers.Api
{
    public partial class SpecialityController : BaseApiController<Speciality>
    {
        //Получить все специальности для факультета
        public HttpResponseMessage GetAll(int facultyId)
        {
            return CreateResponse<int, IEnumerable<SendModel>>(privateGetAll, facultyId);
        }

        private IEnumerable<SendModel> privateGetAll(int facultyId)
        {
            var result = new List<SendModel>();

            var qFaculty = new Faculty();
            qFaculty.Id = facultyId;
          
            var tmp = DataService.GetSpecialities(qFaculty);
            //var tmp = GetTempSpecialities(qFaculty);

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
            var aSpeciality = new Speciality();

            aSpeciality.Code = model.Code;
            aSpeciality.Name = model.Name;
            aSpeciality.ShortName = model.ShortName;
        
            aSpeciality.UpdateDate = DateTime.Now.Date;
            aSpeciality.CreatedDate = DateTime.Now.Date;
            aSpeciality.IsActual = true;

            DataService.Add(aSpeciality);
        }

        [HttpPost]
        public HttpResponseMessage Delete(DeleteModel model)
        {
            return CreateResponse(privateDelete, model.Id);
        }

        public void privateDelete(int Id)
        {
            var dSpeciality = new Speciality();
            dSpeciality.Id = Id;
            DataService.Delete(dSpeciality);
        }
    }
}
