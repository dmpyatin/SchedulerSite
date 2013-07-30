using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Optimization;


namespace Timetable.Site
{
   
    public class MvcApplication : HttpApplication
    {
        /*
        private const String ReturnUrlRegexPattern = @"\?ReturnUrl=.*$";

        public MvcApplication()
        {

            PreSendRequestHeaders += MvcApplicationOnPreSendRequestHeaders;

        }
        private void MvcApplicationOnPreSendRequestHeaders(object sender, EventArgs e)
        {

            String redirectUrl = Response.RedirectLocation;

            if (String.IsNullOrEmpty(redirectUrl)
                 || !Regex.IsMatch(redirectUrl, ReturnUrlRegexPattern))
            {

                return;

            }

            Response.RedirectLocation = Regex.Replace(redirectUrl,
                                                       ReturnUrlRegexPattern,
                                                       String.Empty);
        }*/

        protected void Application_Start()
        {
            //var config = GlobalConfiguration.Configuration;
            //config.Services.Replace(typeof(IDocumentationProvider), new XmlDocumentationProvider(HttpContext.Current.Server.MapPath("~/App_Data/Timetable.Site.xml")));
            
            MvcHandler.DisableMvcResponseHeader = true;

            AreaRegistration.RegisterAllAreas();

            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            
            /*
            GlobalConfiguration.Configuration.Formatters.Clear();
            GlobalConfiguration.Configuration.Formatters.Add(new JsonNetFormatter(new JsonSerializerSettings()));


            var jsonSerializerSettings = new JsonSerializerSettings
            {
                PreserveReferencesHandling = PreserveReferencesHandling.Objects
            };*/
        }
    }
}
