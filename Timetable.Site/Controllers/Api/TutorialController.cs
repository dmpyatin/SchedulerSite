using System;
using System.Collections.Generic;
using System.Web.Mvc;
using System.Net.Http;
using Timetable.Site.DataService;
using Timetable.Site.Models.Tutorials;
using System.Runtime.Serialization;

namespace Timetable.Site.Controllers.Api
{
    public class TutorialController : BaseApiController<Tutorial>
    {
        public HttpResponseMessage GetAll(ForAllModel model)
        {
            return CreateResponse<ForAllModel, IEnumerable<SendModel>>(privateGetAll, model);
        }

        private IEnumerable<SendModel> privateGetAll(ForAllModel model)
        {
            var result = new List<SendModel>();

            var qFaculty = new Faculty();
            qFaculty.Id = model.FacultyId;

            var qCourse = new Course();
            qCourse.Id = model.CourseId;

            var qSpeciality = new Speciality();
            qSpeciality.Id = model.SpecialityId;

            var tmp = DataService.GetTutorialsForSpeciality(qFaculty, qCourse, qSpeciality);

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
            var aTutorial = new Tutorial();

            var qFaculty = new Faculty();
            qFaculty.Id = model.FacultyId;

            aTutorial.Faculty = qFaculty;

            var qSpeciality = new Speciality();
            qSpeciality.Id = model.SpecialityId;

            aTutorial.Speciality = qSpeciality;

            aTutorial.Name = model.Name;
            aTutorial.ShortName = model.ShortName;

            aTutorial.UpdateDate = DateTime.Now.Date;
            aTutorial.CreatedDate = DateTime.Now.Date;
            aTutorial.IsActual = true;

            
            DataService.Add(aTutorial);
        }

        [HttpPost]
        public HttpResponseMessage Delete(DeleteModel model)
        {
            return CreateResponse(privateDelete, model.Id);
        }

        public void privateDelete(int Id)
        {
            var dTutorial = new Tutorial();
            dTutorial.Id = Id;
            DataService.Delete(dTutorial);
        }
    }
}
