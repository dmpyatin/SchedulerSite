using System.Collections.Generic;
using System.Net.Http;
using System.Runtime.Serialization;
using Timetable.Site.DataService;
using Timetable.Site.Controllers.Extends;
using Timetable.Site.Models.Branches;

namespace Timetable.Site.Controllers.Api
{
    public partial class BranchController : BaseApiController<Branch>
    {
        //Получить список всех подразделений
        public HttpResponseMessage GetAll()
        {
            return CreateResponse<IEnumerable<SendModel>>(privateGetAll);
        }

        private IEnumerable<SendModel> privateGetAll()
        {
            var result = new List<SendModel>();
            var tmp = DataService.GetBranches();
            //var tmp = GetTempBranches();
            foreach (var t in tmp)
            {
                result.Add(new SendModel(t));
            }

            return result;
        }
    }
}
