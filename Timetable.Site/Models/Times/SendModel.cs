using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;
using Timetable.Site.DataService;


namespace Timetable.Site.Models.Times
{
    [DataContract(IsReference = true)]
    public class SendModel
    {
        [DataMember(Name = "Id")]
        public int Id;

        [DataMember(Name = "ViewId")]
        public int ViewId;

        [DataMember(Name = "Start")]
        public string Start;

        [DataMember(Name = "End")]
        public string End;

        [DataMember(Name = "StartEnd")]
        public string StartEnd;

        public SendModel() { }
        public SendModel(int Id, int ViewId, string Start, string End)
        {
            this.Id = Id;
            this.ViewId = ViewId;
            this.Start = Start;
            this.End = End;
            this.StartEnd = Start + "-" + End;
        }

        public SendModel(Time t, int Index)
        {
            this.Id = t.Id;
            this.ViewId = Index;
            this.Start = t.Start.ToString(@"hh\:mm");
            this.End = t.End.ToString(@"hh\:mm");
            this.StartEnd = this.Start + "-" + this.End;
        }
    }
}