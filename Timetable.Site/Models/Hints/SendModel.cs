using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;
using Timetable.Site.Controllers.Extends;
using Timetable.Site.DataService;

using SendTime = Timetable.Site.Models.Times.SendModel;

namespace Timetable.Site.Models.Hints
{
    [DataContract(IsReference = true)]
    public class SendModel
    {
        [DataMember(Name = "Day")]
        public int Day;

        [DataMember(Name = "Period")]
        public SendTime Period;

        [DataMember(Name = "Auditorium")]
        public Auditorium Auditorium;

        public SendModel() { }

        public SendModel(int Day, SendTime Period, Auditorium Auditorium)
        {
            this.Day = Day;
            this.Period = Period;
            this.Auditorium = Auditorium;
        }

    }
}