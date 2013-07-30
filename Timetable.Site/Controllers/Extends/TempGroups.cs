using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Runtime.Serialization;
using Timetable.Site.DataService;
using Timetable.Site.Models.ScheduleInfoes;

namespace Timetable.Site.Controllers.Api
{
    public partial class GroupController : BaseApiController<Group>
    {
        public Group GetTempGroupById(int groupId)
        {
            var result = new Group();
            if (groupId == 22305)
            {
                return CreateGroup(22305, "22305", 1, 1);
            }
            if (groupId == 22306)
            {
                return CreateGroup(22306, "22306", 1, 1);
            }
            if (groupId == 22303)
            {
                return CreateGroup(22303, "22303", 1, 1);
            }
            if (groupId == 22304)
            {
                return CreateGroup(22304, "22304", 1, 1);
            }
            if (groupId == 22308)
            {
                return CreateGroup(22308, "22308", 1, 1);
            }
            if (groupId == 22101)
            {
                return CreateGroup(22101, "22101", 1, 1);
            }
            if (groupId == 22103)
            {
                return CreateGroup(22103, "22103", 1, 1);
            }
            if (groupId == 22104)
            {
                return CreateGroup(22104, "22104", 1, 1);
            }
            if (groupId == 22105)
            {
                return CreateGroup(22105, "22105", 1, 1);
            }
            if (groupId == 22106)
            {
                return CreateGroup(22106, "22106", 1, 1);
            }
            if (groupId == 22108)
            {
                return CreateGroup(22108, "22108", 1, 1);
            }
            if (groupId == 22201)
            {
                return CreateGroup(22201, "22201", 1, 1);
            }
            if (groupId == 22203)
            {
                return CreateGroup(22203, "22203", 1, 1);
            }
            if (groupId == 22204)
            {
                return CreateGroup(22204, "22204", 1, 1);
            }
            if (groupId == 22205)
            {
                return CreateGroup(22205, "22205", 1, 1);
            }
            if (groupId == 22206)
            {
                return CreateGroup(22206, "22206", 1, 1);
            }
            if (groupId == 22208)
            {
                return CreateGroup(22208, "22208", 1, 1);
            }
            return result;
        }

        public Group[] GetTempGroups(Course c, Speciality s)
        {
            var result = new List<Group>();
            //ИСиТ
            if (s != null)
            {
                if (s.Id == 5)
                {
                    if (c.Id == 3)
                    {
                        result.Add(CreateGroup(22305, "22305", s.Id, c.Id));
                        result.Add(CreateGroup(22306, "22306", s.Id, c.Id));
                    }
                }
                if (s.Id == 1)
                {
                    if (c.Id == 1)
                    {
                        result.Add(CreateGroup(22105, "22105", s.Id, c.Id));
                        result.Add(CreateGroup(22106, "22106", s.Id, c.Id));
                    }
                    if (c.Id == 2)
                    {
                        result.Add(CreateGroup(22205, "22205", s.Id, c.Id));
                        result.Add(CreateGroup(22206, "22206", s.Id, c.Id));
                    }
                    
                    if (c.Id == 4)
                    {
                        result.Add(CreateGroup(22405, "22405", s.Id, c.Id));
                    }
                }

                //БИ
                if (s.Id == 2)
                {
                    if (c.Id == 1)
                    {
                        result.Add(CreateGroup(22108, "22108", s.Id, c.Id));
                    }
                    if (c.Id == 2)
                    {
                        result.Add(CreateGroup(22208, "22208", s.Id, c.Id));
                    }
                    if (c.Id == 3)
                    {
                        result.Add(CreateGroup(22308, "22308", s.Id, c.Id));
                    }
                    if (c.Id == 4)
                    {
                        result.Add(CreateGroup(22408, "22408", s.Id, c.Id));
                    }
                }

                //Математика
                if (s.Id == 3)
                {
                    if (c.Id == 1)
                    {
                        result.Add(CreateGroup(22101, "22101", s.Id, c.Id));
                    }
                    if (c.Id == 2)
                    {
                        result.Add(CreateGroup(22201, "22201", s.Id, c.Id));
                    }
                    if (c.Id == 3)
                    {
                        result.Add(CreateGroup(22301, "22301", s.Id, c.Id));
                    }
                    if (c.Id == 4)
                    {
                        result.Add(CreateGroup(22401, "22401", s.Id, c.Id));
                    }
                }

                //ПМИ
                if (s.Id == 4)
                {
                    if (c.Id == 1)
                    {
                        result.Add(CreateGroup(22103, "22103", s.Id, c.Id));
                        result.Add(CreateGroup(22104, "22104", s.Id, c.Id));
                    }
                    if (c.Id == 2)
                    {
                        result.Add(CreateGroup(22203, "22203", s.Id, c.Id));
                        result.Add(CreateGroup(22204, "22204", s.Id, c.Id));
                    }
                    if (c.Id == 3)
                    {
                        result.Add(CreateGroup(22303, "22303", s.Id, c.Id));
                        result.Add(CreateGroup(22304, "22304", s.Id, c.Id));
                    }
                    if (c.Id == 4)
                    {
                        result.Add(CreateGroup(22403, "22403", s.Id, c.Id));
                    }
                }
            }
            else
            {
                if (c.Id == 1)
                {
                    result.Add(CreateGroup(22105, "22105", 1, c.Id));
                    result.Add(CreateGroup(22106, "22106", 1, c.Id));
                    result.Add(CreateGroup(22108, "22108", 2, c.Id));
                    result.Add(CreateGroup(22101, "22101", 3, c.Id));
                    result.Add(CreateGroup(22103, "22103", 4, c.Id));
                    result.Add(CreateGroup(22104, "22104", 4, c.Id));
                }

                if (c.Id == 2)
                {
                    result.Add(CreateGroup(22205, "22205", 1, c.Id));
                    result.Add(CreateGroup(22206, "22206", 1, c.Id));
                    result.Add(CreateGroup(22208, "22208", 2, c.Id));
                    result.Add(CreateGroup(22201, "22201", 3, c.Id));
                    result.Add(CreateGroup(22203, "22203", 4, c.Id));
                    result.Add(CreateGroup(22204, "22204", 4, c.Id));
                }

                if (c.Id == 3)
                {
                    result.Add(CreateGroup(22305, "22305", 1, c.Id));
                    result.Add(CreateGroup(22306, "22306", 1, c.Id));
                    result.Add(CreateGroup(22308, "22308", 2, c.Id));
                    result.Add(CreateGroup(22301, "22301", 3, c.Id));
                    result.Add(CreateGroup(22303, "22303", 4, c.Id));
                    result.Add(CreateGroup(22304, "22304", 4, c.Id));

                }

                if (c.Id == 4)
                {
                    result.Add(CreateGroup(22405, "22405", 1, c.Id));
                    result.Add(CreateGroup(22406, "22406", 1, c.Id));
                    result.Add(CreateGroup(22408, "22408", 2, c.Id));
                    result.Add(CreateGroup(22401, "22401", 3, c.Id));
                    result.Add(CreateGroup(22403, "22403", 4, c.Id));
                    result.Add(CreateGroup(22404, "22404", 4, c.Id));
                }
            }

            return result.ToArray();
        }



        public Group CreateGroup(int Id, string Code, int specialityId, int courseId){
             var g1 = new Group();
             g1.Id = Id;
             g1.Code = Code;
             g1.Course = new Course();
             g1.Course.Id = courseId;
             g1.Speciality = new Speciality();
             g1.Speciality.Id = specialityId;

             return g1;
        }
    }



    
}