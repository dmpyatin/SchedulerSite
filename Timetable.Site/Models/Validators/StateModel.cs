using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Timetable.Site.Models.Validators
{
    public class StateModel
    {
         public int scheduleInfoId { get; set; }
         public int day { get; set; }
         public int PeriodId { get; set; }
         public int WeekTypeId { get; set; }
    }
}