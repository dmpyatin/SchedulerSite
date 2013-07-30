using System.Web;
using System.Web.Optimization;

namespace Timetable.Site
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/Scripts/jquery").Include("~/Scripts/jquery*"));
            bundles.Add(new ScriptBundle("~/Scripts/knockout").Include("~/Scripts/knockout*"));
            bundles.Add(new ScriptBundle("~/Scripts/modernizr").Include("~/Scripts/modernizr*"));
            bundles.Add(new ScriptBundle("~/Scripts/bootstrap").Include("~/Scripts/bootstrap.js"));
            bundles.Add(new ScriptBundle("~/Scripts/jqwidgets").Include("~/Scripts/jqxcore.js"));
            bundles.Add(new ScriptBundle("~/Scripts/Site/Index").Include("~/Scripts/Site/main.index.viewmodel.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/Site.css"));
            bundles.Add(new StyleBundle("~/Content/jqwidgets").Include("~/Content/jqwidgets/jqx.base.css", "~/Content/jqwidgets/jqx.classic.css"));
            bundles.Add(new StyleBundle("~/Content/themes/base/css").Include("~/Content/themes/base/jquery*"));
            bundles.Add(new StyleBundle("~/Content/bootstrap").Include("~/Content/bootstrap*"));
            

            BundleTable.EnableOptimizations = false;
        }
    }
}