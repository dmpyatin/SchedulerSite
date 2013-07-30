using System.Collections.Generic;
using System.Net.Http;
using System.Runtime.Serialization;
using Timetable.Site.DataService;
using Timetable.Site.Models.Buidlings;

namespace Timetable.Site.Controllers.Api
{
    public partial class BuildingController : BaseApiController<Building>
    {
        //Получить список зданийC:\NewUniversityScheduler3\Scheduler.Site\Timetable.Site\Controllers\Api\BuildingController.cs
        public HttpResponseMessage GetAll()
        {
            return CreateResponse<IEnumerable<SendModel>>(privateGetAll);
        }

        private IEnumerable<SendModel> privateGetAll()
        {
            var result = new List<SendModel>();

            var tmp = DataService.GetBuildings();
            //var tmp = GetTempBuildings();

            foreach (var t in tmp)
            {
                result.Add(new SendModel(t));
            }

            return result;
        }
    }
}
