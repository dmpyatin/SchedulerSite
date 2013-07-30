using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Timetable.Site.DataService;
using System.Runtime.Serialization;
using SendSchedule = Timetable.Site.Models.Schedules.SendModel;
using SendTime = Timetable.Site.Models.Times.SendModel;
using SendGroup = Timetable.Site.Models.Groups.SendModel;

namespace Timetable.Site.Models
{
    public class PrintScheduleInfoModel
    {
        public string Name { get; set; }
    }
    public class PrintScheduleModel
    {
        public SendSchedule[,,] ScheduleTable { get; set; }
        public IEnumerable<SendTime> Times { get; set; }
        public string Header { get; set; }
        public IEnumerable<string> Days { get; set; }
        public int FontSize { get; set; }
        public string Mode { get; set; }
    }

    public class PrintScheduleForGroupsModel
    {
        public SendSchedule[,,,] ScheduleTable { get; set; } //Group, Day, Time, Period
        public int[, ,] Colspan { get; set; }
        public bool[, ,] Skip2 { get; set; }
        public int[] Rowspan { get; set; }
        public bool[,] Skip { get; set; }
        public IEnumerable<SendTime> Times { get; set; }
        public string Header { get; set; }
        public IEnumerable<string> Days { get; set; }
        public IEnumerable<SendGroup> Groups { get; set; }
        public int FontSize { get; set; }
    }
}