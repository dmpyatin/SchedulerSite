using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Runtime.Serialization;
using Timetable.Site.DataService;
using Timetable.Site.Models.Validators;

namespace Timetable.Site.Controllers.Api
{
    public class ValidatorController : BaseApiController<BaseEntity>
    {
        public HttpResponseMessage GetByState(StateModel model)
        {
            return CreateResponse<StateModel, IEnumerable<SendModel>>(privateGetByState, model);
        }

        private IEnumerable<SendModel> privateGetByState(StateModel model)
        {
           var result = new List<SendModel>();

 
            ScheduleInfo aScheduleInfo = DataService.GetScheduleInfoById(model.scheduleInfoId);

            int curHours = DataService.CountSchedulesForScheduleInfoes(aScheduleInfo);

            int maxHours = aScheduleInfo.HoursPerWeek;


            

           if (curHours >= maxHours)
           {
               result.Add(new SendModel(1,"Недостаточно часов", 1, "Добавить часы"));
           }


           var qPeriod = new Time();
           qPeriod.Id = model.PeriodId;

           var qWeekType = new WeekType();
           qWeekType.Id = model.WeekTypeId;

           int collisions = DataService.CountScheduleCollisions(model.day, qPeriod, qWeekType);


           if (collisions > 0)
           {
               result.Add(new SendModel(2, "Выбранная позиция занята", 2, "Подобрать вариант"));
           }
         
           return result;
        }
    }
}
