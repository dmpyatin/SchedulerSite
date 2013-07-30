using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace Timetable.Site
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

           
            /*
            routes.MapHttpRoute(
                name: "GroupGetApi",
                routeTemplate: "api/v1.0/group/get/{facultyid}/{courseid}",
                defaults: new { controller = "GroupController", action = "GetByNumber" }
            );*/

            /*
            routes.MapHttpRoute(
              name: "ScheduleGetApi",
              routeTemplate: "api/v1.0/schedule/getall/{fucultyid}/{courseid}/{groupid}",
              defaults: new { controller = "Schedule", action = "GetAll", fucultyid = UrlParameter.Optional,
                                                                               courseid = UrlParameter.Optional,
                                                                               groupid = UrlParameter.Optional
              }
            );*/
            


            routes.MapHttpRoute(
              name: "LecturerGetApi",
              routeTemplate: "api/v1.0/lecturer/get/{tutorialid}",
              defaults: new { controller = "Lecturer", action = "Get", tutorialid = UrlParameter.Optional }
            );
            

            routes.MapHttpRoute(
                name: "FacultyGetApi",
                routeTemplate: "api/v1.0/faculty/getall",
                defaults: new { controller = "Faculty", action = "GetAll" }
            );

            routes.MapHttpRoute(
              name: "CourseGetApi",
              routeTemplate: "api/v1.0/course/getall",
              defaults: new { controller = "Course", action = "GetAll" }
            );

            routes.MapHttpRoute(
              name: "TimeGetApi",
              routeTemplate: "api/v1.0/time/getall",
              defaults: new { controller = "Time", action = "GetAll" }
            );

            
            routes.MapHttpRoute(
             name: "TutorialGetApi",
             routeTemplate: "api/v1.0/tutorial/getall",
             defaults: new { controller = "Tutorial", action = "GetAll" }
           );

            routes.MapHttpRoute(
               name: "SpecialityGetApi",
               routeTemplate: "api/v1.0/speciality/Getbyfaculty/{facultyid}",
               defaults: new { controller = "Speciality", action = "GetByFaculty" }
           );

            /*
            routes.MapHttpRoute(
                name: "ScheduleGetForGroupApi",
                routeTemplate: "api/v1.0/schedule/getforgroup/{groupid}",
                defaults: new { controller = "Schedule", action = "GetForGroup" }
            );

            routes.MapHttpRoute(
                name: "AuditoriumGetByIdApi",
                routeTemplate: "api/v1.0/auditorium/getbynumber/{number}/{buildingid}",
                defaults: new { controller = "Auditorium", action = "GetByNumber" }
            );

            routes.MapHttpRoute(
                name: "ScheduleGetForAuditoriumApi",
                routeTemplate: "api/v1.0/schedule/getforauditorium/{auditoriumid}",
                defaults: new { controller = "Schedule", action = "GetForAuditorium" }
            );

            routes.MapHttpRoute(
                name: "ScheduleInfoUnscheduledApi",
                routeTemplate: "api/v1.0/scheduleinfo/getunscheduled/{facultyId}/{courseId}/{groupId}/{specialityId}",
                defaults: new { controller = "ScheduleInfo", action = "GetUnscheduled" }
            );*/

            routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/v1.0/{controller}/{action}/{id}",
                defaults: new { id = System.Web.Http.RouteParameter.Optional }
            );
            

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Schedule", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}