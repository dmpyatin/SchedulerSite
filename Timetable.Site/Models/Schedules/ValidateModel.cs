using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;
using Timetable.Site.DataService;
using Timetable.Site.Controllers.Extends;

namespace Timetable.Site.Models.Schedules
{
    [DataContract(IsReference = true)]
    public class ValidateModel
    {
        [DataMember(Name = "Id")]
        public bool status { get; set; }

        [DataMember(Name = "Id")]
        IEnumerable<string> messages { get; set; }

        public ValidateModel() { }

        public ValidateModel(bool status, IEnumerable<string> messages) {
            this.status = status;
            this.messages = messages;
        }
    }
}