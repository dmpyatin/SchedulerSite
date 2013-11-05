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
    public class SendModel
    {
        [DataMember(Name = "Id")]
        public int Id;

        [DataMember(Name = "ScheduleInfoId")]
        public int ScheduleInfoId;

        [DataMember(Name = "DayOfWeek")]
        public int DayOfWeek;

        [DataMember(Name = "PeriodId")]
        public int PeriodId;

        [DataMember(Name = "BuildingId")]
        public int BuildingId;

        [DataMember(Name = "WeekTypeName")]
        public string WeekTypeName;

        [DataMember(Name = "WeekTypeId")]
        public int WeekTypeId;

        [DataMember(Name = "AuditoriumNumber")]
        public string AuditoriumNumber;

        [DataMember(Name = "AuditoriumId")]
        public int AuditoriumId;

        [DataMember(Name = "LecturerName")]
        public string LecturerName;

        [DataMember(Name = "LecturerId")]
        public int LecturerId;

        [DataMember(Name = "TutorialName")]
        public string TutorialName;

        [DataMember(Name = "TutorialId")]
        public int TutorialId;

        [DataMember(Name = "TutorialTypeName")]
        public string TutorialTypeName;

        [DataMember(Name = "TutorialTypeId")]
        public int TutorialTypeId;

        [DataMember(Name = "GroupNames")]
        public string GroupNames;

        [DataMember(Name = "GroupIds")]
        public string GroupIds;

        [DataMember(Name = "IsForLecturer")]
        public bool IsForLecturer;

        [DataMember(Name = "IsForAuditorium")]
        public bool IsForAuditorium;

        [DataMember(Name = "IsForGroup")]
        public bool IsForGroup;

        [DataMember(Name = "StartDate")]
        public string StartDate;

        [DataMember(Name = "EndDate")]
        public string EndDate;

        [DataMember(Name = "AutoDelete")]
        public bool AutoDelete;

        [DataMember(Name = "StartTime")]
        public string StartTime;

        [DataMember(Name = "EndTime")]
        public string EndTime;

        [DataMember(Name = "LecturerFullName")]
        public string LecturerFullName;

        [DataMember(Name = "TutorialFullName")]
        public string TutorialFullName;

        [DataMember(Name = "TutorialTypeFullName")]
        public string TutorialTypeFullName;

        [DataMember(Name = "WeekTypeFullName")]
        public string WeekTypeFullName;

        [DataMember(Name = "BuildingFullName")]
        public string BuildingFullName;

        [DataMember(Name = "SubGroup")]
        public string SubGroup;


        public SendModel() { }

        public SendModel(int Id, int ScheduleInfoId, int DayOfWeek, int PeriodId, int BuildingId, string WeekTypeName, int WeekTypeId, string AuditoriumNumber,
                                int AuditoriumId, string LecturerName, int LecturerId, string TutorialName,
                                int TutorialId, string TutorialTypeName, int TutorialTypeId, string GroupNames,
                                string GroupIds, bool IsForLecturer, bool IsForAuditorium, bool IsForGroup,
                                string StartDate, string EndDate, bool AutoDelete, string StartTime, string EndTime, 
                                string LecturerFullName,
                                string TutorialFullName,
                                string TutorialTypeFullName,
                                string WeekTypeFullName,
                                string BuildingFullName, 
                                string SubGroup)
        {
            this.Id = Id;
            this.ScheduleInfoId = ScheduleInfoId;
            this.DayOfWeek = DayOfWeek;
            this.PeriodId = PeriodId;
            this.BuildingId = BuildingId;
            this.WeekTypeName = WeekTypeName;
            this.WeekTypeId = WeekTypeId;
            this.AuditoriumNumber = AuditoriumNumber;
            this.AuditoriumId = AuditoriumId;
            this.LecturerName = LecturerName;
            this.LecturerId = LecturerId;
            this.TutorialName = TutorialName;
            this.TutorialId = TutorialId;
            this.TutorialTypeName = TutorialTypeName;
            this.TutorialTypeId = TutorialTypeId;
            this.GroupNames = GroupNames;
            this.GroupIds = GroupIds;
            this.IsForLecturer = IsForLecturer;
            this.IsForAuditorium = IsForAuditorium;
            this.IsForGroup = IsForGroup;
            this.StartDate = StartDate;
            this.EndDate = EndDate;
            this.AutoDelete = AutoDelete;
            this.StartTime = StartTime;
            this.EndTime = EndTime;
            this.LecturerFullName = LecturerFullName;
            this.TutorialFullName = TutorialFullName;
            this.TutorialTypeFullName = TutorialTypeFullName;
            this.WeekTypeFullName = WeekTypeFullName;
            this.BuildingFullName = BuildingFullName;
            this.SubGroup = SubGroup;
        }

        public SendModel(Schedule t, bool IsForLecturer, bool IsForAuditorium, bool IsForGroup)
        {
                
            var cns = new CutNameService();

            this.IsForLecturer = IsForLecturer;
            this.IsForAuditorium = IsForAuditorium;
            this.IsForGroup = IsForGroup;

            this.Id = t.Id;

            this.ScheduleInfoId = 0;
            if (t.ScheduleInfo != null)
                this.ScheduleInfoId = t.ScheduleInfo.Id;

            this.DayOfWeek = t.DayOfWeek;

            this.PeriodId = 0;
            if (t.Period != null)
            {
                this.PeriodId = t.Period.Id;
            }

            

            this.WeekTypeId = 0;
            this.WeekTypeName = "";
            if (t.WeekType != null)
            {
                this.WeekTypeId = t.WeekType.Id;
                this.WeekTypeName = t.WeekType.Name;
                if (this.WeekTypeName == "Л") { this.WeekTypeFullName = "Еженедельно"; }
                if (this.WeekTypeName == "Ч") { this.WeekTypeFullName = "Числитель"; }
                if (this.WeekTypeName == "З") { this.WeekTypeFullName = "Знаменатель"; }
            }

            this.AuditoriumId = 0;
            this.AuditoriumNumber = "";
            if (t.Auditorium != null)
            {
                this.AuditoriumId = t.Auditorium.Id;
                this.AuditoriumNumber = t.Auditorium.Number;

                if (t.Auditorium.Building != null)
                {
                    this.BuildingFullName = t.Auditorium.Building.Name;
                    this.BuildingId = t.Auditorium.Building.Id;
                }
            }

            this.LecturerId = 0;
            this.LecturerName = "";
            if (t.ScheduleInfo != null)
            {
                if (t.ScheduleInfo.Lecturer != null)
                {
                    this.LecturerId = t.ScheduleInfo.Lecturer.Id;
                    this.LecturerName = t.ScheduleInfo.Lecturer.Lastname;// +" " + t.ScheduleInfo.Lecturer.Firstname[0] + ". " + t.ScheduleInfo.Lecturer.Middlename[0] + ".";
                    this.LecturerFullName = t.ScheduleInfo.Lecturer.Lastname +" " + t.ScheduleInfo.Lecturer.Firstname + " " + t.ScheduleInfo.Lecturer.Middlename + " ";
                }
            }

            this.TutorialId = 0;
            this.TutorialName = "";
            if (t.ScheduleInfo != null)
            {
                if (t.ScheduleInfo.Tutorial != null)
                {
                    this.TutorialId = t.ScheduleInfo.Tutorial.Id;
                    this.TutorialName = cns.Cut(t.ScheduleInfo.Tutorial.Name);
                    this.TutorialFullName = t.ScheduleInfo.Tutorial.Name;
                }
            }

            this.TutorialTypeId = 0;
            this.TutorialTypeName = "";
            if (t.ScheduleInfo != null)
            {
                if (t.ScheduleInfo.TutorialType != null)
                {
                    this.TutorialTypeId = t.ScheduleInfo.TutorialType.Id;
                    this.TutorialTypeName = t.ScheduleInfo.TutorialType.Name;
                    this.TutorialTypeFullName = t.ScheduleInfo.TutorialType.Name;
                    if (this.TutorialTypeId == 1) this.TutorialTypeName = "Лек.";
                    if (this.TutorialTypeId == 2) this.TutorialTypeName = "Лаб.";
                    if (this.TutorialTypeId == 3) this.TutorialTypeName = "Пр.";
                    if (this.TutorialTypeId == 20) this.TutorialTypeName = "Сем-р.";
                    if (this.TutorialTypeId == 22) this.TutorialTypeName = "Фак-в.";
                    if (this.TutorialTypeId == 23) this.TutorialTypeName = "Инд.";
                    if (this.TutorialTypeId == 43) this.TutorialTypeName = "Пр.в диспл.";
                    if (this.TutorialTypeId == 44) this.TutorialTypeName = "Лаб.(изл.)";

                }


            }

            this.GroupNames = "";
            this.GroupIds = "";
            if (t.ScheduleInfo != null)
            {
                if (t.ScheduleInfo.Groups != null)
                {
                    foreach (var g in t.ScheduleInfo.Groups)
                    {
                        if (g.Code != null)
                            this.GroupNames += g.Code + " ";
                        this.GroupIds += g.Id.ToString() + ", ";
                    }
                }
            }

            this.StartDate = t.StartDate.ToShortDateString();
            this.EndDate = t.EndDate.ToShortDateString();
            this.AutoDelete = t.AutoDelete;

            this.StartTime = t.Period.Start.ToString(@"hh\:mm");
            this.EndTime = t.Period.End.ToString(@"hh\:mm");

            this.SubGroup = t.SubGroup;

        }
    }
}