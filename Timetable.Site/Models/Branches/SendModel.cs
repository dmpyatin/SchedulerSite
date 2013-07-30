using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;
using Timetable.Site.DataService;
using Timetable.Site.Controllers.Extends;

namespace Timetable.Site.Models.Branches
{
    [DataContract(IsReference = true)]
    public class SendModel
    {
        [DataMember(Name = "Id")]
        int Id;

        [DataMember(Name = "Name")]
        string Name;

        public SendModel() { }
        public SendModel(int Id, string Name)
        {
            this.Id = Id;
            this.Name = Name;
        }

        public SendModel(Branch t)
        {
            var cns = new CutNameService();
            this.Id = t.Id;
            this.Name = cns.Cut(t.Name);
        }

    }
}