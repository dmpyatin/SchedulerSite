using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ScheduleForPrintModel = Timetable.Site.Models.Schedules.ForPrintModel;
using ScheduleForPrintByAuditorium = Timetable.Site.Models.Schedules.ForPrintByAuditoriumModel;
using ScheduleForAllModel = Timetable.Site.Models.Schedules.ForAllModel;
using TimeForAllModel = Timetable.Site.Models.Times.ForAllModel;
using SendSchedule = Timetable.Site.Models.Schedules.SendModel;
using Timetable.Site.Models;
using Timetable.Site.DataService;
using System.Net.Http;
using Timetable.Site.Controllers.Api;
using AudSendModel = Timetable.Site.Models.Auditoriums.SendModel;
using SendGroup = Timetable.Site.Models.Groups.SendModel;
using Timetable.Site.Controllers.Extends;
using System.Data;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Drawing;

namespace Timetable.Site.Controllers
{
    
    public class PrintScheduleController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        private static DataTable CreateDataTable(int rowCount, int colCount)
        {
            DataTable dt = new DataTable();
            for (int i = 0; i < colCount; i++)
                dt.Columns.Add(i.ToString());


            for (int i = 0; i < rowCount; i++)
            {
                DataRow dr = dt.NewRow();
                foreach (DataColumn dc in dt.Columns)
                    dr[dc.ToString()] = i;

                dt.Rows.Add(dr);
            }
            return dt;
        }


        public Byte[] CreateTable()
        {
            var p = new ExcelPackage();

            //Here setting some document properties
            p.Workbook.Properties.Author = "Zeeshan Umar";
            p.Workbook.Properties.Title = "Office Open XML Sample";

            //Create a sheet
            p.Workbook.Worksheets.Add("Sample WorkSheet");
            ExcelWorksheet ws = p.Workbook.Worksheets[1];
            ws.Name = "Sample Worksheet"; //Setting Sheet's name
            ws.Cells.Style.Font.Size = 11; //Default font size for whole sheet
            ws.Cells.Style.Font.Name = "Calibri"; //Default Font name for whole sheet


            DataTable dt = CreateDataTable(10,10); //My Function which generates DataTable

            //Merging cells and create a center heading for out table
            ws.Cells[1, 1].Value = "Sample DataTable Export";
            ws.Cells[1, 1, 1, dt.Columns.Count].Merge = true;
            ws.Cells[1, 1, 1, dt.Columns.Count].Style.Font.Bold = true;
            ws.Cells[1, 1, 1, dt.Columns.Count].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

            int colIndex = 1;
            int rowIndex = 2;

            foreach (DataColumn dc in dt.Columns) //Creating Headings
            {
                var cell = ws.Cells[rowIndex, colIndex];

                //Setting the background color of header cells to Gray
                var fill = cell.Style.Fill;
                fill.PatternType = ExcelFillStyle.Solid;
                fill.BackgroundColor.SetColor(Color.Gray);


                //Setting Top/left,right/bottom borders.
                var border = cell.Style.Border;
                border.Bottom.Style =
                    border.Top.Style =
                    border.Left.Style =
                    border.Right.Style = ExcelBorderStyle.Thin;

                //Setting Value in cell
                cell.Value = "Heading " + dc.ColumnName;

                colIndex++;
            }

            foreach (DataRow dr in dt.Rows) // Adding Data into rows
            {
                colIndex = 1;
                rowIndex++;
                foreach (DataColumn dc in dt.Columns)
                {
                    var cell = ws.Cells[rowIndex, colIndex];
                    //Setting Value in cell
                    cell.Value = Convert.ToInt32(dr[dc.ColumnName]);

                    //Setting borders of cell
                    var border = cell.Style.Border;
                    border.Left.Style =
                        border.Right.Style = ExcelBorderStyle.Thin;
                    colIndex++;
                }
            }

            colIndex = 0;
            foreach (DataColumn dc in dt.Columns) //Creating Headings
            {
                colIndex++;
                var cell = ws.Cells[rowIndex, colIndex];

                //Setting Sum Formula
                cell.Formula = "Sum(" +
                                ws.Cells[3, colIndex].Address +
                                ":" +
                                ws.Cells[rowIndex - 1, colIndex].Address +
                                ")";

                //Setting Background fill color to Gray
                cell.Style.Fill.PatternType = ExcelFillStyle.Solid;
                cell.Style.Fill.BackgroundColor.SetColor(Color.Gray);
            }

            //Generate A File with Random name
            var memoryStream = p.GetAsByteArray();

            return memoryStream;
        }


