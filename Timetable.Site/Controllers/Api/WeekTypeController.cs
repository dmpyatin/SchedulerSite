using System.Collections.Generic;
using System.Net.Http;
using Timetable.Site.DataService;
using System.Runtime.Serialization;
using Timetable.Site.Models.WeekTypes;

namespace Timetable.Site.Controllers.Api
{
    public partial class WeekTypeController : BaseApiController<WeekType>
    {
        //Получить типы недели
        public HttpResponseMessage GetAll()
        {
            return CreateResponse<IEnumerable<SendModel>>(privateGetAll);
        }

        private IEnumerable<SendModel> privateGetAll()
        {
            var result = new List<SendModel>();

            var tmp = DataService.GetWeekTypes();
            //var tmp = GetTempWeekTypes();

            foreach (var t in tmp)
            {
                result.Add(new SendModel(t));
            }

            return result;
        }
    }
}