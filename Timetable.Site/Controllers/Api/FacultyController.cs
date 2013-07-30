using System.Collections.Generic;
using System.Net.Http;
using System.Runtime.Serialization;
using Timetable.Site.DataService;
using Timetable.Site.Models.Faculties;

namespace Timetable.Site.Controllers.Api
{
    public partial class FacultyController : BaseApiController<Faculty>
    {
        //Получить список всех факультетов
        public HttpResponseMessage GetAll(int branchId)
        {
            return CreateResponse<int, IEnumerable<SendModel>>(privateGetAll, branchId);
        }

        private IEnumerable<SendModel> privateGetAll(int branchId)
        {
            var result = new List<SendModel>();

            var qBranch = new Branch();
            qBranch.Id = branchId;

            var tmp = DataService.GetFaculties(qBranch);
            //var tmp = GetTempFaculties();

            foreach (var t in tmp)
            {
                result.Add(new SendModel(t));
            }

            return result;
        }
    }
}
