using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Timetable.Site.Controllers.Extends
{

    public class CutNameService
    {
        
        public CutNameService(){

        }

        public string Cut(string t)
        {
            var vowels = new HashSet<char>();
            var consonants = new HashSet<char>();

            var wordCount = 0;
            var words = new List<string>();
            string result = "";
            foreach (var tt in t.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries))
            {
                words.Add(tt);
                wordCount++;
            }

            if (wordCount == 1)
            {
                foreach (var w in words)
                {
                    var len = w.Length;
                    if (len > 6)
                    {
                        result = w[0].ToString() + w[1].ToString() + w[2].ToString() + "-"
                            + w[len-3].ToString() + w[len-2].ToString() + w[len-1].ToString();
                    }else{
                        result = w;
                    }
                }
            }

            if (wordCount == 2)
            {
                foreach (var w in words)
                {
                    var len = w.Length;
                    if (len > 3)
                        result += w[0].ToString() + w[1].ToString() + w[2].ToString() + ".";
                    else
                        result += w + ".";
                }
            }

            if (wordCount > 2)
            {
                foreach (var w in words)
                {
                    result += w[0].ToString().ToUpper();
                }
            }

            return result;
        }
    }
     public class Pair<T, U>
     {
         public Pair()
         {
         }

         public Pair(T first, U second)
         {
             this.First = first;
             this.Second = second;
         }

         public T First { get; set; }
         public U Second { get; set; }
     };
}
