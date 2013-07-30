using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;
using Timetable.Site.DataService;

namespace Timetable.Site.Models.Groups
{
    [DataContract(IsReference = true)]
    public class SendModel
    {
        [DataMember(Name = "Id")]
        public int Id;

        [DataMember(Name = "Code")]
        public string Code;

        public SendModel() { }
        public SendModel(int Id, string Code)
        {
            this.Id = Id;
            this.Code = Code;
        }

        public SendModel(Group t)
        {
            this.Id = t.Id;
            this.Code = t.Code;
        }
    }
}