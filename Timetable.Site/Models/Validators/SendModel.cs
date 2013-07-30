using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;
using Timetable.Site.DataService;

namespace Timetable.Site.Models.Validators
{
    [DataContract(IsReference = true)]
    public class SendModel
    {
        [DataMember(Name = "ErrorId")]
        int ErrorId;

        [DataMember(Name = "ErrorName")]
        string ErrorName;

        [DataMember(Name = "PossibleResolveId")]
        int PossibleResolveId;

        [DataMember(Name = "PossibleResolveName")]
        string PossibleResolveName;

        public SendModel() { }
        public SendModel(int ErrorId, string ErrorName, int PossibleResolveId, string PossibleResolveName)
        {
            this.ErrorId = ErrorId;
            this.ErrorName = ErrorName;
            this.PossibleResolveId = PossibleResolveId;
            this.PossibleResolveName = PossibleResolveName;
        }
    }
}