        public Byte[] CreateTableForAuditorium(int? auditoriumId, int buildingId, string startDate, string endDate, string title)
        {

           
            var scheduleController = new Timetable.Site.Controllers.Api.ScheduleController();
            var timeController = new Timetable.Site.Controllers.Api.TimeController();

            var schedules = scheduleController.privateGetScheduleByAll(null, auditoriumId, "", 1, "", startDate, endDate);

            var times = timeController.privateGetAll(buildingId).ToList();
            var days = new List<string>() { "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота" };

            var p = new ExcelPackage();
            p.Workbook.Properties.Author = "Система составления расписания";
            p.Workbook.Properties.Title = "Расписание для аудитории " + title;
            p.Workbook.Worksheets.Add("Расписание");
            ExcelWorksheet ws = p.Workbook.Worksheets[1];

            ws.Name = "Расписание";
            ws.Cells.Style.Font.Size = 11;
            ws.Cells.Style.Font.Name = "Calibri";

            DataTable dt = CreateDataTable(2+times.Count(), 1+days.Count());

            ws.Cells[1, 1].Value = "Расписание для аудитории " + title;
            ws.Cells[1, 1, 1, dt.Columns.Count].Merge = true;
            ws.Cells[1, 1, 1, dt.Columns.Count].Style.Font.Bold = true;
            ws.Cells[1, 1, 1, dt.Columns.Count].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            //ws.Cells[1, 1, 1, dt.Columns.Count].AutoFitColumns();
            ws.Cells[2, 1].Value = "Время";

            
            ws.Column(1).Width = 10;



            var border1 = ws.Cells[2, 1].Style.Border;
            border1.Left.Style = border1.Right.Style = ExcelBorderStyle.Thin;
            border1.Bottom.Style = border1.Top.Style = ExcelBorderStyle.Thin;

            border1 = ws.Cells[1, 1, 1, dt.Columns.Count].Style.Border;
            border1.Left.Style = border1.Right.Style = ExcelBorderStyle.Thin;
            border1.Bottom.Style = border1.Top.Style = ExcelBorderStyle.Thin;


            for (int i = 0; i < times.Count(); ++i)
            {
                for (int j = 0; j < days.Count(); ++j)
                {
                    var cell = ws.Cells[3 + i, 2+j];
                    var border = cell.Style.Border;
                    border.Left.Style = border.Right.Style = ExcelBorderStyle.Thin;
                    border.Bottom.Style = border.Top.Style = ExcelBorderStyle.Thin;
                }
            }


            for (int i = 0; i < times.Count(); ++i)
            {
                ws.Row(3+i).Height = 50;
                var cell = ws.Cells[3+i, 1];
                cell.Value = times[i].StartEnd; 
                var border = cell.Style.Border;
                cell.Style.WrapText = true;
                border.Left.Style = border.Right.Style = ExcelBorderStyle.Thin;
                border.Bottom.Style = border.Top.Style = ExcelBorderStyle.Thin;
            }

            for (int i = 0; i < days.Count(); ++i)
            {
                ws.Column(2+i).Width = 20;
                var cell = ws.Cells[2, 2+i];
                cell.Value = days[i];
                cell.Style.WrapText = true;
                var border = cell.Style.Border;
                border.Left.Style = border.Right.Style = ExcelBorderStyle.Thin;
                border.Bottom.Style = border.Top.Style = ExcelBorderStyle.Thin;
            }

            foreach (var schedule in schedules)
            {
                var timeViewId = 0;
                var i = 1;
                foreach (var t in times)
                {
                    if (schedule.PeriodId == t.Id)
                    {
                        timeViewId = i;
                        break;
                    }
                    i++;
                }
                if (timeViewId > 0)
                {
                    var cell = ws.Cells[2+timeViewId,1+schedule.DayOfWeek];
                    var value = schedule.WeekTypeName + " " + schedule.LecturerName + " " +
                                schedule.TutorialName + " (" + schedule.TutorialTypeName + ") " + schedule.GroupNames;
                    cell.Value = value;
                    cell.Style.WrapText = true;
                }
            }


            return p.GetAsByteArray();
        }

