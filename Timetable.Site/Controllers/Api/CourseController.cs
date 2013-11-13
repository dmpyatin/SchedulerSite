using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Runtime.Serialization;
using Timetable.Site.DataService;
using Timetable.Site.Models.Courses;
using System.Web.Http;
using System.Linq;

namespace Timetable.Site.Controllers.Api
{
    public partial class CourseController : BaseApiController<Course>
    {
        //Получить список курсов
        public HttpResponseMessage GetAll()
        {
            return CreateResponse<IEnumerable<SendModel>>(privateGetAll);
        }

        public IEnumerable<SendModel> privateGetAll()
        {
            var result = new List<SendModel>();
            var tmp = DataService.GetCources();
            //var tmp = GetTempCourses();

            foreach (var t in tmp)
            {
                result.Add(new SendModel(t));
            }

            return result;
        }

        public IEnumerable<SendModel> GetByIds(string courseIds)
        {
            var result = new List<SendModel>();
            var tmp = DataService.GetCources();
            var Ids = new List<int>();
             foreach (var courseId in courseIds.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                 if (courseId != " ")
                    Ids.Add(int.Parse(courseId));

            var courses = privateGetAll();
            foreach(var c in courses){
                if (Ids.Any(x => x == c.Id))
                    result.Add(c);
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
            var aCourse = new Course();

            aCourse.Name = model.Name;
         
            aCourse.UpdateDate = DateTime.Now.Date;
            aCourse.CreatedDate = DateTime.Now.Date;
            aCourse.IsActual = true;

            DataService.Add(aCourse);
        }

        [HttpPost]
        public HttpResponseMessage Delete(DeleteModel model)
        {
            return CreateResponse(privateDelete, model.Id);
        }

        public void privateDelete(int Id)
        {
            var dCourse = new Course();
            dCourse.Id = Id;
            DataService.Delete(dCourse);
        }
    }
}