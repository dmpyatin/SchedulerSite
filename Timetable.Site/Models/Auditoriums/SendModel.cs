using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;
using Timetable.Site.DataService;

namespace Timetable.Site.Models.Auditoriums
{
    [DataContract(IsReference = true)]
    public class SendModel
    {
        [DataMember(Name = "Id")]
        int Id;

        [DataMember(Name = "Number")]
        string Number;

        [DataMember(Name = "Capacity")]
        int Capacity;

        [DataMember(Name = "Name")]
        string Name;

        [DataMember(Name = "Info")]
        string Info;

        public SendModel() { }
        public SendModel(int Id, string Number, int Capacity, string Name, string Info)
        {
            this.Id = Id;
            this.Number = Number;
            this.Capacity = Capacity;
            this.Name = Name;
            this.Info = Info;

        }

        public SendModel(Auditorium t)
        {
            this.Id = t.Id;
            this.Number = t.Number;
            this.Capacity = (int)t.Capacity;
            this.Name = t.Name;
            this.Info = t.Info;
        }
    }
}