        public FileResult GetReportForGroups()
        {
            var memoryStream = CreateTable();
            var fileName = string.Format("Расписание по потоку-{0:yyyy-MM-dd-HH-mm-ss}.xlsx", DateTime.UtcNow);
    
            return base.File(memoryStream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
        }

        public FileResult GetReportForAuditorium(int? auditoriumId, int buildingId, string startDate, string endDate, string title)
        {
            
            var memoryStream = CreateTableForAuditorium(auditoriumId, buildingId, startDate, endDate, title);
            var fileName = string.Format("Расписание для аудитории-{0:yyyy-MM-dd-HH-mm-ss}.xlsx", DateTime.UtcNow);

            return base.File(memoryStream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
        }



        [HttpPost]
        public ActionResult IndexForAuditorium(ScheduleForPrintByAuditorium s, TimeForAllModel t, string h, int fs, string mode)
        {
           
            var scheduleController = new Timetable.Site.Controllers.Api.ScheduleController();
            var timeController = new Timetable.Site.Controllers.Api.TimeController();

            var printScheduleModel = new PrintScheduleModel();

            printScheduleModel.FontSize = fs;

            printScheduleModel.Header = h;
            
            printScheduleModel.Times = timeController.privateGetAll(t.buildingId);

            printScheduleModel.Days = new List<string>() { "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота" }.AsEnumerable();

            printScheduleModel.ScheduleTable = new SendSchedule[30, 30, 5];

            printScheduleModel.Mode = "forAuditorium";
         
        
            var Schedules = scheduleController.privateGetScheduleByAll(null, s.auditoriumId, "", 1, "", s.startDate, s.endDate);
           
            foreach (var ss in Schedules)
            {
                int timeId = 0;
                foreach (var tt in printScheduleModel.Times)
                {
                    if (tt.Id == ss.PeriodId)
                    {
                        timeId = tt.ViewId;
                        break;
                    }
                }

                if(ss.DayOfWeek > 0 && timeId > 0)
                    printScheduleModel.ScheduleTable[timeId - 1, ss.DayOfWeek - 1, ss.WeekTypeId] = ss;
            }

            return View(printScheduleModel);
        }



        /*PrintScheduleForGroupsModel getBestPrintForGroupsModel(PrintScheduleForGroupsModel currentModel)
        {

        }*/


        [HttpPost]
        public ActionResult IndexForGroups(ScheduleForPrintModel s, TimeForAllModel t, string h, int fs)
        {
            
            
            var scheduleController = new Timetable.Site.Controllers.Api.ScheduleController();
            var timeController = new Timetable.Site.Controllers.Api.TimeController();
            var groupController = new Timetable.Site.Controllers.Api.GroupController();
            var buildingController = new Timetable.Site.Controllers.Api.BuildingController();

            var printScheduleModel = new PrintScheduleForGroupsModel();

            printScheduleModel.FontSize = fs;
            printScheduleModel.Header = h;
          
            printScheduleModel.Days = new List<string>() { "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота" }.AsEnumerable();
            printScheduleModel.ScheduleTable = new SendSchedule[35, 35, 35, 35];

            printScheduleModel.Colspan = new int[35, 35, 35];
            printScheduleModel.Rowspan = new int[35];
            printScheduleModel.Skip = new bool[35, 35];
            printScheduleModel.Skip2 = new bool[35, 35, 35];

            if(s.groupIds != null)
                printScheduleModel.Groups = groupController.GetByIds(s.groupIds);
            else
                if(s.specialityIds != null)
                    printScheduleModel.Groups = groupController.GetBySpecialityIds(s.courseIds, s.specialityIds);
                else
                    if(s.courseIds != null)
                        printScheduleModel.Groups = groupController.GetByCourseIds(s.facultyId, s.courseIds);


            
            //printScheduleModel.Times = timeController.privateGetAll(t.buildingId); //TODO: change all
         
            var targetGroupsIds = "";
            var targetCourseIds = s.courseIds;


            foreach (var gr in printScheduleModel.Groups)
                targetGroupsIds += gr.Id + ", ";
            
            //Достаем занятия для всех групп
            //var Schedules = scheduleController.privateGetByAll(s.lecturerId, s.auditoriumId, s.facultyId, s.courseIds, s.groupIds, s.studyYearId, s.semesterId, s.timetableId, s.sequence);
            //var Schedules = scheduleController.privateGetByGroups(s.facultyId, targetCourseIds, targetGroupsIds, s.studyYearId, s.semesterId, s.timetableId, s.startTime, s.endTime, "");

            var Schedules = scheduleController.privateGetScheduleByAll(s.lecturerId, s.auditoriumId, targetGroupsIds, 1, s.subGroup, s.startDate, s.endDate).ToList();

            var buildings = buildingController.privateGetAll();

            foreach (var b in buildings)
            {
                var tTimes = timeController.privateGetAll(b.Id).Where(x => Schedules.Any(y => y.PeriodId == x.Id)).ToList();
                printScheduleModel.Times = printScheduleModel.Times == null ?  tTimes : printScheduleModel.Times.Union(tTimes);
            }
            printScheduleModel.Times = printScheduleModel.Times.OrderBy(x => x.Start);
            var ind = 1;
            foreach (var time in printScheduleModel.Times)
            {
                time.ViewId = ind;
                ind++;
            }

            var a = printScheduleModel.Times.ToList();

            
            string newGroupIds = "";

            foreach (var gg in printScheduleModel.Groups)
            {
                bool skip = false;
                foreach (var ss in Schedules)
                {
                    foreach (var groupId in ss.GroupIds.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                    {
                        if (groupId != " ")
                        {
                            int igroupId = int.Parse(groupId);
                            if (gg.Id == igroupId)
                            {
                                newGroupIds += gg.Id + ", ";
                                skip = true;
                                break;
                            }
                        }

                    }
                    if (skip == true)
                        break;
                }
            }

            printScheduleModel.Groups = groupController.GetByIds(newGroupIds);

            foreach (var ss in Schedules)
            {
                int timeId = 0;
                foreach (var tt in printScheduleModel.Times)
                {
                    if (tt.Id == ss.PeriodId)
                    {
                        timeId = tt.ViewId;
                        break;
                    }
                }

                int gId = 0;

                //Получаем очередной id из выбранного списка групп
                foreach (var gg in printScheduleModel.Groups)
                { 
                    //Получаем список idшников групп из занятия
                    foreach (var groupId in ss.GroupIds.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                    {
                        if(groupId != " "){
                            int igroupId = int.Parse(groupId);

                            //Очередной idшник группы из занятия
                            if (gg.Id == igroupId)
                            {
                                //usedGroups.Add(new Pair<int,int>(ss.ScheduleInfoId, gg.Id));
                                if(ss.DayOfWeek > 0 && timeId > 0)
                                    printScheduleModel.ScheduleTable[gId, ss.DayOfWeek - 1, timeId - 1, ss.WeekTypeId] = ss;
                            }
                        }
                    }
                    gId++;
                }
            }

            
            int dsize = printScheduleModel.Days.Count();
            int tsize = printScheduleModel.Times.Count();
            int gsize = printScheduleModel.Groups.Count();

            for (int k = 0; k < dsize; ++k)
            {
                for (int i = 0; i < tsize; ++i)
                {
                    bool empty = true;
                    for (int j = 0; j < gsize; ++j)
                    {
                        if (printScheduleModel.ScheduleTable[j, k, i, 1] != null ||
                           printScheduleModel.ScheduleTable[j, k, i, 2] != null ||
                           printScheduleModel.ScheduleTable[j, k, i, 3] != null)
                        {
                            empty = false;
                            break;
                        }
                    }
                    if (empty == true)
                    {
                        printScheduleModel.Skip[k, i] = true;
                        printScheduleModel.Rowspan[k]++;
                    }
                    else
                    {
                        int cur = 0;
                        for (int j = cur+1; j < gsize; ++j)
                        {
                            if(printScheduleModel.ScheduleTable[cur, k, i, 1] == null){
                                cur++;
                                continue;
                            }

                            if (printScheduleModel.ScheduleTable[j, k, i, 1] != null)
                            {
                                if (printScheduleModel.ScheduleTable[cur, k, i, 1].AuditoriumNumber
                                    == printScheduleModel.ScheduleTable[j, k, i, 1].AuditoriumNumber)
                                {
                                    printScheduleModel.Skip2[j, k, i] = true;
                                    printScheduleModel.Colspan[cur, k, i]++;
                                }
                                else
                                {
                                    cur = j;
                                }
                            }
                            else
                            {
                                cur = j;
                            }
                        }

                        //Числитель и знаменатель
                        cur = 0;
                        for (int j = cur+1; j < gsize; ++j)
                        {
                            if(printScheduleModel.ScheduleTable[cur, k, i, 2] == null || printScheduleModel.ScheduleTable[cur, k, i, 3] == null){
                                cur++;
                                continue;
                            }

                            if (printScheduleModel.ScheduleTable[j, k, i, 2] != null && printScheduleModel.ScheduleTable[j, k, i, 3] != null)
                            {
                                if (printScheduleModel.ScheduleTable[cur, k, i, 2].AuditoriumNumber
                                    == printScheduleModel.ScheduleTable[j, k, i, 2].AuditoriumNumber 
                                    && printScheduleModel.ScheduleTable[cur, k, i, 3].AuditoriumNumber
                                    == printScheduleModel.ScheduleTable[j, k, i, 3].AuditoriumNumber)
                                {
                                    printScheduleModel.Skip2[j, k, i] = true;
                                    printScheduleModel.Colspan[cur, k, i]++;
                                }
                                else
                                {
                                    cur = j;
                                }
                            }
                            else
                            {
                                cur = j;
                            }
                        }

                        //Числитель
                        cur = 0;
                        for (int j = cur + 1; j < gsize; ++j)
                        {
                            if (printScheduleModel.ScheduleTable[cur, k, i, 2] == null || printScheduleModel.ScheduleTable[cur, k, i, 3] != null)
                            {
                                cur++;
                                continue;
                            }

                            if (printScheduleModel.ScheduleTable[j, k, i, 2] != null && printScheduleModel.ScheduleTable[j, k, i, 3] == null)
                            {
                                if (printScheduleModel.ScheduleTable[cur, k, i, 2].AuditoriumNumber
                                    == printScheduleModel.ScheduleTable[j, k, i, 2].AuditoriumNumber)
                                {
                                    printScheduleModel.Skip2[j, k, i] = true;
                                    printScheduleModel.Colspan[cur, k, i]++;
                                }
                                else
                                {
                                    cur = j;
                                }
                            }
                            else
                            {
                                cur = j;
                            }
                        }

                        //Знаменатель
                        cur = 0;
                        for (int j = cur + 1; j < gsize; ++j)
                        {
                            if (printScheduleModel.ScheduleTable[cur, k, i, 2] != null || printScheduleModel.ScheduleTable[cur, k, i, 3] == null)
                            {
                                cur++;
                                continue;
                            }

                            if (printScheduleModel.ScheduleTable[j, k, i, 2] == null && printScheduleModel.ScheduleTable[j, k, i, 3] != null)
                            {
                                if (printScheduleModel.ScheduleTable[cur, k, i, 3].AuditoriumNumber
                                    == printScheduleModel.ScheduleTable[j, k, i, 3].AuditoriumNumber)
                                {
                                    printScheduleModel.Skip2[j, k, i] = true;
                                    printScheduleModel.Colspan[cur, k, i]++;
                                }
                                else
                                {
                                    cur = j;
                                }
                            }
                            else
                            {
                                cur = j;
                            }
                        }
                    }
                }
            }

            return View(printScheduleModel);
        }
    }
}
