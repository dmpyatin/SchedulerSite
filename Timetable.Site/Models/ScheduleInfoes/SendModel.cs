using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;
using Microsoft.Ajax.Utilities;
using Timetable.Site.DataService;
using Timetable.Site.Controllers.Extends;

namespace Timetable.Site.Models.ScheduleInfoes
{
    [DataContract(IsReference = true)]
    public class SendModel
    {
        [DataMember(Name = "Id")]
        public int Id;

        [DataMember(Name = "HoursPerWeek")]
        public double HoursPerWeek;

        [DataMember(Name = "CurrentHours")]
        public double CurrentHours;

        [DataMember(Name = "LecturerName")]
        public string LecturerName;

        [DataMember(Name = "LecturerId")]
        public int LecturerId;

        [DataMember(Name = "TutorialTypeName")]
        public string TutorialTypeName;

        [DataMember(Name = "TutorialTypeId")]
        public int TutorialTypeId;

        [DataMember(Name = "DepartmentName")]
        public string DepartmentName;

        [DataMember(Name = "DepartmentId")]
        public int DepartmentId;

        [DataMember(Name = "TutorialName")]
        public string TutorialName;

        [DataMember(Name = "TutorialId")]
        public int TutorialId;

        [DataMember(Name = "CourseNames")]
        public string CourseNames;

        [DataMember(Name = "CourseIds")]
        public string CourseIds;

        [DataMember(Name = "FacultyNames")]
        public string FacultyNames;

        [DataMember(Name = "SpecialityNames")]
        public string SpecialityNames;

        [DataMember(Name = "GroupNames")]
        public string GroupNames;

        [DataMember(Name = "GroupIds")]
        public string GroupIds;

        public SendModel() { }

        public SendModel(int Id, double HoursPerWeek, double CurrentHours,
                               string LecturerName, int LecturerId,
                               string TutorialTypeName, int TutorialTypeId,
                               string DepartmentName, int DepartmentId,
                               string TutorialName, int TutorialId,
                               string CourseNames, string CourseIds, string FacultyNames,
                               string SpecialityNames, string GroupNames,
                               string GroupIds)
        {
            this.Id = Id;
            this.HoursPerWeek = HoursPerWeek;
            this.CurrentHours = CurrentHours;
            this.LecturerName = LecturerName;
            this.LecturerId = LecturerId;
            this.TutorialTypeName = TutorialTypeName;
            this.TutorialTypeId = TutorialTypeId;
            this.DepartmentName = DepartmentName;
            this.DepartmentId = DepartmentId;
            this.TutorialName = TutorialName;
            this.TutorialId = TutorialId;
            this.CourseNames = CourseNames;
            this.CourseIds = CourseIds;
            this.FacultyNames = FacultyNames;
            this.SpecialityNames = SpecialityNames;
            this.GroupNames = GroupNames;
            this.GroupIds = GroupIds;
        }

        public SendModel(ScheduleInfo t, int CurrentHours)
        {
            var cns = new CutNameService();

            this.Id = t.Id;
            this.HoursPerWeek = t.HoursPerWeek;

            this.CurrentHours = CurrentHours; 

            this.LecturerId = 0;
            this.LecturerName = "";
            if (t.Lecturer != null)
            {
                this.LecturerId = t.Lecturer.Id;
                if (!t.Lecturer.Lastname.IsNullOrWhiteSpace() && !t.Lecturer.Firstname.IsNullOrWhiteSpace() && !t.Lecturer.Middlename.IsNullOrWhiteSpace())
                    this.LecturerName = t.Lecturer.Lastname + " " + t.Lecturer.Firstname[0] + ". " + t.Lecturer.Middlename[0] + ".";
            }

            this.TutorialTypeId = 0;
            this.TutorialTypeName = "";
            if (t.TutorialType != null)
            {
                this.TutorialTypeId = t.TutorialType.Id;
                this.TutorialTypeName = t.TutorialType.Name;

                if (this.TutorialTypeId == 1) this.TutorialTypeName = "Лек.";
                if (this.TutorialTypeId == 2) this.TutorialTypeName = "Лаб.";
                if (this.TutorialTypeId == 3) this.TutorialTypeName = "Пр.";
                if (this.TutorialTypeId == 20) this.TutorialTypeName = "Сем-р.";
                if (this.TutorialTypeId == 22) this.TutorialTypeName = "Фак-в.";
                if (this.TutorialTypeId == 23) this.TutorialTypeName = "Инд.";
                if (this.TutorialTypeId == 43) this.TutorialTypeName = "Пр.в диспл.";
                if (this.TutorialTypeId == 44) this.TutorialTypeName = "Лаб.(изл.)";
            }

            this.DepartmentId = 0;
            this.DepartmentName = "";
            if (t.Department != null)
            {
                this.DepartmentId = t.Department.Id;
                this.DepartmentName = t.Department.Name;
            }

            this.TutorialId = 0;
            this.TutorialName = "";
            if (t.Tutorial != null)
            {
                this.TutorialId = t.Tutorial.Id;
                this.TutorialName = cns.Cut(t.Tutorial.Name);
            }

            this.GroupNames = "";
            this.GroupIds = "";
            if (t.Groups != null)
            {
                foreach (var g in t.Groups)
                {
                    if (g.Code != null)
                        this.GroupNames += g.Code + " ";
                    this.GroupIds += g.Id.ToString() + ", ";
                }
            }

            this.CourseNames = "";
            this.CourseIds = "";
            if (t.Courses != null)
            {
                foreach (var c in t.Courses)
                {
                    if (c.Name != null)
                    {
                        if (c.Name == "первый курс")
                            this.CourseNames += "1 ";
                        if (c.Name == "второй курс")
                            this.CourseNames += "2 ";
                        if (c.Name == "третий курс")
                            this.CourseNames += "3 ";
                        if (c.Name == "четвертый курс")
                            this.CourseNames += "4 ";
                        if (c.Name == "пятый курс")
                            this.CourseNames += "5 ";
                        if (c.Name == "шестой курс")
                            this.CourseNames += "6 ";
                    }
                    this.CourseIds += c.Id.ToString() + ", ";
                }
            }

            this.FacultyNames = "";
            if (t.Faculties != null)
            {
                foreach (var f in t.Faculties)
                {
                    if (f.Name != null)
                        this.FacultyNames += f.Name + " ";
                }
            }

            this.SpecialityNames = "";
            if (t.Specialities != null)
            {
                foreach (var s in t.Specialities)
                {
                    if (s.Name != null)
                        this.SpecialityNames += s.Name + " ";
                }
            }
        }
    }
}