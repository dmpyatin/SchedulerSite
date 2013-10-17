using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Timetable.Site.Models.Schedules
{
    public class UpdateModel
    {
        public int ScheduleId { get; set; }

        public int AuditoriumId { get; set; }

        public int ScheduleInfoId { get; set; }

        public int DayOfWeek { get; set; }

        public int PeriodId { get; set; }

        public int WeekTypeId { get; set; }

        public string StartDate { get; set; }

        public string EndDate { get; set; }

        public bool AutoDelete { get; set; }

        public string SubGroup { get; set; }
    }
}