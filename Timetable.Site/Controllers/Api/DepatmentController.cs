using System.Collections.Generic;
using System.Net.Http;
using System.Runtime.Serialization;
using Timetable.Site.DataService;
using Timetable.Site.Models.Departments;

namespace Timetable.Site.Controllers.Api
{
    public class DepartmentController : BaseApiController<Department>
    {
        //Получить список кафедр университета
        public HttpResponseMessage GetAll()
        {
            return CreateResponse<IEnumerable<SendModel>>(privateGetAll);
        }

        private IEnumerable<SendModel> privateGetAll()
        {
            var result = new List<SendModel>();

            var tmp = DataService.GetDeparmtents();

            foreach (var t in tmp)
            {
                result.Add(new SendModel(t));
            }

            return result;
        }
    }
}
